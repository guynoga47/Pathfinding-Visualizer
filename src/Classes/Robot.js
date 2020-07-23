export default class Robot {
  constructor(charge, grid) {
    this.map = this.getInitialMap(grid);
    this.stepsAvailable = this.mapChargeToAvailableSteps(charge);
  }

  getInitialMap = (grid) => {
    let row, col;
    const map = [];
    for (row = 0; row < grid.length; row++) {
      map.push([]);
      for (col = 0; col < grid[0].length; col++) {
        map[row].push(false);
      }
    }
    return map;
  };

  mapChargeToAvailableSteps = (charge) => {
    const totalSteps = this.map.length * this.map[0].length * 5;
    return (charge / 100) * totalSteps;
  };

  updateMap = (visitedNodes) => {
    for (const node of visitedNodes) {
      const { row, col } = node;
      this.map[row][col] = true;
    }
    let count = 0;
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[0].length; col++) {
        if (this.map[row][col]) {
          count++;
        }
      }
    }
  };
}
