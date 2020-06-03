export const dijkstra = (grid, startNode, finishNode) => {
  if (!startNode || !finishNode || startNode === finishNode) {
    console.log("Bad parameters, can't find path!");
    return false;
  }
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  const visitedNodesInOrder = [];
  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighborsDistances(closestNode, grid);
  }
};

//check if we get undefined on function call since we are defining it as variable.
//so hoisting to undefined
const sortNodesByDistance = (unvisitedNodes) => {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
};

const updateUnvisitedNeighborsDistances = (node, grid) => {
  const neighbors = getUnvisitedNeighbours(node, grid);
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
};

const getUnvisitedNeighbours = (node, grid) => {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
};

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
  //return [].concat(...grid);
}
