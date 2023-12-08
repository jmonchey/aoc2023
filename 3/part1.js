"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var symbols = '';
function isDigit(character) {
    var digit = parseInt(character);
    return !isNaN(digit) && isFinite(digit);
}
function getConsecutiveDigits(line, start) {
    var index = start;
    start = -1;
    var end = -1;
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
    return { start: start, end: end };
}
function isPartNumber(grid, row, colStart, colEnd) {
    var changes = [[-1, 0], [-1, -1], [-1, 1], [0, -1], [0, 1], [1, 0], [1, -1], [1, 1]];
    var newRow;
    var newCol;
    for (var col = colStart; col <= colEnd; col++) {
        for (var _i = 0, changes_1 = changes; _i < changes_1.length; _i++) {
            var change = changes_1[_i];
            newRow = row + change[1];
            if (newRow < 0 || newRow >= grid.length) {
                continue;
            }
            newCol = col + change[0];
            if (newCol < 0 || newCol >= grid[row].length) {
                continue;
            }
            if (newRow === row && (newCol >= colStart && newCol <= colEnd)) {
                continue;
            }
            if (isSymbol(grid, newRow, newCol)) {
                symbols += grid[row].substring(colStart, colEnd + 1) + ': ' + grid[newRow][newCol] + '\n';
                symbols += parseInt(grid[row].substring(colStart, colEnd + 1)) + '\n\n';
                return true;
            }
        }
    }
    return false;
}
function isPartNumber2(grid, row, colStart, colEnd) {
    if (colStart > 0) {
        if (isSymbol(grid, row, colStart - 1))
            return true;
        if (row > 0 && isSymbol(grid, row - 1, colStart - 1))
            return true;
        if (row < grid.length - 1 && isSymbol(grid, row + 1, colStart - 1))
            return true;
    }
    if (colEnd < grid[row].length - 1) {
        if (isSymbol(grid, row, colEnd + 1))
            return true;
        if (row > 0 && isSymbol(grid, row - 1, colEnd + 1))
            return true;
        if (row < grid.length - 1 && isSymbol(grid, row + 1, colEnd + 1))
            return true;
    }
    for (var col = colStart; col <= colEnd; col++) {
        if (row > 0 && isSymbol(grid, row - 1, col))
            return true;
        if (row < grid.length - 1 && isSymbol(grid, row + 1, col))
            return true;
    }
    return false;
}
function isSymbol(grid, row, col) {
    return !isDigit(grid[row][col]) && grid[row][col] !== '.';
}
function solve2() {
    var input = fs.readFileSync('input.txt', 'utf8').trim();
    var lines = input.split('\n').map(function (line) { return line.trim(); });
    var sum = 0;
    var start;
    var end;
    var index;
    var startFound;
    for (var row = 0; row < lines.length; row++) {
        startFound = false;
        var line = lines[row];
        start = 0;
        end = 0;
        index = 0;
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
                    if (isPartNumber2(lines, row, start, end)) {
                        sum += parseInt(line.substring(start, end + 1));
                    }
                }
            }
            index++;
        }
        if (startFound) {
            end = line.length - 1;
            if (isPartNumber2(lines, row, start, end)) {
                sum += parseInt(line.substring(start, end + 1));
            }
        }
    }
    console.log(sum);
}
function solve() {
    var input = fs.readFileSync('input.txt', 'utf8').trim();
    var lines = input.split('\n').map(function (line) { return line.trim(); });
    var sum = 0;
    for (var row = 0; row < lines.length; row++) {
        var line = lines[row];
        var position = getConsecutiveDigits(line, 0);
        while (position !== null) {
            if (isPartNumber(lines, row, position.start, position.end)) {
                sum += parseInt(line.substring(position.start, position.end + 1));
            }
            position = getConsecutiveDigits(line, position.end + 1);
        }
    }
    console.log(sum);
}
solve();
