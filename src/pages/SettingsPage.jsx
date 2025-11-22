import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Moon, Shield, Save } from 'lucide-react';

const SettingsPage = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-400">Manage your profile and preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Settings Navigation */}
                <div className="glass-panel p-4 h-fit space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-neon-blue/10 text-neon-blue font-medium">
                        <User size={18} />
                        Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                        <Bell size={18} />
                        Notifications
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                        <Moon size={18} />
                        Appearance
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                        <Shield size={18} />
                        Security
                    </button>
                </div>

                {/* Settings Content */}
                <div className="md:col-span-2 space-y-6">

                    {/* Profile Section */}
                    <div className="glass-panel p-8">
                        <h3 className="font-display font-bold text-xl text-white mb-6">Public Profile</h3>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="relative">
                                <img src={user?.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-charcoal shadow-lg" />
                                <button className="absolute bottom-0 right-0 p-2 bg-neon-blue rounded-full text-obsidian hover:bg-white transition-colors shadow-lg">
                                    <User size={16} />
                                </button>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-lg">{user?.name}</h4>
                                <p className="text-gray-400">{user?.role}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
                                    <input type="text" defaultValue={user?.name.split(' ')[0]} className="input-field" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                                    <input type="text" defaultValue={user?.name.split(' ')[1]} className="input-field" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                                <input type="email" defaultValue={user?.email} className="input-field" disabled />
                                <p className="text-xs text-gray-500 mt-1">Contact support to change your email.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bio</label>
                                <textarea className="input-field min-h-[100px]" placeholder="Tell us about yourself..."></textarea>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button className="flex items-center gap-2 px-6 py-2 bg-neon-blue text-obsidian rounded-lg font-bold hover:bg-neon-cyan hover:shadow-neon-blue transition-all">
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* Preferences Preview */}
                    <div className="glass-panel p-8 opacity-50 pointer-events-none">
                        <h3 className="font-display font-bold text-xl text-white mb-6">Notifications</h3>
                        <p className="text-gray-400">Coming soon...</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
