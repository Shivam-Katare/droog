"use client";

import SaveData from '@/components/component/save-data';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <>
     <SaveData />
     <Toaster />
    </>
  )
}