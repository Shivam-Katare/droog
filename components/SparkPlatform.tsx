"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSelectedPlatformStore } from "@/store/useSelectedPostsType"

const frameworks = [
  {
    value: "xpost",
    label: "X(Formally Twitter)",
  },
  {
    value: "linkedinpost",
    label: "LinkedIn Post",
  },
  {
    value: "instagrampost",
    label: "Instagram Post",
  },
  {
    value: "facebookpost",
    label: "Facebook Post",
  },
  {
    value: "peerlist",
    label: "Peerlist Post",
  }
]

export function SparkPlatform() {
  const [open, setOpen] = React.useState(false)
  const {platform, setPlatform} = useSelectedPlatformStore()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {platform
            ? frameworks.find((framework) => framework.value === platform)?.label
            : "Select a Platform..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Select a Platform..." />
          <CommandList>
            <CommandEmpty>No Platform found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setPlatform(currentValue === platform ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      platform === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
