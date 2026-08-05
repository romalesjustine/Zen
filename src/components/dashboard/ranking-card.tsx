import Image from "next/image";

interface RankingUser {
    id: string;
    rank: number;
    name: string;
    xp: number;
    avatarUrl?: string;
    isCurrentUser?: boolean;
}

interface RankingCardProps {
    user: RankingUser;
    isSticky?: boolean;
}

export default function RankingCard({ user, isSticky = false }: RankingCardProps) {
    const cardClasses = isSticky 
        ? "sticky bottom-0 flex items-center justify-between p-5 rounded-2xl" 
        : "flex items-center justify-between p-5 rounded-2xl";

    const backgroundStyle = user.isCurrentUser
        ? { background: 'var(--ranking-card-current)' }
        : {};

    const bgColorClass = user.isCurrentUser ? '' : 'bg-[var(--ranking-card-surface)]';

    return (
        <div
            className={`${cardClasses} ${bgColorClass}`}
            style={user.isCurrentUser ? backgroundStyle : undefined}
        >
            <div className="flex flex-row items-center gap-3">
                <div className="w-[55.2444px] h-[55.2444px] bg-pink-accent rounded-full overflow-hidden">
                    {user.avatarUrl && (
                        <Image 
                            src={user.avatarUrl} 
                            alt={user.name} 
                            width={55}
                            height={55}
                            className="object-cover"
                        />
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-light text-xl font-medium">{user.name}</span>
                    <span className="text-light/77 text-base">{user.xp.toLocaleString()} XP</span>
                </div>
            </div>
            <span className="flex items-center justify-center w-[28px] h-[28px] text-center text-light text-base rounded-full border-1 border-light mx-4">
                {user.rank}
            </span>
        </div>
    );
}

export type { RankingUser };
