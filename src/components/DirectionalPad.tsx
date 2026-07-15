import { useGameStore, type Direction } from '@/store/gameStore';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DirectionalPad() {
  const setDirection = useGameStore((s) => s.setDirection);

  const handlePress = (dir: Direction) => {
    setDirection(dir);
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4 select-none">
      <button
        className="dpad-btn w-14 h-14"
        onTouchStart={(e) => {
          e.preventDefault();
          handlePress('UP');
        }}
        onMouseDown={() => handlePress('UP')}
        aria-label="向上"
      >
        <ChevronUp size={28} />
      </button>
      <div className="flex gap-2">
        <button
          className="dpad-btn w-14 h-14"
          onTouchStart={(e) => {
            e.preventDefault();
            handlePress('LEFT');
          }}
          onMouseDown={() => handlePress('LEFT')}
          aria-label="向左"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          className="dpad-btn w-14 h-14"
          onTouchStart={(e) => {
            e.preventDefault();
            handlePress('DOWN');
          }}
          onMouseDown={() => handlePress('DOWN')}
          aria-label="向下"
        >
          <ChevronDown size={28} />
        </button>
        <button
          className="dpad-btn w-14 h-14"
          onTouchStart={(e) => {
            e.preventDefault();
            handlePress('RIGHT');
          }}
          onMouseDown={() => handlePress('RIGHT')}
          aria-label="向右"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
