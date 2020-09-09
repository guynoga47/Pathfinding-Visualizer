import {
  astar
} from "./pathfindingAlgorithms";
import Stack from "../Classes/Stack";
import {
  getAllNodes,
  getGridDeepCopy,
  getNeighbors,
  getShortestPathNodesInOrder,
  resetGridSearchProperties,
  isNeighbors,
  isValidCoordinates,
  fillPathGapsInNodeList,
  removeDuplicateNodes,
  shuffle,
} from "./algorithmUtils";
import * as mappingAlgorithms from "./mappingAlgorithms";




const findEulerCircuit = (grid, map, dockingStation, availableSteps) => {
  // in order to use this euler algorithm we must check that indegree=outdegree which always true hence no need to check that
  const graphAdjList = adjList(grid, map, dockingStation, availableSteps);
  const currPath = new Stack();
  let currVertex = dockingStation;
  let nextVertex;
  //initialize starting point to currpath
  currPath.push(dockingStation);
  let circuit = [];
  while (!currPath.isEmpty()) {
    //check if there is remaining edge
    if (graphAdjList[`${currVertex.row}-${currVertex.col}`].length > 0) {
      currPath.push(currVertex);
      currVertex = graphAdjList[`${currVertex.row}-${currVertex.col}`].pop().v;
    }
    //
    else {
      circuit.push(currVertex);
      currVertex = currPath.pop();
    }
  }

  let visitedConsideringBattery = mappingAlgorithms.adjustRobotPathToBatteryAndInsertReturnPath(
    circuit,
    map,
    dockingStation,
    availableSteps
  );
  return visitedConsideringBattery;
  //return circuit;
};

const prepareAdjesencyList = (adjList) => {
  for (let key in adjList) {
    if (adjList[key].length % 2 === 1) {
      // if odd number of neighbours
      // find a neighbour that has odd number of neighbours and add the opposit edge
      for (let i = 0; i < adjList[key].length; i++) {
        if (adjList[`${adjList[key][i].v.row}-${adjList[key][i].v.col}`].length % 2 === 1) {
          let edge = {
            u: adjList[key][i].v,
            v: adjList[key][i].u,
            w: getWeight(adjList[key][i].v, adjList[key][i].u),
          };
          adjList[key].push(adjList[key][i]);
          adjList[`${adjList[key][i].v.row}-${adjList[key][i].v.col}`].push(edge);
        }
      }
    }
  }
  return adjList;
};

const findEulerCircuitUndirected = (grid, map, dockingStation, availableSteps) => {
  // in order to use this euler algorithm we must check that indegree=outdegree which always true hence no need to check that
  const graphAdjList = adjList(grid, map, dockingStation, availableSteps);
  const undriectedAdjList = prepareAdjesencyList(graphAdjList);
  const currPath = new Stack();
  let currVertex = dockingStation;
  let nextVertex;
  //initialize starting point to currpath
  currPath.push(dockingStation);
  let circuit = [];
  while (!currPath.isEmpty()) {
    //check if there is remaining edge
    if (graphAdjList[`${currVertex.row}-${currVertex.col}`].length > 0) {
      currPath.push(currVertex);
      let topVertexIndex = graphAdjList[`${currVertex.row}-${currVertex.col}`].length - 1;
      let topVertex = graphAdjList[`${currVertex.row}-${currVertex.col}`][topVertexIndex].v;
      let topVertexNeighbours = graphAdjList[`${topVertex.row}-${topVertex.col}`];
      let newTopVertexNeighbours = [];
      for (let i = 0; i < topVertexNeighbours.length; i++) {
        if (topVertexNeighbours[i].v !== currVertex) {
          newTopVertexNeighbours.push(topVertexNeighbours[i]);
        }
        graphAdjList[`${topVertex.row}-${topVertex.col}`] = newTopVertexNeighbours;
      }
      currVertex = graphAdjList[`${currVertex.row}-${currVertex.col}`].pop().v;
      // find and remove the opposite edge
    }
    //
    else {
      circuit.push(currVertex);
      currVertex = currPath.pop();
    }
  }
  const visitedNodesInOrder = [];
  fillPathGapsInNodeList(map, circuit, visitedNodesInOrder);
  return visitedNodesInOrder;

};

const adjList = (grid, map, dockingStation, availableSteps) => {
  const adjList = {};
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j].isMapped) {
        const node = map[i][j];
        const edges = [];
        const neighbors = getNeighbors(node, map).filter(
          (neighbor) => (!neighbor.isWall) && (neighbor.isMapped)
        );
        neighbors.forEach((neighbor) => {
          edges.push({
            u: node,
            v: neighbor,
            w: getWeight(node, neighbor),
          });
        });
        shuffle(edges);
        adjList[`${i}-${j}`] = edges;
      }
    }
  }
  return adjList;
};

const getWeight = (n1, n2) => {
  return n1.isWall || n2.isWall || n1 === n2 ? null : n2.dust;
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
  let mapCopy = getGridDeepCopy(map)
  let currNode = mapCopy[dockingStation.row][dockingStation.col];
  let bestCandidate;
  let canContinue = true;
  let visitedNodesInOrder = [];
  visitedNodesInOrder.push(dockingStation);
  while (canContinue) {
    bestCandidate = findbestCandidate(currNode, visitedNodesInOrder, mapCopy);

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

const findbestCandidate = (currNode, visitedNodesInOrder, mapCopy) => {
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
  const findleastVisitedNode = (currNeighbours) => {
    let neighboursSortedByVisitCount = currNeighbours.sort(
      (n1, n2) => n1.visitCount - n2.visitCount
    );
    return neighboursSortedByVisitCount[0];
  };
  return findleastVisitedNode(currNeighbours);
};

export const data = [{
  name: "Greedy Cleaning",
  shortened: "Greedy",
  func: greedyCleaning,
}, {
  name: "Euler undirected Cleaning",
  shortened: "Un-Directed-Euler",
  func: findEulerCircuitUndirected,
}, {
  name: "Euler Cleaning",
  shortened: "Euler",
  func: findEulerCircuit,
}, ];