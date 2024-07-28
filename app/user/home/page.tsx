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
import { Dock, DockIcon } from '@/components/magicui/dock';
import { FaDev, FaHashnode, FaMedium } from 'react-icons/fa6';
import { SiDailydotdev } from 'react-icons/si';
import Link from 'next/link';

function Home() {
  const { value } = useSelectedValueStore()
  const { platform } = useSelectedPlatformStore()
  const { successfullyGenerated, successfullyPromptGenerated } = useStore()
  return (
    <Tabs defaultValue='spark_an_idea' className='space-y-6 p-8'>
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
          {
            !successfullyGenerated && (
              <>
                <Dock magnification={60} distance={100}>
            <DockIcon className="bg-black/10 dark:bg-white/10 p-3">
              <Link href="https://hashnode.com/" target='_blank'>
                <FaHashnode className="size-full text-blue-600" />
              </Link>
            </DockIcon>
            <DockIcon className="bg-black/10 dark:bg-white/10 p-3">
              <Link href="https://medium.com/" target='_blank'>
                <FaMedium className="size-full" />
              </Link>
            </DockIcon>
            <DockIcon className="bg-black/10 dark:bg-white/10 p-3">
            <Link href="https://daily.dev/" target='_blank'>
              <SiDailydotdev className="size-full" />
            </Link>  
            </DockIcon>
            <DockIcon className="bg-black/10 dark:bg-white/10 p-3">
            <Link href="https://dev.to/" target='_blank'>
              <FaDev className="size-full" />
            </Link> 
            </DockIcon>
          </Dock>
          <p className='mt-6'>Click on any to blog platform where you write and paste blog content here.</p>
              </>
            )
          }
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
          {platform && successfullyPromptGenerated && <SparkPosts />}
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