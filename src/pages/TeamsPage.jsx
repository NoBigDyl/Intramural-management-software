import React, { useEffect, useState } from 'react';
import { Plus, Users, Shield, X } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';

const TeamsPage = () => {
    const { teams, leagues, users, fetchTeams, createTeam, fetchLeagues } = useStore();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTeam, setNewTeam] = useState({ name: '', leagueId: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTeams();
        fetchLeagues();
    }, [fetchTeams, fetchLeagues]);

    const getLeagueName = (id) => {
        const league = leagues.find(l => l.id === id);
        return league ? league.name : 'Unknown League';
    };

    const getCaptainName = (id) => {
        // If the captain is the current user, return "You"
        if (user && id === user.id) return 'You';
        const captain = users.find(u => u.id === id);
        return captain ? captain.name : 'Unknown Captain';
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        setError('');

        if (!newTeam.name || !newTeam.leagueId) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await createTeam({
                name: newTeam.name,
                league_id: newTeam.leagueId, // Note: DB column is league_id
                leagueId: newTeam.leagueId, // Keep consistent with store usage if needed, but DB is source of truth
                captainId: user.id,
                captain_id: user.id,
                wins: 0,
                losses: 0,
                points: 0,
                members: [user.id]
            });
            setIsModalOpen(false);
            setNewTeam({ name: '', leagueId: '' });
            // Refresh teams
            fetchTeams();
        } catch (err) {
            console.error('Error creating team:', err);
            setError('Failed to create team. Please try again.');
        }
    };

    // Filter leagues that are open for registration
    const openLeagues = leagues.filter(l => l.status === 'active' || l.registrationOpen);

    // Filter teams based on role
    const displayedTeams = user?.role === 'student'
        ? teams.filter(team =>
            team.captainId === user.id ||
            team.captain_id === user.id ||
            (team.members && team.members.includes(user.id))
        )
        : teams;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-display font-bold text-white">Teams</h2>
                    <p className="text-gray-400 mt-1">
                        {user?.role === 'student'
                            ? 'Your active teams.'
                            : 'Manage all teams across your leagues.'}
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-neon-blue hover:bg-neon-cyan text-obsidian px-4 py-2 rounded-lg font-bold transition-colors shadow-neon-blue"
                >
                    <Plus size={20} />
                    Create Team
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedTeams.map(team => (
                    <div key={team.id} className="glass-panel p-5 hover:border-neon-blue/30 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-neon-blue/10 rounded-lg flex items-center justify-center text-neon-blue border border-neon-blue/20">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-neon-blue transition-colors">{team.name}</h3>
                                    <p className="text-xs text-gray-400">{getLeagueName(team.leagueId || team.league_id)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-white/5 pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Captain</span>
                                <span className="font-medium text-gray-300">{getCaptainName(team.captainId || team.captain_id)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Members</span>
                                <div className="flex items-center gap-1 text-gray-300">
                                    <Users size={14} className="text-gray-500" />
                                    <span className="font-medium">{team.members?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {teams.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No teams found. Create one to get started!
                    </div>
                )}
            </div>

            {/* Create Team Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-charcoal border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-display font-bold text-white mb-6">Create New Team</h3>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleCreateTeam} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Team Name</label>
                                <input
                                    type="text"
                                    value={newTeam.name}
                                    onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                                    className="w-full bg-obsidian border border-white/10 rounded-lg p-2.5 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                                    placeholder="e.g. The Net Ninjas"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">League</label>
                                <select
                                    value={newTeam.leagueId}
                                    onChange={e => setNewTeam({ ...newTeam, leagueId: e.target.value })}
                                    className="w-full bg-obsidian border border-white/10 rounded-lg p-2.5 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                                >
                                    <option value="">Select a League</option>
                                    {openLeagues.map(league => (
                                        <option key={league.id} value={league.id}>
                                            {league.name} ({league.sport})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-neon-blue text-obsidian font-bold py-3 rounded-lg hover:bg-neon-cyan transition-colors shadow-neon-blue"
                                >
                                    Create Team
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamsPage;
