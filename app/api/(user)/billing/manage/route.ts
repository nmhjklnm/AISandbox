import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Response } from "@/app/utils/response";
import Stripe from "stripe";
import { supabaseAdmin } from "@/app/lib/supabase/admin";
import { getURL } from "@/app/utils/index"; // 导入 getURL 函数

export const runtime = "edge";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-08-16",
});

export async function POST(request: NextRequest) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json(Response.Error("No user found"));

  let { data: initialBillingData, error: getInitialBillingDataError } =
    await supabaseAdmin
      .from("users")
      .select("stripe_customer_id")
      .eq("user_id", user?.id)
      .single();

  if (
    getInitialBillingDataError &&
    getInitialBillingDataError?.code !== "PGRST116"
  ) {
    // code PGRST116 means no rows returned, if it's not that, then it's an database error
    return NextResponse.json(
      Response.Error(getInitialBillingDataError?.message as string)
    );
  }

  if (initialBillingData?.stripe_customer_id) {
    const baseURL = getURL(); // 获取动态生成的 baseURL
    const returnURL = `${baseURL}dashboard/billing`; // 构建 return_url

    const session = await stripe.billingPortal.sessions.create({
      customer: initialBillingData.stripe_customer_id,
      return_url: returnURL,
    });

    return NextResponse.json(Response.Success(session.url));
  } else {
    return NextResponse.json(Response.Error("No customer found"));
  }
}
