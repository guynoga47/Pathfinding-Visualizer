export const INFO_MSG = `This platform allows you to implement your own method to traverse the grid.
You are required to create and return an 'Array' object which represents the path that the robot will take.
The path must meet the following requirements:

1. Every element in the array must be a node reference from the 'map' parameter.
2. The path must start and end with the docking station node which is given as a parameter.
3. The number of elements in the array must be of value 'availableSteps' at most.

`;

export const SUCCESS_MSG = `Well done!
You can now compare your code to our pre-defined algorithms by 
clicking 'Benchmark', or simulate a run on the current configuration 
by clicking 'Run'.`;

export const WARNING_MSG = `Are you sure you want to restore code back to default?`;

export const TIME_LIMIT_EXCEEDED = `Time limit exceeded, check for infinite loops or performance bottlenecks!`;

export const NO_BATTERY = `Please charge the robot's battery before attempting to validate the code!`;

export const COMPILATION_FAILED = `'Babel' Code compilation failed.
Check your code for syntax errors, and verify that you are connected to the internet!`;

export const VALIDATE_RETURN_TYPE = (
  result
) => `Invalid return type: ${typeof result}. 
return type 'Array' is required.`;
export const VALIDATE_EMPTY_ARRAY = `Returned array must not be empty.`;
export const VALIDATE_GRID_NODES = (elem, i) =>
  `Array[${i}] is of type '${
    elem === null ? "null" : Array.isArray(elem) ? "Array" : typeof elem
  }'.`;

export const VALIDATE_PROPERTIES = (i) => `Invalid properties in Array[${i}].`;
export const VALIDATE_COORDINATES = (i) =>
  `Invalid coordinates in Array[${i}].`;
export const VALIDATE_NON_ADJACENT = (currNode, prevNode, i) => `Invalid path.
  Non-adjacent nodes detected at indices [${i - 1}], [${i}].

  Array[${i - 1}] = [${prevNode.row}, ${prevNode.col}]
  Array[${i}] = [${currNode.row}, ${currNode.col}]`;

export const VALIDATE_WALL = (node) =>
  `Wall node found at location [${node.row}, ${node.col}]. Path must include accessible nodes only!`;
export const VALIDATE_ACYCLIC_FIRST = (
  firstNode,
  startNode
) => `Invalid starting position. 
  Path must start from the docking station. 

 Expected starting position: [${startNode.row},${startNode.col}] 
 Received starting position: [${firstNode.row},${firstNode.col}]`;

export const VALIDATE_ACYCLIC_LAST = (
  lastNode,
  startNode
) => `Invalid ending position. 
 Path must end in the docking station, 

Expected ending position: [${startNode.row},${startNode.col}] 
Received ending position: [${lastNode.row},${lastNode.col}]`;
