import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../store';

const EditLeaguePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getLeague, updateLeague, error, isLoading } = useStore();
    const [submitError, setSubmitError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        sport: 'Basketball',
        startDate: '',
        endDate: '',
        maxTeams: 16,
        type: 'Single Elimination',
        division: ''
    });

    useEffect(() => {
        const league = getLeague(id);
        if (league) {
            setFormData({
                name: league.name,
                sport: league.sport,
                startDate: league.start_date || league.startDate || '',
                endDate: league.end_date || league.endDate || '',
                maxTeams: league.max_teams || league.maxTeams || 16,
                type: league.format || 'Single Elimination',
                division: (league.divisions && league.divisions[0]) || ''
            });
        } else {
            // If league not found in store (e.g. direct link), might need to fetch or redirect
            // For now, assuming store is populated or we redirect
            // navigate('/leagues'); 
        }
    }, [id, getLeague]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDivisionChange = (division) => {
        setFormData(prev => ({ ...prev, division }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        try {
            await updateLeague(id, {
                ...formData,
                divisions: [formData.division] // Backend expects an array
            });
            navigate('/leagues');
        } catch (err) {
            console.error('Update error:', err);
            setSubmitError(err.message || 'Failed to update league.');
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <button
                onClick={() => navigate('/leagues')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Leagues
            </button>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Edit League</h2>
                    <p className="text-gray-500 mt-1">Update the details for this league.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error Alert */}
                    {(error || submitError) && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                            {error || submitError}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">League Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                            <select
                                name="sport"
                                value={formData.sport}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="Basketball">Basketball</option>
                                <option value="Soccer">Soccer</option>
                                <option value="Volleyball">Volleyball</option>
                                <option value="Flag Football">Flag Football</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="Single Elimination">Single Elimination</option>
                                <option value="Double Elimination">Double Elimination</option>
                                <option value="Round Robin">Round Robin</option>
                            </select>
                        </div>
                    </div>



                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Divisions</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['Men\'s', 'Women\'s', 'Co-Rec', 'Open'].map((div) => (
                                <label key={div} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${formData.division === div ? 'bg-indigo-50 border-indigo-200' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="division"
                                        value={div}
                                        checked={formData.division === div}
                                        onChange={() => handleDivisionChange(div)}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">{div}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                required
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                required
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Teams</label>
                        <input
                            type="number"
                            name="maxTeams"
                            min="2"
                            value={formData.maxTeams}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/leagues')}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default EditLeaguePage;
