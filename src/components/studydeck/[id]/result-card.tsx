import Image from 'next/image';
interface ResultCardProps {
    isPassed: boolean;
    score: number;
    totalQuestions: number;
}

export default function ResultCard({ isPassed, score, totalQuestions }: ResultCardProps) {
    const badgeImage = isPassed ? "/passed_badge.svg" : "/fail_badge.svg";
    const title = isPassed ? "You Nailed It!🎉" : "Almost There!";
    const subtitle = isPassed 
        ? "Excellent Work! Keep up the momentum!"
        : "Don't give up! Learn and try again!";
    const scoreColor = isPassed ? "text-[#47942A]" : "text-white";

    return (
        <div className="rounded-[120px] w-[600px] h-[570px] relative z-50"
            style={{
                backgroundColor: "rgba(6, 2, 19, 0.10)",
                boxShadow: "0px 3px 9px 0px rgba(89, 29, 169, 0.10) inset, 0px 24px 36px 0px #6A34B2 inset, 0px 72px 96px 0px #120622 inset",
            }}>
            <Image src={badgeImage} alt="Result Badge" width={350} height={250} className="absolute -top-[90px] z-0 left-[130px]"/>
            <div className="flex flex-col items-center pt-40 h-full">
                <div className="flex flex-col gap-2 items-center">
                    <h1 className="font-bold text-5xl">{title}</h1>
                    <h3 className="text-xl font-normal">{subtitle}</h3>
                </div>
                <div className="mt-14">
                    <h1 className="text-[100px] font-bold text-[#591DA9]">
                        <span className={scoreColor}>{score}</span>/{totalQuestions}
                    </h1>
                </div>
            </div>
        </div>
    );
}
