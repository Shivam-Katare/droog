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
import { useSelectedPlatformStore } from "@/store/useSelectedPostsType"
import useStore from "@/store/apiStore"
import Link from "next/link"

const FormSchema = z.object({
  bio: z
    .string()
    .min(20, {
      message: "Content must be at least 20 characters.",
    })
    .max(200, {
      message: "Content must not exceed 200 characters.",
    })
})

export function SparkTextArea() {

  const { loading, generatePlatformPost } = useStore()
  const { platform } = useSelectedPlatformStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    generatePlatformPost(data.bio);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your prompt here</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a topic you want to create content for..."
                  className="resize-none"
                  disabled={loading || !platform}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can enter text form of content between 20 and 200 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full grid grid-cols-2 justify-between justify-items-start">
          <Button type="submit" disabled={loading || !platform}>
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