import { create } from 'zustand';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  speed: number;
  isRunning: boolean;
  isGameOver: boolean;
  particles: Particle[];
  gridSize: number;
  canvasSize: number;
  cellSize: number;

  initGame: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  setDirection: (dir: Direction) => void;
  updateGame: () => void;
  spawnFood: () => void;
  addParticles: (x: number, y: number, color: string) => void;
  updateParticles: () => void;
  setCanvasSize: (size: number) => void;
}

const GRID_COUNT = 20;
const INITIAL_SPEED = 150;

function getHighScore(): number {
  const stored = localStorage.getItem('snake-high-score');
  return stored ? parseInt(stored, 10) : 0;
}

function saveHighScore(score: number) {
  localStorage.setItem('snake-high-score', String(score));
}

function randomFood(snake: Position[]): Position {
  let pos: Position;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_COUNT),
      y: Math.floor(Math.random() * GRID_COUNT),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export const useGameStore = create<GameState>((set, get) => ({
  snake: [],
  food: { x: 10, y: 10 },
  direction: 'RIGHT',
  nextDirection: 'RIGHT',
  score: 0,
  highScore: getHighScore(),
  speed: INITIAL_SPEED,
  isRunning: false,
  isGameOver: false,
  particles: [],
  gridSize: GRID_COUNT,
  canvasSize: 600,
  cellSize: 30,

  initGame: () => {
    const startSnake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 },
    ];
    set({
      snake: startSnake,
      food: randomFood(startSnake),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      speed: INITIAL_SPEED,
      isRunning: false,
      isGameOver: false,
      particles: [],
    });
  },

  startGame: () => {
    const state = get();
    if (state.snake.length === 0) {
      get().initGame();
    }
    set({ isRunning: true, isGameOver: false });
  },

  pauseGame: () => set({ isRunning: false }),
  resumeGame: () => set({ isRunning: true }),

  resetGame: () => {
    const startSnake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 },
    ];
    set({
      snake: startSnake,
      food: randomFood(startSnake),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      score: 0,
      speed: INITIAL_SPEED,
      isRunning: true,
      isGameOver: false,
      particles: [],
    });
  },

  setDirection: (dir: Direction) => {
    const { direction, isRunning, isGameOver } = get();
    if (!isRunning || isGameOver) return;

    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };

    if (opposites[dir] !== direction) {
      set({ nextDirection: dir });
    }
  },

  updateGame: () => {
    const state = get();
    if (!state.isRunning || state.isGameOver) return;

    const newDirection = state.nextDirection;
    const head = { ...state.snake[0] };

    switch (newDirection) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= GRID_COUNT || head.y < 0 || head.y >= GRID_COUNT) {
      set({ isGameOver: true, isRunning: false });
      const currentHigh = get().highScore;
      if (state.score > currentHigh) {
        saveHighScore(state.score);
        set({ highScore: state.score });
      }
      return;
    }

    // Self collision
    if (state.snake.some((s) => s.x === head.x && s.y === head.y)) {
      set({ isGameOver: true, isRunning: false });
      const currentHigh = get().highScore;
      if (state.score > currentHigh) {
        saveHighScore(state.score);
        set({ highScore: state.score });
      }
      return;
    }

    const newSnake = [head, ...state.snake];

    // Eat food
    if (head.x === state.food.x && head.y === state.food.y) {
      const newScore = state.score + 10;
      const newSpeed = Math.max(50, INITIAL_SPEED - Math.floor(newScore / 50) * 10);
      const foodPos = randomFood(newSnake);
      get().addParticles(
        state.food.x * state.cellSize + state.cellSize / 2,
        state.food.y * state.cellSize + state.cellSize / 2,
        '#ff007f'
      );
      set({
        snake: newSnake,
        food: foodPos,
        score: newScore,
        speed: newSpeed,
        direction: newDirection,
      });
    } else {
      newSnake.pop();
      set({ snake: newSnake, direction: newDirection });
    }
  },

  spawnFood: () => {
    const { snake } = get();
    set({ food: randomFood(snake) });
  },

  addParticles: (x: number, y: number, color: string) => {
    const particles: Particle[] = [];
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
      const speed = 1 + Math.random() * 3;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 1,
        color,
        size: 2 + Math.random() * 3,
      });
    }
    set((state) => ({ particles: [...state.particles, ...particles] }));
  },

  updateParticles: () => {
    set((state) => ({
      particles: state.particles
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.03,
          vx: p.vx * 0.96,
          vy: p.vy * 0.96,
        }))
        .filter((p) => p.life > 0),
    }));
  },

  setCanvasSize: (size: number) => {
    set({
      canvasSize: size,
      cellSize: size / GRID_COUNT,
    });
  },
}));
