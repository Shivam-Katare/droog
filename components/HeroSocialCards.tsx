import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Linkedin } from "lucide-react";

export const HeroSocialCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Social Posts */}
      <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt="x logo"
              src="/x.svg"
            />
            <AvatarFallback>X</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">Shivam Katare</CardTitle>
            <CardDescription>@shivamkatare_27</CardDescription>
          </div>
        </CardHeader>

        <CardContent>You know, DROOG can genrate a short high quality social posts that saves a lot of your time</CardContent>
      </Card>

      <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt="x logo"
              src="/linkedIn.svg"
            />
            <AvatarFallback>X</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">Shivam Katare</CardTitle>
            <CardDescription>@shivamkatare_27</CardDescription>
          </div>
        </CardHeader>

        <CardContent> LinkedIn Posts can easily be created by DROOG </CardContent>
      </Card>
    </div>
  );
};