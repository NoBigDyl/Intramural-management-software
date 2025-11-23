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
    { id: 't1', name: 'The Ballers', leagueId: 'l1', captainId: '22222222-2222-2222-2222-222222222222', members: ['22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333'], wins: 2, losses: 0, points: 45 },
    { id: 't2', name: 'Net Ninjas', leagueId: 'l1', captainId: '33333333-3333-3333-3333-333333333333', members: ['33333333-3333-3333-3333-333333333333'], wins: 1, losses: 1, points: 32 },
];

const initialUsers = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'Admin User', email: 'admin@university.edu', role: 'director', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Admin' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'John Doe', email: 'john@student.edu', role: 'student', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=John' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Jane Smith', email: 'jane@student.edu', role: 'student', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Jane' },
];

export const useStore = create((set, get) => ({
    // State
    currentUser: { ...initialUsers[0], xp: 500, level: 5 }, // Default to Admin for now
    users: initialUsers,

    leagues: [], // Start with empty leagues
    teams: [],
    matches: [],
    announcements: [],
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

    setCurrentUser: (user) => {
        set({ currentUser: user });
        if (user) {
            get().fetchProfile(user.id);
        }
    },

    fetchProfile: async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            // Fallback for mock users if DB record doesn't exist yet
            set((state) => ({
                currentUser: { ...state.currentUser, xp: 0, level: 1 }
            }));
        } else {
            set((state) => ({
                currentUser: { ...state.currentUser, ...data }
            }));
        }
    },

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

    deleteTeam: async (id) => {
        set({ isLoading: true });
        try {
            const { error } = await supabase
                .from('teams')
                .delete()
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                teams: state.teams.filter(t => t.id !== id),
                isLoading: false
            }));
        } catch (error) {
            console.error('Error deleting team:', error);
            set({ error: error.message, isLoading: false });
        }
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

    // Announcements Actions
    fetchAnnouncements: async () => {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching announcements:', error);
        else set({ announcements: data || [] });
    },

    createAnnouncement: async (announcement) => {
        const { data, error } = await supabase
            .from('announcements')
            .insert([announcement])
            .select()
            .single();

        if (error) throw error;
        set((state) => ({ announcements: [data, ...state.announcements] }));
    },

    createMatches: async (matchesList) => {
        const { data, error } = await supabase
            .from('matches')
            .insert(matchesList)
            .select();

        if (error) throw error;
        set((state) => ({ matches: [...state.matches, ...data] }));
    },

    updateMatch: async (id, updates) => {
        const { data, error } = await supabase
            .from('matches')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        set((state) => ({
            matches: state.matches.map(m => m.id === id ? data : m)
        }));

        // Trigger standings recalculation if the match is completed
        if (data.status === 'completed' && data.league_id) {
            get().recalculateStandings(data.league_id);
        }
    },

    recalculateStandings: async (leagueId) => {
        // 1. Fetch all completed matches for the league
        const { data: matches, error: matchError } = await supabase
            .from('matches')
            .select('*')
            .eq('league_id', leagueId)
            .eq('status', 'completed');

        if (matchError) {
            console.error('Error fetching matches for standings:', matchError);
            return;
        }

        // 2. Fetch all teams for the league
        const { data: teams, error: teamError } = await supabase
            .from('teams')
            .select('*')
            .eq('league_id', leagueId);

        if (teamError) {
            console.error('Error fetching teams for standings:', teamError);
            return;
        }

        // 3. Calculate Stats
        const teamStats = {};
        teams.forEach(team => {
            teamStats[team.id] = { wins: 0, losses: 0, draws: 0, points: 0 };
        });

        matches.forEach(match => {
            const homeId = match.home_team_id;
            const awayId = match.away_team_id;
            const homeScore = match.home_score;
            const awayScore = match.away_score;

            if (teamStats[homeId] && teamStats[awayId]) {
                if (homeScore > awayScore) {
                    teamStats[homeId].wins += 1;
                    teamStats[homeId].points += 3; // 3 pts for win
                    teamStats[awayId].losses += 1;
                } else if (awayScore > homeScore) {
                    teamStats[awayId].wins += 1;
                    teamStats[awayId].points += 3;
                    teamStats[homeId].losses += 1;
                } else {
                    teamStats[homeId].draws += 1;
                    teamStats[homeId].points += 1; // 1 pt for draw
                    teamStats[awayId].draws += 1;
                    teamStats[awayId].points += 1;
                }
            }
        });

        // 4. Update Teams in DB
        const updates = Object.keys(teamStats).map(async (teamId) => {
            return supabase
                .from('teams')
                .update(teamStats[teamId])
                .eq('id', teamId);
        });

        await Promise.all(updates);

        // 5. Refresh local teams state
        get().fetchTeams(leagueId);
    },

    addTeam: (team) => set((state) => ({
        teams: [...state.teams, { ...team, id: `t${Date.now()}` }]
    })),

    // Selectors (Helpers)
    getLeague: (id) => get().leagues.find(l => l.id === id),
    getTeamsByLeague: (leagueId) => get().teams.filter(t => t.leagueId === leagueId),
}));
