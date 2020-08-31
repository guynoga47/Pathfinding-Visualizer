export default [
  {
    name: "Node",
    snippet: `const grid[i][j] = {
  row: number, 
  col: number,
  dust: number,
  isWall: boolean, 
  isMapped: boolean,  /*true only for nodes which we visited in previous runs*/
  isVisited: boolean,       /*control variable for graph path finding algorithms*/
  distance: number          /*a variable which can be used in graph path finding algorithms
  heuristicDistance: number /*a variable which is used in astar algorithm*/
  previousNode: node        /*a variable which is used in several path finding algorithms, to track paths
}`,
    description: `
        The 'Node' parameter is an object which represents the basic unit which composes the house that the robot can traverse.
        We provided several functions to extract information from a 'Node' object, which will be described under the "Functions"
        portion of the API.
        `,
  },
  {
    name: "Grid",
    snippet: "const grid = [[...row1.nodes],[...row2.nodes],...]",
    description: `
        The 'Grid' parameter is a 2-dimensional array of node objects.
        It represents the structure of the house which the robot can traverse.
        In the context of our algorithms, we use it to simulate the Robot's sensors,
        and we take the walls and dust information from the nodes in it.
        `,
  },
  {
    name: "Map",
    snippet: "const map = [[...row1.nodes],[...row2.nodes],...]",
    description: `
        The 'Map' parameter is a 2-dimensional array of node objects.
        It represents the portion of the house that the robot has already traveresed, under "MAP" simulation type.
        The map is always continious, because it is calculated based on legal previous mapping paths.
        We use the map in order to simulate the Robot's "brain", meaning that in every "SWEEP" simulation we want to respect the nodes 
        [isMapped] property, and only allow traversing over mapped nodes.
        `,
  },
  {
    name: "Docking Station",
    snippet: `const dockingStation = {
  ...Node,
  row: /*current starting position row*/
  col: /*current starting position col*/
}`,
    description: `
        The 'Docking Station' parameter is a 'Node' reference object which corresponds to the current position of the docking station on the UI.
        The Robot must start his path from this node and return to it to recharge, before it runs out of battery.
        `,
  },
  {
    name: "Available Steps",
    snippet: `console.log(typeof availableSteps); /*number*/
console.log(number >= 0 && number <= grid.length * grid[0].length); /*true*/`,
    description: `
        This variable correlates to the battery percentage which was set by the user, and represents the number of nodes that the robot can traverse
        before running out of battery. In the context of the code, it's the upper limit of the returned path length.
        `,
  },
];
