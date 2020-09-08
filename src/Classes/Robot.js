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
        const mapNode = this.map[row][col];
        const gridNode = grid[row][col];
        mapNode.isWall = gridNode.isWall;
        mapNode.isMapped = gridNode.isWall ? false : mapNode.isMapped;
        mapNode.dust = gridNode.dust;
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
