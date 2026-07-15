import { useGameStore } from '@/store/gameStore';

export default function GameOverlay() {
  const { isRunning, isGameOver, score, highScore, startGame, resetGame } = useGameStore();

  if (isRunning && !isGameOver) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <div className="glass-panel rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
        {!isGameOver ? (
          <>
            <h1 className="font-retro text-xl mb-2 neon-text-green tracking-wider">
              贪吃蛇
            </h1>
            <p className="text-sm text-gray-400 mb-6 font-retro">
              张耕陌
            </p>
            <div className="mb-6 text-gray-300 text-sm space-y-1">
              <p>使用方向键或 WASD 控制</p>
              <p>手机上使用下方方向键</p>
            </div>
            <button
              onClick={startGame}
              className="font-retro text-sm px-6 py-3 rounded-xl border-2 neon-border-green text-[#39ff14] hover:bg-[#39ff14]/10 transition-colors"
            >
              开始游戏
            </button>
          </>
        ) : (
          <>
            <h2 className="font-retro text-xl mb-4 neon-text-pink">
              游戏结束
            </h2>
            <div className="mb-6 space-y-3">
              <div>
                <p className="text-gray-400 text-xs font-retro mb-1">最终得分</p>
                <p className="font-retro text-3xl neon-text-green">{score}</p>
              </div>
              {score >= highScore && score > 0 && (
                <p className="text-[#ff007f] font-retro text-xs animate-pulse">
                  新纪录！
                </p>
              )}
              <div>
                <p className="text-gray-400 text-xs font-retro mb-1">最高分</p>
                <p className="font-retro text-lg text-gray-300">{highScore}</p>
              </div>
            </div>
            <button
              onClick={resetGame}
              className="font-retro text-sm px-6 py-3 rounded-xl border-2 neon-border-pink text-[#ff007f] hover:bg-[#ff007f]/10 transition-colors"
            >
              再来一局
            </button>
          </>
        )}
      </div>
    </div>
  );
}
