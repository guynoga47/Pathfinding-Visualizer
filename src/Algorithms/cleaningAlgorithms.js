import { astar } from "./pathfindingAlgorithms";
import Stack from "../Classes/Stack";
import {
  getGridDeepCopy,
  getNeighbors,
  getShortestPathNodesInOrder,
  fillPathGapsInNodeList,
  adjustRobotPathToBatteryAndInsertReturnPath,
  shuffle,
  adjList,
} from "./algorithmUtils";

const findEulerCircuit = (grid, map, dockingStation, availableSteps) => {
  // in order to use this euler algorithm we must check that indegree=outdegree which always true hence no need to check that
  const graph = adjList(map, [
    { attribute: "isWall", evaluation: false },
    { attribute: "isMapped", evaluation: true },
  ]);
  const currPath = new Stack();
  let currVertex = dockingStation;
  //initialize starting point to currpath
  currPath.push(dockingStation);
  let circuit = [];
  while (!currPath.isEmpty()) {
    //check if there is remaining edge
    if (graph[`${currVertex.row}-${currVertex.col}`].length > 0) {
      currPath.push(currVertex);
      currVertex = graph[`${currVertex.row}-${currVertex.col}`].pop().v;
    }
    //
    else {
      circuit.push(currVertex);
      currVertex = currPath.pop();
    }
  }

  let visitedConsideringBattery = adjustRobotPathToBatteryAndInsertReturnPath(
    circuit,
    map,
    dockingStation,
    availableSteps
  );
  return visitedConsideringBattery;
  //return circuit;
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
  // in order to use this euler algorithm we must check that indegree=outdegree which always true hence no need to check that
  const graph = adjList(map, [
    { attribute: "isWall", evaluation: false },
    { attribute: "isMapped", evaluation: true },
  ]);
  /* const undriectedAdjList = prepareAdjesencyList(graph); */
  const currPath = new Stack();
  let currNode = dockingStation;
  //initialize starting point to currpath
  currPath.push(dockingStation);
  const circuit = [];
  while (!currPath.isEmpty()) {
    //check if there is remaining edge
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
      // find and remove the opposite edge
    }
    //
    else {
      circuit.push(currNode);
      currNode = currPath.pop();
    }
  }
  const visitedNodesInOrder = [];
  fillPathGapsInNodeList(map, circuit, visitedNodesInOrder);
  return visitedNodesInOrder;
};

const canStartCleaning = (map, startingPoint) => {
  const startingPointNeighbours = getNeighbors(startingPoint, map);
  if (startingPointNeighbours.length === 0) {
    return false;
  }

  for (let i = 0; i < startingPointNeighbours.length; i++) {
    if (startingPointNeighbours[i].isMapped) {
      return true;
    }
  }
  return false;
};

const greedyCleaning = (grid, map, dockingStation, availableSteps) => {
  if (!canStartCleaning(map, dockingStation)) {
    return [];
  }
  let mapCopy = getGridDeepCopy(map);
  let currNode = mapCopy[dockingStation.row][dockingStation.col];
  let bestCandidate;
  let canContinue = true;
  let visitedNodesInOrder = [];
  visitedNodesInOrder.push(dockingStation);
  while (canContinue) {
    bestCandidate = findBestCandidate(currNode, visitedNodesInOrder, mapCopy);

    // get Astar path from best candidate to docking station and check that there are still enough steps if we add the best candidate

    let astarRes = astar(
      mapCopy,
      bestCandidate,
      mapCopy[dockingStation.row][dockingStation.col]
    );
    let shortestPathFromBestCandidateToDockingStation = getShortestPathNodesInOrder(
      astarRes[astarRes.length - 1]
    );
    let startThroughBestToDockingLength =
      shortestPathFromBestCandidateToDockingStation.length +
      visitedNodesInOrder.length;
    //if it can be added
    if (startThroughBestToDockingLength < availableSteps) {
      visitedNodesInOrder.push(bestCandidate);
      bestCandidate.visitCount++;
    }
    // else we want to return the current path
    else {
      astarRes = astar(
        mapCopy,
        currNode,
        mapCopy[dockingStation.row][dockingStation.col]
      );
      let shortestPathBackToDockingStation = getShortestPathNodesInOrder(
        astarRes[astarRes.length - 1]
      );
      visitedNodesInOrder.push(...shortestPathBackToDockingStation);
      canContinue = false;
    }
    currNode = bestCandidate;
  }

  return visitedNodesInOrder;
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
