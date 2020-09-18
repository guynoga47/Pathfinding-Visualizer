import {
  getAllNodes,
  getNeighbors,
  MAX_DISTANCE,
  isEqual,
  resetGridSearchProperties,
} from "./algorithmUtils";

import Stack from "../Classes/Stack.js";

export const bfs = (grid, startNode, finishNode) => {
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  const visitedNodesInOrder = [];
  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.isWall) continue;
    //need to find more elegant way to work on a copy of the array, maybe move grid to 1d array instead of 2d.
    if (closestNode.distance === MAX_DISTANCE) {
      visitedNodesInOrder.forEach((node) => (node.isVisited = false));
      return visitedNodesInOrder;
    }
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    //need to find more elegant way to work on a copy of the array, maybe move grid to 1d array instead of 2d.
    if (closestNode === finishNode) {
      visitedNodesInOrder.forEach((node) => (node.isVisited = false));
      return visitedNodesInOrder;
    }
    updateUnvisitedNeighborsDistances(closestNode, grid);
  }
  return visitedNodesInOrder;
};

const sortNodesByDistance = (unvisitedNodes) => {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
};

const updateUnvisitedNeighborsDistances = (node, grid) => {
  let neighbors = getNeighbors(node, grid);
  neighbors = neighbors.filter(
    (neighbor) => !neighbor.isVisited && !neighbor.isWall
  );
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
};

export const dfs = (grid, startNode) => {
  const stack = new Stack();
  const visitedNodesInOrder = [];
  stack.push(startNode);
  while (!stack.isEmpty()) {
    const currNode = stack.pop();
    if (currNode.isWall) continue;
    if (!visitedNodesInOrder.includes(currNode))
      visitedNodesInOrder.push(currNode);
    let neighbors = getNeighbors(currNode, grid);
    // priortize by is mapped first in
    neighbors = neighbors.filter((neighbor) => !neighbor.isVisited);
    neighbors.sort((n1, n2) => {
      if (n1.isMapped) {
        return -1;
      } else {
        return 1;
      }
    });

    neighbors.forEach((neighbor) => {
      if (!visitedNodesInOrder.includes(neighbor)) {
        stack.push(neighbor);
        neighbor.previousNode = currNode;
      }
    });
  }

  return visitedNodesInOrder;
};

export const astar = (
  grid,
  startNode,
  finishNode,
  filters,
  invokedFromEditor
) => {
  if (!filters) {
    filters = [
      { attribute: "isVisited", evaluation: false },
      { attribute: "isWall", evaluation: false },
    ];
  }

  const visitedNodesInOrder = [];

  grid = invokedFromEditor ? invokedFromEditor.searchPropsResetter(grid) : grid;
  !invokedFromEditor && resetGridSearchProperties(grid);

  startNode.distance = 0;
  startNode.heuristicDistance = 0;
  const priorityQueue = [];
  priorityQueue.push(startNode);
  while (priorityQueue.length) {
    sortNodesByHeuristicDistance(priorityQueue);
    const closestNode = priorityQueue.shift();
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (isEqual(closestNode, finishNode)) {
      return visitedNodesInOrder;
    }

    let neighbors = getNeighbors(closestNode, grid);
    neighbors = neighbors.filter((neighbor) => {
      let res = true;
      filters.forEach((filter) => {
        const { attribute, evaluation } = filter;
        if (neighbor[attribute] !== evaluation) {
          res = false;
        }
      });
      return res;
    });

    for (const neighbor of neighbors) {
      //for single headed path visualization don't add weight to closestNode.distance.
      let tentativeWeightedDistance = closestNode.distance + 1; //+closestNode.weight
      if (tentativeWeightedDistance < neighbor.distance) {
        neighbor.distance = tentativeWeightedDistance;
        neighbor.heuristicDistance =
          neighbor.distance + manhattanDistance(neighbor, finishNode);
        neighbor.previousNode = closestNode;
        priorityQueue.push(neighbor);
      }
    }
  }
  console.log(
    `failed to find path from node-${startNode.row}-${startNode.col} to node-${finishNode.row}-${finishNode.col} at astar.`
  );
  return false;
};

const manhattanDistance = (node, finishNode) => {
  //|x1-x2|+|y1-y2|
  return (
    Math.abs(node.col - finishNode.col) + Math.abs(node.row - finishNode.row)
  );
};

const sortNodesByHeuristicDistance = (unvisitedNodes) => {
  unvisitedNodes.sort(
    (nodeA, nodeB) => nodeA.heuristicDistance - nodeB.heuristicDistance
  );
};
