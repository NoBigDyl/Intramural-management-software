import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Trophy, Users, User, ArrowRight, Search } from 'lucide-react';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const navigate = useNavigate();
    const { leagues, teams, users, fetchLeagues, fetchTeams } = useStore();

    useEffect(() => {
        fetchLeagues();
        fetchTeams();
    }, [fetchLeagues, fetchTeams]);

    if (!query) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Search size={40} className="text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Search Campus Clash</h2>
                <p className="text-gray-400">Enter a keyword to find leagues, teams, or players.</p>
            </div>
        );
    }

    const lowerQuery = query.toLowerCase();

    const filteredLeagues = (leagues || []).filter(l =>
        (l.name?.toLowerCase() || '').includes(lowerQuery) ||
        (l.sport?.toLowerCase() || '').includes(lowerQuery)
    );

    const filteredTeams = (teams || []).filter(t =>
        (t.name?.toLowerCase() || '').includes(lowerQuery)
    );

    const filteredUsers = (users || []).filter(u =>
        (u.name?.toLowerCase() || '').includes(lowerQuery) && u.role === 'student'
    );

    const hasResults = filteredLeagues.length > 0 || filteredTeams.length > 0 || filteredUsers.length > 0;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Search Results</h1>
                <p className="text-gray-400">Showing results for "<span className="text-white font-bold">{query}</span>"</p>
            </div>

            {!hasResults && (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-gray-400">No results found. Try a different search term.</p>
                </div>
            )}

            {/* Leagues Results */}
            {filteredLeagues.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Trophy size={20} className="text-neon-blue" />
                        Leagues
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredLeagues.map(league => (
                            <div
                                key={league.id}
                                onClick={() => navigate(`/leagues/${league.id}`)}
                                className="glass-panel p-4 hover:bg-white/10 transition-colors cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-white group-hover:text-neon-blue transition-colors">{league.name}</h3>
                                    <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${league.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {league.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400">{league.season} • {league.sport}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Teams Results */}
            {filteredTeams.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users size={20} className="text-neon-purple" />
                        Teams
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTeams.map(team => (
                            <div
                                key={team.id}
                                className="glass-panel p-4 border border-white/5"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-white">{team.name}</h3>
                                    <span className="text-xs font-mono text-gray-500">{team.wins}-{team.losses}</span>
                                </div>
                                <p className="text-sm text-gray-400 mb-3">Captain: {(users || []).find(u => u.id === team.captainId)?.name || 'Unknown'}</p>
                                <button
                                    onClick={() => navigate(`/leagues/${team.leagueId}`)}
                                    className="text-xs font-bold text-neon-purple hover:text-white transition-colors flex items-center gap-1"
                                >
                                    View League <ArrowRight size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Players Results */}
            {filteredUsers.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <User size={20} className="text-neon-pink" />
                        Players
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUsers.map(user => (
                            <div key={user.id} className="glass-panel p-4 flex items-center gap-4">
                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-white/10" />
                                <div>
                                    <h3 className="font-bold text-white">{user.name}</h3>
                                    <p className="text-xs text-gray-400">Level {user.level || 1} • {user.xp || 0} XP</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
