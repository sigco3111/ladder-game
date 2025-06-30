
import React, { useState, useCallback } from 'react';
import { GameState, Rung, Path } from './types';
import { generateLadder, calculateAllPaths } from './services/ladderService';
import SetupScreen from './components/SetupScreen';
import LadderGameScreen from './components/LadderGameScreen';
import HelpModal from './components/HelpModal';
import { QuestionMarkCircleIcon } from './components/Icons';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Setup);
  const [participants, setParticipants] = useState<string[]>(['참가자 1', '참가자 2', '참가자 3', '참가자 4']);
  const [results, setResults] = useState<string[]>(['꽝', '꽝', '당첨', '꽝']);
  const [ladder, setLadder] = useState<Rung[]>([]);
  const [paths, setPaths] = useState<Path[]>([]);
  const [ladderHeight, setLadderHeight] = useState(400);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleGameStart = useCallback((
    initialParticipants: string[],
    initialResults: string[],
    rungCount: number,
    shuffleResults: boolean,
    shuffleParticipants: boolean
  ) => {
    let finalParticipants = [...initialParticipants];
    if (shuffleParticipants) {
      // Fisher-Yates 알고리즘을 사용하여 참가자 배열을 섞습니다.
      for (let i = finalParticipants.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [finalParticipants[i], finalParticipants[j]] = [finalParticipants[j], finalParticipants[i]];
      }
    }

    let finalResults = [...initialResults];
    if (shuffleResults) {
      // Fisher-Yates 알고리즘을 사용하여 결과 배열을 섞습니다.
      for (let i = finalResults.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [finalResults[i], finalResults[j]] = [finalResults[j], finalResults[i]];
      }
    }

    setParticipants(finalParticipants);
    setResults(finalResults);
    
    // 복잡성에 따라 동적으로 사다리 높이를 계산합니다.
    const RUNG_VERTICAL_SPACING = 40; // ladderService.ts의 값과 일치해야 합니다.
    const MIN_LADDER_HEIGHT = 400;
    const numLanes = finalParticipants.length - 1;

    let calculatedHeight = MIN_LADDER_HEIGHT;
    if (numLanes > 0) {
        // 필요한 수직 레벨 수를 추정합니다.
        // 인접하지 않는 규칙 때문에 수평 레벨에는 평균적으로 ~numLanes / 2개의 가로줄이 들어갈 수 있습니다.
        const requiredLevels = Math.ceil((2 * rungCount) / numLanes);
        // 전체 높이는 레벨 수 + 상단/하단 여백 및 시각적 공간을 위한 패딩을 기반으로 합니다.
        calculatedHeight = (requiredLevels + 4) * RUNG_VERTICAL_SPACING;
    }
    
    const finalLadderHeight = Math.max(MIN_LADDER_HEIGHT, calculatedHeight);
    setLadderHeight(finalLadderHeight);

    const ladderWidth = 600;
    const newLadder = generateLadder(finalParticipants.length, finalLadderHeight, rungCount);
    const newPaths = calculateAllPaths(finalParticipants.length, finalLadderHeight, ladderWidth, newLadder);

    setLadder(newLadder);
    setPaths(newPaths);
    setGameState(GameState.Ready);
  }, []);

  const handleReset = () => {
    setGameState(GameState.Setup);
    setLadder([]);
    setPaths([]);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-cyan-400 selection:text-slate-900">
        <div className="w-full max-w-5xl mx-auto my-8">
          <header className="text-center mb-6 relative">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500 pb-2">
              세상에서 가장 공정한 사다리게임
            </h1>
            <p className="text-slate-400">운명을 시험해 보세요!</p>
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="absolute top-0 right-0 p-2 text-slate-500 hover:text-cyan-400 transition-colors"
              aria-label="도움말 보기"
              title="왜 이 게임이 공정한지 알아보세요"
            >
              <QuestionMarkCircleIcon className="w-8 h-8" />
            </button>
          </header>

          <main className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-700/50 p-4 sm:p-6 md:p-8">
            {gameState === GameState.Setup ? (
              <SetupScreen
                initialParticipants={participants}
                initialResults={results}
                onStart={handleGameStart}
              />
            ) : (
              <LadderGameScreen
                participants={participants}
                results={results}
                ladder={ladder}
                paths={paths}
                onReset={handleReset}
                ladderHeight={ladderHeight}
              />
            )}
          </main>
        </div>
      </div>
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </>
  );
};

export default App;
