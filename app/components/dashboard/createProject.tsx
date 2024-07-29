"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast, useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

const CreateProjectButton = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [projectName, setProjectName] = useState("Untitled");

  const createNewProject = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (session) {
      const emptyData = { nodes: [], edges: [] };

      const { data, error } = await supabase
        .from("projects")
        .insert([
          { data: emptyData, user_id: session.user.id, name: projectName },
        ])
        .select();

      if (error) {
        toast({
          title: "Error",
          description: error.message,
        });
      } else {
        router.push(`/project/${data[0].id}`);
      }
    } else {
      toast({
        title: "Unauthorized",
        description: "You need to be logged in to create a project",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={"lg"}
          className="rounded-lg w-2/4 h-2/4 bg-background"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Enter the name of your new project. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectName" className="text-right">
              Project Name
            </Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
        <div
            className="w-full h-full"
            onClick={createNewProject}
          >
            Create Project
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectButton;
