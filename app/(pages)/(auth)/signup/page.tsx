import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/app/utils";
import { buttonVariants } from "@/app/components/ui/button";
import { Workflow } from "lucide-react";
import Signup from '@/app/components/dashboard/Signup';
export const metadata: Metadata = {
    title: "Authentication",
    description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
    return (
        <>
            <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="hidden h-full flex-col flex-wrap justify-end bg-muted p-10 bg-gradient-to-br from-blue-200 to-red-100 lg:flex">
                    <div className="flex justify-end items-end">
                        <Link
                            href="/"
                            className="flex flex-row items-center gap-2 font-semibold"
                        >
                            <Workflow /> Nbias
                        </Link>
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                &ldquo;No bias! Stable for AI System.&rdquo;
                            </p>
                            <footer className="text-sm">Gorage</footer>
                        </blockquote>
                    </div>
                </div>

                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <Signup />
                    </div>
                </div>
            </div>
        </>
    );
}
