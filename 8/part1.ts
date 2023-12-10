import * as fs from 'fs';

type Node = {
  id: string;
  left: string;
  right: string;
};

type Direction = 'left' | 'right';

function* getDirections(directions: string) {
  let index = 0;

  while (true) {
    yield directions[index] === 'L' ? 'left' : 'right';
    index = (index + 1) % directions.length;
  }
}

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

  return {
    id: results![1],
    left: results![2] ,
    right: results![3]
  };
}

function solve() {
  let input = fs.readFileSync('input.txt', 'utf8').trim();
  let parts = input.split('\n');
  let directions = getDirections(parts[0].trim());
  let nodes = parts.slice(2).map(line => line.trim());
  let nodeMap = getNodeMap(nodes);

  let nextDirection = directions.next().value;
  let nextNode = 'AAA';
  let steps = 0;

  while (nextNode !== 'ZZZ') {
    steps++; 
    if (nextDirection === 'left') {
      nextNode = nodeMap.get(nextNode)!.left;
    } else {
      nextNode = nodeMap.get(nextNode)!.right;
    }

    nextDirection = directions.next().value;
  }

  console.log(steps);
}

solve();