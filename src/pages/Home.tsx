import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import GameCanvas from '@/components/GameCanvas';
import GameOverlay from '@/components/GameOverlay';
import DirectionalPad from '@/components/DirectionalPad';

export default function Home() {
  const { score, highScore, isRunning, isGameOver, initGame, setDirection, pauseGame, resumeGame } = useGameStore();

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setDirection('RIGHT');
          break;
        case ' ':
          if (isRunning) {
            pauseGame();
          } else if (!isGameOver) {
            resumeGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setDirection, pauseGame, resumeGame, isRunning, isGameOver]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-4 py-2">
      {/* Score Board */}
      <div className="w-full max-w-[600px] flex justify-between items-center mb-3 px-1">
        <div>
          <p className="text-[10px] text-gray-500 font-retro mb-1">SCORE</p>
          <p className="font-retro text-lg neon-text-green">{score}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 font-retro mb-1">HIGH</p>
          <p className="font-retro text-lg text-gray-300">{highScore}</p>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative">
        <GameCanvas />
        <GameOverlay />
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden">
        <DirectionalPad />
      </div>

      {/* Desktop Hint */}
      <div className="hidden md:block mt-4 text-center">
        <p className="text-xs text-gray-600 font-retro">
          方向键 / WASD 移动 · 空格 暂停
        </p>
      </div>
    </div>
  );
}
