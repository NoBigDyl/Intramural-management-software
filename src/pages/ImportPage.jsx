import React, { useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../store';

const ImportPage = () => {
    const [step, setStep] = useState(1); // 1: Upload, 2: Map/Preview, 3: Success
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [importType, setImportType] = useState('teams'); // teams, players, schedule
    const { addTeam, leagues } = useStore();

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    setData(results.data);
                    setStep(2);
                }
            });
        }
    };

    const handleImport = () => {
        if (importType === 'teams') {
            let importedCount = 0;
            data.forEach((row) => {
                if (row.TeamName && row.Sport) {
                    // Find a matching league based on the sport
                    // We'll look for a league where the sport matches the CSV 'Sport' column
                    const targetLeague = leagues.find(l =>
                        l.sport.toLowerCase() === row.Sport.trim().toLowerCase()
                    );

                    if (targetLeague) {
                        addTeam({
                            name: row.TeamName,
                            leagueId: targetLeague.id,
                            captainId: 'u2', // Default placeholder captain
                            members: [],
                            wins: 0,
                            losses: 0,
                            points: 0
                        });
                        importedCount++;
                    } else {
                        console.warn(`No league found for sport: ${row.Sport}`);
                    }
                }
            });
        }
        setStep(3);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Import Data</h2>
                <p className="text-gray-500">Migrate data from your previous platform via CSV.</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center mb-8">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold`}>1</div>
                <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold`}>2</div>
                <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'} font-bold`}>3</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Step 1: Upload */}
                {step === 1 && (
                    <div className="p-12 text-center">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">What are you importing?</label>
                            <select
                                value={importType}
                                onChange={(e) => setImportType(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="teams">Teams</option>
                                <option value="players">Players</option>
                                <option value="schedule">Schedule</option>
                            </select>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:bg-gray-50 transition-colors relative">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                                    <Upload size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">Drop your CSV file here</h3>
                                <p className="text-gray-500 mt-1">or click to browse</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Preview */}
                {step === 2 && (
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{file?.name}</h3>
                                    <p className="text-sm text-gray-500">{data.length} rows found</p>
                                </div>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {data.length > 0 && Object.keys(data[0]).slice(0, 4).map(header => (
                                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.slice(0, 5).map((row, i) => (
                                        <tr key={i}>
                                            {Object.values(row).slice(0, 4).map((cell, j) => (
                                                <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data.length > 5 && (
                                <div className="px-6 py-3 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-200">
                                    ...and {data.length - 5} more rows
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImport}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                            >
                                Import Data
                                <ArrowRight size={16} />
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
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Import Successful!</h3>
                        <p className="text-gray-500 mb-8">Your data has been migrated and added to the system.</p>
                        <button
                            onClick={() => setStep(1)}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                        >
                            Import More Data
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportPage;
