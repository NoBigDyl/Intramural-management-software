import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Filter, ChevronDown, Search } from 'lucide-react';
import LeagueCard from '../components/LeagueCard';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';

const LeaguesPage = () => {
    const navigate = useNavigate();
    const { leagues, fetchLeagues } = useStore();
    const { user } = useAuth();
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        fetchLeagues();
    }, [fetchLeagues]);

    // Set default filter for students
    useEffect(() => {
        if (user?.role === 'student') {
            setFilter('upcoming');
        }
    }, [user]);

    const filteredLeagues = leagues.filter(league => {
        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                (league.name?.toLowerCase() || '').includes(query) ||
                (league.sport?.toLowerCase() || '').includes(query);
            if (!matchesSearch) return false;
        }

        // Status Filter
        if (filter === 'all') return true;
        if (filter === 'upcoming') {
            // Fix: Upcoming should NOT include active leagues
            return (league.status === 'upcoming' || league.registrationOpen || league.registration_open) && league.status !== 'active';
        }
        if (filter === 'current') return league.status === 'active';
        if (filter === 'past') return league.status === 'past' || league.status === 'completed';
        return true;
    });

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Leagues</h1>
                    <p className="text-gray-400">
                        {user?.role === 'director'
                            ? 'Manage your active seasons and tournaments.'
                            : 'Browse and join active leagues.'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Search Bar */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search leagues..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 transition-all w-64"
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors min-w-[140px] justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <Filter size={18} />
                                <span className="capitalize">{filter}</span>
                            </div>
                            <ChevronDown size={16} />
                        </button>

                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-charcoal border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                                {['all', 'upcoming', 'current', 'past'].map(option => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setFilter(option);
                                            setIsFilterOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${filter === option ? 'text-neon-blue font-bold bg-white/5' : 'text-gray-400'}`}
                                    >
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {user?.role === 'director' && (
                        <button
                            onClick={() => navigate('/leagues/create')}
                            className="flex items-center gap-2 px-6 py-2 bg-neon-blue text-obsidian rounded-lg font-bold hover:bg-neon-cyan hover:shadow-neon-blue transition-all duration-300"
                        >
                            <Plus size={20} />
                            Create League
                        </button>
                    )}
                </div>
            </div>

            {/* AI Assistant Banner - Director Only */}
            {user?.role === 'director' && (
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-white/10 p-1">
                    <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
                    <div className="relative bg-obsidian/40 backdrop-blur-sm rounded-xl p-6 flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-neon-purple to-indigo-600 rounded-lg shadow-lg">
                            <Sparkles className="text-white" size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">AI Insights</h3>
                            <p className="text-gray-300 text-sm mb-3">
                                Based on last season's data, we recommend increasing the max teams for <strong>Fall Basketball</strong> to 24.
                            </p>
                            <button className="text-sm font-medium text-neon-purple hover:text-white transition-colors">
                                View Analysis &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Leagues Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLeagues.map((league) => (
                    <LeagueCard key={league.id} league={league} />
                ))}
                {filteredLeagues.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No leagues found for this filter.
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaguesPage;
