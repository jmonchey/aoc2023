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

function getMatches(card: Card): number {
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

  return matches;
}


function solve() {
  let input = fs.readFileSync('input.txt', 'utf8').trim();
  let lines = input.split('\n');
  let copies = new Map<number, number>();

  for (let i = 0; i < lines.length; i++) {
    copies.set(i, 1);
  }

  for (let i = 0; i < lines.length; i++) {
    let card = parseCard(lines[i].trim());
    let copiesOfCard = copies.get(i)!;
    let matches = getMatches(card);
    for (let j = 1; j <= matches; j++) {
      copies.set(i + j, copies.get(i + j)! + copiesOfCard);
    }
  }

  const sum = Array.from(copies.values()).reduce((sum, value) => sum + value, 0);
  console.log(sum);
}

solve();