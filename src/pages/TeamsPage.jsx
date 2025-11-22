import React from 'react';
import { Plus, Users, Shield } from 'lucide-react';

import { useStore } from '../store';

const TeamsPage = () => {
    const { teams, leagues, users } = useStore();

    const getLeagueName = (id) => {
        const league = leagues.find(l => l.id === id);
        return league ? league.name : 'Unknown League';
    };

    const getCaptainName = (id) => {
        const user = users.find(u => u.id === id);
        return user ? user.name : 'Unknown Captain';
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
                    <p className="text-gray-500 mt-1">Manage all teams across your leagues.</p>
                </div>
                <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                    <Plus size={20} />
                    Create Team
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                    <div key={team.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{team.name}</h3>
                                    <p className="text-xs text-gray-500">{getLeagueName(team.leagueId)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-gray-100 pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Captain</span>
                                <span className="font-medium text-gray-900">{getCaptainName(team.captainId)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Members</span>
                                <div className="flex items-center gap-1 text-gray-900">
                                    <Users size={14} className="text-gray-400" />
                                    <span className="font-medium">{team.members.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamsPage;
