import Exception from "../../Classes/Exception";
import {
  isValidCoordinates,
  isNeighbors,
} from "../../Algorithms/algorithmUtils";

const validateReturnType = (result, context) => {
  if (!Array.isArray(result)) {
    throw new Exception(
      `Invalid return type: ${typeof result}. return type 'Array' is required.`
    );
  }
};

const validateIsEmpty = (result, context) => {
  if (result.length === 0) {
    throw new Exception(`Returned array must not be empty.`);
  }
};

const validateIsGridNodes = (result, context) => {
  const { grid } = context.state;
  for (let [i, elem] of result.entries()) {
    if (!Number.isInteger(elem.row) || !Number.isInteger(elem.col)) {
      throw new Exception(`Invalid properties in Array[${i}].`);
    } else if (!isValidCoordinates(elem, grid)) {
      throw new Exception(`Invalid coordinates in Array[${i}].`);
    }
  }
};
const validateContinuousPath = (result, context) => {
  for (let i = 0; i < result.length; i++) {
    const currNode = result[i];
    const prevNode = i > 0 ? result[i - 1] : currNode;
    if (!isNeighbors(currNode, prevNode)) {
      throw new Exception(`Invalid path. Non-adjacent nodes detected at indices [${i}], [${
        i - 1
      }].\n
        Array[${i}] = [${currNode.row}, ${currNode.col}]
        Array[${i - 1}] = [${prevNode.row}, ${prevNode.col}]`);
    }
  }
};
const validateCyclicPath = (result, context) => {
  const { startNode } = context.state;
  const { isStartNode } = context;
  const [firstNode, lastNode] = [result[0], result[result.length - 1]];
  if (!isStartNode(firstNode)) {
    throw new Exception(
      `Invalid starting node. returned path must start from the docking station, position: [${startNode.row},${startNode.col}]\n Current starting position is [${firstNode.row},${firstNode.col}]`
    );
  }
  if (!isStartNode(lastNode)) {
    throw new Exception(
      `Invalid ending node. returned path must end in the docking station, position: [${startNode.row},${startNode.col}]\n Current ending position is [${lastNode.row},${lastNode.col}]`
    );
  }
};

export default [
  validateReturnType,
  validateIsEmpty,
  validateIsGridNodes,
  validateContinuousPath,
  validateCyclicPath,
];
