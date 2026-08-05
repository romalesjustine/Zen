import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Profile } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { Switch } from "@/components/ui/switch";

interface DashboardSidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  profile: Pick<Profile, "username" | "avatar_url" | "tier">;
}

interface NavButtonProps {
  icon: string;
  label: string;
  isExpanded: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

function Divider({
  isExpanded,
  className = "",
}: {
  isExpanded: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute border-t border-[var(--color-nav)] opacity-30"
        style={{
          left: "-1.5rem",
          right: isExpanded ? "-1.5rem" : "-1rem",
          width: isExpanded ? "calc(100% + 3rem)" : "calc(100% + 2.5rem)",
        }}
      />
    </div>
  );
}

function NavButton({
  icon,
  label,
  isExpanded,
  isSelected = false,
  onClick,
}: NavButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getBackgroundStyle = () => {
    if (isSelected) {
      return {
        background:
          "linear-gradient(180deg, rgba(229, 204, 246, 0.60) 0%, rgba(203, 152, 237, 0.60) 32.5%, rgba(89, 29, 169, 0.60) 100%)",
      };
    }
    if (isHovered) {
      return {
        background: "rgba(89, 29, 169, 0.5)",
      };
    }
    return {
      background: "transparent",
    };
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-center px-3 py-2 text-sm text-light text-left rounded-3xl transition-all duration-200 gap-3 w-full`}
      style={{ minHeight: "2.5rem", ...getBackgroundStyle() }}
    >
      <span className="flex-shrink-0 min-w-[1.5rem] h-8 flex justify-center items-center">
        <Image src={icon} alt={label} width={20} height={20} />
      </span>
      <span
        className={`whitespace-nowrap transition-opacity duration-200 ${
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        } ml-0`}
        style={{ display: "inline-block" }}
      >
        {label}
      </span>
    </button>
  );
}

export default function DashboardSidebar({
  isExpanded,
  onToggle,
  profile,
}: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const profileName = profile?.username || "Zen User";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark =
      savedTheme === "dark" ||
      (savedTheme === null &&
        document.documentElement.classList.contains("dark"));
    document.documentElement.classList.toggle("dark", prefersDark);
    setIsDarkMode(prefersDark);
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  // Map routes to labels
  const getSelectedItem = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/dashboard/study-deck") return "Study Deck";
    if (pathname === "/dashboard/ai-notes") return "AI Notes";
    if (pathname === "/dashboard/goal-helper-ai") return "Goal Helper AI";
    if (pathname === "/dashboard/weekly-wrap") return "Weekly Wrap";
    if (pathname === "/dashboard/subscription") return "Subscription";
    if (pathname === "/dashboard/settings") return "Settings";
    return "Dashboard";
  };

  const selectedItem = getSelectedItem();

  const handleNavigation = (label: string) => {
    const routes: { [key: string]: string } = {
      Dashboard: "/dashboard",
      "Study Deck": "/dashboard/study-deck",
      "AI Notes": "/dashboard/ai-notes",
      "Goal Helper AI": "/dashboard/goal-helper-ai",
      "Weekly Wrap": "/dashboard/weekly-wrap",
      Subscription: "/dashboard/subscription",
      Settings: "/dashboard/settings",
    };
    router.push(routes[label]);
  };

  return (
    <aside
      className={`${
        isExpanded ? "w-70 p-6" : "w-22 py-6 pl-6 pr-4"
      } h-screen flex flex-col justify-between transition-all duration-300 fixed left-0 top-0 rounded-tr-2xl rounded-br-2xl`}
      style={{ background: "var(--sidebar-surface)" }}
    >
      <button
        onClick={onToggle}
        className="absolute top-6 -right-3 z-10 bg-transparent p-0 border-none focus:outline-none"
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {/* Toggle Arrow Icon */}
        {isExpanded ? (
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="24"
              height="24"
              rx="12"
              fill="var(--color-pink-accent)"
            />
            <rect
              x="0.5"
              y="0.5"
              width="25"
              height="25"
              rx="12.5"
              stroke="var(--color-nav)"
              strokeOpacity="0.1"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.1658 9.23431C15.4782 9.54673 15.4782 10.0533 15.1658 10.3657L12.5315 13L15.1658 15.6343C15.4782 15.9467 15.4782 16.4533 15.1658 16.7657C14.8534 17.0781 14.3468 17.0781 14.0344 16.7657L10.8344 13.5657C10.522 13.2533 10.522 12.7467 10.8344 12.4343L14.0344 9.23431C14.3468 8.9219 14.8534 8.9219 15.1658 9.23431Z"
              fill="#F8F7FC"
            />
          </svg>
        ) : (
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="24"
              height="24"
              rx="12"
              transform="matrix(-1 0 0 1 25 1)"
              fill="var(--color-pink-accent)"
            />
            <rect
              x="0.5"
              y="-0.5"
              width="25"
              height="25"
              rx="12.5"
              transform="matrix(-1 0 0 1 26 1)"
              stroke="var(--color-nav)"
              strokeOpacity="0.1"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.8342 9.23431C10.5218 9.54673 10.5218 10.0533 10.8342 10.3657L13.4685 13L10.8342 15.6343C10.5218 15.9467 10.5218 16.4533 10.8342 16.7657C11.1466 17.0781 11.6532 17.0781 11.9656 16.7657L15.1656 13.5657C15.478 13.2533 15.478 12.7467 15.1656 12.4343L11.9656 9.23431C11.6532 8.9219 11.1466 8.9219 10.8342 9.23431Z"
              fill="#F8F7FC"
            />
          </svg>
        )}
      </button>
      <div>
        <Link href="/" className="flex items-center mb-10">
          <div className="w-10 h-10 rounded-full mr-3 flex-shrink-0 overflow-hidden bg-white flex items-center justify-center">
            <Image
              src="/logo-zen.png"
              alt="Zen"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          {isExpanded && (
            <span className="text-xl font-bold text-light">Zen</span>
          )}
        </Link>
        <nav className="flex flex-col gap-2">
          <NavButton
            icon="/dashboard-icon.png"
            label="Dashboard"
            isExpanded={isExpanded}
            isSelected={selectedItem === "Dashboard"}
            onClick={() => handleNavigation("Dashboard")}
          />

          {/* Divider 1 */}
          <Divider isExpanded={isExpanded} className="my-3" />

          <NavButton
            icon="/study-deck-icon.png"
            label="Study Deck"
            isExpanded={isExpanded}
            isSelected={selectedItem === "Study Deck"}
            onClick={() => handleNavigation("Study Deck")}
          />

          <NavButton
            icon="/ai-notes-icon.png"
            label="AI Notes"
            isExpanded={isExpanded}
            isSelected={selectedItem === "AI Notes"}
            onClick={() => handleNavigation("AI Notes")}
          />

          <NavButton
            icon="/goal-helper-icon.png"
            label="Goal Helper AI"
            isExpanded={isExpanded}
            isSelected={selectedItem === "Goal Helper AI"}
            onClick={() => handleNavigation("Goal Helper AI")}
          />

          <NavButton
            icon="/clock.png"
            label="Weekly Wrap"
            isExpanded={isExpanded}
            isSelected={selectedItem === "Weekly Wrap"}
            onClick={() => handleNavigation("Weekly Wrap")}
          />

          {/* Divider 2 */}
          <Divider isExpanded={isExpanded} className="my-3" />

          <NavButton
            icon="/subscription-icon.png"
            label="Subscription"
            isExpanded={isExpanded}
            isSelected={selectedItem === "Subscription"}
            onClick={() => handleNavigation("Subscription")}
          />

          <NavButton
            icon="/settings-icon.png"
            label="Settings"
            isExpanded={isExpanded}
            isSelected={selectedItem === "Settings"}
            onClick={() => handleNavigation("Settings")}
          />
        </nav>
      </div>
      <div className="relative">
        {/* Divider 3 */}
        <Divider isExpanded={isExpanded} className="mb-4" />

        {/* Theme Toggle */}
        <div
          className={`flex items-center justify-between gap-3 mb-4 ${
            isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ display: isExpanded ? "flex" : "none" }}
        >
          <span className="text-light text-sm font-medium">Dark mode</span>
          <Switch checked={isDarkMode} onCheckedChange={handleThemeToggle} />
        </div>

        {/* Profile Section */}
        <button
          onClick={() => setIsLogoutPopupOpen(!isLogoutPopupOpen)}
          className="flex items-center gap-3 w-full bg-transparent border-none p-0 cursor-pointer text-left"
        >
          <div className="w-10 h-10 bg-card rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profileName}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-secondary-8 font-bold text-sm">
                {profileName?.charAt(0).toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div
            className={`flex-1 flex items-center justify-between transition-opacity duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{ display: isExpanded ? "flex" : "none" }}
          >
            <div className="flex flex-col items-start">
              <span className="text-light text-xs whitespace-nowrap">
                Welcome back 👋
              </span>
              <span className="text-light text-sm">{profileName}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Tier Badge */}
              {profile?.tier && (
                <div className="flex-shrink-0">
                  {profile.tier === "FREE" && (
                    <Image
                      src="/Basic Tier.png"
                      alt="Basic Tier"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  )}
                  {profile.tier === "GOLD" && (
                    <Image
                      src="/Gold Tier.png"
                      alt="Gold Tier"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  )}
                  {profile.tier === "PREMIUM" && (
                    <Image
                      src="/Premium Tier.png"
                      alt="Premium Tier"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  )}
                </div>
              )}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
                  fill="var(--color-light)"
                />
              </svg>
            </div>
          </div>
        </button>

        {/* Logout Popup */}
        {isLogoutPopupOpen && (
          <div
            className="absolute bottom-full left-0 mb-2 rounded-lg border border-primary bg-secondary-8 text-light cursor-pointer hover:bg-primary/20 transition-colors"
            style={{
              width: "231px",
              padding: "8px 0",
              boxShadow: "-2px 4px 7.9px 0 rgba(0, 0, 0, 0.36)",
            }}
            onClick={async () => {
              await signOut();
            }}
          >
            <div className="px-4 py-2 text-base">Logout</div>
          </div>
        )}
      </div>
    </aside>
  );
}
