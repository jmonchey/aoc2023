"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function getGameCount(line) {
    var parts = line.split(':');
    var gameId = parseInt(parts[0].split(' ')[1]);
    var maxColourCount = parts[1].split(';').map(getRoundCount).reduce(mergeMaxColours, { redCount: 0, greenCount: 0, blueCount: 0 });
    return { gameId: gameId, colourCount: maxColourCount };
}
function getRoundCount(round) {
    var colourCount = { redCount: 0, greenCount: 0, blueCount: 0 };
    round.split(',').forEach(function (colourGroup) {
        var parts = colourGroup.trim().split(' ');
        var count = parseInt(parts[0]);
        var colour = parts[1];
        if (colour === 'red') {
            colourCount.redCount = count;
        }
        else if (colour === 'green') {
            colourCount.greenCount = count;
        }
        else if (colour === 'blue') {
            colourCount.blueCount = count;
        }
    });
    return colourCount;
}
function mergeMaxColours(colourCount1, colourCount2) {
    return {
        redCount: Math.max(colourCount1.redCount, colourCount2.redCount),
        greenCount: Math.max(colourCount1.greenCount, colourCount2.greenCount),
        blueCount: Math.max(colourCount1.blueCount, colourCount2.blueCount)
    };
}
function getPower(colourCount) {
    return colourCount.redCount * colourCount.greenCount * colourCount.blueCount;
}
function solve() {
    var input = fs.readFileSync('input.txt', 'utf8').trim();
    var lines = input.split('\n');
    var sum = lines.map(getGameCount)
        .map(function (gameCount) { return gameCount.colourCount; })
        .map(getPower)
        .reduce(function (acc, power) { return acc + power; }, 0);
    console.log(sum);
}
solve();
