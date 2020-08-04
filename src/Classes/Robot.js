export default class Robot {
  constructor(charge, grid) {
    this.map = this.getInitialMap(grid);
    /*     this.stepsAvailable = this.mapChargeToAvailableSteps(charge); */
  }

  getInitialMap = (grid) => {
    let row, col;
    const map = [];
    for (row = 0; row < grid.length; row++) {
      map.push([]);
      for (col = 0; col < grid[0].length; col++) {
        map[row].push({ ...grid[row][col] });
        map[row][col].isMapped = false;
        map[row][col].visitCount = 0;
      }
    }
    return map;
  };

  /* mapChargeToAvailableSteps = (charge) => {
    const totalSteps = this.map.length * this.map[0].length * 5;
    return (charge / 100) * totalSteps;
  }; */

  updateMap = (path) => {
    for (const node of path) {
      const { row, col } = node;
      this.map[row][col].isMapped = true;
    }
  };
}
