import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef(0);

  const {
    snake,
    food,
    particles,
    canvasSize,
    cellSize,
    isRunning,
    isGameOver,
    speed,
    updateGame,
    updateParticles,
    setCanvasSize,
  } = useGameStore();

  // Resize canvas responsively
  useEffect(() => {
    const handleResize = () => {
      const maxSize = Math.min(window.innerWidth - 32, 600);
      const size = Math.max(280, maxSize);
      setCanvasSize(size);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setCanvasSize]);

  // Game loop
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;

      if (delta >= speed) {
        updateGame();
        lastTimeRef.current = timestamp;
      }

      updateParticles();
      animFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [speed, updateGame, updateParticles]
  );

  useEffect(() => {
    if (isRunning && !isGameOver) {
      lastTimeRef.current = 0;
      animFrameRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isRunning, isGameOver, gameLoop]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Clear
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid
    ctx.strokeStyle = 'rgba(57, 255, 20, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 20; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvasSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvasSize, i * cellSize);
      ctx.stroke();
    }

    // Draw food with glow
    ctx.save();
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ff007f';
    const foodX = food.x * cellSize + cellSize * 0.1;
    const foodY = food.y * cellSize + cellSize * 0.1;
    const foodSize = cellSize * 0.8;
    ctx.beginPath();
    ctx.roundRect(foodX, foodY, foodSize, foodSize, cellSize * 0.2);
    ctx.fill();
    ctx.restore();

    // Draw snake
    snake.forEach((segment, index) => {
      const segX = segment.x * cellSize + cellSize * 0.05;
      const segY = segment.y * cellSize + cellSize * 0.05;
      const segSize = cellSize * 0.9;

      ctx.save();
      if (index === 0) {
        // Head
        ctx.shadowColor = '#39ff14';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#39ff14';
      } else {
        // Body
        ctx.shadowColor = 'rgba(57, 255, 20, 0.4)';
        ctx.shadowBlur = 8;
        const opacity = Math.max(0.4, 1 - index * 0.03);
        ctx.fillStyle = `rgba(57, 255, 20, ${opacity})`;
      }
      ctx.beginPath();
      ctx.roundRect(segX, segY, segSize, segSize, cellSize * 0.25);
      ctx.fill();
      ctx.restore();
    });

    // Draw particles
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Border glow
    ctx.save();
    ctx.strokeStyle = 'rgba(57, 255, 20, 0.3)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur = 10;
    ctx.strokeRect(0, 0, canvasSize, canvasSize);
    ctx.restore();
  }, [snake, food, particles, canvasSize, cellSize]);

  return (
    <div ref={containerRef} className="relative flex justify-center items-center">
      <canvas
        ref={canvasRef}
        style={{ width: canvasSize, height: canvasSize }}
        className="rounded-lg"
      />
    </div>
  );
}
