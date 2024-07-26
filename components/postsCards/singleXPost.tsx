import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import useStore from '@/store/apiStore';
import Image from 'next/image';
import { FaWandMagicSparkles } from "react-icons/fa6";
import { useUser } from '@clerk/nextjs';
import toast, { Toaster } from 'react-hot-toast';
import { Copy, Edit2, Save } from 'lucide-react';
import { useSelectedValueStore } from '@/store/useSelectedPostsType';


function SingleXPost() {
  const [isEditable, setIsEditable] = useState(false);

  const [imageUrl, setImageUrl] = useState('');
  const user = useUser().user;
  const userName = user?.username ?? '';
  const user_id = user?.id ?? '';
  const { generateImage, loading, generatedContent, savePost } = useStore();
  const { value } = useSelectedValueStore()
  const [content, setContent] = useState(generatedContent);
  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleDoneEditing = () => {
    setIsEditable(false);
  }

  const handleSave = () => {
    setIsEditable(false);
    if (user_id) {
      savePost({ userName, user_id, postContent: content, post_type: value });
    } else {
      toast.error('You must be signed in to save a post.');
    }
  };

  const handleChange = (event: any) => {
    setContent(event.target.value);
  };

  const handleGenerateImage = async () => {
    await generateImage("Attention, web warriors! 🚀 I'm a front-end wizard with a knack for building killer UIs. I've been wielding my HTML, CSS, and JavaScript powers for over two years, crafting stunning experiences for startups that move at the speed of light. #FrontendMagic");
    setImageUrl(useStore.getState().imageUrl); // Get the generated image URL from the store
  };

  const handlePostToTwitter = () => {
    const tweetText = encodeURIComponent(generatedContent);
    const twitterIntent = `https://x.com/intent/tweet?text=${tweetText}`;
    window.open(twitterIntent, '_blank');
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
        <div className='p-[16px] max-w-[17rem] md:max-w-[32rem] md:min-w-[28rem]' style={{ boxShadow: "#2563eb -1px -4px 20px 0px", border: "2px solid #2563eb", borderRadius: "13px" }}>
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className='cursor-pointer' onClick={handleCopyToClipboard}><Copy /> </div>
                  <TooltipContent sideOffset={8}>Copy this post</TooltipContent>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div style={{ marginTop: '12px' }}>
            {isEditable ? (
              <textarea
                value={content}
                onChange={handleChange}
                className='p-[16px] w-min max-w-[17rem] md:max-w-[32rem] md:min-w-[28rem]'
                id='style-4'
              />
            ) : (
              content
            )}
          </div>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', color: 'gray' }}>
            {isEditable ? (
              <div onClick={handleDoneEditing} className='cursor-pointer'>Done</div>
            ) : (
              <div onClick={handleEdit} className='cursor-pointer'><Edit2 /></div>
            )}
            {
              !isEditable && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div onClick={handleSave}><Save /></div>
                        <TooltipContent sideOffset={8}>Save this post</TooltipContent>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                  <Dialog>
                    <DialogTrigger>
                      <FaWandMagicSparkles className='w-6 h-6' />
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Generate Image</DialogTitle>
                        <DialogDescription>
                          You can generate an image of this post to share on social media.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <textarea
                          value={content}
                          onChange={handleChange}
                          className='p-[16px] w-full'
                          id='style-4'
                        />
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={handleGenerateImage} disabled={loading}>
                          {loading ? 'Generating...' : 'Generate'}
                        </Button>
                      </DialogFooter>
                      {/* {imageUrl && (
                            <div className="mt-4">
                              <img src={imageUrl} alt="Generated" className="w-full" />
                            </div>
                          )} */}

                      <div
                        className='mt-4 max-h-48 overflow-auto grid grid-cols-2 justify-items-center justify-center items-center gap-5'
                        id="style-4"
                      >
                        <Image
                          src="https://ik.imagekit.io/dnwefib6s4/5.png?updatedAt=1718010607272"
                          alt="Profile"
                          width={250}
                          height={330}
                          className='h-auto w-auto object-cover transition-all hover:scale-105 aspect-[3/4]'
                        />

                        <Image
                          src="https://ik.imagekit.io/dnwefib6s4/Gemini_Generated_Image_5d1ql35d1ql35d1q.jfif?updatedAt=1720417256685"
                          alt="Profile"
                          width={250}
                          height={330}
                          className='h-auto w-auto object-cover transition-all hover:scale-105 aspect-[3/4]'
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <button onClick={handlePostToTwitter} className="bg-blue-400 text-white p-2 rounded">
                          Post to X
                        </button>
                        <TooltipContent sideOffset={8}>Post this content to X (Twitter)</TooltipContent>
                      </TooltipTrigger>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )
            }
          </div>
        </div>
      </Card>
      <Toaster />
    </div>
  );
}

export default SingleXPost;
