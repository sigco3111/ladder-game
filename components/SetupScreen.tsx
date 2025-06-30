import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, SparklesIcon } from './Icons';
import { saveSettings, loadSettings } from '../services/storageService';

interface SetupScreenProps {
  initialParticipants: string[];
  initialResults: string[];
  onStart: (participants: string[], results: string[], rungCount: number, shuffleResults: boolean, shuffleParticipants: boolean) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ initialParticipants, initialResults, onStart }) => {
  const [participants, setParticipants] = useState<string[]>(() => {
    return loadSettings()?.participants || initialParticipants;
  });
  const [results, setResults] = useState<string[]>(() => {
    return loadSettings()?.results || initialResults;
  });
  const [rungCount, setRungCount] = useState<number>(() => {
    return loadSettings()?.rungCount || 30;
  });
  const [shuffleResults, setShuffleResults] = useState<boolean>(() => {
    return loadSettings()?.shuffleResults ?? true;
  });
  const [shuffleParticipants, setShuffleParticipants] = useState<boolean>(() => {
    return loadSettings()?.shuffleParticipants ?? true;
  });
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    // Ensure participants and results have the same length before saving
    const minLength = Math.min(participants.length, results.length);
    saveSettings({
      participants: participants.slice(0, minLength),
      results: results.slice(0, minLength),
      rungCount,
      shuffleResults,
      shuffleParticipants,
    });
  }, [participants, results, rungCount, shuffleResults, shuffleParticipants]);

  const handleParticipantChange = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const handleResultChange = (index: number, value: string) => {
    const newResults = [...results];
    newResults[index] = value;
    setResults(newResults);
  };

  const addPlayer = () => {
    if (participants.length >= 10) return;
    const newCount = participants.length + 1;
    setParticipants([...participants, `참가자 ${newCount}`]);
    setResults([...results, '꽝']);
  };

  const removePlayer = (index: number) => {
    if (participants.length <= 2) return;
    const newParticipants = [...participants];
    newParticipants.splice(index, 1);
    setParticipants(newParticipants);
    
    const newResults = [...results];
    newResults.splice(index, 1);
    setResults(newResults);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(participants, results, rungCount, shuffleResults, shuffleParticipants);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Participants Column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-cyan-400">참가자</h2>
            <div className="flex items-center">
              <input
                id="shuffle-participants"
                type="checkbox"
                checked={shuffleParticipants}
                onChange={(e) => setShuffleParticipants(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 text-cyan-600 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2 cursor-pointer"
              />
              <label htmlFor="shuffle-participants" className="ml-2 text-sm font-medium text-slate-300 cursor-pointer select-none">
                참가자 섞기
              </label>
            </div>
          </div>
          {participants.map((p, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={p}
                onChange={(e) => handleParticipantChange(index, e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition"
                required
              />
              <button
                type="button"
                onClick={() => removePlayer(index)}
                className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                disabled={participants.length <= 2}
                aria-label={`참가자 ${index + 1} 삭제`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPlayer}
            className="w-full flex items-center justify-center gap-2 text-sm text-cyan-400 border-2 border-dashed border-slate-600 hover:border-cyan-400 hover:text-white rounded-md p-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={participants.length >= 10}
          >
            <PlusIcon className="w-4 h-4" />
            참가자 추가
          </button>
        </div>

        {/* Results Column */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-fuchsia-500">결과</h2>
            <div className="flex items-center">
              <input
                id="shuffle-results"
                type="checkbox"
                checked={shuffleResults}
                onChange={(e) => setShuffleResults(e.target.checked)}
                className="w-4 h-4 accent-fuchsia-500 text-fuchsia-600 bg-slate-700 border-slate-600 rounded focus:ring-fuchsia-500 focus:ring-2 cursor-pointer"
              />
              <label htmlFor="shuffle-results" className="ml-2 text-sm font-medium text-slate-300 cursor-pointer select-none">
                결과 섞기
              </label>
            </div>
          </div>
          {results.map((r, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                value={r}
                onChange={(e) => handleResultChange(index, e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:outline-none transition"
                required
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t border-slate-700/50">
        <label htmlFor="rungCount" className="block text-xl font-bold text-cyan-400">사다리 복잡도 (가로줄 수)</label>
        <div className="flex items-center gap-4">
            <input
                id="rungCount"
                type="range"
                min="3"
                max="400"
                value={rungCount}
                onChange={(e) => setRungCount(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <span className="font-bold text-lg text-white w-12 text-center bg-slate-700/50 border border-slate-600 rounded-md py-1">{rungCount}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-700/50">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <SparklesIcon className="w-6 h-6"/>
          게임 생성하기
        </button>
      </div>
    </form>
  );
};

export default SetupScreen;