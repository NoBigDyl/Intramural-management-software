import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Shield, ArrowRight, MapPin, Clock, Plus, Trophy, Activity, Star, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { useStore } from '../store';

const StudentHomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { teams = [], leagues = [] } = useStore();
    const [showStats, setShowStats] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    console.log('StudentHomePage Debug:', { user, teams, leagues });

    // Mock stats data (same as ProfilePage for consistency)
    const stats = {
        gamesPlayed: 12,
        wins: 8,
        losses: 4,
        winRate: '67%',
        pointsScored: 145,
        mvpAwards: 2,
        streak: 'W2',
        rank: '#42'
    };

    const myTeams = (user && Array.isArray(teams)) ? teams.filter(t =>
        t.captainId === user.id || (Array.isArray(t.members) && t.members.includes(user.id))
    ).map(t => {
        const league = Array.isArray(leagues) ? leagues.find(l => l.id === t.leagueId) : null;
        return {
            ...t,
            league: league ? league.name : 'Unknown League',
            record: `${t.wins || 0}-${t.losses || 0}`,
            nextGame: 'TBD' // Placeholder until schedule is implemented
        };
    }) : [];

    const upcomingGame = {
        team: 'Net Ninjas',
        opponent: 'Rim Rockers',
        time: '7:00 PM',
        date: 'Today, Nov 21',
        location: 'Main Gym - Court 2',
        league: 'Fall Basketball'
    };

    const firstName = (user && typeof user.name === 'string') ? user.name.split(' ')[0] : 'Student';

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Hey, {firstName}! 👋</h1>
                    <p className="text-gray-400">Ready for your game tonight?</p>
                </div>
                <button
                    onClick={() => setShowStats(!showStats)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-colors text-sm"
                >
                    {showStats ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showStats ? 'Hide Stats' : 'Show Stats'}
                </button>
            </div>

            {/* Stats Section (Toggleable) */}
            {showStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="glass-panel p-4 flex flex-col items-center text-center hover:bg-white/5 transition-colors border-b-4 border-b-neon-blue">
                        <div className="p-2 bg-neon-blue/10 rounded-lg text-neon-blue mb-2">
                            <Trophy size={20} />
                        </div>
                        <div className="text-2xl font-display font-bold text-white">{stats.wins}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Wins</div>
                    </div>
                    <div className="glass-panel p-4 flex flex-col items-center text-center hover:bg-white/5 transition-colors border-b-4 border-b-neon-purple">
                        <div className="p-2 bg-neon-purple/10 rounded-lg text-neon-purple mb-2">
                            <Activity size={20} />
                        </div>
                        <div className="text-2xl font-display font-bold text-white">{stats.gamesPlayed}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Games</div>
                    </div>
                    <div className="glass-panel p-4 flex flex-col items-center text-center hover:bg-white/5 transition-colors border-b-4 border-b-neon-pink">
                        <div className="p-2 bg-neon-pink/10 rounded-lg text-neon-pink mb-2">
                            <Star size={20} />
                        </div>
                        <div className="text-2xl font-display font-bold text-white">{stats.mvpAwards}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">MVPs</div>
                    </div>
                    <div className="glass-panel p-4 flex flex-col items-center text-center hover:bg-white/5 transition-colors border-b-4 border-b-neon-cyan">
                        <div className="p-2 bg-neon-cyan/10 rounded-lg text-neon-cyan mb-2">
                            <TrendingUp size={20} />
                        </div>
                        <div className="text-2xl font-display font-bold text-white">{stats.winRate}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Win Rate</div>
                    </div>
                    <div className="glass-panel p-4 flex flex-col items-center text-center hover:bg-white/5 transition-colors border-b-4 border-b-yellow-500">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 mb-2">
                            <div className="font-bold text-lg">PTS</div>
                        </div>
                        <div className="text-2xl font-display font-bold text-white">{stats.pointsScored}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Points</div>
                    </div>
                    <div className="glass-panel p-4 flex flex-col items-center text-center hover:bg-white/5 transition-colors border-b-4 border-b-green-500">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-500 mb-2">
                            <div className="font-bold text-lg">STR</div>
                        </div>
                        <div className="text-2xl font-display font-bold text-white">{stats.streak}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Streak</div>
                    </div>
                    <div className="glass-panel p-4 flex flex-col items-center text-center hover:bg-white/5 transition-colors border-b-4 border-b-orange-500">
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 mb-2">
                            <div className="font-bold text-lg">#</div>
                        </div>
                        <div className="text-2xl font-display font-bold text-white">{stats.rank}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Personal Rank</div>
                    </div>
                </div>
            )}

            {/* Hero: Next Game */}
            <div className="relative overflow-hidden rounded-2xl glass-panel p-1 group">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-charcoal/80 backdrop-blur-xl rounded-xl p-4 md:p-8 border border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                        {/* Matchup */}
                        <div className="flex items-center gap-8 flex-1">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full bg-obsidian border-4 border-neon-blue flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(102,252,241,0.3)] mb-3">
                                    🥷
                                </div>
                                <div className="font-bold text-white text-lg">You</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-display font-bold text-gray-500 mb-1">VS</div>
                                <div className="text-xs uppercase tracking-widest text-neon-blue font-bold">Tonight</div>
                            </div>
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full bg-obsidian border-4 border-white/10 flex items-center justify-center text-3xl mb-3">
                                    🏀
                                </div>
                                <div className="font-bold text-gray-400 text-lg">{upcomingGame.opponent}</div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex flex-col gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-8 w-full md:w-auto">
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">League</div>
                                <div className="text-white font-medium">{upcomingGame.league}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Time & Place</div>
                                <div className="flex items-center gap-2 text-white font-medium">
                                    <Clock size={16} className="text-neon-purple" />
                                    {upcomingGame.time}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                                    <MapPin size={14} />
                                    {upcomingGame.location}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setIsCheckedIn(!isCheckedIn)}
                                    className={`w-full py-2 rounded-lg font-bold transition-all duration-300 ${isCheckedIn
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                        : 'bg-white/10 hover:bg-white/20 text-white'
                                        }`}
                                >
                                    {isCheckedIn ? 'Checked In ✓' : 'Check In'}
                                </button>
                                <button
                                    onClick={() => navigate('/leagues/l1/schedule')} // Hardcoded for demo, should be dynamic
                                    className="w-full py-2 rounded-lg font-bold bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue hover:text-obsidian transition-all"
                                >
                                    View Full Schedule
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* My Teams */}
                <div className="glass-panel p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                            <Shield size={20} className="text-neon-blue" />
                            My Teams
                        </h3>
                        <button
                            onClick={() => navigate('/teams')}
                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {myTeams.map(team => (
                            <div key={team.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-neon-blue/30 transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-white text-lg group-hover:text-neon-blue transition-colors">{team.name}</div>
                                    <div className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded">{team.record}</div>
                                </div>
                                <div className="text-sm text-gray-400 mb-3">{team.league}</div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar size={12} />
                                        Next: {team.nextGame}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/leagues/${team.leagueId}/schedule`);
                                        }}
                                        className="text-xs font-bold text-neon-blue hover:text-white transition-colors"
                                    >
                                        View Schedule &rarr;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Announcements / Feed */}
                <div className="glass-panel p-8">
                    <h3 className="font-display font-bold text-xl text-white mb-6">Announcements</h3>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-neon-purple/10 text-neon-purple flex items-center justify-center flex-shrink-0">
                                📢
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Playoffs Schedule Released</h4>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    The bracket for Fall Basketball is now live! Check your team's standing and upcoming matchups.
                                </p>
                                <p className="text-xs text-gray-600 mt-2">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-neon-blue/10 text-neon-blue flex items-center justify-center flex-shrink-0">
                                🌧️
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Field 3 Maintenance</h4>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Soccer games scheduled for Field 3 are moved to Field 1 due to drainage issues.
                                </p>
                                <p className="text-xs text-gray-600 mt-2">Yesterday</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentHomePage;
