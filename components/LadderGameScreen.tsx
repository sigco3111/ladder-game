import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { Rung, Path } from '../types';
import { PlayIcon, EyeIcon, RefreshIcon } from './Icons';

interface LadderGameScreenProps {
  participants: string[];
  results: string[];
  ladder: Rung[];
  paths: Path[];
  onReset: () => void;
  ladderHeight: number;
}

const LADDER_WIDTH = 600;
const LADDER_PADDING = 20;
const BASE_DURATION = 8000; // 1x speed duration in ms

const PATH_COLORS = [
  '#22d3ee', // cyan-400
  '#f472b6', // pink-400
  '#a78bfa', // violet-400
  '#4ade80', // green-400
  '#facc15', // yellow-400
  '#fb923c', // orange-400
  '#60a5fa', // blue-400
  '#818cf8', // indigo-400
  '#e879f9', // fuchsia-400
  '#fb7185', // rose-400
];

const PathLine = forwardRef<SVGPathElement, { path: Path; color: string; isVisible: boolean }>(
  ({ path, color, isVisible }, ref) => {
    const d = path.points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x} ${p.y}`).join(' ');

    return (
      <path
        ref={ref}
        d={d}
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity: isVisible ? 1 : 0,
          // CSS transitions are managed directly on the element for more control,
          // preventing the "flash" of the full path before the animation.
          // The path is made visible via opacity, but it's initially "undrawn"
          // because its stroke-dashoffset is set to its length by a useEffect hook.
        }}
      />
    );
  }
);
PathLine.displayName = 'PathLine';


const LadderGameScreen: React.FC<LadderGameScreenProps> = ({ participants, results, ladder, paths, onReset, ladderHeight }) => {
  const [revealed, setRevealed] = useState<boolean[]>(Array(participants.length).fill(false));
  const [finishedAnimations, setFinishedAnimations] = useState<boolean[]>(Array(participants.length).fill(false));
  const [animating, setAnimating] = useState<boolean>(false);
  const [animationSpeed, setAnimationSpeed] = useState(1); // 1, 2, or 4

  const resultsRef = useRef<(HTMLDivElement | null)[]>([]);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<Map<number, SVGPathElement>>(new Map());
  const animationFrameId = useRef<number | null>(null);

  const duration = BASE_DURATION / animationSpeed;
  
  useEffect(() => {
    // When paths change, we initialize them for the draw animation.
    // This pre-sets them to be fully "undrawn" by setting the stroke-dashoffset
    // equal to the path length. This runs after the component has mounted and laid out.
    const initPaths = () => {
      pathRefs.current.forEach((pathElement) => {
        if (pathElement) {
          const length = pathElement.getTotalLength();
          pathElement.style.strokeDasharray = `${length}`;
          pathElement.style.strokeDashoffset = `${length}`;
          pathElement.style.transition = 'none'; // Clear any existing transitions
        }
      });
    };
    
    // Using a timeout ensures all refs are populated and SVG has been rendered.
    const timerId = setTimeout(initPaths, 0);

    // Cleanup function
    return () => {
      clearTimeout(timerId);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [paths]); // This effect re-runs whenever the ladder (and its paths) are regenerated.

  const startPathAnimation = (index: number, onComplete: () => void) => {
    const pathElement = pathRefs.current.get(index);
    const svgElement = svgRef.current;
    if (!pathElement || !svgElement) {
        onComplete(); // Call complete to not block UI if path isn't found
        return;
    }

    const length = pathElement.getTotalLength();
    // Ensure the path is ready to be animated.
    pathElement.style.strokeDasharray = `${length}`;
    pathElement.style.strokeDashoffset = `${length}`;
    pathElement.style.transition = 'none';

    let start: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const ratio = Math.min(progress / duration, 1);

      pathElement.style.strokeDashoffset = String(length * (1 - ratio));

      const currentPoint = pathElement.getPointAtLength(length * ratio);
      
      // --- Scrolling Logic ---
      const svgRect = svgElement.getBoundingClientRect();
      const pointYInViewport = svgRect.top + currentPoint.y * (svgRect.height / (ladderHeight + LADDER_PADDING * 3));
      const viewportHeight = window.innerHeight;
      const scrollTargetY = viewportHeight * 0.4; // Keep the point 40% from the top

      const scrollError = pointYInViewport - scrollTargetY;

      if (Math.abs(scrollError) > 1) { 
        window.scrollBy({
          top: scrollError,
          behavior: 'auto',
        });
      }
      // --- End Scrolling Logic ---

      if (ratio < 1) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        // Animation finished
        const resultIndex = paths[index].endIndex;
        const resultElement = resultsRef.current[resultIndex];
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        onComplete();
      }
    };
    animationFrameId.current = requestAnimationFrame(animate);
  };

  const handleReveal = (index: number) => {
    if (animating || revealed[index]) return;
    setAnimating(true);
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    // Short delay to allow React to render the opacity change
    setTimeout(() => {
      startPathAnimation(index, () => {
        // onComplete callback
        setFinishedAnimations(prev => {
          const newFinished = [...prev];
          newFinished[index] = true;
          return newFinished;
        });
        setAnimating(false);
      });
    }, 50);
  };

  const handleRevealAll = () => {
    if (animating || revealed.every(r => r)) return;
    setAnimating(true);
    const newRevealed = Array(participants.length).fill(true);
    setRevealed(newRevealed);
    
    const transitionDurationSeconds = duration / 1000;

    // Use a small timeout to ensure React has rendered the opacity change
    // before we apply the CSS transition for the drawing animation.
    setTimeout(() => {
      pathRefs.current.forEach((pathElement) => {
        if (pathElement) {
          // Paths are pre-initialized by the useEffect, but we ensure it here again for robustness.
          const length = pathElement.getTotalLength();
          pathElement.style.strokeDasharray = `${length}`;
          // Only set offset if it's not already set, to avoid flicker
          if (pathElement.style.strokeDashoffset === '') {
             pathElement.style.strokeDashoffset = `${length}`;
          }
          pathElement.style.transition = 'none';
          
          // Force a reflow to ensure the browser applies the initial state
          pathElement.getBoundingClientRect();
          
          // Now, apply the transition and set the final state
          pathElement.style.transition = `stroke-dashoffset ${transitionDurationSeconds}s ease-in-out`;
          pathElement.style.strokeDashoffset = '0';
        }
      });
    }, 50);

    setTimeout(() => {
      setAnimating(false);
      setFinishedAnimations(Array(participants.length).fill(true));
      
      if (resultsContainerRef.current) {
        resultsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, duration + 100);
  };

  const colWidth = LADDER_WIDTH / (participants.length > 1 ? participants.length - 1 : 1);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full flex justify-around">
        {participants.map((p, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="bg-slate-700 px-4 py-2 rounded-lg text-center font-bold min-w-[80px] truncate">{p}</div>
            <button
              onClick={() => handleReveal(i)}
              disabled={revealed[i] || animating}
              className="bg-cyan-500/80 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-full p-2 transition transform hover:scale-110"
              aria-label={`결과 보기 ${p}`}
            >
              <PlayIcon className="w-5 h-5"/>
            </button>
          </div>
        ))}
      </div>

      <div className="w-full max-w-[600px] mx-auto overflow-x-hidden">
        <svg ref={svgRef} viewBox={`-30 0 ${LADDER_WIDTH + 60} ${ladderHeight + LADDER_PADDING * 3}`} className="w-full">
          {/* Vertical Lines */}
          {participants.map((_, i) => (
            <line
              key={i}
              x1={i * colWidth}
              y1={LADDER_PADDING}
              x2={i * colWidth}
              y2={ladderHeight + LADDER_PADDING}
              stroke="#475569" // slate-600
              strokeWidth="3"
            />
          ))}
          {/* Rungs */}
          {ladder.map((rung, i) => (
            <line
              key={i}
              x1={rung.leftCol * colWidth}
              y1={rung.y}
              x2={(rung.leftCol + 1) * colWidth}
              y2={rung.y}
              stroke="#475569" // slate-600
              strokeWidth="3"
            />
          ))}
          {/* Animated Paths */}
          {paths.map((path, i) => (
            <PathLine
              key={i}
              ref={(el) => {
                if (el) pathRefs.current.set(i, el);
                else pathRefs.current.delete(i);
              }}
              path={path}
              color={PATH_COLORS[i % PATH_COLORS.length]}
              isVisible={revealed[i]}
            />
          ))}
        </svg>
      </div>

      <div ref={resultsContainerRef} className="w-full flex justify-around items-start">
        {results.map((result, i) => {
          const participantIndex = paths.findIndex(p => p.endIndex === i);
          const animationIsFinished = participantIndex !== -1 && finishedAnimations[participantIndex];
          const isHighlighted = animationIsFinished;
          const participantName = isHighlighted ? participants[participantIndex] : '';

          return (
            <div
              key={i}
              ref={el => { resultsRef.current[i] = el; }}
              className="flex flex-col items-center gap-6 text-center"
            >
              <div
                className={`bg-slate-700 px-4 py-3 rounded-lg font-bold min-w-[80px] w-full transition-all duration-500 ${isHighlighted ? 'bg-fuchsia-500 text-white scale-110 shadow-lg shadow-fuchsia-500/30' : ''}`}
              >
                <span className="truncate">{result}</span>
              </div>
              <div className="h-6 text-sm font-medium text-slate-300 transition-opacity duration-500" style={{ opacity: animationIsFinished ? 1 : 0 }}>
                {animationIsFinished && (
                  <span className="bg-slate-600/50 px-2 py-1 rounded-md truncate">{participantName}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 w-full max-w-md flex flex-col items-center gap-4">
        {/* Speed Controls */}
        <div className="flex justify-center items-center gap-2">
            <span className="text-sm font-medium text-slate-400">애니메이션 속도:</span>
            {[1, 2, 4].map((speed) => (
                <button
                key={speed}
                onClick={() => setAnimationSpeed(speed)}
                disabled={animating}
                className={`w-16 text-center px-3 py-1 text-sm font-bold rounded-full transition-all duration-200 ${
                    animationSpeed === speed
                    ? 'bg-cyan-500 text-white shadow-cyan-500/20 shadow-lg'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
                >
                {`${speed}x`}
                </button>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRevealAll}
              disabled={animating || revealed.every(r => r)}
              className="w-full flex-1 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center gap-2 transition"
            >
              <EyeIcon className="w-5 h-5" />
              전체 결과 보기
            </button>
            <button
              onClick={onReset}
              className="w-full flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg flex items-center justify-center gap-2 transition"
            >
              <RefreshIcon className="w-5 h-5" />
              다시하기
            </button>
        </div>
      </div>
    </div>
  );
};

export default LadderGameScreen;