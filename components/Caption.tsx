import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { HfInference } from '@huggingface/inference';
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CloudIcon, CopyIcon } from "lucide-react";
import toast from 'react-hot-toast';
import useStore from '@/store/apiStore';
import { useApiKeyStore } from '@/store/apiKeyStore';

const languages = ['English', 'Hindi', 'Spanish', 'French', 'Russian'];
const tones = [
  'Neutral',
  'Funny',
  'Happy',
  'Sad',
  'Fun',
  'Friendly',
  'Friends',
  'Family',
  'Relatives',
  'Roast',
  'Sarcastic',
  'Formal',
  'Inspirational',
  'Sarcastic',
  'Dramatic',
  'Mysterious',
  'Energetic',
  'Relaxed',
  'Professional',
  'Casual',
  'Poetic',
  'Nostalgic',
  'Optimistic',
  'Excited',
  'Thoughtful',
  'Whimsical',
  'Motivational',
  'Empathetic',
  'Adventurous',
  'Confident',
  'Humble',
  'Playful',
  'Serious',
  'Grateful',
  'Curious',
  'Philosophical',
];

const ImageCaptioner: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tone, setTone] = useState<string>('Neutral');
  const [useHashtags, setUseHashtags] = useState<boolean>(false);
  const [useEmojis, setUseEmojis] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('English');
  const [variants, setVariants] = useState<number>(1);

  const { developerAPIKeyUsageLeft, setDeveloperAPIKeyUsageLeft, developerHuggingFaceTokenUsageLeft, setDeveloperHuggingFaceTokenUsageLeft } = useStore();
  const { geminiKey, huggingFaceKey } = useApiKeyStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      setImage(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    }
  });

  const generateCaptionVariants = async (initialCaption: string) => {

    if (developerAPIKeyUsageLeft <= 0) {
      toast.error('You have reached the daily limit for using the Huggingface API. Please try again tomorrow.');
      return;
    }

    const API_KEY = geminiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!API_KEY) {
      toast.error("Gemini API key is not set");
    }

    const genAI = new GoogleGenerativeAI(API_KEY || '');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate ${variants} ${tone.toLowerCase()} captions in ${language} based on the following image description. ${useHashtags ? 'Include relevant hashtags.' : ''} ${useEmojis ? 'Include appropriate emojis.' : ''} Keep each caption concise and engaging.

              Initial caption: "${initialCaption}"

      Please provide the captions in a numbered list format.`;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const generatedText = response.text();

      const variantCaptions = generatedText.split('\n')
        .filter(line => line.trim().match(/^\d+\./))
        .map(line => line.replace(/^\d+\.\s*/, '').trim());

      if (!geminiKey && developerAPIKeyUsageLeft > 0) {
        setDeveloperAPIKeyUsageLeft(developerAPIKeyUsageLeft - 1);
      }
      return variantCaptions;
    } catch (error) {
      toast.error('Error generating captions. Please try again. Or use your Huggingface Token.');
      throw error;
    }
  };


  const generateCaption = async () => {
    if (!image) return;

    if (developerHuggingFaceTokenUsageLeft <= 0) {
      toast.error('You have reached the limit for using the Huggingface Token. Please try to add your own token.');
      return;
    }

    setLoading(true);
    try {
      const hf = new HfInference(huggingFaceKey || process.env.NEXT_PUBLIC_HF_ACCESS_TOKEN);
      const result = await hf.imageToText({
        model: 'Salesforce/blip-image-captioning-large',
        data: image,
      });

      const initialCaption = result.generated_text;
      const variantCaptions = await generateCaptionVariants(initialCaption);
      setCaptions(variantCaptions || []);
      toast.success('Captions generated successfully!');

      if (!huggingFaceKey && developerHuggingFaceTokenUsageLeft > 0) {
        setDeveloperHuggingFaceTokenUsageLeft(developerHuggingFaceTokenUsageLeft - 1);
      }

    } catch (error) {
      toast.error('Error generating captions. Please try again.');
      setCaptions(['Error generating captions. Please try again.']);
    } finally {
      setLoading(false);
    }
  };
  const handleCopy = (caption: string) => {
    navigator.clipboard.writeText(caption);
    toast.success('Caption copied to clipboard');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Image Captioner</h1>

      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
      >
        <input {...getInputProps()} />
        <CloudIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p>Drop the image here ...</p>
        ) : (
          <p>Drag &apos;n&apos; drop an image here, or click to select</p>
        )}
      </div>

      {image && (
        <div className="mt-4 text-center">
          <img src={URL.createObjectURL(image)} alt="Preview" className="max-w-full max-h-64 mx-auto object-contain" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select onValueChange={setTone} value={tone}>
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              {tones.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select onValueChange={setLanguage} value={language}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <Label>Number of Variants: {variants}</Label>
        <Slider
          value={[variants]}
          onValueChange={(value: any) => setVariants(value[0])}
          min={1}
          max={5}
          step={1}
        />
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="hashtags" checked={useHashtags} onCheckedChange={setUseHashtags} />
          <Label htmlFor="hashtags">Include Hashtags</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="emojis" checked={useEmojis} onCheckedChange={setUseEmojis} />
          <Label htmlFor="emojis">Include Emojis</Label>
        </div>
      </div>

      <Button
        onClick={generateCaption}
        disabled={!image || loading}
        className="w-full mt-6"
      >
        {loading ? 'Generating...' : 'Generate Caption'}
      </Button>

      {captions.map((caption, index) => (
        <Card key={index} className="mt-4">
          <CardContent className="p-4">
            <p className="text-sm">{caption}</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => handleCopy(caption)}
            >
              <CopyIcon className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ImageCaptioner;
