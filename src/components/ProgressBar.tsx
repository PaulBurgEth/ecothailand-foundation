'use client';

import { MILESTONE_USD } from '@/lib/constants';

interface ProgressBarProps {
    totalRaisedUSD: number;
    isLoading?: boolean;
}

export function ProgressBar({ totalRaisedUSD, isLoading }: ProgressBarProps) {
    const percentage = Math.min((totalRaisedUSD / MILESTONE_USD) * 100, 100);
    const formattedRaised = totalRaisedUSD.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    });
    const formattedGoal = MILESTONE_USD.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    });

    return (
        <div className="w-full max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="text-lg font-bold text-white">Total Impact Capital Raised</h3>
                    <p className="text-sm text-slate-400">
                        Funding real-world environmental regeneration
                    </p>
                </div>
                <div className="text-right">
                    {isLoading ? (
                        <div className="animate-pulse bg-slate-700 h-8 w-24 rounded" />
                    ) : (
                        <>
                            <span className="text-2xl font-bold text-emerald-400">{formattedRaised}</span>
                            <span className="text-slate-400 ml-2">/ {formattedGoal}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 animate-pulse opacity-30" />

                {/* Progress Fill */}
                <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>

                {/* Percentage Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white drop-shadow-lg">
                        {isLoading ? '...' : `${percentage.toFixed(1)}%`}
                    </span>
                </div>
            </div>

            {/* Milestone Markers */}
            <div className="flex justify-between mt-2 px-1">
                <span className="text-xs text-slate-500">$0</span>
                <span className="text-xs text-slate-500">$1,250</span>
                <span className="text-xs text-slate-500">$2,500</span>
                <span className="text-xs text-slate-500">$3,750</span>
                <span className="text-xs text-emerald-400 font-medium">$5,000</span>
            </div>
        </div>
    );
}
