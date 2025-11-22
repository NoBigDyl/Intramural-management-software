import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Copy, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { useStore } from '../store';

const DuplicateLeaguePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getLeague, addLeague } = useStore();
    const [sourceLeague, setSourceLeague] = useState(null);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: '',
        season: '',
        startDate: '',
        endDate: '',
        keepTeams: false,
        keepSettings: true
    });

    useEffect(() => {
        const league = getLeague(id);
        if (league) {
            setSourceLeague(league);
            setFormData(prev => ({
                ...prev,
                name: `Copy of ${league.name}`,
                season: 'Spring 2026', // Smart default
                startDate: '',
                endDate: '',
            }));
        }
    }, [id, getLeague]);

    const handleCreate = () => {
        if (!sourceLeague) return;

        const newLeague = {
            ...sourceLeague,
            ...formData,
            status: 'upcoming',
            registrationOpen: true,
            // In a real app, we might clone teams/brackets here if keepTeams is true
        };

        addLeague(newLeague);
        setStep(3); // Success step
    };

    if (!sourceLeague) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <button
                onClick={() => navigate('/leagues')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Leagues
            </button>

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Duplicate Season</h2>
                <p className="text-gray-500">Create a new season based on <strong>{sourceLeague.name}</strong>.</p>
            </div>

            {/* Steps */}
            <div className="flex items-center mb-8">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold`}>1</div>
                <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold`}>2</div>
                <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold`}>3</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Step 1: Configuration */}
                {step === 1 && (
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New League Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Season Label</label>
                                <input
                                    type="text"
                                    value={formData.season}
                                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Spring 2026"
                                />
                            </div>
                            <div>
                                {/* Spacer */}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-2">What to copy?</h4>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.keepSettings}
                                        onChange={(e) => setFormData({ ...formData, keepSettings: e.target.checked })}
                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">Settings & Rules (Divisions, Format, etc.)</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.keepTeams}
                                        onChange={(e) => setFormData({ ...formData, keepTeams: e.target.checked })}
                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">Teams & Rosters (Not recommended for new seasons)</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!formData.name || !formData.startDate}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next: Review
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Review */}
                {step === 2 && (
                    <div className="p-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex gap-3">
                            <AlertCircle className="text-yellow-600 shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-yellow-800">Double Check Details</h4>
                                <p className="text-sm text-yellow-700">You are about to create a new league. Please confirm the dates and settings.</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="text-gray-500">Source League</div>
                                <div className="col-span-2 font-medium text-gray-900">{sourceLeague.name}</div>

                                <div className="text-gray-500">New Name</div>
                                <div className="col-span-2 font-medium text-gray-900">{formData.name}</div>

                                <div className="text-gray-500">Dates</div>
                                <div className="col-span-2 font-medium text-gray-900">{formData.startDate} to {formData.endDate}</div>

                                <div className="text-gray-500">Format</div>
                                <div className="col-span-2 font-medium text-gray-900">{sourceLeague.format} (Copied)</div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                            >
                                <Copy size={16} />
                                Duplicate Season
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="p-12 text-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Season Created!</h3>
                        <p className="text-gray-500 mb-8"><strong>{formData.name}</strong> has been successfully created.</p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => navigate('/leagues')}
                                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                Return to Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/leagues')} // Ideally navigate to the new league detail
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                            >
                                View New League
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DuplicateLeaguePage;
