"use client";

import { ComboboxDemo } from '@/components/ComboBox'
import LinkedInPosts from '@/components/postsCards/linkedInPost'
import SingleXPost from '@/components/postsCards/singleXPost'
import XThread from '@/components/postsCards/xThread';
import { TextareaForm } from '@/components/Textarea'
import useStore from '@/store/apiStore';
import { useSelectedPlatformStore, useSelectedValueStore } from '@/store/useSelectedPostsType'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import React from 'react'
import { Toaster } from 'react-hot-toast';
import { SparkTextArea } from '@/components/SparkTextArea';
import SparkPosts from '@/components/postsCards/sparkPost';
import { SparkPlatform } from '@/components/SparkPlatform';
import ImageCaptioner from '@/components/Caption';
import BlurIn from '@/components/magicui/blur-in';

function Home() {
  const { value } = useSelectedValueStore()
  const { platform } = useSelectedPlatformStore()
  const { successfullyGenerated } = useStore()
  return (
    <Tabs defaultValue='blog_to_post' className='space-y-6 p-8'>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="blog_to_post">Blog to post</TabsTrigger>
        <TabsTrigger value="spark_an_idea">Spark an Idea</TabsTrigger>
        <TabsTrigger value="image_caption">Snap an Say</TabsTrigger>

      </TabsList>

      <TabsContent value="blog_to_post">
        <div className='w-full grid justify-items-center'>
          <ComboboxDemo />
          <TextareaForm />
          {value === 'xthread' && successfullyGenerated && <XThread />}
          {value === 'xpost' && successfullyGenerated && <SingleXPost />}
          {value === 'linkedinpost' && successfullyGenerated && <LinkedInPosts />}
        </div>
      </TabsContent>
      <TabsContent value="spark_an_idea">
        <div className='w-full grid justify-items-center'>
          <BlurIn
            word="Choose a platform, Pick a topic, and let DROOG do the rest."
            className="text-[1.5rem] font-bold text-black"
            duration={2}
          />
          <SparkPlatform />
          <SparkTextArea />
          {platform && successfullyGenerated && <SparkPosts />}
        </div>
      </TabsContent>

      <TabsContent value="image_caption">
        <div className='w-full grid justify-items-center'>
          <ImageCaptioner />
        </div>
      </TabsContent>
      <Toaster />
    </Tabs>
  )
}

export default Home