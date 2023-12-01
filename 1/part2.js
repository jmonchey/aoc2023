"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function getCalibrationValue(line) {
    var firstDigit = undefined;
    var lastDigit = undefined;
    for (var i = 0; i < line.length; i++) {
        if (firstDigit === undefined) {
            if (isDigit(line[i])) {
                firstDigit = line[i];
            }
            else {
                var wordDigit = getWordDigit(line.substring(i));
                if (wordDigit !== undefined) {
                    firstDigit = "".concat(wordDigit);
                }
            }
        }
        if (lastDigit === undefined) {
            if (isDigit(line[line.length - 1 - i])) {
                lastDigit = line[line.length - 1 - i];
            }
            else {
                var wordDigit = getWordDigit(line.substring(line.length - 1 - i));
                if (wordDigit !== undefined) {
                    lastDigit = "".concat(wordDigit);
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
    return parseInt("".concat(firstDigit).concat(lastDigit));
}
function isDigit(character) {
    var digit = parseInt(character);
    return !isNaN(digit) && isFinite(digit);
}
function getWordDigit(input) {
    var wordDigits = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    for (var i = 0; i < wordDigits.length; i++) {
        if (input.startsWith(wordDigits[i])) {
            return i;
        }
    }
    return undefined;
}
function solve() {
    var input = fs.readFileSync('input.txt', 'utf8').trim();
    var lines = input.split('\n');
    var values = lines.map(getCalibrationValue);
    var answer = values.reduce(function (a, b) { return a + b; }, 0);
    console.log(answer);
}
solve();
