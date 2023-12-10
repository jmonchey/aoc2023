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
function getMatches(card) {
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
    return matches;
}
function solve() {
    var input = fs.readFileSync('input.txt', 'utf8').trim();
    var lines = input.split('\n');
    var copies = new Map();
    for (var i = 0; i < lines.length; i++) {
        copies.set(i, 1);
    }
    for (var i = 0; i < lines.length; i++) {
        var card = parseCard(lines[i].trim());
        var copiesOfCard = copies.get(i);
        var matches = getMatches(card);
        for (var j = 1; j <= matches; j++) {
            copies.set(i + j, copies.get(i + j) + copiesOfCard);
        }
    }
    var sum = Array.from(copies.values()).reduce(function (sum, value) { return sum + value; }, 0);
    console.log(sum);
}
solve();
