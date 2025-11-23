import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Trophy, Activity, Hash, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';
import Bracket from '../components/Bracket';

const LeagueDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <ErrorBoundary>
            <LeagueDetailsContent id={id} navigate={navigate} />
        </ErrorBoundary>
    );
};

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("LeagueDetailsPage Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center text-red-500">
                    <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
                    <p className="font-mono text-sm bg-black/50 p-4 rounded text-left overflow-auto">
                        {this.state.error && this.state.error.toString()}
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

const LeagueDetailsContent = ({ id, navigate }) => {
    const { getLeague, fetchTeams, teams, fetchLeagues, fetchMatches, matches } = useStore();
    const [activeTab, setActiveTab] = React.useState('standings');

    React.useEffect(() => {
        fetchLeagues();
        fetchTeams(id);
        fetchMatches(id);
    }, [id, fetchTeams, fetchLeagues, fetchMatches]);

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
                            {useAuth().user?.role === 'director' && (
                                <>
                                    <button
                                        onClick={() => navigate(`/leagues/edit/${league.id}`)}
                                        className="px-4 py-3 bg-white/5 text-gray-400 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                                        title="Edit League"
                                    >
                                        <Activity size={20} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this league? This action cannot be undone.')) {
                                                useStore.getState().deleteLeague(league.id);
                                                navigate('/leagues');
                                            }
                                        }}
                                        className="px-4 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors"
                                        title="Delete League"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </>
                            )}
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

            {/* Content Tabs */}
            <div className="flex items-center gap-6 border-b border-white/10 mb-8">
                <button
                    onClick={() => setActiveTab('standings')}
                    className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'standings'
                        ? 'text-neon-blue border-b-2 border-neon-blue'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Standings
                </button>
                <button
                    onClick={() => setActiveTab('bracket')}
                    className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'bracket'
                        ? 'text-neon-blue border-b-2 border-neon-blue'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Tournament Bracket
                </button>
                <button
                    onClick={() => setActiveTab('schedule')}
                    className={`pb-4 px-2 text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'schedule'
                        ? 'text-neon-blue border-b-2 border-neon-blue'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Schedule
                </button>
            </div>

            {activeTab === 'standings' && (
                <div className="glass-panel p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/5 rounded-lg">
                            <Trophy size={20} className="text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white">League Standings</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-white/10">
                                    <th className="p-4 font-bold">Rank</th>
                                    <th className="p-4 font-bold">Team</th>
                                    <th className="p-4 font-bold text-center">GP</th>
                                    <th className="p-4 font-bold text-center">W</th>
                                    <th className="p-4 font-bold text-center">L</th>
                                    <th className="p-4 font-bold text-center">Pts</th>
                                </tr>
                            </thead>
                            <tbody className="text-white">
                                {(teams || [])
                                    .filter(t => t.leagueId === id || t.league_id === id)
                                    .sort((a, b) => (b.wins || 0) - (a.wins || 0)) // Sort by wins for now
                                    .map((team, index) => (
                                        <tr key={team.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-mono text-gray-400">#{index + 1}</td>
                                            <td className="p-4 font-bold">{team.name}</td>
                                            <td className="p-4 font-bold text-center text-gray-400">{(team.wins || 0) + (team.losses || 0) + (team.draws || 0)}</td>
                                            <td className="p-4 font-bold text-center text-neon-green">{team.wins || 0}</td>
                                            <td className="p-4 font-bold text-center text-red-400">{team.losses || 0}</td>
                                            <td className="p-4 font-bold text-center text-neon-blue">{team.points || 0}</td>
                                        </tr>
                                    ))}
                                {(teams || []).filter(t => t.leagueId === id || t.league_id === id).length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-500">
                                            No teams in this league yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'bracket' && (
                <div className="glass-panel p-8 overflow-hidden">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/5 rounded-lg">
                            <Trophy size={20} className="text-neon-purple" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Tournament Bracket</h3>
                    </div>
                    <Bracket
                        matches={(matches || []).filter(m => m.league_id === id)}
                        teams={teams || []}
                    />
                </div>
            )}

            {activeTab === 'schedule' && (
                <div className="glass-panel p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg">
                                <Calendar size={20} className="text-neon-blue" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Full Schedule</h3>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {(matches || []).filter(m => m.league_id === id).length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No matches scheduled yet.
                            </div>
                        ) : (
                            Object.entries(
                                (matches || [])
                                    .filter(m => m.league_id === id)
                                    .reduce((acc, match) => {
                                        const date = new Date(match.start_time).toDateString();
                                        if (!acc[date]) acc[date] = [];
                                        acc[date].push(match);
                                        return acc;
                                    }, {})
                            )
                                .sort((a, b) => new Date(a[0]) - new Date(b[0]))
                                .map(([date, dayMatches]) => (
                                    <div key={date}>
                                        <h3 className="text-lg font-bold text-neon-blue mb-4 sticky top-0 bg-obsidian/90 backdrop-blur py-2 z-10 border-b border-white/5">
                                            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </h3>
                                        <div className="space-y-3">
                                            {dayMatches.map(match => {
                                                const homeTeam = teams.find(t => t.id === match.home_team_id);
                                                const awayTeam = teams.find(t => t.id === match.away_team_id);
                                                return (
                                                    <div key={match.id} className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-white/20 transition-colors">
                                                        <div className="flex items-center gap-8 flex-1">
                                                            <div className={`flex-1 text-right font-bold text-lg ${match.home_score > match.away_score ? 'text-neon-green' : 'text-white'}`}>
                                                                {homeTeam ? homeTeam.name : 'Unknown'}
                                                            </div>
                                                            <div className="px-3 py-1 bg-white/5 rounded text-sm text-gray-400 font-mono min-w-[80px] text-center">
                                                                {match.status === 'completed' ? (
                                                                    <span className="text-white font-bold">{match.home_score} - {match.away_score}</span>
                                                                ) : (
                                                                    'VS'
                                                                )}
                                                            </div>
                                                            <div className={`flex-1 text-left font-bold text-lg ${match.away_score > match.home_score ? 'text-neon-green' : 'text-white'}`}>
                                                                {awayTeam ? awayTeam.name : 'Unknown'}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-6 text-sm text-gray-400 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Calendar size={16} />
                                                                    {new Date(match.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Hash size={16} />
                                                                    {match.location}
                                                                </div>
                                                            </div>
                                                            {match.status === 'completed' && (
                                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold uppercase tracking-wider">
                                                                    Final
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeagueDetailsPage;
