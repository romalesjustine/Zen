import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-[#FFFFFF] pt-20">
      <div className="flex w-full">
        {/* Quick Links Section */}
        <div className="flex-1 flex flex-col space-y-4 leading-2 ml-50">
          <h1 className="text-[18px] font-[500]">Quick Links</h1>
          <Link
            href="/about"
            className="text-xs hover:text-[#CB98ED] transition-colors"
          >
            About Zen
          </Link>
          <Link
            href="/#features"
            className="text-xs hover:text-[#CB98ED] transition-colors"
          >
            Features
          </Link>
        </div>

        {/* Study Tools Section - Linked to Dashboard Routes */}
        <div className="flex-1 flex flex-col space-y-4 leading-2 ml-50">
          <h1 className="text-[18px] font-[500]">Study Tools</h1>
          <Link
            href="/dashboard/weekly-wrap"
            className="text-xs hover:text-[#CB98ED] transition-colors"
          >
            AI Weekly Wrap
          </Link>
          <Link
            href="/dashboard/ai-notes"
            className="text-xs hover:text-[#CB98ED] transition-colors"
          >
            AI Notes
          </Link>
          <Link
            href="/dashboard/goal-helper-ai"
            className="text-xs hover:text-[#CB98ED] transition-colors"
          >
            Goal Helper AI
          </Link>
          <Link
            href="#pomodoro"
            className="text-xs hover:text-[#CB98ED] transition-colors"
          >
            Pomodoro Timer
          </Link>
        </div>

        {/* Contact Section */}
        <div className="flex-1 flex flex-col space-y-4 leading-2 ml-50">
          <h1 className="text-[18px] font-[500]">Contact Us</h1>
          <a
            href="mailto:zenstudy@gmail.com"
            className="text-xs hover:text-[#CB98ED] transition-colors"
          >
            zenstudy@gmail.com
          </a>
          <a
            href="tel:09653201648"
            className="text-xs hover:text-[#CB98ED] transition-colors"
          >
            09653201648
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between container mx-auto px-40 py-10 text-center">
        <p className="text-sm text-[#939393]">
          &copy; {new Date().getFullYear()} Zen. All rights reserved.
        </p>
        <div className="flex items-center space-x-2">
          <Image
            src="/logo-zen.png"
            alt="logo"
            className="rounded-full"
            width={24}
            height={24}
          />
          <h1 className="text-xl font-bold">Zen</h1>
        </div>
      </div>
    </footer>
  );
}
