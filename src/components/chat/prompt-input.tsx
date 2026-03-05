import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ArrowUp, LoaderCircleIcon, Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function PromptInput({
  onLoading,
  ...props
}: React.ComponentProps<"textarea"> & { onLoading: boolean }) {
  return (
    <InputGroup className="flex flex-col-reverse max-h-[10rem]">
      <InputGroupTextarea placeholder="Ask, Search or Chat" {...props} />
      <InputGroupAddon className="w-full flex items-center px-2.5 py-1.5 gap-4 pb-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="w-6 h-6 rounded-full ml-2"
              type="button"
            >
              <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add File</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>Model</TooltipTrigger>
          <TooltipContent>Select Model</TooltipContent>
        </Tooltip>
        <Button
          className="w-6 h-6 rounded-full ml-auto"
          type="submit"
          disabled={onLoading}
        >
          {onLoading ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            <ArrowUp />
          )}
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
}
