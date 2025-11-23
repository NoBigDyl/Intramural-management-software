import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';
import { FileText, Download, ExternalLink, Plus, X, Search, Shield, Book, File } from 'lucide-react';

const ResourcesPage = () => {
    const { resources, fetchResources, createResource } = useStore();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    // Form State
    const [newResource, setNewResource] = useState({
        title: '',
        url: '',
        description: '',
        category: 'Rules'
    });

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const handleAddResource = async (e) => {
        e.preventDefault();
        if (!newResource.title || !newResource.url) return;

        await createResource(newResource);
        setIsModalOpen(false);
        setNewResource({ title: '', url: '', description: '', category: 'Rules' });
    };

    const categories = ['All', 'Rules', 'Forms', 'Safety', 'Other'];

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = activeCategory === 'All' || resource.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const getIconForCategory = (category) => {
        switch (category) {
            case 'Rules': return <Book size={20} className="text-neon-blue" />;
            case 'Safety': return <Shield size={20} className="text-red-400" />;
            case 'Forms': return <FileText size={20} className="text-yellow-400" />;
            default: return <File size={20} className="text-gray-400" />;
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Resources</h1>
                    <p className="text-gray-400">Access important documents, rules, and forms.</p>
                </div>
                {user?.role === 'director' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-neon-blue text-obsidian rounded-lg font-bold hover:bg-neon-cyan transition-colors"
                    >
                        <Plus size={20} />
                        Add Resource
                    </button>
                )}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${activeCategory === cat
                                ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 transition-all"
                    />
                </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map(resource => (
                    <div key={resource.id} className="glass-panel p-6 flex items-start gap-4 group hover:border-neon-blue/30 transition-all">
                        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                            {getIconForCategory(resource.category)}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-white text-lg mb-1 group-hover:text-neon-blue transition-colors">
                                    {resource.title}
                                </h3>
                                <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded uppercase tracking-wider">
                                    {resource.category}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                {resource.description || 'No description provided.'}
                            </p>
                            <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-bold text-neon-blue hover:text-white transition-colors"
                            >
                                <Download size={16} />
                                Download / View
                            </a>
                        </div>
                    </div>
                ))}
                {filteredResources.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No resources found matching your criteria.
                    </div>
                )}
            </div>

            {/* Add Resource Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-charcoal border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-xl font-bold text-white mb-6">Add New Resource</h2>

                        <form onSubmit={handleAddResource} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newResource.title}
                                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue/50 focus:outline-none"
                                    placeholder="e.g., 2025 Rulebook"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">URL</label>
                                <input
                                    type="url"
                                    required
                                    value={newResource.url}
                                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue/50 focus:outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Category</label>
                                <select
                                    value={newResource.category}
                                    onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue/50 focus:outline-none"
                                >
                                    <option value="Rules">Rules</option>
                                    <option value="Forms">Forms</option>
                                    <option value="Safety">Safety</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea
                                    value={newResource.description}
                                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-neon-blue/50 focus:outline-none h-24 resize-none"
                                    placeholder="Brief description..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-neon-blue text-obsidian font-bold rounded-lg hover:bg-neon-cyan transition-colors mt-2"
                            >
                                Add Resource
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourcesPage;
