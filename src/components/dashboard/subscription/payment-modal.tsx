'use client';

import { useState } from 'react';
import Image from 'next/image';
import SubscribeButton from '../subscribe-button';

type PaymentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
};

type PaymentMethod = 'digital-bank' | 'e-wallet' | 'loan' | null;

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
    const [step, setStep] = useState<'method' | 'credentials'>('method');
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        accountNumber: '',
    });

    if (!isOpen) return null;

    const handleMethodSelect = (method: PaymentMethod) => {
        setSelectedMethod(method);
    };

    const handleNext = () => {
        if (selectedMethod) {
            setStep('credentials');
        }
    };

    const handleBack = () => {
        setStep('method');
    };

    const handleSubmit = () => {
        console.log('Payment submitted:', { method: selectedMethod, ...formData });
        // Reset and close
        setStep('method');
        setSelectedMethod(null);
        setFormData({ firstName: '', lastName: '', accountNumber: '' });
        onSuccess?.();
        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
            setStep('method');
            setSelectedMethod(null);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-3xl w-[700px] max-h-[400px] overflow-y-auto">
                {/* Step 1: Choose Payment Method */}
                {step === 'method' && (
                    <>
                        <div className="pt-7 pb-0 px-12">
                            <h2 className="text-sm text-center text-dark mb-4">
                                Choose Payment Method:
                            </h2>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-[1px] bg-dark mb-4" />

                        <div className="px-12 flex flex-col gap-4">
                            {/* Digital Bank Payment */}
                            <button
                                onClick={() => handleMethodSelect('digital-bank')}
                                className={`flex items-center gap-4 px-5 py-2 rounded-2xl border-2 transition-all ${
                                    selectedMethod === 'digital-bank'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-300 hover:border-primary/50'
                                }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    selectedMethod === 'digital-bank' ? 'border-primary' : 'border-gray-300'
                                }`}>
                                    {selectedMethod === 'digital-bank' && (
                                        <div className="w-4 h-4 rounded-full bg-primary" />
                                    )}
                                </div>
                                <span className="text-sm text-dark">Digital Bank Payment</span>
                                <Image src="/visa-icon.png" alt="VISA" width={50} height={50} />
                                <Image src="/paypal-icon.png" alt="PayPal" width={50} height={50} />
                            </button>

                            {/* E-wallet Payment */}
                            <button
                                onClick={() => handleMethodSelect('e-wallet')}
                                className={`flex items-center gap-4 px-5 py-2 rounded-2xl border-2 transition-all ${
                                    selectedMethod === 'e-wallet'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-300 hover:border-primary/50'
                                }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    selectedMethod === 'e-wallet' ? 'border-primary' : 'border-gray-300'
                                }`}>
                                    {selectedMethod === 'e-wallet' && (
                                        <div className="w-4 h-4 rounded-full bg-primary" />
                                    )}
                                </div>
                                <span className="text-sm text-dark">e-wallet Payment</span>
                                <Image src="/gcash-icon.png" alt="GCash" width={50} height={50} />
                                <Image src="/maya-icon.png" alt="Maya" width={50} height={50} />
                            </button>

                            {/* Loan Payment */}
                            <button
                                onClick={() => handleMethodSelect('loan')}
                                className={`flex items-center gap-4 px-5 py-2 rounded-2xl border-2 transition-all ${
                                    selectedMethod === 'loan'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-300 hover:border-primary/50'
                                }`}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    selectedMethod === 'loan' ? 'border-primary' : 'border-gray-300'
                                }`}>
                                    {selectedMethod === 'loan' && (
                                        <div className="w-4 h-4 rounded-full bg-primary" />
                                    )}
                                </div>
                                <span className="text-sm text-dark">Loan Payment</span>
                                <Image src="/spay-icon.png" alt="SpayLater" width={50} height={50} />
                                <Image src="/billease-icon.png" alt="BillEase" width={50} height={50} />
                            </button>
                        </div>

                        <div className="flex justify-center mt-4 pb-10">
                            <button
                                onClick={handleNext}
                                disabled={!selectedMethod}
                                className="text-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:underline"
                            >
                                Next &gt;
                            </button>
                        </div>
                    </>
                )}

                {/* Step 2: Enter Credentials */}
                {step === 'credentials' && (
                    <>
                        <div className="pt-7 pb-0 px-12">
                            <button
                                onClick={handleBack}
                                className="text-dark text-sm mb-4 hover:text-gray-800 w-full flex justify-center"
                            >
                                &lt; Enter Credentials:
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-[0.5px] bg-dark mb-4" />

                        <div className="pt-0 pb-10 px-12 flex flex-col gap-6">
                            <div className="flex gap-4">
                                <div className="flex-1 relative mt-2 group">
                                    <label className="absolute left-4 -top-2.5 bg-white px-1 text-gray-400 text-xs z-10 select-none pointer-events-none group-focus-within:text-blue-500">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
                                    />
                                </div>
                                <div className="flex-1 relative mt-2 group">
                                    <label className="absolute left-4 -top-2.5 bg-white px-1 text-gray-400 text-xs z-10 select-none pointer-events-none group-focus-within:text-blue-500">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            <div className="relative mt-2 group">
                                <label className="absolute left-4 -top-2.5 bg-white px-1 text-gray-400 text-xs z-10 select-none pointer-events-none group-focus-within:text-blue-500">Account or Mobile Number</label>
                                <input
                                    type="text"
                                    value={formData.accountNumber}
                                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-800 focus:outline-none focus:border-blue-500 placeholder-gray-400"
                                />
                            </div>

                            <div className="flex justify-center mt-4">
                                <SubscribeButton 
                                    onClick={handleSubmit}
                                    className="px-7 py-2"
                                >
                                    Submit
                                </SubscribeButton>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
