"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useSelectedValueStore } from "@/store/useSelectedPostsType"
import useStore from "@/store/apiStore"
import Link from "next/link"

const FormSchema = z.object({
  bio: z
    .string()
    .min(200, {
      message: "Content must be at least 200 characters.",
    })
    .max(3000, {
      message: "Content must not exceed 3k characters.",
    })
})

export function TextareaForm() {

  const { generatePost, loading } = useStore()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    generatePost(data.bio);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const { value } = useSelectedValueStore();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your blog here</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your blog here. Copy and paste from your blog."
                  className="resize-none"
                  disabled={!value || loading}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can enter text form of content between 200 and 3k characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full grid grid-cols-2 justify-between justify-items-start">
          <Button type="submit" disabled={loading || value.length <= 0}>
            {loading ? 'Generating...' : 'Submit'}
          </Button>

          <div className="w-full grid justify-items-end">
            <Link href="/user/savedposts" prefetch={true}>
              <Button type="reset" disabled={loading}>
                See Saved Posts
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </Form>
  )
}