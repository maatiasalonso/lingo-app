"use client";

import { useExitModal } from "@/store/use-exit-modal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export const ExitModal = () => {
  const { isOpen, close } = useExitModal();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image
              src={"/mascot-sad.svg"}
              alt="Mascot"
              width={80}
              height={80}
            />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            Wait, don't go!
          </DialogTitle>
          <DialogDescription className="text-center font-semibold">
            You're about to leave the lesson. Are you sure?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex flex-col gap-y-4 w-full">
            <Button
              variant={"primary"}
              className="w-full uppercase font-bold"
              size={"lg"}
              onClick={close}
            >
              Keep Learning
            </Button>
            <Button
              variant={"dangerOutline"}
              className="w-full uppercase font-bold"
              size={"lg"}
              onClick={() => {
                close();
                router.push("/");
              }}
            >
              End session
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
