'use client';

interface SubscribeButtonProps {
    onClick?: () => void;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    variant?: 'default' | 'outline';
}

export default function SubscribeButton({ onClick, children = 'Subscribe', className = '', disabled = false, variant = 'default' }: SubscribeButtonProps) {
    const baseStyles = `
        rounded-full px-7 py-2
        transition-opacity duration-200
        text-white
    `;

    const variantStyles = variant === 'outline'
        ? 'bg-transparent border-2 border-light text-light cursor-default'
        : `
            bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-primary-3)_0%,var(--color-primary)_100%)]
            shadow-[0_0_3.7px_3px_rgba(89,29,169,0.30),0_-4px_2px_0_rgba(0,0,0,0.25)_inset,0_2px_1px_0_rgba(255,255,255,0.25)_inset]
            hover:opacity-50
            cursor-pointer
        `;

    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
        >
            {children}
        </button>
    );
}
