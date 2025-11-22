import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Activity, Calendar, Star, TrendingUp } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuth();

    // Mock stats data
    const stats = {
        gamesPlayed: 12,
        wins: 8,
        losses: 4,
        winRate: '67%',
        pointsScored: 145,
        mvpAwards: 2
    };

    const badges = [
        { id: 1, name: 'Sharpshooter', icon: '🎯', description: 'Scored 20+ points in a game', date: 'Oct 15, 2025' },
        { id: 2, name: 'Champion', icon: '🏆', description: 'Won Fall 2024 Basketball', date: 'Nov 20, 2024' },
        { id: 3, name: 'Iron Man', icon: '🦾', description: 'Played 10 consecutive games', date: 'Sep 10, 2025' },
    ];

    const recentGames = [
        { id: 1, result: 'W', score: '65-60', opponent: 'Net Ninjas', date: 'Nov 12', sport: 'Basketball' },
        { id: 2, result: 'W', score: '42-38', opponent: 'Hoops I Did It Again', date: 'Nov 05', sport: 'Basketball' },
        { id: 3, result: 'L', score: '55-60', opponent: 'The Ballers', date: 'Oct 29', sport: 'Basketball' },
    ];

    if (!user) return <div className="text-white">Please log in.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="glass-panel p-8 flex items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="relative">
                    <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-br from-neon-blue to-neon-purple shadow-neon-blue">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full rounded-full border-4 border-obsidian"
                        />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-obsidian shadow-lg"></div>
                </div>

                <div className="flex-1 relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-display font-bold text-white mb-2">{user.name}</h1>
                            <p className="text-gray-400 flex items-center gap-3 text-sm">
                                <span className="capitalize bg-neon-blue/10 text-neon-blue border border-neon-blue/20 px-3 py-1 rounded-full font-bold tracking-wide shadow-neon-blue">
                                    {user.role}
                                </span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                <span>Computer Science Major</span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                <span>Class of 2026</span>
                            </p>
                        </div>
                        <button className="px-6 py-2 border border-white/10 bg-white/5 rounded-lg text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all">
                            Edit Profile
                        </button>
                    </div>

                    <div className="mt-8 flex gap-12">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                                <Trophy size={24} />
                            </div>
                            <div>
                                <div className="font-display font-bold text-2xl text-white leading-none">{stats.wins}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Wins</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <Activity size={24} />
                            </div>
                            <div>
                                <div className="font-display font-bold text-2xl text-white leading-none">{stats.gamesPlayed}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">Games</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                <Star size={24} />
                            </div>
                            <div>
                                <div className="font-display font-bold text-2xl text-white leading-none">{stats.mvpAwards}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mt-1">MVPs</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Badges */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="glass-panel p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                            <div className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2">Win Rate</div>
                            <div className="text-3xl font-display font-bold text-white mb-2">{stats.winRate}</div>
                            <div className="text-xs text-green-400 flex items-center bg-green-400/10 px-2 py-1 rounded-full">
                                <TrendingUp size={12} className="mr-1" /> +5%
                            </div>
                        </div>
                        <div className="glass-panel p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                            <div className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2">Points</div>
                            <div className="text-3xl font-display font-bold text-white mb-2">{stats.pointsScored}</div>
                            <div className="text-xs text-gray-500">Career Total</div>
                        </div>
                        <div className="glass-panel p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                            <div className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2">Streak</div>
                            <div className="text-3xl font-display font-bold text-white mb-2">W2</div>
                            <div className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Current</div>
                        </div>
                        <div className="glass-panel p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                            <div className="text-gray-400 text-xs uppercase tracking-wider font-bold mb-2">Rank</div>
                            <div className="text-3xl font-display font-bold text-white mb-2">#42</div>
                            <div className="text-xs text-gray-500">Campus Wide</div>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="glass-panel p-8">
                        <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-3">
                            <Medal className="text-neon-purple" size={24} />
                            Achievements
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {badges.map(badge => (
                                <div key={badge.id} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all cursor-default group">
                                    <div className="w-14 h-14 bg-obsidian rounded-full flex items-center justify-center text-3xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
                                        {badge.icon}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white group-hover:text-neon-blue transition-colors">{badge.name}</div>
                                        <div className="text-xs text-gray-400 mb-1">{badge.description}</div>
                                        <div className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">{badge.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Recent Activity */}
                <div className="space-y-8">
                    <div className="glass-panel p-8">
                        <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-3">
                            <Calendar className="text-neon-blue" size={24} />
                            Recent Games
                        </h3>
                        <div className="space-y-4">
                            {recentGames.map(game => (
                                <div key={game.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-obsidian text-sm shadow-lg ${game.result === 'W' ? 'bg-neon-blue' : 'bg-red-500 text-white'}`}>
                                            {game.result}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{game.opponent}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{game.sport} • {game.date}</div>
                                        </div>
                                    </div>
                                    <div className="font-mono font-bold text-lg text-gray-300">
                                        {game.score}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 text-sm text-neon-blue font-bold uppercase tracking-wider border border-neon-blue/20 rounded-lg hover:bg-neon-blue/10 transition-all">
                            View Full History
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
