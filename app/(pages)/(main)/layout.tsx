"use client";

import { ArrowUpRight, LogOut } from "lucide-react";
import Link from "next/link";
import {
  createClientComponentClient,
  createServerActionClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CreateProjectButton from "@/app/components/dashboard/createProject";
import { Separator } from "@/app/components/ui/separator";
import SignOut from "@/app/components/dashboard/signout";
import { Workflow, UserCircle } from "lucide-react";
import { navigationMenuTriggerStyle } from "@/app/components/ui/navigation-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/app/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/app/components/ui/use-toast";
import { usePathname } from "next/navigation"; // 导入 usePathname
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog"



export const runtime = "edge";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (!user) {
        router.push("/login");
      }
    };
    getUser();
  }, []);
  const { toast } = useToast();
  const pathname = usePathname(); 
  const onSignOutClick = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
      router.push("/");
    }
  };
  return (
    <div className="fixed w-full">
      <div className="flex flex-row justify-between items-center py-3 px-5">
        <Link
          href="/"
          className="flex flex-row gap-1 items-center text-md py-1 pl-2 font-bold antialiased hover:subpixel-antialiased hover:bg-accent hover:rounded-lg "
        >
          <Workflow />
          Nbias
        </Link>

        <NavigationMenu className="-ml-4">
          <NavigationMenuList>
            <NavigationMenuItem>
            <Link href="/knowledge" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} ${pathname === "/knowledge" ? "bg-accent text-accent-foreground" : ""}`}
                >
                  Knowledge
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/chat" legacyBehavior passHref>
              <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} ${pathname === "/chat" ? "bg-accent text-accent-foreground" : ""}`}
                >
                  Chat
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
            <Link href="/tools" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} ${pathname === "/tools" ? "bg-accent text-accent-foreground" : ""}`}
                >
                  Tools
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden focus-visible:outline-none">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/assets/avatars/xx.png" alt={user?.email || "User"} />
                <AvatarFallback><UserCircle/></AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.email || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "m@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem>
                Usage
              </DropdownMenuItem>
              <DropdownMenuItem>
                Price
                {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOutClick}>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      <div className="w-full h-full">{children}</div>
    </div>
  );
}