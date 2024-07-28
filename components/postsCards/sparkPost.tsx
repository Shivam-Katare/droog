"use client";

import React, { useState } from 'react';
import { Card } from '../ui/card';
import useStore from '@/store/apiStore';
import { Copy, Download, Edit, Heart, Save, X } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { FaWandMagicSparkles } from "react-icons/fa6";
import { Button } from '../ui/button';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import * as Dialog from '@radix-ui/react-dialog';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Input } from '../ui/input';
import { useSelectedPlatformStore } from '@/store/useSelectedPostsType';
import SocialIcon from '../SocialIcon';
import { Skeleton } from '../ui/skeleton';


function SparkPosts() {
  const [isEditing, setIsEditing] = useState(false);
  const { generatedPlatformContent, generateImage, savePost, imageUrl, apiKeyUsageCount, setUserApiKey, userApiKey, generateImagePrompt, loading } = useStore();
  const [content, setContent] = useState(generatedPlatformContent);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { platform } = useSelectedPlatformStore()

  const user = useUser().user;
  const userName = user?.username ?? '';
  const user_id = user?.id ?? '';
  const userImage = user?.imageUrl ?? '';

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    if (user_id) {
      savePost({ userName, user_id, postContent: content, post_type: platform });
    } else {
      toast.error('You must be signed in to save a post.');
    }
  };

  const handleContentChange = (e: any) => {
    setContent(e.target.value);
  };

  const handleChange = (event: any) => {
    setContent(event.target.value);
  }

  const handleDoneEditing = () => {
    setIsEditing(false);
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      toast.success('Content copied to clipboard!');
    }).catch(err => {
      toast.error('Failed to copy content.');
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleIconClick = async () => {
    const prompt = await generateImagePrompt(content);
    if (prompt !== undefined) {
      setImagePrompt(prompt);
    }
  };

  const handleImagePromptChange = (e: any) => {
    setImagePrompt(e.target.value);
  }

  const handleCloseDialog = () => {
    if (generatedImageUrl) {
      setShowAlertDialog(true);
    } else {
      handleConfirmClose();
    }
  };

  const handleConfirmClose = () => {
    setImagePrompt('');
    setGeneratedImageUrl('');
    setDialogOpen(false);
    setShowAlertDialog(false);
  };

  const handleGenerateImage = async () => {
    await generateImage(imagePrompt);
    setGeneratedImageUrl(imageUrl);
    setContent(useStore.getState().generatedPlatformContent);
  };

  return (
    <div>
      <Card>
        <div
          className='grid p-[16px] w-full max-w-[17rem] min-h-[22rem] max-h-[22rem] overflow-auto md:max-w-[26rem]'
          style={{ border: "2px solid rgb(194 10 135)", borderRadius: "12px", boxShadow: "rgb(255 83 218) -1px -4px 20px 0px" }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Image
                src={userImage}
                alt="Profile"
                style={{ borderRadius: '50%', marginRight: '12px' }}
                width={50}
                height={50}
              />
              <div>
                <div style={{ fontWeight: 'bold' }}>{userName}</div>
              </div>
            </div>
            <SocialIcon />
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
              <button onClick={handleDoneEditing} className="text-blue-500">Done</button>
            ) : (
              <button onClick={handleEditClick} className="text-blue-500"><Edit /></button>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                    <Dialog.Trigger asChild>
                      <FaWandMagicSparkles className='w-6 h-6' />
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[425px] max-w-full">
                        <Dialog.Title className="text-lg font-bold mb-2">Generate Image</Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-500 mb-4">
                          You can generate an image of this post to share on social media.
                        </Dialog.Description>
                        {apiKeyUsageCount >= 5 && !userApiKey && (
                          <Input
                            placeholder="Enter your Stability AI API key"
                            onChange={(e: any) => setUserApiKey(e.target.value)}
                            className="mt-2"
                          />
                        )}
                        <div className="grid gap-4 py-4">
                          <textarea
                            value={imagePrompt}
                            onChange={handleImagePromptChange}
                            className='p-[16px] w-full'
                            id='style-4'
                            maxLength={200}
                            placeholder='Enter a prompt for the image, or autofill one below.'
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" onClick={handleIconClick} disabled={loading}>
                            {loading ? 'Writing Prompt...' : 'Autofill Prompt'}
                          </Button>
                          <Button type="button" onClick={handleGenerateImage} disabled={loading || imagePrompt.length > 30}>
                            {loading ? 'Generating...' : 'Generate'}
                          </Button>
                        </div>
                        {loading && <Skeleton className="h-12 w-12 rounded-full" />}
                        {generatedImageUrl && (
                          <div className="mt-4">
                            <Image src={generatedImageUrl} alt="Generated" width={300} height={300} className="w-full h-auto" />
                            <div className="flex justify-between mt-2">
                              <Button onClick={handleDownload} variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        )}
                        <Dialog.Close asChild>
                          <button
                            className="absolute top-2 right-2 inline-flex items-center justify-center rounded-full p-2 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                            onClick={handleCloseDialog}
                          >
                            <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                          </button>
                        </Dialog.Close>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
                  <TooltipContent sideOffset={8}>Generate an image of this post</TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>

            <AlertDialog.Root open={showAlertDialog} onOpenChange={setShowAlertDialog}>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
                <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[425px] max-w-full">
                  <AlertDialog.Title className="text-lg font-bold mb-2">Are you sure?</AlertDialog.Title>
                  <AlertDialog.Description className="text-sm text-gray-500 mb-4">
                    If you close this dialog, the generated image will be deleted. Please download it if you want to keep it.
                  </AlertDialog.Description>
                  <div className="flex justify-end space-x-2">
                    <AlertDialog.Cancel asChild>
                      <Button variant="outline">Cancel</Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <Button onClick={handleConfirmClose}>Confirm</Button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Copy className='cursor-pointer' onClick={handleCopyToClipboard} />
                  <TooltipContent sideOffset={8}>Copy this post</TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Save className='cursor-pointer' onClick={handleSaveClick} />
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

export default SparkPosts;
