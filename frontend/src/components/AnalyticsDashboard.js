import React, { useState, useEffect, useRef } from 'react';
import { getAdvancedAnalytics } from '../utils/renders';
import { AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineLineChart } from 'react-icons/ai';

function AnalyticsDashboard({ refreshTrigger }) {
    const [stats, setStats] = useState(null);
    const statsCache = useRef({ data: null, triggerValue: null }); // Ref to hold cached stats and trigger value
    const lastRefreshTrigger = useRef(refreshTrigger); // Ref to store the last refreshTrigger value

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            // Fetch data only if:
            // 1. stats is null (initial load)
            // OR
            // 2. refreshTrigger has changed since the last fetch
            if (!statsCache.current || refreshTrigger !== lastRefreshTrigger.current) {
                const data = await getAdvancedAnalytics();
                setStats(data); // Update component state to re-render
                statsCache.current = { data: data, triggerValue: refreshTrigger }; // Cache the fetched data and trigger value
                lastRefreshTrigger.current = refreshTrigger; // Update the ref to the new trigger value
            }
        };
        
        fetchAnalyticsData(); // Call the async function
        
    }, [refreshTrigger]); // Dependency on refreshTrigger ensures effect runs when it changes

    // If stats are not yet loaded, return null or a loading indicator
    if (!stats) return null; 

    const { comparison, forecast, dailySpending } = stats;
    const isMore = parseFloat(comparison.diffPercent) > 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {/* MoM Comparison */}
            <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm min-w-0">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">vs Last Month</p>
                        <h3 className="text-xl sm:text-2xl font-bold text-white">
                            {isMore ? <AiOutlineArrowUp className="inline text-red-400 mr-1" /> : <AiOutlineArrowDown className="inline text-green-400 mr-1" />}
                            {Math.abs(comparison.diffPercent)}%
                        </h3>
                    </div>
                    <div className={`p-2 rounded-lg ${isMore ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        <AiOutlineLineChart size={24} />
                    </div>
                </div>
                <p className="text-sm text-gray-400">
                    You've spent <span className="text-white font-bold">Rs. {comparison.currentTotal}</span> this month compared to Rs. {comparison.lastTotal} last month.
                </p>
            </div>

            {/* Forecasting */}
            <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm min-w-0">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Predicted Month-End</p>
                        <h3 className="text-xl sm:text-2xl font-bold text-primary break-words">Rs. {Math.round(forecast)}</h3>
                    </div>
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <AiOutlineLineChart size={24} />
                    </div>
                </div>
                <p className="text-sm text-gray-400">
                    Based on your current daily average, you are likely to spend around <span className="text-white font-bold">Rs. {Math.round(forecast)}</span> by the end of the month.
                </p>
            </div>

            {/* Simple Daily Heatmap Mini-view */}
            <div className="md:col-span-2 bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 backdrop-blur-sm min-w-0">
                <h4 className="text-sm font-bold text-white mb-4">Daily Spending Activity (Last 30 Days)</h4>
                <div className="flex gap-1 h-12 items-end">
                    {dailySpending.map((day, idx) => {
                        const height = Math.min((day.total / 5000) * 100, 100); // Scale relative to 5k
                        return (
                            <div 
                                key={idx} 
                                title={`${day._id}: Rs. ${day.total}`}
                                className="flex-1 bg-primary/40 hover:bg-primary transition-all rounded-t-sm cursor-help"
                                style={{ height: `${height}%`, minHeight: '4px' }}
                            ></div>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-gray-500 uppercase">
                    <span>30 days ago</span>
                    <span>Today</span>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsDashboard;
