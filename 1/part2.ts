import * as fs from 'fs';

function getCalibrationValue(line: string): number {
  let firstDigit: string | undefined = undefined;
  let lastDigit: string | undefined = undefined;

  for (let i = 0; i < line.length; i++) {
    if (firstDigit === undefined) {
      if (isDigit(line[i])) {
        firstDigit = line[i];
      } else {
        const wordDigit = getWordDigit(line.substring(i));
        if (wordDigit !== undefined) {
          firstDigit = `${wordDigit}`;
        }
      }
    }

    if (lastDigit === undefined) {
      if (isDigit(line[line.length - 1 - i])) {
        lastDigit = line[line.length - 1 - i];
      } else {
        const wordDigit = getWordDigit(line.substring(line.length - 1 - i));
        if (wordDigit !== undefined) {
          lastDigit = `${wordDigit}`;
        }
      }
    }

    if (firstDigit !== undefined && lastDigit !== undefined) {
      break;
    }
  }

  if (firstDigit === undefined) {
    firstDigit = lastDigit;
  }

  if (lastDigit === undefined) {
    lastDigit = firstDigit;
  }

  return parseInt(`${firstDigit}${lastDigit}`);
}

function isDigit(character: string) {
  const digit = parseInt(character);
  return !isNaN(digit) && isFinite(digit);
}

function getWordDigit(input: string): number | undefined {
  const wordDigits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

  for (let i = 0; i < wordDigits.length; i++) {
    if (input.startsWith(wordDigits[i])) {
      return i;
    }
  }

  return undefined;
}

function solve() {
  let input = fs.readFileSync('input.txt', 'utf8').trim();
  let lines = input.split('\n');
  let values = lines.map(getCalibrationValue);
  let answer = values.reduce((a, b) => a + b, 0);
  console.log(answer);
}

solve();