import Exception from "../../Classes/Exception";
import {
  isValidCoordinates,
  isNeighbors,
  isEqual,
} from "../../Algorithms/algorithmUtils";

import * as MSG from "./Message/messages";

const validateReturnType = (result, context) => {
  if (!Array.isArray(result)) {
    throw new Exception(MSG.VALIDATE_RETURN_TYPE(result));
  }
};

const validateIsEmpty = (result, context) => {
  if (result.length === 0) {
    throw new Exception(MSG.VALIDATE_EMPTY_ARRAY);
  }
};

const validateIsGridNodes = (result, context) => {
  const { grid } = context.state;
  const isObject = (elem) => {
    return typeof elem === "object" && !Array.isArray(elem) && elem !== null;
  };

  for (let [i, elem] of result.entries()) {
    if (!isObject(elem)) {
      throw new Exception(MSG.VALIDATE_GRID_NODES(elem, i));
    } else {
      if (!Number.isInteger(elem.row) || !Number.isInteger(elem.col)) {
        throw new Exception(MSG.VALIDATE_PROPERTIES(i));
      } else if (!isValidCoordinates(elem, grid)) {
        throw new Exception(MSG.VALIDATE_COORDINATES(i));
      }
    }
  }
};
//prettier-ignore
const validateContinuousPath = (result, context) => {
  for (let i = 0; i < result.length; i++) {
    const currNode = result[i];
    const prevNode = i > 0 ? result[i - 1] : currNode;
    if (!isNeighbors(currNode, prevNode) || (isEqual(currNode, prevNode) && i > 0)) {
      throw new Exception(MSG.VALIDATE_NON_ADJACENT(currNode, prevNode, i));
    }
  }
};

const validateStepLimitExceeded = (result, context) => {
  return result.length <= context.state.availableSteps;
};

const validateNoWalls = (result, context) => {
  for (const node of result) {
    if (node.isWall === true) {
      throw new Exception(MSG.VALIDATE_WALL(node));
    }
  }
};

const validateCyclicPath = (result, context) => {
  const { startNode } = context.state;
  const { isStartNode } = context;
  const [firstNode, lastNode] = [result[0], result[result.length - 1]];

  if (!isStartNode(firstNode.row, firstNode.col)) {
    throw new Exception(MSG.VALIDATE_ACYCLIC_FIRST(firstNode, startNode));
  }
  if (!isStartNode(lastNode.row, lastNode.col)) {
    throw new Exception(MSG.VALIDATE_ACYCLIC_LAST(lastNode, startNode));
  }
};

const validateMappedAreaOnSweepingAlgorithm = (result, context) => {
  const { robot, state } = context;
  const { simulationType } = state;
  if (
    simulationType === "sweep" &&
    robot.map.filter((node) => node.isMapped).length === 0
  ) {
    throw new Exception(MSG.VALIDATE_MAPPED_AREA_IN_SWEEP());
  }
};

/* 
The order of validators is important:
we want the less demanding checks to be done first, so the editor would feel more responsive when throwing error messages
according to the failed test. furthermore, some of the checks are dependent on passing previous checks in order to finish.
exported as array so we can iterate over the validators in the designated function.
*/
export default [
  validateReturnType,
  validateMappedAreaOnSweepingAlgorithm,
  validateIsEmpty,
  validateIsGridNodes,
  validateStepLimitExceeded,
  validateCyclicPath,
  validateNoWalls,
  validateContinuousPath,
];
