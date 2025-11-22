import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Users, Calendar, LogOut, Upload, User, LayoutDashboard, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../store/index.js';

const Sidebar = () => {
    const location = useLocation();
    const { user, isRole, logout, login } = useAuth();
    const { users } = useStore();

    const directorItems = [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Leagues', path: '/leagues', icon: Trophy },
        { label: 'Teams', path: '/teams', icon: Users },
        { label: 'Import Data', path: '/import', icon: Upload },
        { label: 'Settings', path: '/settings', icon: Settings },
    ];

    const studentItems = [
        { label: 'Home', path: '/', icon: LayoutDashboard },
        { label: 'My Teams', path: '/teams', icon: Users },
        { label: 'Leagues', path: '/leagues', icon: Trophy },
        { label: 'Profile', path: '/profile', icon: User },
        { label: 'Settings', path: '/settings', icon: Settings },
    ];

    const navItems = isRole('student') ? studentItems : directorItems;

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="w-64 bg-charcoal/90 backdrop-blur-xl border-r border-white/5 h-screen flex flex-col">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-cyan rounded-xl flex items-center justify-center text-obsidian font-bold shadow-neon-blue">
                    CC
                </div>
                <span className="font-display font-bold text-xl text-white tracking-wide">Campus Clash</span>
            </div>

            <div className="px-6 mb-8">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer group">
                    <img src={user?.avatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-neon-blue/30 group-hover:border-neon-blue transition-colors" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-neon-blue capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive(item.path)
                            ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-neon-blue'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon size={20} className={isActive(item.path) ? 'animate-pulse' : ''} />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-4">
                <div className="px-4">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Dev: Switch Role</div>
                    <div className="flex gap-3">
                        {users.map(u => (
                            <button
                                key={u.id}
                                onClick={() => login(u.email)}
                                className={`w-8 h-8 rounded-full border-2 overflow-hidden transition-all ${user?.id === u.id
                                    ? 'border-neon-blue shadow-neon-blue scale-110'
                                    : 'border-transparent opacity-50 hover:opacity-100'
                                    }`}
                                title={`Switch to ${u.role}`}
                            >
                                <img src={u.avatar} alt={u.role} />
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-gray-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
