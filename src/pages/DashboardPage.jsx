import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Calendar, ArrowRight, Plus, Upload, Activity } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { leagues, users } = useStore();

    const stats = [
        { label: 'Active Leagues', value: leagues.filter(l => l.status === 'active').length, icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { label: 'Total Players', value: users.length, icon: Users, color: 'text-neon-blue', bg: 'bg-neon-blue/10' },
        { label: 'Games Today', value: '12', icon: Calendar, color: 'text-neon-purple', bg: 'bg-neon-purple/10' },
    ];

    const recentActivity = [
        { id: 1, user: 'Sarah Connor', action: 'registered for', target: 'Fall Basketball', time: '2 mins ago' },
        { id: 2, user: 'Mike Ross', action: 'created team', target: 'Suits & Sneakers', time: '15 mins ago' },
        { id: 3, user: 'System', action: 'generated schedule for', target: 'Flag Football', time: '1 hour ago' },
    ];

    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = React.useState(false);
    const [announcement, setAnnouncement] = React.useState({ title: '', content: '' });
    const { createAnnouncement } = useStore();
    const { user } = useAuth(); // Get current user for author_id

    const handleSendAnnouncement = async (e) => {
        e.preventDefault();
        try {
            await createAnnouncement({
                title: announcement.title,
                content: announcement.content,
                author_id: user?.id
            });
            setIsAnnouncementModalOpen(false);
            setAnnouncement({ title: '', content: '' });
            alert('Announcement sent successfully!');
        } catch (error) {
            alert('Error sending announcement: ' + error.message);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Welcome back, Director. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="glass-panel p-6 flex items-center gap-4 hover:bg-white/5 transition-colors">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <div className="text-3xl font-display font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Quick Actions */}
                    <div className="glass-panel p-8">
                        <h3 className="font-display font-bold text-xl text-white mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button
                                onClick={() => navigate('/leagues/create')}
                                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-neon-blue/10 hover:border-neon-blue/30 group transition-all text-left"
                            >
                                <div className="p-2 w-fit rounded-lg bg-neon-blue/10 text-neon-blue mb-3 group-hover:scale-110 transition-transform">
                                    <Plus size={20} />
                                </div>
                                <div className="font-bold text-white mb-1">Create League</div>
                                <div className="text-sm text-gray-400">Start a new season or tournament</div>
                            </button>

                            <button
                                onClick={() => navigate('/import')}
                                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-neon-purple/10 hover:border-neon-purple/30 group transition-all text-left"
                            >
                                <div className="p-2 w-fit rounded-lg bg-neon-purple/10 text-neon-purple mb-3 group-hover:scale-110 transition-transform">
                                    <Upload size={20} />
                                </div>
                                <div className="font-bold text-white mb-1">Import Data</div>
                                <div className="text-sm text-gray-400">Bulk upload teams or players</div>
                            </button>

                            <button
                                onClick={() => setIsAnnouncementModalOpen(true)}
                                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-neon-pink/10 hover:border-neon-pink/30 group transition-all text-left"
                            >
                                <div className="p-2 w-fit rounded-lg bg-neon-pink/10 text-neon-pink mb-3 group-hover:scale-110 transition-transform">
                                    <Activity size={20} />
                                </div>
                                <div className="font-bold text-white mb-1">Announcement</div>
                                <div className="text-sm text-gray-400">Notify all students</div>
                            </button>
                        </div>
                    </div>

                    {/* Active Leagues Preview */}
                    <div className="glass-panel p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-display font-bold text-xl text-white">Active Leagues</h3>
                            <button
                                onClick={() => navigate('/leagues')}
                                className="text-sm text-neon-blue hover:text-white transition-colors flex items-center gap-1"
                            >
                                View All <ArrowRight size={14} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {leagues.slice(0, 3).map(league => (
                                <div key={league.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-charcoal flex items-center justify-center text-lg">
                                            {league.sport === 'Basketball' ? '🏀' : league.sport === 'Soccer' ? '⚽' : '🏆'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{league.name}</div>
                                            <div className="text-xs text-gray-400">{league.season}</div>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${league.status === 'active'
                                        ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                                        : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                        }`}>
                                        {league.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Activity Feed */}
                <div className="glass-panel p-6 h-fit">
                    <h3 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-neon-blue" />
                        Live Feed
                    </h3>
                    <div className="space-y-6 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-2.5 top-2 bottom-2 w-px bg-white/10"></div>

                        {recentActivity.map((item) => (
                            <div key={item.id} className="flex gap-4 relative">
                                <div className="w-5 h-5 rounded-full bg-charcoal border-2 border-neon-blue z-10 mt-0.5"></div>
                                <div>
                                    <p className="text-sm text-gray-300">
                                        <span className="font-bold text-white">{item.user}</span> {item.action} <span className="text-neon-blue">{item.target}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Announcement Modal */}
            {isAnnouncementModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-charcoal border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsAnnouncementModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <Activity size={20} className="rotate-45" />
                        </button>

                        <h3 className="text-xl font-display font-bold text-white mb-6">Send Announcement</h3>

                        <form onSubmit={handleSendAnnouncement} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={announcement.title}
                                    onChange={e => setAnnouncement({ ...announcement, title: e.target.value })}
                                    className="w-full bg-obsidian border border-white/10 rounded-lg p-2.5 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all"
                                    placeholder="e.g. Playoffs Schedule"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                                <textarea
                                    value={announcement.content}
                                    onChange={e => setAnnouncement({ ...announcement, content: e.target.value })}
                                    className="w-full bg-obsidian border border-white/10 rounded-lg p-2.5 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all min-h-[100px]"
                                    placeholder="Type your message here..."
                                    required
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-neon-pink text-white font-bold py-3 rounded-lg hover:bg-neon-pink/80 transition-colors shadow-lg shadow-neon-pink/20"
                                >
                                    Send Announcement
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
