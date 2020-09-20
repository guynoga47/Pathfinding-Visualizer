import { astar } from "./pathfindingAlgorithms";
import Stack from "../Classes/Stack";
import {
  getNeighbors,
  getShortestPathNodesInOrder,
  fillPathGapsInNodeList,
  adjustRobotPathToBatteryAndInsertReturnPath,
  shuffle,
  adjList,
} from "./algorithmUtils";

const findEulerCircuit = (grid, map, dockingStation, availableSteps) => {
  const graph = adjList(map, [
    { attribute: "isWall", evaluation: false },
    { attribute: "isMapped", evaluation: true },
  ]);
  const currPath = new Stack();
  let currVertex = dockingStation;

  currPath.push(dockingStation);
  let circuit = [];
  while (!currPath.isEmpty()) {
    if (graph[`${currVertex.row}-${currVertex.col}`].length > 0) {
      currPath.push(currVertex);
      currVertex = graph[`${currVertex.row}-${currVertex.col}`].pop().v;
    } else {
      circuit.push(currVertex);
      currVertex = currPath.pop();
    }
  }

  let robotPath = adjustRobotPathToBatteryAndInsertReturnPath(
    circuit,
    map,
    dockingStation,
    availableSteps
  );
  return robotPath;
};

/* const prepareAdjesencyList = (adjList) => {
  for (let key in adjList) {
    if (adjList[key].length % 2 === 1) {
      // if odd number of neighbours
      // find a neighbour that has odd number of neighbours and add the opposit edge
      for (let i = 0; i < adjList[key].length; i++) {
        if (
          adjList[`${adjList[key][i].v.row}-${adjList[key][i].v.col}`].length %
            2 ===
          1
        ) {
          let edge = {
            u: adjList[key][i].v,
            v: adjList[key][i].u,
            w: getWeight(adjList[key][i].v, adjList[key][i].u),
          };
          adjList[key].push(adjList[key][i]);
          adjList[`${adjList[key][i].v.row}-${adjList[key][i].v.col}`].push(
            edge
          );
        }
      }
    }
  }
  return adjList;
}; */

const findEulerCircuitUndirected = (
  grid,
  map,
  dockingStation,
  availableSteps
) => {
  const graph = adjList(map, [
    { attribute: "isWall", evaluation: false },
    { attribute: "isMapped", evaluation: true },
  ]);
  const currPath = new Stack();
  let currNode = dockingStation;
  currPath.push(dockingStation);
  const circuit = [];
  while (!currPath.isEmpty()) {
    const { row, col } = currNode;
    if (graph[`${row}-${col}`].length) {
      currPath.push(currNode);
      let topVertexIndex = graph[`${row}-${col}`].length - 1;
      let topVertex = graph[`${row}-${col}`][topVertexIndex].v;
      let topVertexNeighbours = graph[`${topVertex.row}-${topVertex.col}`];
      const newTopVertexNeighbors = [];
      for (let i = 0; i < topVertexNeighbours.length; i++) {
        if (topVertexNeighbours[i].v !== currNode) {
          newTopVertexNeighbors.push(topVertexNeighbours[i]);
        }
        graph[`${topVertex.row}-${topVertex.col}`] = newTopVertexNeighbors;
      }
      currNode = graph[`${row}-${col}`].pop().v;
    } else {
      circuit.push(currNode);
      currNode = currPath.pop();
    }
  }
  const robotPath = [];
  fillPathGapsInNodeList(map, circuit, robotPath);
  return robotPath;
};

const greedyCleaning = (grid, map, dockingStation, availableSteps) => {
  const isCleaningPossible = (map, startingPoint) => {
    const neighbors = getNeighbors(startingPoint, map);
    return (
      neighbors.length && neighbors.filter((node) => node.isMapped).length > 0
    );
  };
  const findBestCandidate = (currNode, visitedNodesInOrder, mapCopy) => {
    const getLeastVisitedNode = (nodes) => {
      let nodesByVisitCount = nodes.sort(
        (n1, n2) => n1.visitCount - n2.visitCount
      );
      return nodesByVisitCount[0];
    };
    let currNeighbours = getNeighbors(currNode, mapCopy).filter(
      (neighbour) => neighbour.isMapped
    );
    shuffle(currNeighbours);
    const sortedNeighboursByWeight = currNeighbours.sort(
      (neigbour1, neigbour2) => neigbour2.dust - neigbour1.dust
    );
    for (let i = 0; i < sortedNeighboursByWeight.length - 1; i++) {
      if (!visitedNodesInOrder.includes(sortedNeighboursByWeight[i])) {
        return sortedNeighboursByWeight[i];
      }
    }
    return getLeastVisitedNode(currNeighbours);
  };

  if (!isCleaningPossible(map, dockingStation)) {
    return [];
  }

  let currNode = map[dockingStation.row][dockingStation.col];
  const robotPath = [];
  robotPath.push(dockingStation);

  while (true) {
    const bestCandidate = findBestCandidate(currNode, robotPath, map);
    let astarRes = astar(
      map,
      bestCandidate,
      map[dockingStation.row][dockingStation.col]
    );
    const shortestPathFromBestCandidateToDockingStation = getShortestPathNodesInOrder(
      astarRes[astarRes.length - 1]
    );
    const startThroughBestToDockingLength =
      shortestPathFromBestCandidateToDockingStation.length + robotPath.length;

    if (startThroughBestToDockingLength < availableSteps) {
      robotPath.push(bestCandidate);
      bestCandidate.visitCount++;
    } else {
      astarRes = astar(
        map,
        currNode,
        map[dockingStation.row][dockingStation.col]
      );
      const shortestPathBackToDockingStation = getShortestPathNodesInOrder(
        astarRes[astarRes.length - 1]
      );
      robotPath.push(...shortestPathBackToDockingStation);
      break;
    }
    currNode = bestCandidate;
  }

  return robotPath;
};

export const data = [
  {
    name: "Greedy Cleaning",
    shortened: "Greedy",
    func: greedyCleaning,
  },
  {
    name: "Euler undirected Cleaning",
    shortened: "Un-Directed-Euler",
    func: findEulerCircuitUndirected,
  },
  {
    name: "Euler Cleaning",
    shortened: "Euler",
    func: findEulerCircuit,
  },
];
