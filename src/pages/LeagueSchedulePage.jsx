import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Plus, Wand2 } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';
import { generateRoundRobin } from '../utils/scheduler';

const LeagueSchedulePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { matches, teams, fetchMatches, fetchTeams, createMatch, createMatches } = useStore();

    const [isAdding, setIsAdding] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Manual Match State
    const [newMatch, setNewMatch] = useState({
        homeTeamId: '',
        awayTeamId: '',
        date: '',
        time: '',
        location: 'Main Gym'
    });

    // Auto-Generate Settings
    const [genSettings, setGenSettings] = useState({
        startDate: '',
        weeks: 4,
        days: [], // [1, 3] for Mon, Wed
        timeSlots: ['18:00', '19:00', '20:00'],
        location: 'Main Gym'
    });

    useEffect(() => {
        fetchMatches(id);
        fetchTeams(id);
    }, [id, fetchMatches, fetchTeams]);

    const handleAddMatch = async (e) => {
        e.preventDefault();
        try {
            const startTime = new Date(`${newMatch.date}T${newMatch.time}`).toISOString();
            await createMatch({
                league_id: id,
                home_team_id: newMatch.homeTeamId,
                away_team_id: newMatch.awayTeamId,
                start_time: startTime,
                location: newMatch.location,
                status: 'scheduled'
            });
            setIsAdding(false);
            setNewMatch({ homeTeamId: '', awayTeamId: '', date: '', time: '', location: 'Main Gym' });
        } catch (error) {
            alert('Error creating match: ' + error.message);
        }
    };

    const handleAutoGenerate = async () => {
        if (teams.length < 2) {
            alert("Need at least 2 teams to generate a schedule.");
            return;
        }
        if (!genSettings.startDate || genSettings.days.length === 0) {
            alert("Please select a start date and at least one day of the week.");
            return;
        }

        try {
            const generatedMatches = generateRoundRobin(teams, {
                startDate: genSettings.startDate,
                weeks: parseInt(genSettings.weeks),
                daysOfWeek: genSettings.days.map(d => parseInt(d)),
                timeSlots: genSettings.timeSlots,
                location: genSettings.location
            });

            if (generatedMatches.length === 0) {
                alert("No matches could be generated. Check your settings.");
                return;
            }

            // Add league_id to all matches
            const matchesWithLeague = generatedMatches.map(m => ({ ...m, league_id: id }));

            await createMatches(matchesWithLeague);
            setIsGenerating(false);
            alert(`Successfully generated ${matchesWithLeague.length} matches!`);
        } catch (error) {
            console.error(error);
            alert('Error generating schedule: ' + error.message);
        }
    };

    const toggleDay = (day) => {
        setGenSettings(prev => {
            const days = prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day];
            return { ...prev, days };
        });
    };

    const getTeamName = (teamId) => {
        const team = teams.find(t => t.id === teamId);
        return team ? team.name : 'Unknown Team';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    // Group matches by date
    const matchesByDate = matches.reduce((acc, match) => {
        const date = new Date(match.start_time).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(match);
        return acc;
    }, {});

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
                <h1 className="text-3xl font-bold text-white">League Schedule</h1>
                {user?.role === 'director' && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsGenerating(!isGenerating)}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <Wand2 size={20} />
                            Auto-Generate
                        </button>
                        <button
                            onClick={() => setIsAdding(!isAdding)}
                            className="flex items-center gap-2 px-4 py-2 bg-neon-blue text-obsidian font-bold rounded-lg hover:bg-neon-cyan transition-colors"
                        >
                            <Plus size={20} />
                            Add Match
                        </button>
                    </div>
                )}
            </div>

            {/* Auto-Generate Modal/Panel */}
            {isGenerating && (
                <div className="mb-8 glass-panel p-6 border border-neon-purple/30">
                    <h3 className="text-xl font-bold text-white mb-4">Auto-Generate Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                            <input
                                type="date"
                                className="w-full p-2 rounded bg-charcoal border border-white/10 text-white"
                                value={genSettings.startDate}
                                onChange={e => setGenSettings({ ...genSettings, startDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Duration (Weeks)</label>
                            <input
                                type="number"
                                className="w-full p-2 rounded bg-charcoal border border-white/10 text-white"
                                value={genSettings.weeks}
                                onChange={e => setGenSettings({ ...genSettings, weeks: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-2">Days of Week</label>
                            <div className="flex gap-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                    <button
                                        key={day}
                                        onClick={() => toggleDay(index)}
                                        className={`px-3 py-1 rounded border ${genSettings.days.includes(index)
                                            ? 'bg-neon-purple text-obsidian border-neon-purple'
                                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <button
                                onClick={handleAutoGenerate}
                                className="w-full py-2 bg-neon-purple text-white font-bold rounded hover:bg-neon-purple/80 transition-colors"
                            >
                                Generate Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Match Form */}
            {isAdding && (
                <div className="mb-8 glass-panel p-6 border border-neon-blue/30">
                    <h3 className="text-xl font-bold text-white mb-4">Schedule New Match</h3>
                    <form onSubmit={handleAddMatch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            className="p-2 rounded bg-charcoal border border-white/10 text-white"
                            value={newMatch.homeTeamId}
                            onChange={e => setNewMatch({ ...newMatch, homeTeamId: e.target.value })}
                            required
                        >
                            <option value="">Select Home Team</option>
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <select
                            className="p-2 rounded bg-charcoal border border-white/10 text-white"
                            value={newMatch.awayTeamId}
                            onChange={e => setNewMatch({ ...newMatch, awayTeamId: e.target.value })}
                            required
                        >
                            <option value="">Select Away Team</option>
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                        <input
                            type="date"
                            className="p-2 rounded bg-charcoal border border-white/10 text-white"
                            value={newMatch.date}
                            onChange={e => setNewMatch({ ...newMatch, date: e.target.value })}
                            required
                        />
                        <select
                            className="p-2 rounded bg-charcoal border border-white/10 text-white"
                            value={newMatch.time}
                            onChange={e => setNewMatch({ ...newMatch, time: e.target.value })}
                            required
                        >
                            <option value="">Select Time</option>
                            {Array.from({ length: 29 }, (_, i) => {
                                const hour = Math.floor(i / 2) + 8; // Start at 8 AM
                                const minute = i % 2 === 0 ? '00' : '30';
                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                const displayHour = hour > 12 ? hour - 12 : hour;
                                const timeValue = `${hour.toString().padStart(2, '0')}:${minute}`;
                                return (
                                    <option key={timeValue} value={timeValue}>
                                        {displayHour}:{minute} {ampm}
                                    </option>
                                );
                            })}
                        </select>
                        <input
                            type="text"
                            placeholder="Location"
                            className="p-2 rounded bg-charcoal border border-white/10 text-white"
                            value={newMatch.location}
                            onChange={e => setNewMatch({ ...newMatch, location: e.target.value })}
                            required
                        />
                        <button type="submit" className="md:col-span-2 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            Save Match
                        </button>
                    </form>
                </div>
            )}

            {/* Matches List */}
            <div className="space-y-8">
                {Object.keys(matchesByDate).length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No matches scheduled yet.
                    </div>
                ) : (
                    Object.entries(matchesByDate).sort((a, b) => new Date(a[0]) - new Date(b[0])).map(([date, dayMatches]) => (
                        <div key={date}>
                            <h3 className="text-lg font-bold text-neon-blue mb-4 sticky top-24 bg-obsidian/90 backdrop-blur py-2 z-10 border-b border-white/5">
                                {formatDate(date)}
                            </h3>
                            <div className="space-y-3">
                                {dayMatches.map(match => (
                                    <div key={match.id} className="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-white/20 transition-colors">
                                        <div className="flex items-center gap-8 flex-1">
                                            <div className="flex-1 text-right font-bold text-white text-lg">
                                                {getTeamName(match.home_team_id)}
                                            </div>
                                            <div className="px-3 py-1 bg-white/5 rounded text-sm text-gray-400 font-mono">
                                                VS
                                            </div>
                                            <div className="flex-1 text-left font-bold text-white text-lg">
                                                {getTeamName(match.away_team_id)}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 text-sm text-gray-400 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 w-full md:w-auto justify-between md:justify-end">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                {formatTime(match.start_time)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={16} />
                                                {match.location}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LeagueSchedulePage;
