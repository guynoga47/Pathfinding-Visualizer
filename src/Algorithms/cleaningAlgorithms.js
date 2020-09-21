import { astar } from "./pathfindingAlgorithms";
import Stack from "../Classes/Stack";
import {
  getNeighbors,
  adjustRobotPathToBatteryAndInsertReturnPath,
  shuffle,
  adjList,
} from "./algorithmUtils";

const findEulerCircuit = (grid, map, dockingStation, availableSteps) => {
  const graph = adjList(map, [
    { attribute: "isWall", evaluation: false },
    { attribute: "isMapped", evaluation: true },
  ]);
  if (Object.keys(graph) === 0) return [];
  const currPath = new Stack();
  let currNode = dockingStation;

  currPath.push(dockingStation);
  const circuit = [];
  while (!currPath.isEmpty()) {
    const { row, col } = currNode;
    if (graph[`${row}-${col}`].length > 0) {
      currPath.push(currNode);
      currNode = graph[`${row}-${col}`].pop().v;
    } else {
      circuit.push(currNode);
      currNode = currPath.pop();
    }
  }

  const robotPath = adjustRobotPathToBatteryAndInsertReturnPath(
    circuit,
    map,
    dockingStation,
    availableSteps
  );
  return robotPath;
};

const greedyCleaning = (grid, map, dockingStation, availableSteps) => {
  const isCleaningPossible = () => {
    const neighbors = getNeighbors(dockingStation, map);
    return (
      neighbors.length && neighbors.filter((node) => node.isMapped).length > 0
    );
  };
  const findBestCandidate = (currNode, robotPath, map) => {
    const getLeastVisitedNode = (nodes) => {
      let nodesByVisitCount = nodes.sort(
        (n1, n2) => n1.visitCount - n2.visitCount
      );
      return nodesByVisitCount[0];
    };
    let currNeighbours = getNeighbors(currNode, map).filter(
      (neighbour) => neighbour.isMapped
    );
    shuffle(currNeighbours);
    const sortedNeighboursByWeight = currNeighbours.sort(
      (neigbour1, neigbour2) => neigbour2.dust - neigbour1.dust
    );
    for (let i = 0; i < sortedNeighboursByWeight.length - 1; i++) {
      if (!robotPath.includes(sortedNeighboursByWeight[i])) {
        return sortedNeighboursByWeight[i];
      }
    }
    return getLeastVisitedNode(currNeighbours);
  };

  const robotPath = [];
  if (!isCleaningPossible()) return robotPath;

  let currNode = dockingStation;
  robotPath.push(currNode);
  const filters = [
    { attribute: "isVisited", evaluation: false },
    { attribute: "isWall", evaluation: false },
    { attribute: "isMapped", evaluation: true },
  ];

  while (true) {
    const bestCandidate = findBestCandidate(currNode, robotPath, map);
    let returnPath = astar(
      map,
      bestCandidate,
      map[dockingStation.row][dockingStation.col],
      filters
    );

    if (returnPath && returnPath.length + robotPath.length < availableSteps) {
      robotPath.push(bestCandidate);
      bestCandidate.visitCount++;
    } else {
      returnPath = astar(
        map,
        currNode,
        map[dockingStation.row][dockingStation.col],
        filters
      );
      robotPath.push(...returnPath);
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
    name: "Euler Circuit Cleaning",
    shortened: "Euler",
    func: findEulerCircuit,
  },
];
