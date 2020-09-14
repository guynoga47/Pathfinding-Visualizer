export default class Robot {
  constructor(grid) {
    this.map = this.getInitialMap(grid);
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

  syncMapLayoutWithGrid = (grid) => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        const gridNode = grid[row][col];
        this.map[row][col].isWall = gridNode.isWall;
        this.map[row][col].isMapped = gridNode.isWall
          ? false
          : this.map[row][col].isMapped;
        this.map[row][col].dust = gridNode.dust;
      }
    }
  };

  updateMap = (path) => {
    for (const node of path) {
      const { row, col } = node;
      this.map[row][col].isMapped = true;
    }
  };
}
