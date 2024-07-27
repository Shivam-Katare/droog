import { create } from 'zustand';
import { toast } from 'react-hot-toast'; // Assuming you are using react-hot-toast for notifications
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '@/lib/supabaseClient';
import { useSelectedPlatformStore, useSelectedValueStore } from './useSelectedPostsType';

interface KanbanColumn {
  id: string;
  title: string;
  postIds: string[];
}

interface Post {
  id: string;
  user_id: string;
  userName: string;
  postContent: string;
  post_type: string;
}

// Define the interface for the store state
interface StoreState {
  tripPlan: string;
  loading: boolean;
  apiKey: string;
  myKey: number;
  imageUrl: string;
  generatedContent: string;
  tweets: string[];
  successfullyGenerated: boolean;
  userPosts: string[];
  userIds: number[];
  kanbanColumns: KanbanColumn[];
  posts: Post[];
  scrapedContent: string;
  scrapeLoading: boolean;
  scrapeError: string | null;
  setGeneratedContent: (content: string) => void;
  setLoading: (loading: boolean) => void;
  generatePost: (article: string) => Promise<void>;
  generateImage: (prompt: string) => Promise<void>;
  savePost: (postData: { user_id: string; userName: string; postContent: string, post_type: string  }) => Promise<void>;
  updatePost: (updateData: { postId: string; postContent: string; user_id: string}) => Promise<void>; // Added function
  fetchUserPosts: (userId: string) => Promise<void>; // Added function
  generatePlatformPost: (content: string) => Promise<void>;
}

