import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from "next/image";

export const Hero = () => {
  return (
    <section className="container w-full grid justify-items-center mt-12">
      <h1 className="text-5xl md:text-6xl font-bold">DROOG</h1>

      <main className="text-[25px] font-sans font-bold text-center">
        <h1>
          <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">

          </span>{" "}
        </h1>
        <h1>
          Convert your blog into social media posts.
        </h1>

        <AspectRatio ratio={16 / 9} className="bg-muted mt-12">
          <Image
            src="https://ik.imagekit.io/dnwefib6s4/Gemini_Generated_Image_5d1ql35d1ql35d1q.jfif?updatedAt=1720417256685"
            alt="Photo by Drew Beamer"
            fill
            className="rounded-md object-cover"
          />
        </AspectRatio>

        <div className="space-y-4 md:space-y-0 md:space-x-4 mt-12">
          <Link href="/user/home">
            <Button className="w-full md:w-1/3">Get Started</Button>
          </Link>

          <a
            rel="noreferrer noopener"
            href="https:github.com/leoMirandaa/shadcn-landing-page.git"
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Github Repository
          </a>
        </div>
      </main>

    </section>
  );
};