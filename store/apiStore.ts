import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from '@/lib/supabaseClient';
import { useSelectedPlatformStore, useSelectedValueStore } from './useSelectedPostsType';
import axios from 'axios';
import { useApiKeyStore } from './apiKeyStore';
import { createJSONStorage, persist } from 'zustand/middleware';

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
  apiKeyUsageCount: number;
  userApiKey: string;
  generatedContent: string;
  generatedPlatformContent: string;
  tweets: string[];
  successfullyGenerated: boolean;
  successfullyPromptGenerated: boolean;
  userPosts: string[];
  userIds: number[];
  posts: Post[];
  developerAPIKeyUsageLeft: number;
  developerStabilityAPIKeyUsageLeft: number;
  developerHuggingFaceTokenUsageLeft: number;
  setDeveloperHuggingFaceTokenUsageLeft: (usage: number) => void;
  setDeveloperAPIKeyUsageLeft: (usage: number) => void;
  setDeveloperStabilityAPIKeyUsageLeft: (usage: number) => void;
  setGeneratedContent: (content: string) => void;
  setGeneratedPlatformContent: (content: string) => void;
  setLoading: (loading: boolean) => void;
  generatePost: (article: string) => Promise<void>;
  generateImagePrompt: (content: string) => Promise<string | void>;
  generateImage: (prompt: string) => Promise<void>;
  savePost: (postData: { user_id: string; userName: string; postContent: string, post_type: string  }) => Promise<void>;
  updatePost: (updateData: { postId: string; postContent: string; user_id: string}) => Promise<void>;
  fetchUserPosts: (userId: string) => Promise<void>;
  generatePlatformPost: (content: string) => Promise<void>;
  setUserApiKey: (key: string) => void;
}

type PersistedState = Pick<StoreState, 'developerAPIKeyUsageLeft' | 'developerStabilityAPIKeyUsageLeft' | 'developerHuggingFaceTokenUsageLeft'>;

