"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function parseCard(line) {
    var parts = line.split(':');
    var id = parseInt(parts[0].substring(4).trim());
    var rawNumbers = parts[1].split('|');
    var winningNumbers = getNumbers(rawNumbers[0].trim());
    var numbersInHand = getNumbers(rawNumbers[1].trim());
    return {
        id: id,
        winningNumbers: winningNumbers,
        numbersInHand: numbersInHand
    };
}
function isDigit(character) {
    var digit = parseInt(character);
    return !isNaN(digit) && isFinite(digit);
}
function getNumbers(line) {
    var startFound = false;
    var start = 0;
    var end = 0;
    var index = 0;
    var numbers = [];
    while (index < line.length) {
        if (isDigit(line[index])) {
            if (!startFound) {
                start = index;
                startFound = true;
            }
        }
        else {
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
function getPoints(card) {
    var winningNumberMap = new Map();
    var matches = 0;
    for (var _i = 0, _a = card.winningNumbers; _i < _a.length; _i++) {
        var number = _a[_i];
        winningNumberMap.set(number, 0);
    }
    for (var _b = 0, _c = card.numbersInHand; _b < _c.length; _b++) {
        var number = _c[_b];
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
    var input = fs.readFileSync('input.txt', 'utf8').trim();
    var lines = input.split('\n');
    var sum = 0;
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var card = parseCard(line.trim());
        sum += getPoints(card);
    }
    console.log(sum);
}
solve();
