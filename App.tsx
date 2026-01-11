
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, LevelConfig } from './types';
import { LEVELS } from './constants';
import GameCanvas from './components/GameCanvas';
import { Button } from './components/Button';
import { getStickmanCommentary } from './services/geminiService';
import { Trophy, RotateCcw, Play, ChevronRight, MessageSquareQuote } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [commentary, setCommentary] = useState<string>("");
  const [loadingCommentary, setLoadingCommentary] = useState(false);

  const currentLevel = LEVELS[currentLevelIdx];

  const handleWin = useCallback(async () => {
    setLoadingCommentary(true);
    const msg = await getStickmanCommentary(true, currentLevel.name);
    setCommentary(msg);
    setLoadingCommentary(false);
    setGameState(GameState.LEVEL_COMPLETE);
  }, [currentLevel]);

  const handleLose = useCallback(async () => {
    setLoadingCommentary(true);
    const msg = await getStickmanCommentary(false, currentLevel.name);
    setCommentary(msg);
    setLoadingCommentary(false);
    setGameState(GameState.GAME_OVER);
  }, [currentLevel]);

  const nextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setGameState(GameState.PLAYING);
      setCommentary("");
    } else {
      setGameState(GameState.MENU);
      setCurrentLevelIdx(0);
    }
  };

  const retryLevel = () => {
    setGameState(GameState.PLAYING);
    setCommentary("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-5 flex items-center justify-center">
        <h1 className="text-[20rem] font-black transform -rotate-12 select-none">STICKMAN</h1>
      </div>

      {gameState === GameState.MENU && (
        <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
          <div className="w-32 h-32 mb-6 relative">
             <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-25" />
             <div className="relative w-full h-full bg-slate-900 rounded-3xl flex items-center justify-center border-4 border-white shadow-xl">
               <div className="w-16 h-1 bg-white absolute top-1/2 -mt-4" />
               <div className="w-12 h-12 border-4 border-white rounded-full" />
             </div>
          </div>
          <h1 className="text-6xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Stickman Siege</h1>
          <p className="text-slate-600 font-medium mb-8">Physics-based stickman destruction. Gravity is your only enemy (and the corporate blocks).</p>
          
          <div className="flex flex-col gap-4 w-full">
            <Button onClick={() => setGameState(GameState.PLAYING)} className="w-full text-xl py-6">
              <Play className="fill-current" /> START MISSION
            </Button>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map((l, idx) => (
                <button 
                  key={l.id} 
                  onClick={() => { setCurrentLevelIdx(idx); setGameState(GameState.PLAYING); }}
                  className="bg-white border-2 border-slate-200 p-4 rounded-xl hover:border-orange-500 transition-colors font-bold text-slate-700"
                >
                  {l.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === GameState.PLAYING && (
        <div className="w-full max-w-7xl flex flex-col items-center">
          <div className="mb-4 flex items-center justify-between w-full max-w-[1200px]">
            <Button variant="secondary" onClick={() => setGameState(GameState.MENU)} className="py-2 px-4 text-sm">
              BACK TO MENU
            </Button>
            <div className="flex items-center gap-4">
               <span className="font-black text-slate-800 uppercase italic">Level {currentLevelIdx + 1}: {currentLevel.name}</span>
               <Button variant="secondary" onClick={retryLevel} className="py-2 px-4 text-sm">
                 <RotateCcw size={16} /> RESET
               </Button>
            </div>
          </div>
          <GameCanvas 
            key={`${currentLevelIdx}-${Date.now()}`}
            level={currentLevel} 
            onWin={handleWin} 
            onLose={handleLose} 
          />
        </div>
      )}

      {(gameState === GameState.LEVEL_COMPLETE || gameState === GameState.GAME_OVER) && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl transform animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center text-center">
              {gameState === GameState.LEVEL_COMPLETE ? (
                <>
                  <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                    <Trophy size={48} className="text-yellow-600" />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase italic">Mission Success!</h2>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <RotateCcw size={48} className="text-red-600" />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase italic">Mission Failed!</h2>
                </>
              )}

              {loadingCommentary ? (
                <div className="h-20 flex items-center justify-center">
                  <div className="animate-pulse text-slate-400 font-bold">Stickman is thinking...</div>
                </div>
              ) : (
                commentary && (
                  <div className="bg-slate-50 p-6 rounded-2xl mb-8 relative border-2 border-slate-100 italic font-medium text-slate-700">
                    <MessageSquareQuote className="absolute -top-3 -left-3 text-orange-400 bg-white" />
                    "{commentary}"
                  </div>
                )
              )}

              <div className="flex flex-col gap-3 w-full">
                {gameState === GameState.LEVEL_COMPLETE ? (
                  <Button onClick={nextLevel} className="w-full py-4 text-lg">
                    {currentLevelIdx < LEVELS.length - 1 ? "NEXT LEVEL" : "FINISH GAME"} <ChevronRight />
                  </Button>
                ) : (
                  <Button onClick={retryLevel} className="w-full py-4 text-lg">
                    TRY AGAIN <RotateCcw size={20} />
                  </Button>
                )}
                <Button variant="secondary" onClick={() => setGameState(GameState.MENU)} className="w-full">
                  MAIN MENU
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
