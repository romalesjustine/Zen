interface StatsCardProps {
    value: number;
    label: string;
    isCorrect?: boolean;
}

export default function StatsCard({ value, label, isCorrect }: StatsCardProps) {
    const textColor = isCorrect ? "text-[#47942A]" : "text-white";
    
    return (
        <div className="w-[180px] h-[150px] rounded-[30px] flex items-center justify-center flex-col"
            style={{
                backgroundColor: "rgba(6, 2, 19, 0.10)",
                boxShadow: "0px 5px 25px 0px #6A34B2 inset, 0px 72px 96px 0px #120622 inset, 0px 3px 9px 0px rgba(89, 29, 169, 0.10) inset"
            }}>
            <h1 className={`text-center ${textColor} text-6xl font-semibold`}>{value}</h1>
            <h1 className={`text-center ${textColor} text-xl`}>{label}</h1>
        </div>
    );
}
