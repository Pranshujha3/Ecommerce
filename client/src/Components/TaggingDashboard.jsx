import React, { useEffect, useState } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/summaryApi';
import toast from 'react-hot-toast';
import { MdOutlineAutoAwesome } from "react-icons/md";

const TaggingDashboard = () => {
    const [stats, setStats] = useState({ total: 0, tagged: 0, untagged: 0, healthPercentage: 0 });
    const [isSyncing, setIsSyncing] = useState(false);

    const fetchStats = async () => {
        try {
            const response = await Axios({ ...SummaryApi.getTaggingStats });
            if (response.data.success) setStats(response.data);
        } catch (err) {
            console.error("Health fetch error", err);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        const loadingToast = toast.loading("AI is optimizing search keywords...");
        
        try {
            const response = await Axios({ ...SummaryApi.runAutoTagging });
            if (response.data.success) {
                toast.success("Database Health Restored!", { id: loadingToast });
                fetchStats();
            }
        } catch (err) {
            toast.error("AI Sync failed. Please wait a minute.", { id: loadingToast });
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-5">
            <div className='p-4 border-b bg-gray-50 flex items-center justify-between'>
                <h2 className="font-bold text-gray-700 flex items-center gap-2 text-sm lg:text-base">
                    <MdOutlineAutoAwesome className="text-blue-600 text-lg"/> 
                    Search & Nutrient Optimization
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stats.healthPercentage > 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {stats.healthPercentage}% Ready
                </span>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-blue-50/50 rounded">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Total</p>
                        <p className="text-lg font-black text-blue-600">{stats.total}</p>
                    </div>
                    <div className="text-center p-2 bg-green-50/50 rounded">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Tagged</p>
                        <p className="text-lg font-black text-green-600">{stats.tagged}</p>
                    </div>
                    <div className="text-center p-2 bg-red-50/50 rounded">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Pending</p>
                        <p className="text-lg font-black text-red-500">{stats.untagged}</p>
                    </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                    <div 
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000" 
                        style={{ width: `${stats.healthPercentage}%` }}
                    ></div>
                </div>

                <button 
                    onClick={handleSync}
                    disabled={isSyncing || stats.untagged === 0}
                    className={`w-full py-2 rounded text-xs font-bold transition ${
                        isSyncing || stats.untagged === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    }`}
                >
                    {isSyncing ? "AI Syncing..." : stats.untagged === 0 ? "Search is Fully Optimized" : `Generate AI Tags for ${stats.untagged} Items`}
                </button>
            </div>
        </div>
    );
};

export default TaggingDashboard;