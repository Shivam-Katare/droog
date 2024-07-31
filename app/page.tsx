import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Edit3, Repeat, Image as ImageIcon, Save, Bell } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import SparklesText from "@/components/magicui/sparkles-text";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import { SiNextdotjs } from "react-icons/si";
import { SiTypescript } from "react-icons/si";
import { SiClerk } from "react-icons/si";
import { SiShadcnui } from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";

const FeatureCard = ({ icon, title, description }: any) => (
  <Card className="flex flex-col items-center text-center">
    <CardHeader>
      <div className="p-2 bg-primary/10 rounded-full mb-4">{icon}</div>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
    </CardContent>
  </Card>
);

const Hero = () => {
  return (
    <section className="container w-full grid justify-items-center mt-12 space-y-8">
      <SparklesText text="DROOG" className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text" />

      <p className="text-2xl md:text-3xl font-semibold text-center max-w-3xl">
        Your AI-powered companion for effortless social media content creation
      </p>

      <p className="text-xl text-center text-muted-foreground max-w-2xl">
        Transform your ideas and blogs into engaging posts for Instagram, Twitter, Peerlist, Facebook, and LinkedIn with just a few clicks.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link href="/user/home">
          <Button size="lg" className="w-full sm:w-auto">
            Let&apos;s Go <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <a
          rel="noreferrer noopener"
          href="https://github.com/Shivam-Katare/droog"
          target="_blank"
          className={`w-full sm:w-auto ${buttonVariants({ variant: "outline", size: "lg" })}`}
        >
          Github Repository
        </a>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Edit3 className="h-8 w-8 text-primary" />,
      title: "Generate Post Ideas",
      description: "Create rich, platform-specific posts for Instagram, Twitter, Peerlist, Facebook, and LinkedIn with AI assistance.",
    },
    {
      icon: <Repeat className="h-8 w-8 text-primary" />,
      title: "Blog to Social Media Posts",
      description: "Convert your blog content into tailored social media posts and threads with a simple copy-paste.",
    },
    {
      icon: <ImageIcon className="h-8 w-8 text-primary" />,
      title: "AI Image Captioner",
      description: "Generate multiple captions for your images based on tone, language, and platform preferences.",
    },
    {
      icon: <Save className="h-8 w-8 text-primary" />,
      title: "Manage Your Content",
      description: "Save, edit, update, and filter your generated posts in a centralized dashboard.",
    },
    {
      icon: <ImageIcon className="h-8 w-8 text-primary" />,
      title: "Realistic AI Image Generation",
      description: "Create stunning, realistic images using advanced AI algorithms tailored to your content needs.",
    },
    {
      icon: <Bell className="h-8 w-8 text-primary" />,
      title: "Growth Notifications",
      description: "Receive daily and weekly notifications about your growth and reminders to post on social media.",
    },
  ];

  return (
    <section className="container py-24 space-y-2">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Supercharge Your Social Media Strategy
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="container py-2 sm:py-4">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col md:flex-row gap-8 md:gap-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                About{" "}
              </span>
              DROOG
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              DROOG is your AI-powered companion for effortless social media content creation. Say goodbye to content creation stress and hello to engaging, platform-optimized posts!
            </p>
            <ul className="space-y-2 text-lg">
              <li>✓ AI-powered post generation for multiple platforms</li>
              <li>✓ Blog-to-social media conversion</li>
              <li>✓ Intelligent image captioning</li>
              <li>✓ Content management dashboard</li>
              <li>✓ Time-saving and efficiency-boosting features</li>
            </ul>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <AspectRatio ratio={4 / 3} className="bg-muted w-full max-w-md">
              <Image
                src="/features.png"
                alt="DROOG in action"
                fill
                className="rounded-lg object-cover"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
    </section>
  );
};

const TechStack = () => {
  const technologies = [
    { name: "Next.js", icon: <SiNextdotjs className="w-6 h-6" /> },
    { name: "TypeScript", icon: <SiTypescript className="w-6 h-6 text-blue-600" /> },
    { name: "Clerk", icon: <SiClerk className="w-6 h-6" /> },
    { name: "shadcn/ui", icon: <SiShadcnui className="w-6 h-6" /> },
    { name: "Tailwind CSS", icon: <RiTailwindCssFill className="w-6 h-6 text-blue-400" /> },
    { name: "Plus More", icon: <TbSquareRoundedPlusFilled className="w-6 h-6 text-green-500" /> },
  ];

  return (
    <section className="container py-16 space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        <SparklesText text="Powered by Cutting-Edge Tech" className="bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text" />
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-8">
        {technologies.map((tech, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              {tech.icon}
            </div>
            <span className="mt-2 text-sm font-medium">{tech.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">DROOG</h3>
            <p className="text-gray-300">Your AI-powered social media companion</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/user/home" className="hover:text-gray-200 transition-colors">Generate Posts</Link></li>
              <li><Link href="/user/savedposts" className="hover:text-gray-200 transition-colors">Save Posts</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/docs" target="_blank" className="hover:text-gray-200 transition-colors">ReadME</Link></li>
              <li><Link href="https://github.com/Shivam-Katare/droog" target="_blank" className="hover:text-gray-200 transition-colors">GitHub Repo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="https://github.com/your-github" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <FaGithub className="w-6 h-6" />
              </a>
              <a href="https://x.com/Shivamkatare_27" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <FaXTwitter className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/shivam-katare" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-gray-700" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">&copy; 2024 DROOG. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="https://github.com/Shivam-Katare/droog" className="text-gray-400 hover:text-white transition-colors">Contribute | Give a Star | Share with Friends</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <About />
      <TechStack />
      <Footer />
    </>
  );
}
