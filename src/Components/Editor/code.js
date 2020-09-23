export const DEFAULT_EDITOR_MARKUP = `function buildPath(grid, map, dockingStation, availableSteps){

  /*** EXAMPLE CODE: ***/
  
  const robotPath = [];
  let i = 0;
  let currNode = map[dockingStation.row][dockingStation.col];
  while(i < availableSteps){
    let neighbors = getNeighbors(map, currNode);
    robotPath.push(findBestNeighbor(neighbors));
    //...
    i++;
  }
  

}`;

export const EXECUTE = `buildPath(grid,map,dockingStation,availableSteps);`;
