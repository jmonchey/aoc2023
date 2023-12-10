
import * as fs from 'fs';

type Node = {
  id: string;
  leftId: string;
  leftNode: Node|null;
  rightId: string;
  rightNode: Node|null;
  isStartNode: boolean;
  isEndNode: boolean;
};

type Path = {
  directions: string;
  currentNode: Node;
  steps: number;
};

type PathToEndNode = Map<string, Node>; // The key is the directions to reach the node
type PathCache = Map<string, PathToEndNode>; // The key is the node id

function getNodeMap(nodes: string[]): Map<string, Node> {
  const nodeMap = new Map<string, Node>();

  for (let node of nodes) {
    let parsedNode = parseNode(node);
    nodeMap.set(parsedNode.id, parsedNode);
  }

  return nodeMap;
}

function parseNode(line: string): Node {
  let regex = /(.+) = \((.+), (.+)\)/;
  let results = regex.exec(line);
  let id = results![1];

  return {
    id,
    leftId: results![2] ,
    leftNode: null,
    rightId: results![3],
    rightNode: null,
    isStartNode: id[2] === 'A',
    isEndNode: id[2] === 'Z'
  };
}

function linkNodes(nodeMap: Map<string, Node>) {
  for (let node of Array.from(nodeMap.values())) {
    node.leftNode = nodeMap.get(node.leftId)!;
    node.rightNode = nodeMap.get(node.rightId)!;
  }
}

function moveToNextEndNode(path: Path, pathCache: PathCache) {
  let cachedPaths = pathCache.get(path.currentNode.id)!;
  let cachedPath = Array.from(cachedPaths.keys()).find(key => isCurrentDirections(path.directions, path.steps, key));

  if (cachedPath) {
    console.log('Cached path from ' + path.currentNode.id + ' to ' + cachedPaths.get(cachedPath)!.id + ': ' + cachedPath + ' (' + cachedPath.length + ')');
    fs.appendFileSync('log.txt', 'Cached path from ' + path.currentNode.id + ' to ' + cachedPaths.get(cachedPath)!.id + ': ' + cachedPath + ' (' + cachedPath.length + ')' + '\n');
    path.currentNode = cachedPaths.get(cachedPath)!;
    path.steps += cachedPath.length;
  } else {
    console.log("Cache miss");
    let pathToEnd = '';
    let currentNode = path.currentNode;
    let directionIndex = path.steps % path.directions.length;

    do {
      pathToEnd += path.directions[directionIndex];
      path.steps++;

      if (path.directions[directionIndex] === 'L') {
        currentNode = currentNode.leftNode!;
      } else {
        currentNode = currentNode.rightNode!;
      }
      directionIndex = path.steps % path.directions.length;
    } while (!currentNode.isEndNode);

    cachedPaths.set(pathToEnd, currentNode);
    fs.appendFileSync('log.txt', 'Cached path from ' + path.currentNode.id + ' to ' + currentNode.id + ': ' + pathToEnd + ' (' + pathToEnd.length + ')' + '\n');
    path.currentNode = currentNode;
  }
}

function isCurrentDirections(directions: string, steps: number, directionsToCheck: string): boolean {
  let directionIndex: number;

  for (let checkIndex = 0; checkIndex < directionsToCheck.length; checkIndex++) {
    directionIndex = (steps + checkIndex) % directions.length;
    if (directions[directionIndex] !== directionsToCheck[checkIndex]) {
      return false;
    }
  }
  return true;
}

function hasReachedEnd(paths: Path[]): boolean {
  const steps = paths[0].steps;
  return paths.every(path => path.steps === steps && path.currentNode.isEndNode);
}

function solve() {
  let input = fs.readFileSync('input.txt', 'utf8').trim();
  let parts = input.split('\n');
  let directions = parts[0].trim();
  let nodes = parts.slice(2).map(line => line.trim());
  let nodeMap = getNodeMap(nodes);
  linkNodes(nodeMap);
  let pathCache = new Map<string, PathToEndNode>();
  let startNodes = Array.from(nodeMap.values()).filter(node => node.isStartNode);
  let paths = startNodes.map(node => ({ directions, currentNode: node, steps: 0}));

  for (let node of Array.from(nodeMap.keys())) {
    let pathToEndNode = new Map<string, Node>();
    pathCache.set(node, pathToEndNode);
  }

  for (let path of paths) {
    moveToNextEndNode(path, pathCache);
  }

  while (!hasReachedEnd(paths)) {
    let highestSteps = Math.max(...paths.map(path => path.steps));
    console.log(highestSteps);
    for (let path of paths) {
      while (path.steps < highestSteps) {
        moveToNextEndNode(path, pathCache);
      }
    }
  }

  console.log(paths[0].steps);
}

solve();