import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Trophy, Shield } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';

const LeagueTeamsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { teams, fetchTeams, createTeam, getLeague } = useStore();
    const league = getLeague(id);

    const [isAdding, setIsAdding] = useState(false);
    const [newTeam, setNewTeam] = useState({
        name: '',
        captain_name: '',
        division: ''
    });

    useEffect(() => {
        fetchTeams(id);
    }, [id, fetchTeams]);

    const handleAddTeam = async (e) => {
        e.preventDefault();
        try {
            await createTeam({
                league_id: id,
                name: newTeam.name,
                captain_name: newTeam.captain_name,
                division: newTeam.division,
                wins: 0,
                losses: 0,
                draws: 0
            });
            setIsAdding(false);
            setNewTeam({ name: '', captain_name: '', division: '' });
        } catch (error) {
            alert('Error creating team: ' + error.message);
        }
    };

    if (!league) return <div className="p-8 text-white">Loading league...</div>;

    // Ensure divisions is an array
    const divisions = Array.isArray(league.divisions) ? league.divisions : [];

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <button
                onClick={() => navigate(`/leagues/${id}`)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
                <ArrowLeft size={20} />
                Back to League Details
            </button>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Manage Teams</h1>
                    <p className="text-gray-400 mt-1">{league.name}</p>
                </div>
                {user?.role === 'director' && (
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center gap-2 px-4 py-2 bg-neon-blue text-obsidian font-bold rounded-lg hover:bg-neon-cyan transition-colors"
                    >
                        <Plus size={20} />
                        Add Team
                    </button>
                )}
            </div>

            {/* Add Team Form */}
            {isAdding && (
                <div className="mb-8 glass-panel p-6 border border-neon-blue/30">
                    <h3 className="text-xl font-bold text-white mb-4">Register New Team</h3>
                    <form onSubmit={handleAddTeam} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Team Name"
                            className="p-2 rounded bg-charcoal border border-white/10 text-white"
                            value={newTeam.name}
                            onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Captain Name"
                            className="p-2 rounded bg-charcoal border border-white/10 text-white"
                            value={newTeam.captain_name}
                            onChange={e => setNewTeam({ ...newTeam, captain_name: e.target.value })}
                            required
                        />
                        <select
                            className="p-2 rounded bg-charcoal border border-white/10 text-white md:col-span-2"
                            value={newTeam.division}
                            onChange={e => setNewTeam({ ...newTeam, division: e.target.value })}
                            required
                        >
                            <option value="">Select Division</option>
                            {divisions.map(div => (
                                <option key={div} value={div}>{div}</option>
                            ))}
                        </select>
                        <button type="submit" className="md:col-span-2 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            Create Team
                        </button>
                    </form>
                </div>
            )}

            {/* Teams List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No teams registered yet.
                    </div>
                ) : (
                    teams.map(team => (
                        <div key={team.id} className="glass-panel p-5 hover:border-white/20 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-xl text-white">{team.name}</h3>
                                <span className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400 border border-white/5">
                                    {team.division}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Users size={14} />
                                    <span>Captain: {team.captain_name || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy size={14} />
                                    <span>Record: {team.wins}-{team.losses}-{team.draws}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LeagueTeamsPage;
