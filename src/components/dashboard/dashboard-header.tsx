import React from 'react';

interface DashboardHeaderProps {
    title?: string;
    gradientText?: string;
    bannerUrl?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    title = 'Time to Learn,',
    gradientText = 'Zen!',
    bannerUrl = '/dashboard-banner.png',
}) => (
    <div className="mb-7">
        <div
            className="h-[268px] rounded-xl flex justify-start items-end px-8 py-3"
            style={{
                backgroundImage: `url(${bannerUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <h1 className="text-4xl font-bold text-light">
                {title}<br />
                <span className="bg-gradient-to-b from-secondary-8 via-pink-accent to-primary bg-clip-text text-transparent">{gradientText}</span>
            </h1>
        </div>
    </div>
);

export default DashboardHeader;
