import * as fs from 'fs';

let symbols = '';

type Position = {
  start: number;
  end: number;
};

function isDigit(character: string) {
  const digit = parseInt(character);
  return !isNaN(digit) && isFinite(digit);
}

function getConsecutiveDigits(line: string, start: number): Position | null {
  let index = start;
  start = -1;
  let end = -1;

  while (index < line.length) {
    if (isDigit(line[index])) {
      start = index;
      index++;
      break;
    }

    index++;
  }

  if (start === -1) {
    return null;
  }

  while (index < line.length) {
    if (!isDigit(line[index])) {
      end = index - 1;
      break;
    }
    index++;
  }

  if (end === -1) {
    end = line.length - 1;
  }

  return { start, end };
}

function getGearId(grid: string[], row: number, colStart: number, colEnd: number): string | null {
  if (colStart > 0) {
    if (isGear(grid, row, colStart - 1)) return `${row}_${colStart - 1}`;
    if (row > 0 && isGear(grid, row - 1, colStart - 1)) return `${row - 1}_${colStart - 1}`;
    if (row < grid.length - 1 && isGear(grid, row + 1, colStart - 1)) return `${row + 1}_${colStart - 1}`;
  }

  if (colEnd < grid[row].length - 1) {
    if (isGear(grid, row, colEnd + 1)) return `${row}_${colEnd + 1}`;
    if (row > 0 && isGear(grid, row - 1, colEnd + 1)) return `${row - 1}_${colEnd + 1}`;
    if (row < grid.length - 1 && isGear(grid, row + 1, colEnd + 1)) return `${row + 1}_${colEnd + 1}`;
  }

  for (let col = colStart; col <= colEnd; col++) {
    if (row > 0 && isGear(grid, row - 1, col)) return `${row - 1}_${col}`;
    if (row < grid.length - 1 && isGear(grid, row + 1, col)) return `${row + 1}_${col}`;
  }

  return null;
}

function isGear(grid: string[], row: number, col: number) {
  return grid[row][col] === '*';
}

function isSymbol(grid: string[], row: number, col: number): boolean {
  return !isDigit(grid[row][col]) && grid[row][col] !== '.';
}

function solve() {
  let input = fs.readFileSync('input.txt', 'utf8').trim();
  let lines = input.split('\n').map(line => line.trim());
  let sum = 0;
  let gearMap = new Map<string, number[]>;
  let gearId: string | null;

  for (let row = 0; row < lines.length; row++) {
    const line = lines[row];
    let position = getConsecutiveDigits(line, 0);

    while (position !== null) {
      gearId = getGearId(lines, row, position.start, position.end); 

      if (gearId) {
        if (!gearMap.has(gearId)) {
          gearMap.set(gearId, []);
        }

        gearMap.get(gearId)!.push(parseInt(line.substring(position.start, position.end + 1)));
      }
      position = getConsecutiveDigits(line, position.end + 1);
    }
  }

  let gears = Array.from(gearMap.values());
  for (let gear of gears) {
    if (gear.length === 2) {
      sum += gear[0] * gear[1];
    }
  } 

  console.log(sum);
}

solve();