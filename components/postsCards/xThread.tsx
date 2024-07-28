import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Check, Copy, Edit2, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger, DialogTitle } from '../ui/dialog';
import { FaSquareTwitter, FaWandMagicSparkles } from 'react-icons/fa6';
import { Button } from '../ui/button';
import Image from 'next/image';
import useStore from '@/store/apiStore';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

function XThread() {
  const [chunks, setChunks] = useState<string[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const { loading, generatedContent, savePost, tweets } = useStore(); // Access the generateImage function and loading state from the store
  const [content, setContent] = useState(generatedContent.repeat(50));
  const [editableTweets, setEditableTweets] = useState(tweets.map(tweet => ({ content: tweet, isEditable: false })));
  const user = useUser().user;
  const userName = user?.username ?? '';
  const user_id = user?.id ?? '';
  const userProfile = user?.imageUrl ?? '';

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

  const handleCopyToClipboard = (content: any) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const handleDoneEditing = () => {
    setEditableTweets(prev => prev.map(tweet => ({ ...tweet, isEditable: false })));
  }

  const handleSaveThread = async () => {
    const combinedContent = editableTweets.map(tweet => tweet.content).join('\n\n');
    
    const postData = {
      user_id,
      userName,
      postContent: combinedContent,
      post_type: 'twitter_thread'
    };

    await savePost(postData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {editableTweets.map((tweet, index) => (
        <React.Fragment key={index}>
          <Card className="p-4 shadow-lg border-2 border-blue-500 rounded-xl max-w-[31rem]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
              <Image
                src={userProfile}
                alt="Profile Image"
                style={{ borderRadius: '50%', marginRight: '12px' }}
                width={50}
                height={50}
              />
                <div>
                  <div className="font-bold">{userName}</div>
                  <div className="text-gray-500 flex items-center"><FaSquareTwitter className="mr-1" /> @{userName}</div>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(tweet.content)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy this tweet</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mb-4">
              {tweet.isEditable ? (
                <textarea
                value={tweet.content}
                  onChange={(e) => handleChange(e, index)}
                  className="w-[25rem] p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              ) : (
                <p className="text-gray-800">{tweet.content}</p>
              )}
            </div>
            <div className="flex justify-end">
              {
                tweet.isEditable ? (
                  <div className="flex space-x-4">
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={handleDoneEditing}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Done
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => handleEdit(index)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )
              }
            </div>
          </Card>
          {index < editableTweets.length - 1 && (
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-gray-300"></div>
            </div>
          )}
        </React.Fragment>
      ))}
      <div className="flex justify-center mt-6">
      <Button 
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={handleSaveThread}
          disabled={loading}
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Thread'}
        </Button>
      </div>
    </div>
  );
}

export default XThread;