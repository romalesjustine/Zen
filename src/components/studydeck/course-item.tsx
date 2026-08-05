'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CourseItemProps {
  courseName: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  deadline?: string | null;
}

const calculateDaysLeft = (deadline: string | null | undefined): { text: string; variant: 'urgent' | 'warning' | 'normal' | null } => {
  if (!deadline) return { text: '', variant: null };
  
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { text: 'Overdue', variant: 'urgent' };
  if (diffDays === 0) return { text: 'Due Today', variant: 'urgent' };
  if (diffDays === 1) return { text: '1 day left', variant: 'urgent' };
  if (diffDays <= 3) return { text: `${diffDays} days left`, variant: 'warning' };
  if (diffDays <= 7) return { text: `${diffDays} days left`, variant: 'normal' };
  return { text: `${diffDays} days left`, variant: 'normal' };
};

const CourseItem: React.FC<CourseItemProps> = ({
  courseName,
  icon = '??',
  href,
  onClick,
  deadline,
}) => {
  const router = useRouter();
  const isInteractive = Boolean(onClick || href);

  const handleNavigate = () => {
    onClick?.();
    if (href) {
      router.push(href);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (!isInteractive) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigate();
    }
  };

  const className = [
    'flex items-center justify-between bg-[var(--studydeck-card-surface)] rounded-lg px-6 py-4 transition-colors duration-200',
    isInteractive ? 'cursor-pointer hover:bg-[#2a1f52]' : 'cursor-default',
  ].join(' ');

  const deadlineInfo = calculateDaysLeft(deadline);
  
  const getBadgeStyles = (variant: 'urgent' | 'warning' | 'normal' | null) => {
    if (variant === 'urgent') return 'bg-red-500/20 text-red-400 border border-red-500/30';
    if (variant === 'warning') return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    if (variant === 'normal') return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
    return '';
  };

  return (
    <div
      className={className}
      onClick={isInteractive ? handleNavigate : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl">{icon}</span>
        <div className="flex flex-col gap-1">
          <span className="text-light font-medium">{courseName}</span>
          {deadlineInfo.variant && (
            <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${getBadgeStyles(deadlineInfo.variant)}`}>
              {deadlineInfo.text}
            </span>
          )}
        </div>
      </div>
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );
};

export default CourseItem;
