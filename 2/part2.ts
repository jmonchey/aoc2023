import * as fs from 'fs';

type ColourCount = {
  redCount: number,
  greenCount: number,
  blueCount: number
};

type GameCount = {
  gameId: number,
  colourCount: ColourCount
};

function getGameCount(line: string): GameCount {
  const parts = line.split(':');
  const gameId = parseInt(parts[0].split(' ')[1]);
  const maxColourCount = parts[1].split(';').map(getRoundCount).reduce(mergeMaxColours, { redCount: 0, greenCount: 0, blueCount: 0 });
  return { gameId, colourCount: maxColourCount };
}

function getRoundCount(round: string): ColourCount {
  const colourCount: ColourCount = { redCount: 0, greenCount: 0, blueCount: 0 };

  round.split(',').forEach(colourGroup => {
    const parts = colourGroup.trim().split(' ');
    const count = parseInt(parts[0]);
    const colour = parts[1];

    if (colour === 'red') {
      colourCount.redCount = count;
    } else if (colour === 'green') {
      colourCount.greenCount = count;
    } else if (colour === 'blue') {
      colourCount.blueCount = count;
    }
  });

  return colourCount;
}

function mergeMaxColours(colourCount1: ColourCount, colourCount2: ColourCount): ColourCount {
  return {
    redCount: Math.max(colourCount1.redCount, colourCount2.redCount),
    greenCount: Math.max(colourCount1.greenCount, colourCount2.greenCount),
    blueCount: Math.max(colourCount1.blueCount, colourCount2.blueCount)
  };
}

function getPower(colourCount: ColourCount): number {
  return colourCount.redCount * colourCount.greenCount * colourCount.blueCount;
}

function solve() {
  let input = fs.readFileSync('input.txt', 'utf8').trim();
  let lines = input.split('\n');
  const sum = lines.map(getGameCount)
    .map(gameCount => gameCount.colourCount)
    .map(getPower)
    .reduce((acc, power) => acc + power, 0);

  console.log(sum);
}

solve();