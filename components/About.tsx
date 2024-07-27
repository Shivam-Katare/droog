export const About = () => {
  return (
    <section
      id="about"
      className="container py-24 sm:py-32"
    >
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          {/* <img
            src=""
            alt=""
            className="w-[300px] object-contain rounded-lg"
          /> */}
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                DROOG
              </h2>
                <ul className="list-disc text-xl text-muted-foreground mt-4 pl-5">
                  <li>DROOG is your one-stop shop for streamlining social media content creation!</li>
                  <li>Feeling overwhelmed by turning your blog into engaging social media posts? DROOG is your friendly companion, effortlessly converting your blog content into Twitter threads, LinkedIn posts, and more.</li>
                  <li>Craft fresh posts from scratch or simply copy-paste your blog link – DROOG takes care of the rest.</li>
                  <li>To make your content even more captivating, DROOG uses the power of AI to generate images that perfectly complement your words.</li>
                  <li>Save your creations and manage your social media content strategy all within our user-friendly dashboard.</li>
                  <li>Unleash your voice and amplify your reach with DROOG, your social media content creation friend!</li>
                </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};