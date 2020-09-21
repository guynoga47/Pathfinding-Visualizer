export default [
  {
    name: "boolean isEqual(node1, node2)",
    snippet: `console.log(isEqual(grid[0][0], grid[0][0])) /*true*/
console.log(isEqual(grid[0][0], grid[0][2])) /*false*/
console.log(isEqual(grid[0][0], map[0][0])) /*true*/`,
    description: `
          Performs a check if 2 nodes are identical with respect to their 'row' and 'col' values.
          Comparing with === might be problematic because the variables are copied by value with every 
          function call.
    `,
  },
  {
    name: "boolean isNeighbors(node1, node2)",
    snippet: `console.log(isNeighbors(grid[0][0], grid[0][1])) /*true*/
console.log(isNeighbors(grid[0][0], grid[0][2])) /*false*/
console.log(isNeighbors(grid[1][5], grid[1][5])) /*true*/`,
    description: `
          The 'isNeighbors' functions is used check if two nodes are neighbors.
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
          This function retrieves, by value ,the adjacent nodes to any given node, with respect to the grid's dimensions.
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
         The returned array contains copys of the original grid nodes.
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
    snippet: `const path = astar(map, currNode, dockingStation, 
    [{attribute: "isVisited", evaluation: false}, 
    {attribute: "isWall", evaluation: false},
    {attribute: "isMapped", evaluation: true}]);
if(path){
  /*...*/
}`,
    description: `
         Performs an astar search from 'startNode' to 'finishNode'.
         'filters' indicates the properties which we filter out each node neighbors by. if its not defined, the default is to look only at nodes which
         are not visited yet and are not walls.
         The returned value is an array of nodes which forms the shortest path found from 'startNode' to 'finishNode'.
         in case no path was found, the function returns false.
    `,
  },
  {
    name: "[...[...grid[0], grid] resetGridSearchProperties(grid)",
    snippet: `const path = astar(grid, grid[i][j], grid[k][p]);
if(path){
  /*...*/
}
grid = resetGridSearchProperties(grid);`,
    description: `
           This function can be used to facilitate repeated searches that uses the properties {isVisited, distance, heuristicDistance, previousNode} 
           of the nodes. astar uses it internally to return a "clean" grid, so it's not required in conjunction with it, but can be used 
           when implementing other graph traversal algorithms.
      `,
  },
  {
    name:
      "[...nodes] fillPathGapsInNodeList(map, nodeList, visitedNodesInOrder, ?filters)",
    snippet: `const visitedNodesInOrder = [];
const bfsResult = breadthTraversal(map, startNode, availableSteps);
visitedNodesInOrder = fillPathGapsInNodeList(map, bfsResult, visitedNodesInOrder, 
      [{attribute: "isVisited", evaluation: false}, 
      {attribute: "isWall", evaluation: false},
      {attribute: "isMapped", evaluation: true}]);
return visitedNodesInOrder;`,
    description: `
           This function calls astar internally in order to fill gaps in a node list, by inserting paths between any 'nodeList' adjacent nodes, which
           are not neighbors in the grid. returns a continious list of by-value copied nodes.
      `,
  },
  {
    name: "[...nodes] removeDuplicateNodes(path)",
    snippet: `const path = pathWithDuplicateAdjacentNodes;
path = removeDuplicateNodes(path)`,
    description: `
    This function searches for 'path' adjacent nodes which are identical and removes all the consequetive occurences of that node. 
    returns a list of by-value copied nodes.
      `,
  },
  {
    name: "[...array] shuffle(array)",
    snippet: `const neighbors = getNeighbors(currNode).filter(node => !node.isWall);
neighbors = shuffle(neighbors);
/*...*/`,
    description: `
    Shuffles an array and returns a copy of it, shuffled.
    In our context it's used to force different patterns of traversals for our determinstic algorithms.
    Without shuffling, the order of the neighbors in the returned array is always the same, which can cause similair behavior between different
    runs of the same traversal algorithm.
      `,
  },
];
