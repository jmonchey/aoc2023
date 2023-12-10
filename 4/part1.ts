import * as fs from 'fs';

type Card = {
  id: number;
  winningNumbers: number[];
  numbersInHand: number[];
};

function parseCard(line: string): Card {
  let parts = line.split(':');
  let id = parseInt(parts[0].substring(4).trim());
  const rawNumbers = parts[1].split('|');
  let winningNumbers = getNumbers(rawNumbers[0].trim());
  let numbersInHand = getNumbers(rawNumbers[1].trim());
  return {
    id,
    winningNumbers,
    numbersInHand
  };
}

function isDigit(character: string) {
  const digit = parseInt(character);
  return !isNaN(digit) && isFinite(digit);
}

function getNumbers(line: string): number[] {
  let startFound = false;
  let start = 0;
  let end = 0;
  let index = 0;
  let numbers: number[] = [];

  while (index < line.length) {
    if (isDigit(line[index])) {
      if (!startFound) {
        start = index;
        startFound = true;
      }
    } else {
      if (startFound) {
        end = index - 1;
        startFound = false;
        numbers.push(parseInt(line.substring(start, end + 1)));
      }
    }
    index++;
  }

  if (startFound) {
    end = line.length - 1;
    numbers.push(parseInt(line.substring(start, end + 1)));
  }

  return numbers;
}

function getPoints(card: Card): number {
  let winningNumberMap = new Map<number, number>();
  let matches = 0;

  for (let number of card.winningNumbers) {
    winningNumberMap.set(number, 0);
  }

  for (let number of card.numbersInHand) {
    if (winningNumberMap.has(number)) {
      matches++;
    }
  }

  if (matches === 0) {
    return 0;
  }

  return 1 * Math.pow(2, matches - 1);
}


function solve() {
  let input = fs.readFileSync('input.txt', 'utf8').trim();
  let lines = input.split('\n');
  let sum = 0;

  for (let line of lines) {
    let card = parseCard(line.trim());
    sum += getPoints(card);
  }

  console.log(sum);
}

solve();