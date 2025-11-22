import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Trophy, Activity, Hash } from 'lucide-react';
import { useStore } from '../store';

const LeagueDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getLeague } = useStore();

    const league = getLeague(id);

    if (!league) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl text-white">League not found</h2>
                <button
                    onClick={() => navigate('/leagues')}
                    className="mt-4 text-neon-blue hover:text-white"
                >
                    Back to Leagues
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => navigate('/leagues')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit"
                >
                    <ArrowLeft size={20} />
                    Back to Leagues
                </button>

                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-white/5 text-gray-400 border border-white/5">
                                {league.sport}
                            </span>
                            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${league.status === 'active'
                                    ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/20 shadow-neon-blue'
                                    : 'bg-white/5 text-gray-400 border-white/5'
                                }`}>
                                {league.status}
                            </span>
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white mb-2">{league.name}</h1>
                        <p className="text-gray-400 text-lg">{league.season}</p>
                    </div>

                    <button
                        onClick={() => navigate(`/leagues/edit/${league.id}`)}
                        className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Edit League
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-neon-purple/10 text-neon-purple">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Dates</p>
                        <p className="font-bold text-white">{league.startDate || league.start_date} - {league.endDate || league.end_date}</p>
                    </div>
                </div>

                <div className="glass-panel p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-neon-blue/10 text-neon-blue">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Max Teams</p>
                        <p className="font-bold text-white">{league.maxTeams || league.max_teams}</p>
                    </div>
                </div>

                <div className="glass-panel p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-neon-pink/10 text-neon-pink">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Format</p>
                        <p className="font-bold text-white">{league.format}</p>
                    </div>
                </div>

                <div className="glass-panel p-4 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-neon-cyan/10 text-neon-cyan">
                        <Hash size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Divisions</p>
                        <p className="font-bold text-white">
                            {Array.isArray(league.divisions) ? league.divisions.length : 0}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Divisions</h3>
                        <div className="space-y-2">
                            {Array.isArray(league.divisions) && league.divisions.map((div, index) => (
                                <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/5 text-gray-300">
                                    {div}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="glass-panel p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full py-2 px-4 bg-neon-blue text-obsidian font-bold rounded-lg hover:bg-neon-cyan transition-colors">
                                View Schedule
                            </button>
                            <button className="w-full py-2 px-4 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                                Manage Teams
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeagueDetailsPage;
