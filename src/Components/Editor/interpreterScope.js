import {
  getShortestPathNodesInOrder,
  getAllNodes,
  isNeighbors,
  resetGridSearchProperties,
  shuffle,
  isEqual,
  isValidCoordinates,
  getNeighbors,
  getGridDeepCopy,
  fillPathGapsInNodeList,
  adjustRobotPathToBatteryAndInsertReturnPath,
  removeDuplicateNodes,
} from "../../Algorithms/algorithmUtils";
import { astar } from "../../Algorithms/pathfindingAlgorithms";

export const INTERPRETER_resetGridSearchProperties = (grid) => {
  resetGridSearchProperties(grid);
  return grid;
};

export const INTERPRETER_shuffle = (array) => {
  shuffle(array);
  return array;
};

export const INTERPRETER_removeDuplicateNodes = (path) => {
  removeDuplicateNodes(path);
  return path;
};

export const INTERPRETER_fillPathGapsInNodeList = (
  map,
  nodeList,
  visitedNodesInOrder,
  filters
) => {
  fillPathGapsInNodeList(map, nodeList, visitedNodesInOrder, filters);
  return visitedNodesInOrder;
};

export const INTERPRETER_astar = (grid, startNode, finishNode, filters) => {
  return astar(grid, startNode, finishNode, filters, {
    searchPropsResetter: INTERPRETER_resetGridSearchProperties,
  });
};

export const INTERPRETER_adjustRobotPathToBatteryAndInsertReturnPath = (
  visitedNodesInOrder,
  map,
  dockingStation,
  availableSteps
) => {
  return adjustRobotPathToBatteryAndInsertReturnPath(
    visitedNodesInOrder,
    map,
    dockingStation,
    availableSteps,
    INTERPRETER_astar
  );
};

export default [
  getShortestPathNodesInOrder,
  getAllNodes,
  isNeighbors,
  isEqual,
  isValidCoordinates,
  getNeighbors,
  getGridDeepCopy,
  INTERPRETER_adjustRobotPathToBatteryAndInsertReturnPath,
  INTERPRETER_astar,
  INTERPRETER_resetGridSearchProperties,
  INTERPRETER_shuffle,
  INTERPRETER_fillPathGapsInNodeList,
  INTERPRETER_removeDuplicateNodes,
];
