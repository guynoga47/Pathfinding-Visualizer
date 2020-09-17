export const DEFAULT_EDITOR_MARKUP = `function buildPath(grid, map, dockingStation, availableSteps){

  let i = 0;
  const visitedNodesInOrder = [];
  let currNode = dockingStation;

  while (i < availableSteps) {
    visitedNodesInOrder.push(currNode);
    
    let neighbors = getNeighbors(currNode, map).filter(
      (neighbor) => !grid[neighbor.row][neighbor.col].isWall
    );

    neighbors = INTERPRETER_shuffle(neighbors);

    const neighborsAscending = [...neighbors].sort(
      (n1, n2) => n1.visitCount - n2.visitCount
    );
    const neighborsDescending = [...neighbors].sort(
      (n1, n2) => n2.visitCount - n1.visitCount
    );
    const neighborsProbabilities = [];

    const multipliers = [70, 20, 5, 5];
    neighborsDescending.forEach((neighbor, i) => {
      for (let count = 0; count <= multipliers[i]; count++) {
        neighborsProbabilities.push(neighborsAscending[i]);
      }
    });
    currNode =
      neighborsProbabilities[
        Math.floor(Math.random() * neighborsProbabilities.length)
      ];

    currNode.visitCount = !currNode.visitCount
      ? 1
      : currNode.visitCount + 1;
    i++;
  }

  const robotPath = INTERPRETER_adjustRobotPathToBatteryAndInsertReturnPath(
    visitedNodesInOrder,
    map,
    dockingStation,
    availableSteps,
    INTERPRETER_astar
  );
  return robotPath;
  
  }`;

export const EXECUTE = `buildPath(grid,map,dockingStation,availableSteps);`;
