import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Shield, ArrowRight, MapPin, Clock, Plus, Trophy, Activity, Star, TrendingUp, Eye, EyeOff, Zap, Info, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import { useStore } from '../store';

const StudentHomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { teams = [], leagues = [], announcements = [], fetchAnnouncements, fetchTeams, fetchLeagues } = useStore();
    const [showStats, setShowStats] = useState(false);
    const [isCheckedIn, setIsCheckedIn] = useState(false);

    React.useEffect(() => {
        fetchTeams();
        fetchLeagues();
        fetchAnnouncements();
    }, [fetchTeams, fetchLeagues, fetchAnnouncements]);

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
        t.captainId === user.id ||
        t.captain_id === user.id ||
        (Array.isArray(t.members) && t.members.includes(user.id))
    ).map(t => {
        // Handle both camelCase and snake_case for leagueId
        const leagueId = t.leagueId || t.league_id;
        const league = Array.isArray(leagues) ? leagues.find(l => l.id === leagueId) : null;
        return {
            ...t,
            league: league ? league.name : 'Unknown League',
            leagueId: leagueId, // Ensure we have the ID for navigation
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
        league: 'Fall Basketball',
        leagueId: 'l1' // Mock ID for now, ideally derived from real data
    };

    const firstName = (user && typeof user.name === 'string') ? user.name.split(' ')[0] : 'Student';

    const [showXPModal, setShowXPModal] = useState(false);
    const xp = user?.xp || 0;
    const level = user?.level || 1;
    const nextLevelXP = 100; // Fixed for now, could be formula
    const progress = (xp % 100) / 100 * 100;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* XP Card */}
            <div className="glass-panel p-8 bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 border-neon-blue/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                                👋
                            </div>
                            <div>
                                <h1 className="text-3xl font-display font-bold text-white">Welcome back,</h1>
                                <h1 className="text-3xl font-display font-bold text-neon-blue">{firstName}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full md:w-auto md:max-w-md bg-black/20 rounded-2xl p-6 backdrop-blur-sm border border-white/5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                    Your Level
                                    <button onClick={() => setShowXPModal(true)} className="hover:text-white transition-colors">
                                        <Info size={14} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-4xl font-display font-bold text-white">{level}</span>
                                    <Zap size={24} className="text-yellow-400 fill-yellow-400" />
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-400 mb-1">XP</div>
                                <div className="text-2xl font-bold text-white">{xp}</div>
                            </div>
                        </div>

                        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-blue to-neon-purple transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="text-xs text-gray-400 text-center">
                            {100 - (xp % 100)} XP to level {level + 1}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <p className="text-gray-400">Ready for your game tonight?</p>
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
                                    onClick={() => {
                                        // Find the league ID from upcoming game or first team
                                        const targetLeagueId = upcomingGame.leagueId || (myTeams.length > 0 ? myTeams[0].leagueId : null);
                                        if (targetLeagueId) {
                                            navigate(`/leagues/${targetLeagueId}`);
                                        } else {
                                            navigate('/leagues');
                                        }
                                    }}
                                    className="w-full py-2 rounded-lg font-bold bg-neon-blue/10 text-neon-blue border border-neon-blue/20 hover:bg-neon-blue hover:text-obsidian transition-all"
                                >
                                    View League Details
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
                                            navigate(`/leagues/${team.leagueId}`);
                                        }}
                                        className="text-xs font-bold text-neon-blue hover:text-white transition-colors"
                                    >
                                        View League &rarr;
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
                        {announcements.length === 0 ? (
                            <div className="text-center text-gray-500 py-4">
                                No announcements yet.
                            </div>
                        ) : (
                            announcements.map(announcement => (
                                <div key={announcement.id} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-neon-purple/10 text-neon-purple flex items-center justify-center flex-shrink-0">
                                        📢
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">{announcement.title}</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            {announcement.content}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-2">
                                            {new Date(announcement.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* About XP Modal */}
            {showXPModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white text-obsidian rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setShowXPModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-obsidian transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={24} className="text-yellow-500 fill-yellow-500" />
                            <h3 className="text-xl font-display font-bold">About XP & Levels</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-lg mb-2">What is XP?</h4>
                                <p className="text-gray-600 leading-relaxed">
                                    XP (Experience Points) measures your participation and achievement in intramural sports. Earn XP to level up and unlock achievements!
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-lg mb-3">How to Earn XP:</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 text-green-500"><Check size={16} strokeWidth={3} /></div>
                                        <span className="text-gray-600"><span className="font-bold text-obsidian">Playing games</span> - Show up and compete</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 text-green-500"><Check size={16} strokeWidth={3} /></div>
                                        <span className="text-gray-600"><span className="font-bold text-obsidian">Winning games</span> - Victory brings bonus XP</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 text-green-500"><Check size={16} strokeWidth={3} /></div>
                                        <span className="text-gray-600"><span className="font-bold text-obsidian">On-time check-ins</span> - Be punctual</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 text-green-500"><Check size={16} strokeWidth={3} /></div>
                                        <span className="text-gray-600"><span className="font-bold text-obsidian">No forfeits</span> - Avoid no-shows</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm">
                                <span className="font-bold">Level Up:</span> Each level requires 100 XP. Keep playing to climb the leaderboard!
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentHomePage;
