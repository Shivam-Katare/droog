import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Copy, Edit2, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger, DialogTitle } from '../ui/dialog';
import { FaSquareTwitter, FaWandMagicSparkles } from 'react-icons/fa6';
import { Button } from '../ui/button';
import Image from 'next/image';
import useStore from '@/store/apiStore';

function XThread() {
  const [chunks, setChunks] = useState<string[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const { generateImage, loading, generatedContent, savePost, tweets } = useStore(); // Access the generateImage function and loading state from the store
  const [content, setContent] = useState(generatedContent.repeat(50));
  const [editableTweets, setEditableTweets] = useState(tweets.map(tweet => ({ content: tweet, isEditable: false })));

  useEffect(() => {
    const words = content.split(' ');
    const chunkSize = 54;
    const tempChunks = [];

    for (let i = 0; i < words.length; i += chunkSize) {
      tempChunks.push(words.slice(i, i + chunkSize).join(' '));
    }

    setChunks(tempChunks);
  }, [content]);

  const handleEdit = (index: any) => {
    setEditableTweets(prev => prev.map((tweet, i) => 
      i === index ? { ...tweet, isEditable: true } : tweet
    ));
  };

  const handleSave = () => {
    setIsEditable(false);
  }

  const handleChange = (event: any, index: any) => {
    setEditableTweets(prev => prev.map((tweet, i) => 
      i === index ? { ...tweet, content: event.target.value } : tweet
    ));
  };

  const handleGenerateImage = async () => {
    await generateImage(content);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {editableTweets.map((chunk, index) => (
        <React.Fragment key={index}>
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
                    <div style={{ fontWeight: 'bold' }}>User Name</div>
                    <div style={{ color: 'gray' }}><FaSquareTwitter /> </div>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className='cursor-pointer'><Copy /> </div>
                      <TooltipContent sideOffset={8}>Copy this post</TooltipContent>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className='mt-3'>
                {chunk?.isEditable ? (
                  <textarea
                    value={chunk.content}
                    onChange={(e) => handleChange(e, index)}
                    className='p-[16px] w-min max-w-[17rem] md:max-w-[32rem] md:min-w-[28rem]'
                    id='style-4'
                  />
                ) : (
                  chunk.content
                )}
              </div>
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', color: 'gray' }}>
            {chunk.isEditable ? (
              <div onClick={handleSave} className='cursor-pointer'><Save /></div>
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
                          value={chunk.content}
                          onChange={(e) => handleChange(e, index)}
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
                </>
              )
            }
          </div>
            </div>
          </Card>
          {/* Conditionally render the vertical line except after the last card */}
          {index < tweets.length - 1 && (
            <div className='w-full grid justify-items-start'>
              <div style={{ width: '2px', height: '30px', backgroundColor: 'gray', alignSelf: 'center', margin: '8px 0' }}></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default XThread;