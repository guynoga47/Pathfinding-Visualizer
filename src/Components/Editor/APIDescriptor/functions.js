export default [
  {
    name: "boolean isNeighbors(node1, node2)",
    snippet: `console.log(isNeighbors(grid[0][0], grid[0][1])) /*true*/
console.log(isNeighbors(grid[0][0], grid[0][2])) /*false*/
console.log(isNeighbors(grid[1][5], grid[1][5])) /*true*/`,
    description: `
          The isNeighbors functions is used check if two nodes are neighbors.
          It can be used, for example, to validate the path before returning it to check if
          there are illegal non-adjacent nodes in it.
    `,
  },
  {
    name: "[...nodes] getNeighbors(node, grid)",
    snippet: `let neighbors = getNeighbors(map[i][j], map);
neighbors = neighbors.filter(neighbor => !neighbor.isWall && neighbours.isMapped);
/*get all sweep traversable neighbors of node[i][j] in the map.*/`,
    description: `
          This function retrieves the adjacent nodes to any given node, with respect to grid dimensions.
          Definition of adjacent nodes, for node[i][j]:

          [node[i+1][j], node[i-1][j], node[i][j+1], node[i][j-1]].
    `,
  },
  {
    name: "[...nodes] getAllNodes(grid)",
    snippet: `let nodes = getAllNodes(map);
nodes.forEach(node=>{
  /*do something...*/
});`,
    description: `
         Spreads all the nodes to a 1-dimensional array representation.
    `,
  },
  {
    name: "boolean isValidCoordinates(node, grid)",
    snippet: `console.log(isValidCoordinates(grid[100][100], grid));/*false*/
console.log(isValidCoordinates(grid[0][5], grid));/*true*/`,
    description: `
         Checks if the given node row and col properties respects the grid dimensions.
    `,
  },
  {
    name: "[[...grid[0]],...grid] getGridDeepCopy(grid)",
    snippet: `const temporaryGrid = getGridDeepCopy(grid);
console.log(temporaryGrid===grid);/*false*/`,
    description: `
         Returns a deep copy of the grid for any use case.
    `,
  },
  {
    name: "[...nodes] astar(grid, startNode, finishNode, ?filters)",
    snippet: `const astarResult = astar(map, currNode, dockingStation, 
    [{attribute: "isVisited", evaluation: false}, 
    {attribute: "isWall", evaluation: false},
    {attribute: "isMapped", evaluation: true}]);
if(astarResult){
  /*...*/
}`,
    description: `
         Performs an astar search from 'startNode' to 'finishNode'.
         'filters' indicates the properties which we filter out each node neighbors by. if its not defined, the default is to look only at nodes which
         are not visited yet and are not walls.
         The returned value is an array of the searched nodes, in the order of the search.
         To extract the path, you need to use 'getShortestPathNodesInOrder' on the last searched node, which should be 'finishNode', if a path was found.
         in case no path was found, the algorithm returns false.
    `,
  },
  {
    name: "[...nodes] getShortestPathNodesInOrder(finishNode)",
    snippet: `const astarResult = astar(grid, grid[i][j], grid[k][p]);
if(astarResult){
  const path = getShortestPathNodesInOrder(astarResult[astarResult.length-1])
  /*...*/`,
    description: `
           Retrieves a path of nodes to the 'finishNode', based on a previous run of 'astar' 
           (or any other algorithm which uses the 'previousNode' property of the node).
           if 'finishNode' is not a node, returns false.
      `,
  },
  {
    name: "resetGridSearchProperties(grid)",
    snippet: `const astarResult = astar(grid, grid[i][j], grid[k][p]);
if(astarResult){
  const path = getShortestPathNodesInOrder(astarResult[astarResult.length-1])
  /*...*/
}
resetGridSearchProperties(grid);`,
    description: `
           This function can be used to facilitate repeated searches that uses the properties {isVisited, distance, heuristicDistance, previousNode} 
           of the nodes. astar uses it internally to return a "clean" grid, so it's not required in conjunction with it, but can be used 
           when implementing other graph traversal algorithms.
      `,
  },
  {
    name:
      "fillPathGapsInNodeList(map, nodeList, visitedNodesInOrder, ?filters)",
    snippet: `const visitedNodesInOrder = [];
const bfsResult = breadthTraversal(map, startNode, availableSteps);
fillPathGapsInNodeList(map, bfsResult, visitedNodesInOrder, 
      [{attribute: "isVisited", evaluation: false}, 
      {attribute: "isWall", evaluation: false},
      {attribute: "isMapped", evaluation: true}]);
return visitedNodesInOrder;`,
    description: `
           This function calls astar internally in order to fill gaps in a node list, by inserting paths between any 'nodeList' adjacent nodes, which
           are not neighbors in the grid.
      `,
  },
  {
    name: "removeDuplicateNodes(path)",
    snippet: `const path = pathWithDuplicateAdjacentNodes;
removeDuplicateNodes(path)`,
    description: `
    This function searches for 'path' adjacent nodes which are identical and removes all the consequetive occurences of that node.
      `,
  },
  {
    name: "shuffle(array)",
    snippet: `const neighbors = getNeighbors(currNode).filter(node => !node.isWall);
shuffle(neighbors);
/*...*/`,
    description: `
    Shuffles an array inplace.
    In our context it's used to force different patterns of traversals for our determinstic algorithms.
    Without shuffling, the order of the neighbors in the returned array is always the same, which can cause similair behavior between different
    runs of the same traversal algorithm.
      `,
  },
];
