import { useSelectedPlatformStore } from '@/store/useSelectedPostsType';
import React from 'react';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import { SiPeerlist } from 'react-icons/si';

const SocialIcon = () => {
  const { platform } = useSelectedPlatformStore()

  switch (platform) {
    case 'linkedinpost':
      return <FaLinkedin size={24} color="#0a66c2" />;
    case 'xpost':
      return <FaTwitter size={24} color="#1DA1F2" />;
    case 'facebookpost':
      return <FaFacebook size={24} color="#1877F2" />;
    case 'instagrampost':
      return <FaInstagram size={24} color="#E1306C" />;
    case 'peerlist':  
      return <SiPeerlist size={24} color="green" />;
    default:
      return null;
  }
};

export default SocialIcon;