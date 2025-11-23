import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, MoreVertical, Edit2, Copy, ArrowRight, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';

const LeagueCard = ({ league }) => {
    const navigate = useNavigate();
    const { deleteLeague } = useStore();
    const { user } = useAuth();

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this league?')) {
            deleteLeague(league.id);
        }
    };

    return (
        <div className="glass-panel p-6 hover:border-neon-blue/30 transition-all duration-300 group relative overflow-hidden">
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-neon-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-400 border border-white/5">
                            {league.sport}
                        </span>
                        {league.status === 'active' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-neon-blue">
                                Live
                            </span>
                        )}
                    </div>
                    <h3 className="font-display font-bold text-xl text-white group-hover:text-neon-blue transition-colors">{league.name}</h3>
                </div>
                {user?.role === 'director' && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/leagues/edit/${league.id}`);
                            }}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/leagues/duplicate/${league.id}`);
                            }}
                            className="p-2 text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10 rounded-lg transition-colors"
                            title="Duplicate"
                        >
                            <Copy size={16} />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
                {user?.role === 'student' && (league.registrationOpen || league.registration_open) && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to teams page to create a team
                            navigate('/teams');
                        }}
                        className="px-4 py-1.5 bg-neon-blue/10 text-neon-blue border border-neon-blue/20 rounded-lg text-sm font-bold hover:bg-neon-blue hover:text-obsidian transition-all shadow-neon-blue"
                    >
                        Join League
                    </button>
                )}
            </div>

            <div className="space-y-3 mb-6 relative z-10">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="p-1.5 rounded-md bg-white/5 text-gray-500">
                        <Calendar size={14} />
                    </div>
                    <span>
                        {new Date(league.startDate || league.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(league.endDate || league.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="p-1.5 rounded-md bg-white/5 text-gray-500">
                        <Users size={14} />
                    </div>
                    <span>{league.maxTeams || league.max_teams} Teams Max</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="p-1.5 rounded-md bg-white/5 text-gray-500">
                        <MoreVertical size={14} />
                    </div>
                    <span>
                        {Array.isArray(league.divisions) && league.divisions.length > 0
                            ? league.divisions.join(', ')
                            : 'Open'}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-charcoal border border-white/10 flex items-center justify-center text-[10px] text-gray-500">
                            <Users size={10} />
                        </div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-charcoal border border-white/10 flex items-center justify-center text-[10px] text-gray-500 pl-1">
                        +12
                    </div>
                </div>
                <button
                    onClick={() => navigate(`/leagues/${league.id}`)}
                    className="flex items-center gap-2 text-sm font-medium text-neon-blue hover:text-white transition-colors group/btn"
                >
                    View Details
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default LeagueCard;
