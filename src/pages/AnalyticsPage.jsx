import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, Trophy, Calendar, Search, Sparkles, TrendingUp, Activity } from 'lucide-react';

const AnalyticsPage = () => {
    const { leagues, teams, matches, users } = useStore();
    const [aiPrompt, setAiPrompt] = useState('');
    const [filteredStats, setFilteredStats] = useState(null);

    // Derived Stats
    const totalPlayers = users.filter(u => u.role === 'student').length; // Mock logic, ideally count from team members
    const activeLeagues = leagues.filter(l => l.status === 'active').length;
    const upcomingMatches = matches.filter(m => new Date(m.start_time) > new Date()).length;

    // Chart Data Preparation
    const leaguePopularity = useMemo(() => {
        return leagues.map(l => ({
            name: l.name,
            teams: teams.filter(t => t.leagueId === l.id || t.league_id === l.id).length
        }));
    }, [leagues, teams]);

    const matchDistribution = useMemo(() => {
        const completed = matches.filter(m => m.status === 'completed').length;
        const scheduled = matches.filter(m => m.status !== 'completed').length;
        return [
            { name: 'Completed', value: completed },
            { name: 'Scheduled', value: scheduled }
        ];
    }, [matches]);

    // Mock Registration Data (since we don't have historical data easily accessible)
    const registrationData = [
        { name: 'Week 1', students: 120 },
        { name: 'Week 2', students: 250 },
        { name: 'Week 3', students: 380 },
        { name: 'Week 4', students: 450 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // AI Search Logic (Simple keyword matching for demo)
    const handleAiSearch = (e) => {
        e.preventDefault();
        const prompt = aiPrompt.toLowerCase();

        if (prompt.includes('basketball')) {
            setFilteredStats({
                title: 'Basketball Stats',
                leagues: leagues.filter(l => l.sport === 'Basketball').length,
                teams: teams.filter(t => {
                    const league = leagues.find(l => l.id === t.leagueId || l.id === t.league_id);
                    return league && league.sport === 'Basketball';
                }).length
            });
        } else if (prompt.includes('soccer')) {
            setFilteredStats({
                title: 'Soccer Stats',
                leagues: leagues.filter(l => l.sport === 'Soccer').length,
                teams: teams.filter(t => {
                    const league = leagues.find(l => l.id === t.leagueId || l.id === t.league_id);
                    return league && league.sport === 'Soccer';
                }).length
            });
        } else {
            setFilteredStats(null);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-400">Real-time insights and performance metrics.</p>
                </div>
            </div>

            {/* AI Search Bar */}
            <div className="glass-panel p-6 bg-gradient-to-r from-neon-blue/5 to-neon-purple/5 border-neon-blue/20">
                <form onSubmit={handleAiSearch} className="relative">
                    <Sparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neon-purple" size={20} />
                    <input
                        type="text"
                        placeholder="Ask AI for insights (e.g., 'Show me basketball stats')..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple/50 transition-all"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                        Analyze
                    </button>
                </form>
                {filteredStats && (
                    <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 animate-in fade-in slide-in-from-top-2">
                        <h3 className="font-bold text-neon-blue mb-2 flex items-center gap-2">
                            <Sparkles size={16} />
                            AI Insight: {filteredStats.title}
                        </h3>
                        <div className="flex gap-8">
                            <div>
                                <span className="text-gray-400 text-sm">Active Leagues</span>
                                <div className="text-2xl font-bold text-white">{filteredStats.leagues}</div>
                            </div>
                            <div>
                                <span className="text-gray-400 text-sm">Total Teams</span>
                                <div className="text-2xl font-bold text-white">{filteredStats.teams}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 flex items-center gap-4 border-l-4 border-l-neon-blue">
                    <div className="p-3 bg-neon-blue/10 rounded-xl text-neon-blue">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Total Players</p>
                        <h3 className="text-3xl font-display font-bold text-white">{totalPlayers}</h3>
                    </div>
                </div>
                <div className="glass-panel p-6 flex items-center gap-4 border-l-4 border-l-neon-green">
                    <div className="p-3 bg-neon-green/10 rounded-xl text-neon-green">
                        <Trophy size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Active Leagues</p>
                        <h3 className="text-3xl font-display font-bold text-white">{activeLeagues}</h3>
                    </div>
                </div>
                <div className="glass-panel p-6 flex items-center gap-4 border-l-4 border-l-neon-purple">
                    <div className="p-3 bg-neon-purple/10 rounded-xl text-neon-purple">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Upcoming Matches</p>
                        <h3 className="text-3xl font-display font-bold text-white">{upcomingMatches}</h3>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* League Popularity */}
                <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-neon-blue" />
                        League Popularity
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={leaguePopularity}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2833', borderColor: '#ffffff20', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="teams" fill="#66FCF1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Match Status */}
                <div className="glass-panel p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-neon-purple" />
                        Match Status
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={matchDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {matchDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2833', borderColor: '#ffffff20', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Registration Trend */}
                <div className="glass-panel p-6 lg:col-span-2">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-neon-green" />
                        Registration Trend
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={registrationData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2833', borderColor: '#ffffff20', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="students" stroke="#45A29E" strokeWidth={3} dot={{ fill: '#66FCF1', r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
