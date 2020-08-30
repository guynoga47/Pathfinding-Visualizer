import Exception from "../../Classes/Exception";
import {
  isValidCoordinates,
  isNeighbors,
} from "../../Algorithms/algorithmUtils";

const validateReturnType = (result, context) => {
  if (!Array.isArray(result)) {
    throw new Exception(
      `Invalid return type: ${typeof result}. 
      return type 'Array' is required.`
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
    if (!elem) {
      throw new Exception(`Array[${i}] is ${typeof elem}.`);
    } else {
      if (!Number.isInteger(elem.row) || !Number.isInteger(elem.col)) {
        throw new Exception(`Invalid properties in Array[${i}].`);
      } else if (!isValidCoordinates(elem, grid)) {
        throw new Exception(`Invalid coordinates in Array[${i}].`);
      }
    }
  }
};
const validateContinuousPath = (result, context) => {
  for (let i = 0; i < result.length; i++) {
    const currNode = result[i];
    const prevNode = i > 0 ? result[i - 1] : currNode;
    if (!isNeighbors(currNode, prevNode)) {
      throw new Exception(`Invalid path.
      Non-adjacent nodes detected at indices [${i}], [${i - 1}].

      Array[${i - 1}] = [${prevNode.row}, ${prevNode.col}]
      Array[${i}] = [${currNode.row}, ${currNode.col}]`);
    }
  }
};
const validateCyclicPath = (result, context) => {
  const { startNode } = context.state;
  const { isStartNode } = context;
  const [firstNode, lastNode] = [result[0], result[result.length - 1]];
  if (!isStartNode(firstNode.row, firstNode.col)) {
    throw new Exception(
      `Invalid starting position. 
       Path must start from the docking station. 

      Expected starting position: [${startNode.row},${startNode.col}] 
      Received starting position: [${firstNode.row},${firstNode.col}]`
    );
  }
  if (!isStartNode(lastNode.row, lastNode.col)) {
    throw new Exception(
      `Invalid ending position. 
       Path must end in the docking station, 

      Expected ending position: [${startNode.row},${startNode.col}] 
      Received ending position: [${lastNode.row},${lastNode.col}]`
    );
  }
};

export default [
  validateReturnType,
  validateIsEmpty,
  validateIsGridNodes,
  validateCyclicPath,
  validateContinuousPath,
];
