import Image from "next/image";
import Link from "next/link";
import ImageCarousel from "../components/image-carousel";
import Footer from "@/components/footer";
import Header from "@/components/header";
import ScrollFadeIn from "@/components/scroll-fade-in";
import { features } from "process";

export default function Landing() {
  return (
    <>
      {/* Gradient Background Wrapper */}
      <div className="bg-gradient-to-b from-[#00020A] via-[#6C00B3] to-[#00020A]">
        <div className="bg-gradient-to-b from-[#00020A] to-[#00020A]/0">
          <div className=' bg-[url("/Bg.png")] bg-cover bg-center -z-10'>
            {/*Header*/}
            <Header />
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center text-center text-white mt-20 w-full ">
              <div className="flex items-center space-x-2 mt-30">
                <Image
                  src="/logo-zen.png"
                  alt="logo"
                  className="rounded-full"
                  width={40}
                  height={40}
                />
                <h1 className="text-5xl font-bold text-[#ECECEC]">Zen</h1>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <h1 className="text-7xl font-medium w-200 mt-15 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                  Smarter Studying, Effortless Focus
                </h1>
                <p className="mt-10 text-lg w-150 text-[#ECECECA6]">
                  Boost your learning with AI-powered notes, insights, and
                  progress tracking—all in one place.
                </p>
                <Link href="/signup" className="radial-gradient-button mt-8">
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          {/* Image Carousel Section */}
          <div className="mt-20 mb-10">
            <ImageCarousel />
          </div>
          <div
            id="features"
            className="flex flex-col items-center justify-center text-center text-white w-full"
          >
            <h1 className="text-5xl font-bold w-100 mt-10 text-[#ECECEC]">
              Features that work for your future.
            </h1>
            <p className="text-base text-[#ECECECA6] w-100 mt-10">
              Check out our powerful tools designed to enhance your study
              experience.
            </p>
          </div>

          <ScrollFadeIn
            direction="left"
            className="flex flex-col w-[80%] mx-auto mt-30 mb-10"
          >
            <div className="mx-auto flex w-full max-w-[1100px] items-start gap-10">
              <div className="w-[40%]">
                <h1 className="text-[55px] font-bold bg-gradient-to-b from-[#CB98ED] to-[#591DA9] bg-clip-text text-transparent">
                  Track Progress. Stay Motivated.
                </h1>
                <p className="font-bold text-[22px] w-110 text-white">
                  Stay on top of your learning journey with Weekly Wrap, a
                  detailed breakdown of your study habits.{" "}
                </p>
              </div>
              <div className="flex flex-1 h-60 justify-center gap-10">
                <div className="flex flex-col flex-1 max-w-[140px] mt-25">
                  <Image
                    src="/Vector1.png"
                    alt="Symbol 1"
                    width={48}
                    height={48}
                  />
                  <p className="text-xs font-bold mt-8 text-white">
                    Study Stats
                  </p>
                  <p className="text-[10px] w-25 text-[#ECECECA6]">
                    Track your notes, top subjects, and streaks.
                  </p>
                </div>
                <div className="flex flex-col flex-1 max-w-[140px] mt-25">
                  <Image
                    src="/Vector2.png"
                    alt="Symbol 2"
                    width={48}
                    height={48}
                  />
                  <p className="text-xs font-bold mt-8 text-white">
                    Summary of Notes
                  </p>
                  <p className="text-[10px] w-25 text-[#ECECECA6]">
                    Quick takeaways for easy review.
                  </p>
                </div>
                <div className="flex flex-col flex-1 max-w-[140px] mt-25">
                  <Image
                    src="/Vector3.png"
                    alt="Symbol 3"
                    width={48}
                    height={48}
                  />
                  <p className="text-xs font-bold mt-8 text-white">
                    AI Suggestions
                  </p>
                  <p className="text-[10px] w-25 text-[#ECECECA6]">
                    Smart tips to boost your study game.
                  </p>
                </div>
                <div className="flex flex-col flex-1 max-w-[140px] mt-25">
                  <Image
                    src="/Vector4.png"
                    alt="Symbol 4"
                    width={48}
                    height={48}
                  />
                  <p className="text-xs font-bold mt-8 text-white">
                    Study <span className="text-[#7334c6]">Purr-sonality</span>
                  </p>
                  <p className="text-[10px] w-25 text-[#ECECECA6]">
                    See your learning style in action!
                  </p>
                </div>
              </div>
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn
            direction="right"
            className="flex flex-col w-[80%] mx-auto mb-30"
          >
            <div className="flex justify-center mt-3">
              <Image
                src="/image1.png"
                alt="Image 1"
                width={1300}
                height={1300}
              />
            </div>
          </ScrollFadeIn>

          <ScrollFadeIn direction="up">
            <div className="flex flex-col w-[80%] mx-auto mt-10 ">
              <div className="mx-auto flex w-full max-w-[1100px] items-start gap-10">
                <div className="w-[60%]">
                  <h1 className="text-[55px] font-bold bg-gradient-to-b from-[#CB98ED] to-[#591DA9] bg-clip-text text-transparent">
                    Smart Study Tools, Powered by AI
                  </h1>
                  <p className="font-bold text-[22px] w-110 text-white">
                    Stay on top of your learning journey with Weekly Wrap, a
                    detailed breakdown of your study habits.
                  </p>
                </div>
                <div className="flex flex-1 h-60 justify-center gap-16">
                  <div className="flex flex-col flex-1 max-w-[260px] mt-25">
                    <Image
                      src="/Vector2.png"
                      alt="Symbol 1"
                      width={48}
                      height={48}
                    />
                    <p className="text-xs font-bold mt-8 text-white">
                      AI Notes
                    </p>
                    <p className="text-[10px] w-40 text-[#ECECECA6]">
                      Instantly generate summaries from pasted text, uploaded
                      files, or Google Drive docs.
                    </p>
                  </div>
                  <div className="flex flex-col flex-1 max-w-[260px] mt-25">
                    <Image
                      src="/Vector3.png"
                      alt="Symbol 2"
                      width={48}
                      height={48}
                    />
                    <p className="text-xs font-bold mt-8 text-white">
                      Goal Helper AI{" "}
                    </p>
                    <p className="text-[10px] w-40 text-[#ECECECA6]">
                      Get personalized study plans tailored to your learning
                      goals.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-3">
                <Image
                  src="/image2.png"
                  alt="Image 2"
                  width={1300}
                  height={1300}
                />
              </div>
            </div>
          </ScrollFadeIn>

          <div className="flex items-start justify-center mt-20">
            <Image
              src="/image3.png"
              alt="Image 3"
              className="w-187.5 mb-50 ml-20"
              width={750}
              height={750}
            />
            <div className="flex flex-col">
              <div className="flex flex-col w-150 items-start justify-start h-90 relative top-10 right-30">
                <h1 className="text-[55px] font-bold bg-gradient-to-b from-[#CB98ED] to-[#591DA9] bg-clip-text text-transparent">
                  Stay on Track. Effortlessly.
                </h1>
                <p className="font-bold text-[22px] w-110 text-white">
                  Set goals, track progress, and visualize your study activity.
                </p>
              </div>
              <div className="flex flex-col gap-8">
                <div className="flex items-center gap-3">
                  <Image
                    src="/vector5.png"
                    alt="Symbol 5"
                    width={48}
                    height={48}
                  />
                  <div className="flex flex-col">
                    <p className="text-xs font-bold text-white">
                      Weekly Progress
                    </p>
                    <p className="text-[10px] w-40 text-[#ECECECA6]">
                      See how far you&apos;ve come this week at a glance.
                    </p>
                  </div>
                  <Image
                    src="/vector6.png"
                    alt="Symbol 6"
                    width={48}
                    height={48}
                  />
                  <div className="flex flex-col">
                    <p className="text-xs font-bold text-white">Study Streak</p>
                    <p className="text-[10px] w-40 text-[#ECECECA6]">
                      Stay motivated by tracking your daily study streak.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Image
                    src="/vector7.png"
                    alt="Symbol 7"
                    width={48}
                    height={48}
                  />
                  <div className="flex flex-col">
                    <p className="text-xs font-bold text-white">
                      Weekly Progress
                    </p>
                    <p className="text-[10px] w-40 text-[#ECECECA6]">
                      See how far you&apos;ve come this week at a glance.
                    </p>
                  </div>
                  <Image
                    src="/vector8.png"
                    alt="Symbol 8"
                    width={48}
                    height={48}
                  />
                  <div className="flex flex-col">
                    <p className="text-xs font-bold text-white">Study Streak</p>
                    <p className="text-[10px] w-40 text-[#ECECECA6]">
                      Stay motivated by tracking your daily study streak.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start justify-center">
            <div className="flex justify-end">
              <ScrollFadeIn direction="left">
                <div>
                  <h1 className="text-[100px] font-bold bg-gradient-to-b from-[#CB98ED] to-[#591DA9] bg-clip-text text-transparent w-100 leading-none">
                    Focus. Flow. Finish.
                  </h1>
                  <p className="font-bold text-[22px] w-60 text-white">
                    Boost productivity with timed study sessions.
                  </p>
                </div>
              </ScrollFadeIn>
            </div>
            <ScrollFadeIn direction="right">
              <div className="flex-shrink-0">
                <Image
                  src="/pomodoro.png"
                  alt="Pomodoro Image"
                  width={650}
                  height={650}
                />
              </div>
            </ScrollFadeIn>
          </div>

          <div className="flex flex-col items-center justify-center mb-50">
            <div className="flex items-center space-x-2 mt-30">
              <Image
                src="/logo-zen.png"
                alt="logo"
                className="rounded-full"
                width={40}
                height={40}
              />
              <h1 className="text-5xl font-bold text-[#ECECEC]">Zen</h1>
            </div>
            <h1 className="font-medium text-[80px] bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent mt-10">
              Ready to Study Smarter?
            </h1>
            <p className="text-[#ECECECA6] text-lg">
              Join thousands of students leveling up their study game with Zen.
            </p>
            <Link href="/signup" className="radial-gradient-button mt-12">
              Join for Free
            </Link>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}
