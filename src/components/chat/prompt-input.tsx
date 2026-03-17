import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { ArrowUp, LoaderCircleIcon, Plus } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

export function PromptInput({
  onLoading,
  ...props
}: React.ComponentProps<'textarea'> & { onLoading: boolean }) {
  return (
    <InputGroup className="flex flex-col-reverse max-h-[10rem] px-2.5 pt-2">
      <InputGroupTextarea placeholder="Ask, Search or Chat" {...props} />
      <InputGroupAddon className="w-full flex items-center py-1.5 gap-4 pb-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                className="w-8 h-8 rounded-full"
                type="button"
              >
                <Plus />
              </Button>
            }
          />
          <TooltipContent>Add File</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>GPT-4o</TooltipTrigger>
          <TooltipContent>Select Model</TooltipContent>
        </Tooltip>
        <Button
          className="w-8 h-8 rounded-full ml-auto"
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
  )
}
