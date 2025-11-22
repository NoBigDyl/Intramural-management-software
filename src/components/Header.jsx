import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 px-8 flex items-center justify-between z-20 sticky top-0 bg-obsidian/50 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search leagues, teams, or players..."
                        className="w-full bg-charcoal/50 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-purple rounded-full shadow-neon-purple"></span>
                </button>

                <div className="h-8 w-px bg-white/10"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple p-[2px]">
                        <img src={user?.avatar} alt="Profile" className="w-full h-full rounded-full border-2 border-obsidian" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
