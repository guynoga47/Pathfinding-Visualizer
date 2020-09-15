import { astar } from "./pathfindingAlgorithms";
import {
  getGridDeepCopy,
  getNeighbors,
  getShortestPathNodesInOrder,
} from "./algorithmUtils";

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
    return [dockingStation];
  }
  return [dockingStation];
  let mapCopy = getGridDeepCopy(map);
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

export const data = [
  {
    name: "Greedy Cleaning",
    shortened: "Greedy",
    func: greedyCleaning,
  },
];
