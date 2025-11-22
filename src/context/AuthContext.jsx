import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStore } from '../store';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { currentUser, setCurrentUser, users } = useStore();
    // We'll simulate "switching roles" by just switching the current user for this MVP
    // In a real app, a user might have multiple roles, but here we'll just swap identities.

    const login = (email) => {
        const user = users.find(u => u.email === email);
        if (user) {
            setCurrentUser(user);
        }
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const hasPermission = (permission) => {
        if (!currentUser) return false;

        // Simple role hierarchy
        const rolePermissions = {
            director: ['all'],
            ga: ['manage_games', 'record_stats', 'check_in'],
            referee: ['record_stats', 'check_in'],
            student: ['view_leagues', 'join_team', 'create_team']
        };

        const userPerms = rolePermissions[currentUser.role] || [];
        return userPerms.includes('all') || userPerms.includes(permission);
    };

    const isRole = (role) => currentUser?.role === role;

    return (
        <AuthContext.Provider value={{ user: currentUser, login, logout, hasPermission, isRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
