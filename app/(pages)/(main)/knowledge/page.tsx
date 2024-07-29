import React from "react";
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card } from "@/app/components/ui/card";

const Page = () => {
  return (
    <div className=" flex flex-col h-screen bg-gray-100">
      <header className="fixed  w-full flex items-center justify-between p-2 bg-gray-100 z-10">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={`navigationMenuTriggerStyle() text-sm`}
              >
                知识库
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={`navigationMenuTriggerStyle() text-sm`}
              >
                API
              </NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>
        <div className="flex space-x-4 ">
          <Input placeholder="搜索" />
        </div>
      </header>
    </div>
  );
};

export default Page;
