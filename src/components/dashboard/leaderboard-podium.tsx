import Image from 'next/image';

interface PodiumUserProps {
    rank: number;
    name: string;
    xp: number;
    avatarUrl?: string;
}

interface PodiumCardProps {
    user: PodiumUserProps;
    position: 'left' | 'center' | 'right';
}

export default function LeaderboardPodium({ users }: { users: [PodiumUserProps, PodiumUserProps, PodiumUserProps] }) {
    const [rank1, rank2, rank3] = users;

    return (
        <div className="flex flex-row justify-center items-end w-[409.178px]">
            <PodiumCard user={rank2} position="left" />
            <PodiumCard user={rank1} position="center" />
            <PodiumCard user={rank3} position="right" />
        </div>
    );
}

function PodiumCard({ user, position }: PodiumCardProps) {
    const isCenter = position === 'center';
    const isLeft = position === 'left';

    // Gradients based on rank
    const gradients = {
        1: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
        2: 'linear-gradient(180deg, var(--color-pink-accent-2) 0%, var(--color-pink-accent) 32.5%, var(--color-primary) 100%)',
        3: 'linear-gradient(180deg, var(--color-pink-accent) 0%, var(--color-blue-accent) 100%)'
    };

    const avatarSize = isCenter ? 'w-[102.9556px] h-[102.9556px]' : 'w-[85.378px] h-[85.378px]';
    const containerWidth = isCenter ? 'w-[153px]' : 'w-[128px]';
    const containerHeight = isCenter ? 'h-[264px]' : 'h-[194.944px]';
    const podiumHeight = isCenter ? 'h-[200px]' : 'h-[142px]';
    const podiumSurface = isCenter ? 'var(--podium-surface)' : 'var(--podium-surface-muted)';
    const podiumRadius = isCenter 
        ? 'rounded-[36px] rounded-b-none' 
        : isLeft 
            ? 'rounded-2xl rounded-br-none' 
            : 'rounded-2xl rounded-bl-none';
    const translateX = isCenter ? 'translate-x-5' : 'translate-x-4';

    return (
        <div className={`relative flex flex-col justify-end ${containerWidth} ${containerHeight}`}>
            <div className={`absolute ${translateX} top-0`}>
                <div className="flex flex-shrink-0 justify-center">
                    <div
                        className="relative p-1 rounded-full"
                        style={{ background: gradients[user.rank as keyof typeof gradients] }}
                    >
                        <div className={`${avatarSize} bg-pink-accent rounded-full`}>
                            {user.avatarUrl && (
                                <Image
                                    src={user.avatarUrl} 
                                    alt={user.name} 
                                    width={100}
                                    height={100}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            )}
                        </div>
                        <div
                            className="absolute left-1/2 bottom-0 w-[21.344px] h-[21.344px] flex-shrink-0 rounded-md flex items-center justify-center"
                            style={{
                                transform: 'translate(-50%, 50%) rotate(45deg)',
                                background: gradients[user.rank as keyof typeof gradients]
                            }}
                        >
                            <span 
                                style={{ transform: 'rotate(-45deg)' }} 
                                className="block w-full text-center text-light text-xs font-semibold"
                            >
                                {user.rank}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={`flex flex-col items-center justify-center ${containerWidth} ${podiumHeight} flex-shrink-0 ${podiumRadius} pt-9`}
                style={{ background: podiumSurface }}
            >
                <span className="text-light text-base text-center w-full mb-1">{user.name}</span>
                <span className="text-light font-bold text-base">{user.xp.toLocaleString()} XP</span>
            </div>
        </div>
    );
}
