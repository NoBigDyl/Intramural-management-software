import React from 'react';
import { Trophy } from 'lucide-react';

const Bracket = ({ matches, teams }) => {
    try {
        // Helper to get team name
        const getTeamName = (id) => {
            const team = teams.find(t => t.id === id);
            return team ? team.name : 'TBD';
        };

        // Group matches by date to simulate "Rounds"
        // In a real app, matches would have a 'round' or 'bracket_position' field
        const rounds = matches.reduce((acc, match) => {
            if (!match || !match.start_time) return acc;
            const date = new Date(match.start_time).toDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(match);
            return acc;
        }, {});

        const sortedDates = Object.keys(rounds).sort((a, b) => new Date(a) - new Date(b));

        if (sortedDates.length === 0) {
            return (
                <div className="text-center py-12 text-gray-500 glass-panel">
                    <Trophy size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No tournament matches scheduled yet.</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto pb-4">
                <div className="flex gap-12 min-w-max px-4">
                    {sortedDates.map((date, roundIndex) => (
                        <div key={date} className="flex flex-col justify-around gap-8 relative">
                            {/* Round Header */}
                            <div className="text-center mb-4">
                                <h4 className="text-neon-blue font-bold uppercase tracking-wider text-sm">
                                    {roundIndex === sortedDates.length - 1 && sortedDates.length > 1 ? 'Championship' : `Round ${roundIndex + 1}`}
                                </h4>
                                <span className="text-xs text-gray-500">{new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </div>

                            {/* Matches in this Round */}
                            {rounds[date].map((match, matchIndex) => (
                                <div key={match.id} className="relative group">
                                    {/* Match Card */}
                                    <div className="w-64 bg-charcoal border border-white/10 rounded-lg overflow-hidden hover:border-neon-blue/50 transition-all shadow-lg">
                                        {/* Home Team */}
                                        <div className={`flex justify-between items-center p-3 border-b border-white/5 ${match.home_score > match.away_score ? 'bg-neon-blue/10' : ''}`}>
                                            <span className={`font-bold truncate ${match.home_score > match.away_score ? 'text-neon-blue' : 'text-gray-300'}`}>
                                                {getTeamName(match.home_team_id)}
                                            </span>
                                            <span className="font-mono font-bold text-white">{match.home_score ?? '-'}</span>
                                        </div>

                                        {/* Away Team */}
                                        <div className={`flex justify-between items-center p-3 ${match.away_score > match.home_score ? 'bg-neon-blue/10' : ''}`}>
                                            <span className={`font-bold truncate ${match.away_score > match.home_score ? 'text-neon-blue' : 'text-gray-300'}`}>
                                                {getTeamName(match.away_team_id)}
                                            </span>
                                            <span className="font-mono font-bold text-white">{match.away_score ?? '-'}</span>
                                        </div>
                                    </div>

                                    {/* Connecting Lines (Visual only, simple implementation) */}
                                    {roundIndex < sortedDates.length - 1 && (
                                        <div className="absolute top-1/2 -right-12 w-12 h-px bg-white/10 hidden md:block"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Bracket Error:", error);
        return <div className="text-red-500 p-4">Error loading bracket.</div>;
    }
};

export default Bracket;