// Create the Zustand store
const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      tripPlan: '',
      loading: false,
      apiKey: '',
      myKey: 0,
      imageUrl: '',
      apiKeyUsageCount: 0,
      userApiKey: '',
      generatedContent: '',
      generatedPlatformContent: '',
      tweets: [],
      successfullyGenerated: false,
      successfullyPromptGenerated: false,
      userPosts: [],
      userIds: [],
      posts: [],
      developerAPIKeyUsageLeft: 20,
      developerStabilityAPIKeyUsageLeft: 1,
      developerHuggingFaceTokenUsageLeft: 20,
      setDeveloperHuggingFaceTokenUsageLeft: (usage: number) => set({ developerHuggingFaceTokenUsageLeft: usage }),
      setDeveloperStabilityAPIKeyUsageLeft: (usage: number) => set({ developerStabilityAPIKeyUsageLeft: usage }),
      setDeveloperAPIKeyUsageLeft: (usage: number) => set({ developerAPIKeyUsageLeft: usage }),
      setGeneratedContent: (content: string) => set({ generatedContent: content }),
      setGeneratedPlatformContent: (content: string) => set({ generatedPlatformContent: content }),
      setLoading: (loading: boolean) => set({ loading }),
    
      generatePost: async (article: string) => {
        const { developerAPIKeyUsageLeft, setDeveloperAPIKeyUsageLeft } = get();
        const { geminiKey } = useApiKeyStore.getState();
    
        if (developerAPIKeyUsageLeft <= 0) {
          toast.error('You have reached the limit of free API usage. Please add your own API key.');
          return;
        }
        set({ loading: true });
        const API_KEY = geminiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY
        const genAI = new GoogleGenerativeAI(API_KEY || '');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const selectedValue = useSelectedValueStore.getState().value;
        let prompt;
        if (selectedValue === 'xpost') {
    
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
          // Decrease the API usage count
          if (!geminiKey && developerAPIKeyUsageLeft > 0) {
            setDeveloperAPIKeyUsageLeft(developerAPIKeyUsageLeft - 1);
          }
        } catch (error) {
          set({ tripPlan: 'Error generating Post. API key not valid. Please pass valid API Key to generate social posts' });
          set({ successfullyGenerated: false });
          toast.error('Error generating Post. Please try to add your own Gemini API key');
        } finally {
          set({ loading: false });
        }
      },
    
      generatePlatformPost: async (content: string) => {
        const { developerAPIKeyUsageLeft, setDeveloperAPIKeyUsageLeft } = get();
        const { geminiKey } = useApiKeyStore.getState();
    
        if (developerAPIKeyUsageLeft <= 0) {
          toast.error('You have reached the limit of free API usage. Please add your own API key.');
          return;
        }
        set({ loading: true });
        const API_KEY = geminiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(API_KEY || '');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const { platform } = useSelectedPlatformStore.getState();
    
        let prompt = `Create an engaging social media post based on the following information. The post should be exciting, clear, and tailored to ${platform}. Use relevant hashtags and make sure the tone matches the platform's typical style. If the content is not suitable for a social media post, respond politely indicating that only social media post generation is supported.\n\nContent: ${content}`;
    
        try {
          const result = await model.generateContent(prompt);
          const response = result.response;
          const generatedPost = response.text();
          set({ 
            generatedPlatformContent: generatedPost, 
            successfullyPromptGenerated: true 
          });
          toast.success(`${platform} post generated successfully!`);
    
          if (!geminiKey && developerAPIKeyUsageLeft > 0) {
            setDeveloperAPIKeyUsageLeft(developerAPIKeyUsageLeft - 1);
          }
        } catch (error) {
          set({ 
            generatedPlatformContent: 'Error generating post. Please try again.', 
            successfullyPromptGenerated: false 
          });
          toast.error(`Error generating ${platform} post. Please try to add your own Gemini API key`);
        } finally {
          set({ loading: false });
        }
      },
    
      generateImagePrompt: async (content: string) => {
        const { developerAPIKeyUsageLeft, setDeveloperAPIKeyUsageLeft } = get();
        const { geminiKey } = useApiKeyStore.getState();
    
        if (developerAPIKeyUsageLeft <= 0) {
          toast.error('You have reached the limit of free API usage. Please add your own API key.');
          return;
        }
        set({ loading: true });
        const API_KEY = geminiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(API_KEY || '');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Convert the following social media post into a creative and detailed image generation prompt. The image prompt should accurately reflect the essence of the post and provide enough detail to generate a high-quality image. Ensure the prompt is clear, descriptive, and suitable for an image generation model. Here are the details: ${content}`;
    
        try {
          const result = await model.generateContent(prompt);
          const response = result.response;
          const generatedPrompt = response.text();
          toast.success('Image prompt generated successfully!');
          if (!geminiKey && developerAPIKeyUsageLeft > 0) {
            setDeveloperAPIKeyUsageLeft(developerAPIKeyUsageLeft - 1);
          }
          return generatedPrompt;
        } catch (error) {
          toast.error('Error generating image prompt. Please try to add your own Gemini API key. Or try generating an image directly.');
        } finally {
          set({ loading: false });
        }
      },
    
      generateImage: async (prompt: string) => {

        const { developerStabilityAPIKeyUsageLeft, setDeveloperStabilityAPIKeyUsageLeft } = get();
        const { stabilityAIKey } = useApiKeyStore.getState();
    
        if (developerStabilityAPIKeyUsageLeft <= 0) {
          toast.error('You have reached the limit of free API usage. Please add your own API key.');
          return;
        }

        set({ loading: true });
           const apiKey = stabilityAIKey || process.env.NEXT_PUBLIC_STABILITY_API_KEY;
      
        if (!apiKey) {
          toast.error('Please provide your Stability AI API key');
          set({ loading: false });
          return;
        }
      
        try {
          const formData = new FormData();
          formData.append('prompt', prompt);
          formData.append('cfg_scale', '7');
          formData.append('height', '1024');
          formData.append('width', '1024');
          formData.append('steps', '30');
          formData.append('samples', '1');
          formData.append('output_format', 'png');
      
          const response = await axios.post(
            'https://api.stability.ai/v2beta/stable-image/generate/ultra',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Accept: 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
            }
          );
      
          if (response.status === 200) {
            const imageUrl = `data:image/png;base64,${response.data.image}`;
            set({
              imageUrl,
              apiKeyUsageCount: get().apiKeyUsageCount + 1,
            });
            if (!stabilityAIKey && developerStabilityAPIKeyUsageLeft > 0) {
              setDeveloperStabilityAPIKeyUsageLeft(developerStabilityAPIKeyUsageLeft - 1);
            }
            toast.success('Image generated successfully!');
          } else {
            toast.error(`Failed to generate image. Please try to add your own Stability AI API key`);
          }
        } catch (error: any) {
          if (error.response) {
            switch (error.response.status) {
              case 400:
                toast.error('Invalid parameter(s). Please check your input.');
                break;
              case 402:
                toast.error('Payment required. Please add credits to your account at Stability Platform.');
                break;
              case 403:
                toast.error('Request flagged by content moderation system.');
                break;
              case 413:
                toast.error('Request was larger than 10MiB.');
                break;
              case 422:
                toast.error('Request was well-formed, but rejected.');
                break;
              case 429:
                toast.error('Too many requests. Please try again later.');
                break;
              case 500:
                toast.error('Internal server error. Please try again later.');
                break;
              default:
                toast.error(`Unexpected error: ${error.response.status}`);
            }
          } else {
            toast.error('Failed to generate image. Please try again.');
          }
        } finally {
          set({ loading: false });
        }
      },
    
      setUserApiKey: (key: string) => set({ userApiKey: key }),
    
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
          set({ loading: false, successfullyGenerated: false, successfullyPromptGenerated: false });
        } catch (error) {
          toast.error('Error saving post. Please try again.');
          set({ loading: false, successfullyGenerated: true, successfullyPromptGenerated: true });
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
            set({ userPosts: posts, userIds: postsId });
          }
    
          set({ loading: false });
        } catch (error) {
          toast.error('Error fetching user posts. Please try again.');
          set({ loading: false });
        }
      },
    }),
    {
      name: 'developer-api-usage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ developerAPIKeyUsageLeft: state.developerAPIKeyUsageLeft, developerStabilityAPIKeyUsageLeft: state.developerStabilityAPIKeyUsageLeft, developerHuggingFaceTokenUsageLeft: state.developerHuggingFaceTokenUsageLeft } as PersistedState),
    }
  )
 
);

export default useStore;
