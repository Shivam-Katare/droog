import React from 'react'
import { SlOptionsVertical } from "react-icons/sl";
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Copy, Save } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';

function Options() {
  return (
    <Popover>
      <PopoverTrigger>
        <SlOptionsVertical />
        <PopoverContent className="max-w-[10rem]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className='cursor-pointer'>
                  <Button>
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                </div>
                <TooltipContent sideOffset={8}>Copy this post</TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className='cursor-pointer'>
                    <Button>
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                  </div>
                  <TooltipContent sideOffset={8}>Save this post</TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </div>
        </PopoverContent>
      </PopoverTrigger>
    </Popover>
  )
}

export default Options