import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "./app/lib/supabase/admin";
import { Ratelimit } from "@upstash/ratelimit";
import redis from "./app/lib/redis/client";

// 创建速率限制器
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  prefix: "@upstash/ratelimit",
});

type Handler = (req: NextRequest, res: NextResponse, session?: any) => Promise<NextResponse> | NextResponse;

class SimpleRouter {
  private routes: Map<string, Handler> = new Map();

  public on(path: string, handler: Handler): SimpleRouter {
    this.routes.set(path, handler);
    return this;
  }

  public async route(req: NextRequest, res: NextResponse, session?: any): Promise<NextResponse> {
    for (const [path, handler] of this.routes) {
      if (req.nextUrl.pathname.startsWith(path)) {
        return handler(req, res, session);
      }
    }
    return res; // Default response if no route matches
  }
}

// 实例化 SimpleRouter
const router = new SimpleRouter();

// 注册路由和处理函数
router
  .on("/api/v1/execute", async (req, res) => {
    const authorization = req.headers.get("Authorization");

    // 检查是否提供了 API Key
    if (!authorization) {
      return NextResponse.json(
        { error: "API Key not provided in the `Authorization` header." },
        { status: 401 }
      );
    } else {
      // 对 API Key 进行哈希处理
      const hashedApiKey = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(authorization)
      );

      const hash = Buffer.from(hashedApiKey).toString("hex");

      // 从 Redis 缓存中获取用户 ID 和 API Key ID
      let cachedResult = await redis.get<{
        user_id: string;
        api_key_id: string;
      }>(hash);

      let api_key_id = cachedResult?.api_key_id;
      let user_id = cachedResult?.user_id;

      let success = false;
      if (!user_id) {
        // 如果缓存中没有找到数据，则从 Supabase 数据库中查询
        const { data: apiTableData, error } = await supabaseAdmin
          .from("apikeys")
          .select("*")
          .eq("hash", hash)
          .single();

        if (error) {
          return NextResponse.json(
            { error: "Invalid API Key" },
            { status: 401 }
          );
        }

        // 将数据缓存到 Redis 中，过期时间为 1 天
        user_id = apiTableData.user_id;
        api_key_id = apiTableData.id;
        redis.set(
          hash,
          {
            user_id,
            api_key_id,
          },
          {
            ex: 60 * 60 * 24,
          }
        );

        // 进行速率限制检查
        success = (await ratelimit.limit(apiTableData.user_id)).success;
      } else {
        // 如果缓存中有数据，直接进行速率限制检查
        success = (await ratelimit.limit(user_id)).success;
      }

      if (success) {
        // 如果速率限制通过，在响应头中设置用户 ID 和 API Key ID
        res.headers.set("UserId", user_id as string);
        res.headers.set("APIKeyId", api_key_id as string);
        return res;
      } else {
        // 如果速率限制未通过，返回 429 状态码和错误信息
        return NextResponse.json(
          { error: "Too many requests, please try again in few seconds" },
          { status: 429 }
        );
      }
    }
  })
  .on("/api/v1/models", async (req, res, session) => {
    if (session) {
      // 如果用户已登录，在响应头中设置用户 ID
      res.headers.set("UserId", session.user.id as string);
      return res;
    } else {
      // 如果用户未登录，返回 401 状态码和错误信息
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  })
  .on("/dashboard", async (req, res, session) => {
    if (!session) {
      // 如果用户未登录，重定向到 /login 页面
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return res;
  });

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // 刷新用户会话
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // 使用 SimpleRouter 处理请求
  return router.route(req, res, session);
}

// 配置中间件匹配的路径
export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"],
};