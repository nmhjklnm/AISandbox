import Link from "next/link";
import { Button } from "./components/ui/button";
import Image from "next/image";
import Header from "./components/home/header";
import Footer from "./components/home/footer";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import LandingCard from "./components/home/Card";
import RandomChart from "./components/home/chart";
import ExampleCodes from "./components/home/ExampleCodes";
import { ContainerScroll } from "./components/ui/container-scroll-animation";
import RetroGrid from "@/components/magicui/retro-grid";
export const runtime = "edge";


export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  const getTimeDescription = () => {
    const now = new Date();

    const hours = now.getHours();
    const dayOfWeek = now.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return "this weekend";
    }

    if (hours >= 0 && hours < 12) {
      return "this morning";
    } else if (hours >= 12 && hours < 17) {
      return "this Afternoon";
    } else if (hours >= 17 && hours < 21) {
      return "this evening";
    } else {
      return "tonight";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-violet-200 to-pink-200">
      <RetroGrid />
      <Header user={session ? session.user : null} />

      <div className="container flex flex-col items-center gap-10 pt-56 mt-20 bg-transparent border px-4 rounded-full border-violet-300 shadow-md">
        <div className="flex w-full h-full flex-col overflow-hidden bg-transparent justify-start">
          <ContainerScroll
            titleComponent={
              <>
                <div className="flex flex-col items-start gap-10 drop-shadow-md p-8 rounded-lg">
                  <h1 className="flex flex-col gap-2 items-center font-black text-6xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Build AI Tools
                  </h1>

                  <h4 className="font-semibold text-2xl -mt-10 text-foreground/60 text-center">
                    Prototype AI architectures in a node based editor.
                  </h4>
                  <div className="flex flex-row gap-5">
                    <Link href={session ? "/chat" : "/signup"}>
                      <Button
                        className="flex gap-2 w-fit rounded-3xl border-2 pl-6 pr-4 border-foreground font-bold hover:shadow-xl transition-all transform hover:scale-105"
                        size="lg"
                      >
                        Get Started
                        <ChevronRight />
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            }
          >
            {/* 替换后的 Image 组件 */}
            <Image
              className="mt-4 border-2 shadow-sm rounded-xl transition-all bg-transparent hover:shadow-md hover:-translate-y-1 hover:scale-[1.005]"
              src="/assets/editor.svg" // 新的图片路径
              width={1400}
              height={800} // 新的图片尺寸
              alt="Editor" // 新的 alt 文本
              draggable={false} // 如果你想保持图片不可拖动，可以添加这个属性
            />
          </ContainerScroll>
        </div>

        <div className="flex mt-36 items-center gap-16 flex-col md:flex-row">
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com"
          >
            <LandingCard title="Open Source">
              Nbias is an open source project. <br />
              You can contribute to the project on Github.
            </LandingCard>
          </Link>
          <Link rel="noopener noreferrer" target="_blank" href="/docs">
            <LandingCard title="AI Models">
              The editor provides a wide range of AI models <br />
              to build your AI architectures.
            </LandingCard>
          </Link>

          <Link rel="noopener noreferrer" target="_blank" href="/api">
            <LandingCard title="API Integration">
              Integrated the architectures to any application <br />
              by serving as an API endpoint.
            </LandingCard>
          </Link>
        </div>

        <div className=" grid grid-cols-1 lg:grid-cols-2 grid-flow-rows gap-10 w-auto mt-20">
          <div className="col-span-1 flex flex-col gap-4 bg-gradient-to-b from-foreground/5 to-background border border-slate-300 p-4 rounded-lg hover:drop-shadow-lg hover:-translate-y-3 transition-transform  md:-ml-10">
            <div className="font-bold text-2xl">API Integration</div>
            <div className="text-slate-600 font-medium">
              Nbias provides an REST API endpoint to integrate the AI
              architectures to any application. Currently supportes Python.
            </div>
            <div>
              <ExampleCodes />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-4 bg-gradient-to-b from-foreground/5 to-background border border-slate-300 p-4 rounded-lg hover:drop-shadow-lg hover:-translate-y-3 transition-transform md:-mr-10">
            <div className="font-bold text-2xl">Moniter Usage</div>
            <div className="text-slate-600 font-medium">
              All your API usage is monitered and displayed in the dashboard.
              You can also view the logs of the API calls and usage limit per
              month based on cost.
            </div>
            <RandomChart />
          </div>
        </div>

        <div className="container flex flex-col gap-16 my-[200px] items-center justify-between ">
          <div className="text-left font-bold text-5xl">
            Start building AI architectures{" "}
            <span className="underline">{getTimeDescription()}</span>.
          </div>
          <Link href={session ? "/chat" : "/signup"} className="">
            <Button
              className="flex gap-2 w-fit rounded-3xl border-2 pl-6 pr-4 border-foreground font-bold hover:shadow-xl transition-all transform hover:scale-105"
              size="lg"
            >
              Get Started
              <ChevronRight />
            </Button>
          </Link>
        </div>
      </div>

      <div className="w-screen flex flex-row items-center justify-center bg-transparent container rounded-lg shadow m-4">
        <Footer />
      </div>
      <div className="container justify-center bg-transparent">
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 text-center dark:text-gray-400">
          © 2024 Nbias™. All Rights Reserved.
        </span>
      </div>
    </div>
  );
}
