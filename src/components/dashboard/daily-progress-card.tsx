'use client';

interface DailyProgressCardProps {
    day: string;
    progress: number; // 0-100
    isCurrentDay?: boolean;
}

export default function DailyProgressCard({ day, progress, isCurrentDay = false }: DailyProgressCardProps) {
    // Calculate the circle progress
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center flex-shrink-0" style={{ minWidth: '120px' }}>
            {/* Day Label */}
            <div
                className={
                    `px-3 mb-2 text-2xl text-light font-medium ${isCurrentDay ? 'rounded-[30px] bg-gradient-to-b from-primary via-primary to-secondary' : ''}`
                }
            >
                {day}
            </div>

            {/* Progress Card */}
            <div
                className="relative flex items-center justify-center"
                style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '20px',
                    background: 'linear-gradient(139deg, rgba(89, 29, 169, 0.20) -6.39%, rgba(5, 25, 96, 0.00) 112.17%)',
                    backdropFilter: 'blur(12.5px)'
                }}
            >
                {/* SVG Progress Circle */}
                <svg
                    className="absolute"
                    width="90"
                    height="90"
                    style={{ transform: 'rotate(-90deg)' }}
                >
                    {/* Progress circle with gradient - no gap, touches inner circle */}
                    <defs>
                        <linearGradient id={`gradient-${day}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--color-pink-accent-2)" />
                            <stop offset="32.5%" stopColor="var(--color-pink-accent)" />
                            <stop offset="100%" stopColor="var(--color-primary)" />
                        </linearGradient>
                    </defs>
                    <circle
                        cx="45"
                        cy="45"
                        r={radius}
                        fill="none"
                        stroke={`url(#gradient-${day})`}
                        strokeWidth="15"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{
                            transition: 'stroke-dashoffset 0.5s ease'
                        }}
                    />
                </svg>

                {/* Inner circle background - 55px */}
                <div
                    className="absolute rounded-full flex items-center justify-center"
                    style={{
                        width: '55px',
                        height: '55px',
                        backgroundColor: 'rgba(248, 247, 252, 0.1)'
                    }}
                >
                    {/* Percentage label */}
                    <span className="text-base text-light font-medium">
                        {progress}%
                    </span>
                </div>
            </div>
        </div>
    );
}