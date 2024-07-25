"use client";

import Link from "next/link";
import { User } from "@supabase/auth-helpers-nextjs";
import { Button } from "../ui/button";
import { Workflow } from "lucide-react";
import { motion } from 'framer-motion';

const Header = ({ user }: { user: User | null }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="fixed top-3 flex flex-row items-center justify-between mx-10 w-4/5 md:w-3/4 lg:w-2/3 backdrop-blur-sm bg-background/70 rounded-full shadow-md py-2 pl-4 pr-2 z-20"
    >
      <Link href="/" className="flex flex-row gap-2 items-center text-2xl font-bold">
        <Workflow />Nbias
      </Link>

      <div>
        {user ? (
          <Link href="/dashboard">
            <Button className="rounded-full">Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <Button variant={"ghost"} className="rounded-full">
                Log In
              </Button>
            </Link>

            <Link href="/signup">
              <Button className="rounded-full">Get Started</Button>
            </Link>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Header;