import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface NoteSidebarProps {
  headings: {
    id: string;
    text: string;
    level: number;
    type: string;
  }[];
}

const NoteSidebar: React.FC<NoteSidebarProps> = ({ headings }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState<string>("");
  const [intersectingIds, setIntersectingIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIntersectingIds((prev) => {
            const newIds = new Set(prev);
            if (entry.isIntersecting) {
              newIds.add(entry.target.id);
            } else {
              newIds.delete(entry.target.id);
            }
            return newIds;
          });
        });
      },
      {
        rootMargin: "-10% 0px -80% 0px", // Adjust these values to change when headings become "active"
      },
    );

    // Update active ID when intersecting IDs change
    const updateActiveId = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isAtBottom = scrollPosition + viewportHeight >= documentHeight - 50;

      if (intersectingIds.size === 0) {
        // Find the closest heading above viewport
        const headingsAbove = headings
          .map((h) => ({
            id: h.id,
            distance: Math.abs(
              document.getElementById(h.id)?.getBoundingClientRect().top ??
                Infinity,
            ),
          }))
          .filter((h) => h.distance < Infinity)
          .sort((a, b) => a.distance - b.distance);

        if (headingsAbove.length > 0) {
          setActiveId(headingsAbove[0].id);
        }
        return;
      }

      if (isAtBottom) {
        // At bottom - highlight last heading
        setActiveId(headings[headings.length - 1].id);
        return;
      }

      // Get all intersecting headings and choose the first one
      const visibleHeadings = headings.filter((h) => intersectingIds.has(h.id));
      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[0].id);
      }
    };

    // Observe all heading elements
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    // Add scroll event listener for continuous updates
    window.addEventListener("scroll", updateActiveId);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveId);
    };
  }, [headings, intersectingIds]);

  const handleHeadingClick = (id: string) => {
    setActiveId(id); // Update active ID immediately on click
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const getLevelClass = (level: number, isActive: boolean) => {
    const baseStyles = "relative group";
    const activeStyles = isActive
      ? "text-purple-400"
      : "text-white/80 hover:text-white";

    switch (level) {
      case 1:
        return cn(baseStyles, activeStyles, "font-bold text-base");
      case 2:
        return cn(baseStyles, activeStyles, "pl-4 text-sm");
      case 3:
        return cn(baseStyles, activeStyles, "pl-6 text-sm opacity-80");
      default:
        return baseStyles;
    }
  };

  return (
    <div
      className={cn(
        "fixed right-0 top-0 h-full border-l border-white/10 bg-black/40 backdrop-blur-md transition-all duration-300",
        isOpen ? "w-72" : "w-12",
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-transform hover:scale-110"
      >
        <ChevronRight
          className={cn(
            "h-5 w-5 transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="h-full overflow-y-auto p-6">
          <h3 className="mb-6 text-lg font-semibold text-accent-200">
            Table of Contents
          </h3>
          <nav className="flex flex-col gap-3">
            {headings.map((heading) => {
              const isActive = activeId === heading.id;

              return (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleHeadingClick(heading.id);
                  }}
                  className={getLevelClass(heading.level, isActive)}
                >
                  {isActive && heading.type === "paragraph" && (
                    <div className="absolute -left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-purple-400" />
                  )}
                  <span className="line-clamp-2 transition-colors duration-200">
                    {heading.text}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
};

export default NoteSidebar;
