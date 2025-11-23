import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// Initial Mock Data
const initialLeagues = [
    {
        id: 'l1',
        name: 'Fall 2025 Basketball',
        sport: 'Basketball',
        season: 'Fall 2025',
        status: 'active', // active, upcoming, past
        registrationOpen: true,
        startDate: '2025-10-29',
        endDate: '2025-11-27',
        maxTeams: 16,
        format: 'Single Elimination',
        divisions: ['Men\'s A', 'Men\'s B', 'Co-Rec', 'Women\'s'],
    },
    {
        id: 'l2',
        name: 'Fall 2025 Soccer',
        sport: 'Soccer',
        season: 'Fall 2025',
        status: 'active',
        registrationOpen: true,
        startDate: '2025-09-15',
        endDate: '2025-11-15',
        maxTeams: 24,
        format: 'Round Robin',
        divisions: ['Open', 'Co-Rec'],
    }
];

const initialTeams = [
    { id: 't1', name: 'The Ballers', leagueId: 'l1', captainId: 'u2', members: ['u2', 'u3'], wins: 2, losses: 0, points: 45 },
    { id: 't2', name: 'Net Ninjas', leagueId: 'l1', captainId: 'u4', members: ['u4'], wins: 1, losses: 1, points: 32 },
    { id: 't3', name: 'Goal Diggers', leagueId: 'l2', captainId: 'u5', members: ['u5'], wins: 3, losses: 0, points: 12 },
];

const initialUsers = [
    { id: 'u1', name: 'Admin User', email: 'admin@university.edu', role: 'director', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin' },
    { id: 'u2', name: 'John Doe', email: 'john@student.edu', role: 'student', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=John' },
    { id: 'u3', name: 'Jane Smith', email: 'jane@student.edu', role: 'student', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Jane' },
];

export const useStore = create((set, get) => ({
    // State
    currentUser: initialUsers[0], // Default to Admin for now
    users: initialUsers,

    leagues: [], // Start with empty leagues
    teams: [],
    matches: [],
    isLoading: false,
    error: null,

    // Actions
    fetchLeagues: async () => {
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('leagues')
                .select('*');
            if (error) throw error;
            set({ leagues: data || [], isLoading: false });
        } catch (error) {
            console.error('Error fetching leagues:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    setCurrentUser: (user) => set({ currentUser: user }),

    addLeague: async (league) => {
        set({ isLoading: true });
        try {
            const dbLeague = {
                name: league.name,
                sport: league.sport,
                season: league.season,
                status: league.status,
                registration_open: league.registrationOpen,
                start_date: league.startDate,
                end_date: league.endDate,
                max_teams: parseInt(league.maxTeams),
                format: league.type || league.format,
                divisions: league.divisions
            };

            const { data, error } = await supabase
                .from('leagues')
                .insert([dbLeague])
                .select()
                .single();

            if (error) throw error;

            set((state) => ({
                leagues: [...state.leagues, data],
                isLoading: false
            }));
        } catch (error) {
            console.error('Error adding league:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    updateLeague: async (id, updates) => {
        set({ isLoading: true });
        try {
            // Map frontend keys to DB keys if necessary
            const dbUpdates = {};
            if (updates.name) dbUpdates.name = updates.name;
            if (updates.sport) dbUpdates.sport = updates.sport;
            if (updates.season) dbUpdates.season = updates.season;
            if (updates.status) dbUpdates.status = updates.status;
            if (updates.registrationOpen !== undefined) dbUpdates.registration_open = updates.registrationOpen;
            if (updates.startDate) dbUpdates.start_date = updates.startDate;
            if (updates.endDate) dbUpdates.end_date = updates.endDate;
            if (updates.maxTeams) dbUpdates.max_teams = parseInt(updates.maxTeams);
            if (updates.type) dbUpdates.format = updates.type;
            if (updates.format) dbUpdates.format = updates.format;
            if (updates.divisions) dbUpdates.divisions = updates.divisions;

            const { data, error } = await supabase
                .from('leagues')
                .update(dbUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            set((state) => ({
                leagues: state.leagues.map(l => l.id === id ? data : l),
                isLoading: false
            }));
        } catch (error) {
            console.error('Error updating league:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    deleteLeague: async (id) => {
        set({ isLoading: true });
        try {
            const { error } = await supabase
                .from('leagues')
                .delete()
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                leagues: state.leagues.filter(l => l.id !== id),
                isLoading: false
            }));
        } catch (error) {
            console.error('Error deleting league:', error);
            set({ error: error.message, isLoading: false });
        }
    },

    // Teams Actions
    fetchTeams: async (leagueId = null) => {
        let query = supabase.from('teams').select('*');

        if (leagueId) {
            query = query.eq('league_id', leagueId);
        }

        const { data, error } = await query;

        if (error) console.error('Error fetching teams:', error);
        else set({ teams: data || [] });
    },

    createTeam: async (team) => {
        // Prepare DB object
        const dbTeam = {
            name: team.name,
            league_id: team.leagueId || team.league_id,
            captain_id: team.captainId || team.captain_id,
            members: team.members || (team.captainId ? [team.captainId] : []),
            wins: team.wins || 0,
            losses: team.losses || 0,
            draws: team.draws || 0,
            points: team.points || 0,
            division: team.division || null
        };

        const { data, error } = await supabase
            .from('teams')
            .insert([dbTeam])
            .select()
            .single();

        if (error) throw error;
        set((state) => ({ teams: [...state.teams, data] }));
    },

    // Matches Actions
    fetchMatches: async (leagueId) => {
        const { data, error } = await supabase
            .from('matches')
            .select('*')
            .eq('league_id', leagueId)
            .order('start_time', { ascending: true });

        if (error) console.error('Error fetching matches:', error);
        else set({ matches: data || [] });
    },

    createMatch: async (match) => {
        const { data, error } = await supabase
            .from('matches')
            .insert([match])
            .select()
            .single();

        if (error) throw error;
        set((state) => ({ matches: [...state.matches, data] }));
    },

    createMatches: async (matchesList) => {
        const { data, error } = await supabase
            .from('matches')
            .insert(matchesList)
            .select();

        if (error) throw error;
        set((state) => ({ matches: [...state.matches, ...data] }));
    },

    addTeam: (team) => set((state) => ({
        teams: [...state.teams, { ...team, id: `t${Date.now()}` }]
    })),

    // Selectors (Helpers)
    getLeague: (id) => get().leagues.find(l => l.id === id),
    getTeamsByLeague: (leagueId) => get().teams.filter(t => t.leagueId === leagueId),
}));
