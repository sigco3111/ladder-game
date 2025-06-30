import { Rung, Path, Point } from '../types';

const RUNG_VERTICAL_SPACING = 40;
const LADDER_PADDING = 20;

export const generateLadder = (numParticipants: number, height: number, rungCount: number): Rung[] => {
  const newRungs: Rung[] = [];
  if (numParticipants < 2) return [];

  // 1. Create a pool of all possible rung positions
  const possibleYPositions: number[] = [];
  for (let y = RUNG_VERTICAL_SPACING; y < height - RUNG_VERTICAL_SPACING; y += RUNG_VERTICAL_SPACING) {
    possibleYPositions.push(y);
  }

  const allPossibleRungLocations: { y: number; leftCol: number }[] = [];
  for (const y of possibleYPositions) {
    for (let col = 0; col < numParticipants - 1; col++) {
      allPossibleRungLocations.push({ y, leftCol: col });
    }
  }

  // 2. Shuffle the pool to ensure randomness (Fisher-Yates shuffle)
  for (let i = allPossibleRungLocations.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPossibleRungLocations[i], allPossibleRungLocations[j]] = [allPossibleRungLocations[j], allPossibleRungLocations[i]];
  }

  const occupiedSlots: { [key: string]: boolean } = {};

  // 3. Iterate through the shuffled pool and add valid rungs
  for (const rung of allPossibleRungLocations) {
    if (newRungs.length >= rungCount) {
      break;
    }

    const { y, leftCol } = rung;
    const key = `${y}-${leftCol}`;
    const keyLeft = `${y}-${leftCol - 1}`;
    const keyRight = `${y}-${leftCol + 1}`;

    // Check if the current spot or its immediate horizontal neighbors on the same level are occupied
    if (!occupiedSlots[key] && !occupiedSlots[keyLeft] && !occupiedSlots[keyRight]) {
      newRungs.push(rung);
      occupiedSlots[key] = true; // Mark this spot as occupied
    }
  }

  return newRungs;
};

const calculatePath = (
  startCol: number,
  numParticipants: number,
  height: number,
  width: number,
  rungs: Rung[]
): Path => {
  const colWidth = width / (numParticipants - 1);
  const pathPoints: Point[] = [];
  let currentCol = startCol;
  let currentY = LADDER_PADDING;
  
  const getX = (col: number) => col * colWidth;

  pathPoints.push({ x: getX(currentCol), y: 0 });
  pathPoints.push({ x: getX(currentCol), y: LADDER_PADDING });

  const sortedRungs = [...rungs].sort((a, b) => a.y - b.y);

  for (const rung of sortedRungs) {
    if (rung.y <= currentY) continue;

    pathPoints.push({ x: getX(currentCol), y: rung.y });

    if (rung.leftCol === currentCol) { // Move right
      currentCol++;
      pathPoints.push({ x: getX(currentCol), y: rung.y });
    } else if (rung.leftCol === currentCol - 1) { // Move left
      currentCol--;
      pathPoints.push({ x: getX(currentCol), y: rung.y });
    }
  }

  pathPoints.push({ x: getX(currentCol), y: height + LADDER_PADDING });
  pathPoints.push({ x: getX(currentCol), y: height + LADDER_PADDING*2 });

  return { points: pathPoints, endIndex: currentCol };
};

export const calculateAllPaths = (
  numParticipants: number,
  height: number,
  width: number,
  rungs: Rung[]
): Path[] => {
  const paths: Path[] = [];
  for (let i = 0; i < numParticipants; i++) {
    paths.push(calculatePath(i, numParticipants, height, width, rungs));
  }
  return paths;
};