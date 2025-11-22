import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';

const CreateTeamModal = ({ isOpen, onClose }) => {
    const { leagues, addTeam } = useStore();
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [leagueId, setLeagueId] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Team name is required');
            return;
        }
        if (!leagueId) {
            setError('Please select a league');
            return;
        }

        const newTeam = {
            name,
            leagueId,
            captainId: user.id,
            members: [user.id],
            wins: 0,
            losses: 0,
            points: 0
        };

        addTeam(newTeam);
        onClose();
        setName('');
        setLeagueId('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-charcoal border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-display font-bold text-white mb-6">Create New Team</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Team Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
                            placeholder="e.g. The Ballers"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">Select League</label>
                        <select
                            value={leagueId}
                            onChange={(e) => setLeagueId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors appearance-none"
                        >
                            <option value="" className="bg-charcoal text-gray-500">Choose a league...</option>
                            {leagues.filter(l => l.registrationOpen).map(league => (
                                <option key={league.id} value={league.id} className="bg-charcoal">
                                    {league.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-400 hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-xl font-bold bg-neon-blue text-obsidian hover:bg-neon-cyan transition-colors shadow-neon-blue"
                        >
                            Create Team
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTeamModal;
