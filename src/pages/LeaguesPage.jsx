import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Filter } from 'lucide-react';
import LeagueCard from '../components/LeagueCard';
import { useStore } from '../store';

const LeaguesPage = () => {
    const navigate = useNavigate();
    const { leagues } = useStore();

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Leagues</h1>
                    <p className="text-gray-400">Manage your active seasons and tournaments.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                        <Filter size={18} />
                        Filter
                    </button>
                    <button
                        onClick={() => navigate('/leagues/create')}
                        className="flex items-center gap-2 px-6 py-2 bg-neon-blue text-obsidian rounded-lg font-bold hover:bg-neon-cyan hover:shadow-neon-blue transition-all duration-300"
                    >
                        <Plus size={20} />
                        Create League
                    </button>
                </div>
            </div>

            {/* AI Assistant Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-white/10 p-1">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                <div className="relative bg-obsidian/40 backdrop-blur-sm rounded-xl p-6 flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-neon-purple to-indigo-600 rounded-lg shadow-lg">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">AI Insights</h3>
                        <p className="text-gray-300 text-sm mb-3">
                            Based on last season's data, we recommend increasing the max teams for <strong>Fall Basketball</strong> to 24.
                        </p>
                        <button className="text-sm font-medium text-neon-purple hover:text-white transition-colors">
                            View Analysis &rarr;
                        </button>
                    </div>
                </div>
            </div>

            {/* Leagues Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {leagues.map((league) => (
                    <LeagueCard key={league.id} league={league} />
                ))}
            </div>
        </div>
    );
};

export default LeaguesPage;