// Create the Zustand store
const useStore = create<StoreState>((set, get) => ({
  tripPlan: '',
  loading: false,
  apiKey: '',
  myKey: 0,
  imageUrl: '',
  generatedContent: '',
  tweets: [],
  successfullyGenerated: false,
  userPosts: [],
  userIds: [],
  kanbanColumns: [],
  posts: [],
  scrapedContent: '',
  scrapeLoading: false,
  scrapeError: null,
  setGeneratedContent: (content: string) => set({ generatedContent: content }),
  setLoading: (loading: boolean) => set({ loading }),

  // Function to generate trip plan
  generatePost: async (article: string) => {
    set({ loading: true });
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const selectedValue = useSelectedValueStore.getState().value;
    let prompt;
    if (selectedValue === 'xpost') {
      const exampleXPattern = `Read something interesting and struggling to remember the key points?

      Filip Melka built a chrome extension that uses ChatGPT to generate custom flashcards based on any Hashnode article.
      
      Read more about Flashnode here:[Link]`;

      prompt = `I have a blog post. Write a tweet start with a question or interesting fact to hook the reader, include an engaging emoji, briefly explain the benefit, and end with a call to action to read more, including a link and relevant hashtags.\n\n <> ${article} <>`;
    } else if (selectedValue === 'linkedinpost') {
      prompt = `Create a professional and engaging LinkedIn post based on the following blog content. The post should summarize the key points, highlight the main benefits or insights, and include a call to action. Ensure the writing style includes proper spacing, line gaps, and simple language that doesn't feel like it's written by an AI. The tone should be suitable for a professional audience and use relevant hashtags. If the user input is not related to generating a LinkedIn post from a blog, respond politely indicating that only LinkedIn post generation from blog content is supported. Here are the blog: \n\n <> ${article} <>`
    }
    
    else {
      prompt = `Create an engaging Twitter thread based on the following blog content. The thread should be interesting, attention-grabbing, and written in the style of a famous Twitter thread creator. Ensure that the first tweet serves as an introduction to the thread. The total number of tweets in the thread should be specified by the user, with each tweet adhering to Twitter's character limit of 280 characters. 

      IMPORTANT: Separate each tweet with the exact delimiter '---TWEET_BREAK---' (without quotes) apart from first one.
      
      Each tweet should be written in the first person. Include relevant hashtags and emojis to enhance engagement. Maintain any links and names mentioned in the blog as they are, and clearly label them like '1.' and '2.' with emojis. 
      
      Here are the details: 
      ${article}`;
          }
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      if (selectedValue === 'xthread') {
        const tweets = text.split('---TWEET_BREAK---').map(tweet => tweet.trim());
        set({ tweets, generatedContent: '', successfullyGenerated: true });
      } else {
        set({ generatedContent: text, tweets: [], successfullyGenerated: true });
      }
      toast.success('Post generated successfully!');
    } catch (error) {
      set({ tripPlan: 'Error generating Post. API key not valid. Please pass valid API Key to generate social posts' });
      set({ successfullyGenerated: false });
      toast.error('Error generating Post. API key not valid');
    } finally {
      set({ loading: false });
    }
  },

  generatePlatformPost: async (content: string) => {
    set({ loading: true });
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const { platform } = useSelectedPlatformStore.getState();

    let prompt = `Create an engaging social media post based on the following information. The post should be exciting, clear, and tailored to ${platform}. Use relevant hashtags and make sure the tone matches the platform's typical style. If the content is not suitable for a social media post, respond politely indicating that only social media post generation is supported.\n\nContent: ${content}`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const generatedPost = response.text();
      set({ 
        generatedContent: generatedPost, 
        successfullyGenerated: true 
      });
      toast.success(`${platform} post generated successfully!`);
    } catch (error) {
      set({ 
        generatedContent: 'Error generating post. Please try again.', 
        successfullyGenerated: false 
      });
      toast.error(`Error generating ${platform} post. Please try again.`);
    } finally {
      set({ loading: false });
    }
  },

  // Function to generate image
  generateImage: async (prompt: string) => {
    set({ loading: true });
    const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY_TWO;
    const url = 'https://api.openai.com/v1/images/generations';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    };
    const body = JSON.stringify({
      prompt: prompt,
      n: 1,
      size: '1024x1024', // Square size
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        set({ imageUrl: data.data[0].url });
        toast.success('Image generated successfully!');
      } else {
        throw new Error('No image generated');
      }
    } catch (error) {
      set({ imageUrl: 'Error generating image. API key not valid. Please pass valid API Key to generate images' });
      toast.error('Error generating image. API key not valid');
    }

    set({ loading: false });
  },

  // Function to save post to Supabase
  savePost: async (postData) => {
    set({ loading: true });

    try {
      const { data, error } = await supabase
        .from('SavedPosts')
        .insert([
          {
            user_id: postData.user_id,
            userName: postData.userName,
            postContent: postData.postContent,
            post_type: postData.post_type,
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      toast.success('Post saved successfully!');
      set({ loading: false, successfullyGenerated: false });
    } catch (error) {
      toast.error('Error saving post. Please try again.');
      set({ loading: false, successfullyGenerated: true });
    }
  },

  // function to update the posts
  updatePost: async (updateData) => {
    set({ loading: true });

    try {
      const { data, error } = await supabase
        .from('SavedPosts')
        .update({ postContent: updateData.postContent })
        .match({ id: updateData.postId });

      if (error) {
        throw error;
      }

      toast.success('Post updated successfully!');
      set({ loading: false });
      get().fetchUserPosts(updateData.user_id);
    } catch (error) {
      toast.error('Error updating post. Please try again.');
      set({ loading: false });
    }
  },

  // function to fetch user posts
  fetchUserPosts: async (userId) => {
    set({ loading: true });

    try {
      const { data, error } = await supabase
        .from('SavedPosts')
        .select('id, postContent')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      if (data) {
        const posts = data.map((post) => post.postContent);
        const postsId = data.map((post) => post.id);
        console.log("my posts ", posts);
        set({ userPosts: posts, userIds: postsId });
      }

      set({ loading: false });
    } catch (error) {
      toast.error('Error fetching user posts. Please try again.');
      set({ loading: false });
    }
  },
}));

export default useStore;
