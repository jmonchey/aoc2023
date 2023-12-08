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
function getGearId(grid, row, colStart, colEnd) {
    if (colStart > 0) {
        if (isGear(grid, row, colStart - 1))
            return "".concat(row, "_").concat(colStart - 1);
        if (row > 0 && isGear(grid, row - 1, colStart - 1))
            return "".concat(row - 1, "_").concat(colStart - 1);
        if (row < grid.length - 1 && isGear(grid, row + 1, colStart - 1))
            return "".concat(row + 1, "_").concat(colStart - 1);
    }
    if (colEnd < grid[row].length - 1) {
        if (isGear(grid, row, colEnd + 1))
            return "".concat(row, "_").concat(colEnd + 1);
        if (row > 0 && isGear(grid, row - 1, colEnd + 1))
            return "".concat(row - 1, "_").concat(colEnd + 1);
        if (row < grid.length - 1 && isGear(grid, row + 1, colEnd + 1))
            return "".concat(row + 1, "_").concat(colEnd + 1);
    }
    for (var col = colStart; col <= colEnd; col++) {
        if (row > 0 && isGear(grid, row - 1, col))
            return "".concat(row - 1, "_").concat(col);
        if (row < grid.length - 1 && isGear(grid, row + 1, col))
            return "".concat(row + 1, "_").concat(col);
    }
    return null;
}
function isGear(grid, row, col) {
    return grid[row][col] === '*';
}
function isSymbol(grid, row, col) {
    return !isDigit(grid[row][col]) && grid[row][col] !== '.';
}
function solve() {
    var input = fs.readFileSync('input.txt', 'utf8').trim();
    var lines = input.split('\n').map(function (line) { return line.trim(); });
    var sum = 0;
    var gearMap = new Map;
    var gearId;
    for (var row = 0; row < lines.length; row++) {
        var line = lines[row];
        var position = getConsecutiveDigits(line, 0);
        while (position !== null) {
            gearId = getGearId(lines, row, position.start, position.end);
            if (gearId) {
                if (!gearMap.has(gearId)) {
                    gearMap.set(gearId, []);
                }
                gearMap.get(gearId).push(parseInt(line.substring(position.start, position.end + 1)));
            }
            position = getConsecutiveDigits(line, position.end + 1);
        }
    }
    var gears = Array.from(gearMap.values());
    for (var _i = 0, gears_1 = gears; _i < gears_1.length; _i++) {
        var gear = gears_1[_i];
        if (gear.length === 2) {
            sum += gear[0] * gear[1];
        }
    }
    console.log(sum);
}
solve();
