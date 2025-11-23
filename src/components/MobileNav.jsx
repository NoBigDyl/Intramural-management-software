import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Trophy, User, Settings, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MobileNav = () => {
    const location = useLocation();
    const { isRole } = useAuth();

    // Only show for students
    // if (!isRole('student')) return null;

    const studentItems = [
        { label: 'Home', path: '/', icon: LayoutDashboard },
        { label: 'Teams', path: '/teams', icon: Users },
        { label: 'Leagues', path: '/leagues', icon: Trophy },
        { label: 'Profile', path: '/profile', icon: User },
        { label: 'Settings', path: '/settings', icon: Settings },
    ];

    const directorItems = [
        { label: 'Home', path: '/', icon: LayoutDashboard },
        { label: 'Leagues', path: '/leagues', icon: Trophy },
        { label: 'Teams', path: '/teams', icon: Users },
        { label: 'Settings', path: '/settings', icon: Settings },
    ];

    const navItems = isRole('student') ? studentItems : directorItems;

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-charcoal/95 backdrop-blur-xl border-t border-white/10 z-50 pb-safe">
            <div className="flex justify-around items-center p-2">
                {navItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${isActive(item.path)
                            ? 'text-neon-blue'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <item.icon size={24} className={isActive(item.path) ? 'animate-pulse' : ''} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default MobileNav;
