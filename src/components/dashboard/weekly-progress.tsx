
'use client';

import { useRef, useEffect } from 'react';

import DailyProgressCard from './daily-progress-card';

export type DayProgress = {
    day: string;
    progress: number;
    isCurrentDay?: boolean;
};

interface WeeklyProgressProps {
    weekData?: DayProgress[];
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const getStartOfWeek = (reference: Date) => {
    const start = new Date(reference);
    start.setHours(0, 0, 0, 0);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);
    return start;
};

const formatDateKey = (date: Date) => date.toISOString().split('T')[0];

const buildWeekData = (startOfWeek: Date, todayKey: string, progressByDate?: Map<string, number>): DayProgress[] => {
    const progressMap = progressByDate ?? new Map<string, number>();

    return DAY_LABELS.map((label, index) => {
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(startOfWeek.getDate() + index);
        const key = formatDateKey(dayDate);
        return {
            day: label,
            progress: progressMap.get(key) ?? 0,
            isCurrentDay: key === todayKey
        };
    });
};

const createWeekSkeleton = () => {
    const referenceDate = new Date();
    const startOfWeek = getStartOfWeek(referenceDate);
    const todayKey = formatDateKey(referenceDate);
    return buildWeekData(startOfWeek, todayKey);
};

export default function WeeklyProgress({ weekData }: WeeklyProgressProps) {
    // Mouse drag-to-scroll logic
    const scrollRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (!scrollEl) return;

        const onMouseDown = (e: MouseEvent) => {
            isDragging.current = true;
            scrollEl.classList.add('cursor-grabbing');
            startX.current = e.pageX - scrollEl.offsetLeft;
            scrollLeft.current = scrollEl.scrollLeft;
        };
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            e.preventDefault();
            const x = e.pageX - scrollEl.offsetLeft;
            const walk = x - startX.current;
            scrollEl.scrollLeft = scrollLeft.current - walk;
        };
        const onMouseUp = () => {
            isDragging.current = false;
            scrollEl.classList.remove('cursor-grabbing');
        };
        scrollEl.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            scrollEl.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    const data = weekData && weekData.length > 0 ? weekData : createWeekSkeleton();

    return (
        <div>
            <div
                ref={scrollRef}
                className="overflow-x-auto overflow-y-hidden -mx-2 px-2 cursor-grab select-none"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <style jsx>{`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
                <div className="flex items-start gap-3" style={{ width: 'max-content', minWidth: '100%' }}>
                    {data.map((dayData, index) => (
                        <DailyProgressCard
                            key={index}
                            day={dayData.day}
                            progress={dayData.progress}
                            isCurrentDay={dayData.isCurrentDay}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
