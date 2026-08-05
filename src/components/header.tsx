import Link from "next/link";
import { getUser } from "@/app/actions/auth";
import { signOut } from "@/app/actions/auth";
import Image from "next/image";

export default async function Header() {
  const user = await getUser();

  return (
    <header className="flex bg-black p-3 w-full justify-around items-center">
      {/* Brand Section: Links to /signup */}
      <Link
        href="/signup"
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        <Image
          src="/logo-zen.png"
          alt="logo"
          className="rounded-full"
          width={24}
          height={24}
        />
        <h1 className="text-xl font-bold text-white">Zen</h1>
      </Link>

      <div className="flex items-center space-x-8 text-white">
        {/* Dashboard Link: Redirects to the main dashboard page */}
        <Link
          href="/dashboard"
          className="hover:text-[#CB98ED] transition-colors"
        >
          🏠 Dashboard
        </Link>

        {/* Features link with section anchor */}
        <Link
          href="/#features"
          className="hover:text-[#CB98ED] transition-colors"
        >
          ⚡Features
        </Link>

        {/* About Us link */}
        <Link href="/about" className="hover:text-[#CB98ED] transition-colors">
          🐈‍⬛ About Us
        </Link>

        {user ? (
          <>
            <span className="text-white">Welcome, {user.username}!</span>
            <form action={signOut}>
              <button type="submit" className="radial-gradient-button">
                Sign Out
              </button>
            </form>
          </>
        ) : (
          <Link href="/login" className="radial-gradient-button">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
