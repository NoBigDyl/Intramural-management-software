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
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="glass-panel p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="relative z-10">
                    <button
                        onClick={() => navigate('/leagues')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit mb-6"
                    >
                        <ArrowLeft size={20} />
                        Back to Leagues
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
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
                            <h1 className="text-5xl font-display font-bold text-white mb-2">{league.name}</h1>
                            <p className="text-gray-400 text-xl">{league.season}</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate(`/leagues/${league.id}/schedule`)}
                                className="flex items-center gap-2 px-6 py-3 bg-neon-blue text-obsidian font-bold rounded-lg hover:bg-neon-cyan transition-colors shadow-lg shadow-neon-blue/20"
                            >
                                <Calendar size={20} />
                                View Schedule
                            </button>
                            <button
                                onClick={() => navigate(`/leagues/${league.id}/teams`)}
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <Users size={20} />
                                Manage Teams
                            </button>
                            <button
                                onClick={() => navigate(`/leagues/edit/${league.id}`)}
                                className="px-4 py-3 bg-white/5 text-gray-400 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                                title="Edit League"
                            >
                                <Activity size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel p-5 flex items-center gap-4 border-l-4 border-l-neon-purple">
                    <div className="p-3 rounded-lg bg-neon-purple/10 text-neon-purple">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Season Dates</p>
                        <p className="font-bold text-white text-lg">{league.startDate || league.start_date}</p>
                        <p className="text-xs text-gray-500">to {league.endDate || league.end_date}</p>
                    </div>
                </div>

                <div className="glass-panel p-5 flex items-center gap-4 border-l-4 border-l-neon-blue">
                    <div className="p-3 rounded-lg bg-neon-blue/10 text-neon-blue">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Capacity</p>
                        <p className="font-bold text-white text-lg">{league.maxTeams || league.max_teams} Teams</p>
                        <p className="text-xs text-gray-500">Maximum allowed</p>
                    </div>
                </div>

                <div className="glass-panel p-5 flex items-center gap-4 border-l-4 border-l-neon-pink">
                    <div className="p-3 rounded-lg bg-neon-pink/10 text-neon-pink">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Format</p>
                        <p className="font-bold text-white text-lg">{league.format}</p>
                        <p className="text-xs text-gray-500">Tournament Style</p>
                    </div>
                </div>

                <div className="glass-panel p-5 flex items-center gap-4 border-l-4 border-l-neon-cyan">
                    <div className="p-3 rounded-lg bg-neon-cyan/10 text-neon-cyan">
                        <Hash size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Divisions</p>
                        <p className="font-bold text-white text-lg">
                            {Array.isArray(league.divisions) ? league.divisions.length : 0} Active
                        </p>
                        <p className="text-xs text-gray-500">Categories</p>
                    </div>
                </div>
            </div>

            {/* Divisions Section */}
            <div className="glass-panel p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/5 rounded-lg">
                        <Hash size={20} className="text-neon-cyan" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Active Divisions</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.isArray(league.divisions) && league.divisions.map((div, index) => (
                        <div key={index} className="group p-4 bg-white/5 rounded-xl border border-white/5 hover:border-neon-cyan/30 hover:bg-white/10 transition-all cursor-default">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-white text-lg">{div}</span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider group-hover:text-neon-cyan transition-colors">Division</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LeagueDetailsPage;
