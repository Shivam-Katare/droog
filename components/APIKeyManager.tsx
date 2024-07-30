"use client";

import { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Key, ExternalLink } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { useApiKeyStore } from '@/store/apiKeyStore';
import toast from 'react-hot-toast';
import useStore from '@/store/apiStore';
import { useUser } from '@clerk/nextjs';

const APIKeyManager = () => {
  const { user } = useUser();
  const userId = user?.id;

  const { 
    geminiKey, stabilityAIKey, huggingFaceKey, 
    setGeminiKey, setStabilityAIKey, setHuggingFaceKey,
    geminiUsage, stabilityAIUsage, huggingFaceUsage
  } = useApiKeyStore();

  const { developerAPIKeyUsageLeft, developerHuggingFaceTokenUsageLeft, developerStabilityAPIKeyUsageLeft } = useStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentApiInfo, setCurrentApiInfo] = useState<{ name: string; url: string; steps: string[] }>({ name: '', url: '', steps: [] });

  if (!userId) {
    return null;
  }

  const apiInfos = {
    gemini: {
      name: 'Gemini',
      url: 'https://aistudio.google.com/app/apikey',
      steps: [
        'Click on the below button to go to the Google Gemini API page',
        'Click on Create API Key button',
        'Copy the API Key and Save it somewhere safe',
        'Copy the API key',
        'Paste it over here and click on Save API Keys'
      ]
    },
    stabilityAI: {
      name: 'Stability AI',
      url: 'https://platform.stability.ai/account/keys',
      steps: [
        'Sign up for a Stability AI account',
        'Navigate to the API Keys section',
        'Generate a new API key',
        'Copy the API key'
      ]
    },
    huggingFace: {
      name: 'HuggingFace',
      url: 'https://huggingface.co/settings/tokens',
      steps: [
        'Create a HuggingFace account',
        'Go to your profile settings',
        'Navigate to the Access Tokens section',
        'Create a new token',
        'Copy the token'
      ]
    }
  };

  type ApiType = keyof typeof apiInfos;

  const handleOpenDialog = (apiType: ApiType) => {
    setCurrentApiInfo(apiInfos[apiType]);
    setIsDialogOpen(true);
  };

  const handleSaveApiKeys = () => {
    useApiKeyStore.getState().setGeminiKey(geminiKey);
    useApiKeyStore.getState().setStabilityAIKey(stabilityAIKey);
    useApiKeyStore.getState().setHuggingFaceKey(huggingFaceKey);
    toast.success("API keys saved successfully!");
  };

  const getUsageCount = (key: any) => {
    if (key === 'geminiKey') {
      return geminiKey ? geminiUsage : developerAPIKeyUsageLeft;
    } else if (key === 'stabilityAIKey') {
      return stabilityAIKey ? stabilityAIUsage : developerStabilityAPIKeyUsageLeft;
    } else if (key === 'huggingFaceKey') {
      return huggingFaceKey ? huggingFaceUsage : developerHuggingFaceTokenUsageLeft;
    }
    return 0;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            API Keys <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-96 p-4">
          <div className="space-y-4">
            {Object.entries({ geminiKey, stabilityAIKey, huggingFaceKey }).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</Label>
                   <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger asChild>
                    <Badge variant={value ? 'default' : 'destructive'}>
                          {value ? 'It`s Your Key' : `${getUsageCount(key)}  uses left`}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {value ? 'It`s Your Key' : 'Please add an API key'}
                    </TooltipContent>
                  </Tooltip>
                   </TooltipProvider>
                  
                </div>
                <div className="flex space-x-2">
                  <Input
                    id={key}
                    type="password"
                    value={value}
                    onChange={(e) => {
                      if (key === 'geminiKey') setGeminiKey(e.target.value);
                      else if (key === 'stabilityAIKey') setStabilityAIKey(e.target.value);
                      else if (key === 'huggingFaceKey') setHuggingFaceKey(e.target.value);
                    }}
                    placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}`}
                  />
                  <Button variant="outline" size="icon" onClick={() => handleOpenDialog(key.replace('Key', '') as ApiType)}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button className="w-full" onClick={handleSaveApiKeys}>
              Save API Keys
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentApiInfo.name} API Key Guide</DialogTitle>
            <DialogDescription>
              Follow these steps to get your {currentApiInfo.name} API key:
            </DialogDescription>
          </DialogHeader>
          <ol className="list-decimal list-inside space-y-2">
            {currentApiInfo.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          <Alert>
            <Key className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Never share your API key publicly. Keep it secret and secure.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full mt-4">
            <a href={currentApiInfo.url} target="_blank" rel="noopener noreferrer">
              Get {currentApiInfo.name} API Key
            </a>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default APIKeyManager;