"use client";

import React, { useState } from 'react';
import { Card } from '../ui/card';
import useStore from '@/store/apiStore';
import { Copy, Edit, Heart, Save, WandSparkles } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { FaLinkedin } from "react-icons/fa6";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

function LinkedInPosts() {
  const [isEditing, setIsEditing] = useState(false);
  const { generatedContent, savePost, loading } = useStore();
  const [content, setContent] = useState(generatedContent);
  const user = useUser().user;
  const userName = user?.username ?? '';
  const user_id = user?.id ?? '';

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDoneEditing = () => {
    setIsEditing(false);
  }

  const handleSaveClick = () => {
    setIsEditing(false);
    if (user_id) {
      savePost({ userName, user_id, postContent: content, post_type: 'Linkedin' });
    } else {
      toast.error('You must be signed in to save a post.');
    }
  };
  const handleContentChange = (e: any) => {
    setContent(e.target.value);
  };

  const handleChange = (event: any) => {
    setContent(event.target.value);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      toast.success('Content copied to clipboard!');
    }).catch(err => {
      toast.error('Failed to copy content.');
    });
  };

  return (
    <div>
      <Card>
        <div
          className='grid p-[16px] w-full max-w-[17rem] min-h-[22rem] max-h-[22rem] overflow-auto md:max-w-[26rem]'
          style={{ border: "2px solid #0a66c2", borderRadius: "12px", boxShadow: "#0a66c2 -1px -4px 20px 0px" }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="https://via.placeholder.com/50"
                alt="Profile"
                style={{ borderRadius: '50%', marginRight: '12px' }}
              />
              <div>
                <div style={{ fontWeight: 'bold' }}>{userName}</div>
                <div style={{ color: 'gray' }}>User Headline</div>
              </div>
            </div>
            <FaLinkedin size={24} color="#0a66c2" style={{ cursor: 'pointer' }} />
          </div>
          <div style={{ marginTop: '12px' }}>
            {isEditing ? (
              <textarea
                value={content}
                onChange={handleContentChange}
                className="p-[16px] w-[17rem] max-w-[17rem] h-auto overflow-auto md:max-w-[26rem] md:w-[24rem]"
              />
            ) : (
              <div>
              {content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2">
                  {paragraph}
                </p>
              ))}
            </div>
            )}
          </div>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', color: 'gray' }}>
            {isEditing ? (
              <button className="text-blue-500" onClick={handleDoneEditing}>Done</button>
            ) : (
              <button onClick={handleEditClick} className="text-blue-500"><Edit /></button>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className='cursor-pointer'>
                    <Heart />
                  </div>
                  <TooltipContent sideOffset={8}>Link the genereated post</TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Sheet>
                    <SheetTrigger>
                      <div className='cursor-pointer'>
                        <WandSparkles />
                      </div>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Generate Image</SheetTitle>
                        <SheetDescription>
                          You can generate an image of this post to share on social media.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 py-4">
                        <textarea
                          value={content}
                          onChange={handleChange}
                          className='p-[16px] w-full'
                          id='style-4'
                        />
                      </div>
                      <Button type="button">
                        Generate
                      </Button>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="aspect-w-1 aspect-h-1 relative">
                          <Image
                            src="https://ik.imagekit.io/dnwefib6s4/Gemini_Generated_Image_5d1ql35d1ql35d1q.jfif?updatedAt=1720417256685"
                            alt="Generated Image 1"
                            objectFit="cover"
                            width={250}
                            height={330}
                          />
                        </div>
                        <div className="aspect-w-1 aspect-h-1 relative">
                          <Image
                            src="https://ik.imagekit.io/dnwefib6s4/sakethai.png?updatedAt=1717911817196"
                            alt="Generated Image 2"
                            objectFit="cover"
                            width={250}
                            height={330}
                          />
                        </div>
                        <div className="aspect-w-1 aspect-h-1 relative">
                          <Image
                            src="https://ik.imagekit.io/dnwefib6s4/QR_ratemyservice.jpg?updatedAt=1717697036098"
                            alt="Generated Image 3"
                            objectFit="cover"
                            width={250}
                            height={330}
                          />
                        </div>
                        <div className="aspect-w-1 aspect-h-1 relative">
                          <Image
                            src="https://ik.imagekit.io/dnwefib6s4/Blue%20White%20Modern%20Digital%20Communication%20Technologies%20Logotype.png?updatedAt=1690772961338"
                            alt="Generated Image 4"
                            objectFit="cover"
                            width={250}
                            height={330}
                          />
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <TooltipContent sideOffset={8}>Generate Image for this post</TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className='cursor-pointer'>
                    <Copy  onClick={handleCopyToClipboard}/>
                  </div>
                  <TooltipContent sideOffset={8}>Copy this post</TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className='cursor-pointer'>
                    <Save onClick={handleSaveClick}/>
                  </div>
                  <TooltipContent sideOffset={8}>Save this post</TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default LinkedInPosts;
