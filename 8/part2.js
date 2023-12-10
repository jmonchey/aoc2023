"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function getNodeMap(nodes) {
    var nodeMap = new Map();
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        var parsedNode = parseNode(node);
        nodeMap.set(parsedNode.id, parsedNode);
    }
    return nodeMap;
}
function parseNode(line) {
    var regex = /(.+) = \((.+), (.+)\)/;
    var results = regex.exec(line);
    var id = results[1];
    return {
        id: id,
        leftId: results[2],
        leftNode: null,
        rightId: results[3],
        rightNode: null,
        isStartNode: id[2] === 'A',
        isEndNode: id[2] === 'Z'
    };
}
function linkNodes(nodeMap) {
    for (var _i = 0, _a = Array.from(nodeMap.values()); _i < _a.length; _i++) {
        var node = _a[_i];
        node.leftNode = nodeMap.get(node.leftId);
        node.rightNode = nodeMap.get(node.rightId);
    }
}
function moveToNextEndNode(path, pathCache) {
    var cachedPaths = pathCache.get(path.currentNode.id);
    var cachedPath = Array.from(cachedPaths.keys()).find(function (key) { return isCurrentDirections(path.directions, path.steps, key); });
    if (cachedPath) {
        console.log('Cached path from ' + path.currentNode.id + ' to ' + cachedPaths.get(cachedPath).id + ': ' + cachedPath + ' (' + cachedPath.length + ')');
        fs.appendFileSync('log.txt', 'Cached path from ' + path.currentNode.id + ' to ' + cachedPaths.get(cachedPath).id + ': ' + cachedPath + ' (' + cachedPath.length + ')' + '\n');
        path.currentNode = cachedPaths.get(cachedPath);
        path.steps += cachedPath.length;
    }
    else {
        console.log("Cache miss");
        var pathToEnd = '';
        var currentNode = path.currentNode;
        var directionIndex = path.steps % path.directions.length;
        do {
            pathToEnd += path.directions[directionIndex];
            path.steps++;
            if (path.directions[directionIndex] === 'L') {
                currentNode = currentNode.leftNode;
            }
            else {
                currentNode = currentNode.rightNode;
            }
            directionIndex = path.steps % path.directions.length;
        } while (!currentNode.isEndNode);
        cachedPaths.set(pathToEnd, currentNode);
        fs.appendFileSync('log.txt', 'Cached path from ' + path.currentNode.id + ' to ' + currentNode.id + ': ' + pathToEnd + ' (' + pathToEnd.length + ')' + '\n');
        path.currentNode = currentNode;
    }
}
function isCurrentDirections(directions, steps, directionsToCheck) {
    var directionIndex;
    for (var checkIndex = 0; checkIndex < directionsToCheck.length; checkIndex++) {
        directionIndex = (steps + checkIndex) % directions.length;
        if (directions[directionIndex] !== directionsToCheck[checkIndex]) {
            return false;
        }
    }
    return true;
}
function hasReachedEnd(paths) {
    var steps = paths[0].steps;
    return paths.every(function (path) { return path.steps === steps && path.currentNode.isEndNode; });
}
function solve() {
    var input = fs.readFileSync('input.txt', 'utf8').trim();
    var parts = input.split('\n');
    var directions = parts[0].trim();
    var nodes = parts.slice(2).map(function (line) { return line.trim(); });
    var nodeMap = getNodeMap(nodes);
    linkNodes(nodeMap);
    var pathCache = new Map();
    var startNodes = Array.from(nodeMap.values()).filter(function (node) { return node.isStartNode; });
    var paths = startNodes.map(function (node) { return ({ directions: directions, currentNode: node, steps: 0 }); });
    for (var _i = 0, _a = Array.from(nodeMap.keys()); _i < _a.length; _i++) {
        var node = _a[_i];
        var pathToEndNode = new Map();
        pathCache.set(node, pathToEndNode);
    }
    for (var _b = 0, paths_1 = paths; _b < paths_1.length; _b++) {
        var path = paths_1[_b];
        moveToNextEndNode(path, pathCache);
    }
    while (!hasReachedEnd(paths)) {
        var highestSteps = Math.max.apply(Math, paths.map(function (path) { return path.steps; }));
        console.log(highestSteps);
        for (var _c = 0, paths_2 = paths; _c < paths_2.length; _c++) {
            var path = paths_2[_c];
            while (path.steps < highestSteps) {
                moveToNextEndNode(path, pathCache);
            }
        }
    }
    console.log(paths[0].steps);
}
solve();
