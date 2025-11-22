import { create } from 'zustand';

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
    { id: 'u1', name: 'Admin User', email: 'admin@university.edu', role: 'director', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
    { id: 'u2', name: 'John Doe', email: 'john@student.edu', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
    { id: 'u3', name: 'Jane Smith', email: 'jane@student.edu', role: 'student', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
];

export const useStore = create((set, get) => ({
    // State
    currentUser: initialUsers[0], // Default to Admin for now
    users: initialUsers,
    leagues: initialLeagues,
    teams: initialTeams,

    // Actions
    setCurrentUser: (user) => set({ currentUser: user }),

    addLeague: (league) => set((state) => ({
        leagues: [...state.leagues, { ...league, id: `l${Date.now()}` }]
    })),

    updateLeague: (id, updates) => set((state) => ({
        leagues: state.leagues.map(l => l.id === id ? { ...l, ...updates } : l)
    })),

    addTeam: (team) => set((state) => ({
        teams: [...state.teams, { ...team, id: `t${Date.now()}` }]
    })),

    // Selectors (Helpers)
    getLeague: (id) => get().leagues.find(l => l.id === id),
    getTeamsByLeague: (leagueId) => get().teams.filter(t => t.leagueId === leagueId),
}));
