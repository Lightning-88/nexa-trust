"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp, Plus } from "lucide-react";

export function PromptInput({ ...props }: React.ComponentProps<"textarea">) {
  return (
    <InputGroup className="flex flex-col-reverse">
      <InputGroupTextarea placeholder="Ask, Search or Chat" {...props} />
      <InputGroupAddon className="w-full flex items-center px-2.5 py-1.5 gap-0.5">
        <Button
          variant="outline"
          className="w-6 h-6 rounded-full ml-2"
          type="button"
        >
          <Plus />
        </Button>
        <Button variant="ghost" className="text-base" type="button">
          Auto
        </Button>
        <Button className="w-6 h-6 rounded-full ml-auto" type="submit">
          <ArrowUp />
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
}
