import React, { Component, PureComponent } from "react";
import Node from "./Components/Node/Node";
import Controls from "./Components/Controls/Controls";

import "./PathfindingVisualizer.css";
import { dijkstra, getShortestPathNodesInOrder } from "./Algorithms/dijkstra";
import ReactDOM from "react-dom";

const DEFAULT_GRID_HEIGHT = 25;
const DEFAULT_GRID_WIDTH = 50;

const calculateDefaultGridEndPointsLocations = (height, width) => {
  const defaultStartNode = {
    row: Math.floor(height / 2),
    col: Math.floor(width / 5),
  };
  const defaultFinishNode = {
    row: Math.floor(height / 2),
    col: Math.floor((width * 4) / 5),
  };
  return { defaultStartNode, defaultFinishNode };
};

export default class PathfindingVisualizer extends PureComponent {
  constructor(props) {
    super(props);
    this.speed = 5;
    this.gridHeight = DEFAULT_GRID_HEIGHT;
    this.gridWidth = DEFAULT_GRID_WIDTH;
    const {
      defaultStartNode,
      defaultFinishNode,
    } = calculateDefaultGridEndPointsLocations(this.gridHeight, this.gridWidth);
    this.startNode = defaultStartNode;
    this.finishNode = defaultFinishNode;
    console.log(defaultStartNode);
    console.log(defaultFinishNode);
    this.state = {
      grid: [],
      isRunning: false,
      isFinished: false,
      forceRerender: false,
    };
  }
  mouseKeyDown = false;
  endPointKeyDown = "";
  endPointsRerenderToggle = true;
  /* used to toggle the prop of isStart and isFinished after every reset function. (grid change and reset button currently)
  so the corresponding node component will "feel" a change to it's prop and will rerender with the relevant style. */

  isStartNode = (row, col) => {
    return row === this.startNode.row && col === this.startNode.col;
  };

  isFinishNode = (row, col) => {
    return row === this.finishNode.row && col === this.finishNode.col;
  };

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  handleSpeedChange = (speed) => {
    this.speed = speed;
  };

  handleGridSizeChange = (height) => {
    if (height === this.gridHeight) return;
    this.gridHeight = height;
    this.gridWidth = height * 2;
    const {
      defaultStartNode,
      defaultFinishNode,
    } = calculateDefaultGridEndPointsLocations(this.gridHeight, this.gridWidth);
    this.startNode = defaultStartNode;
    this.finishNode = defaultFinishNode;

    this.reset();
  };

  handleResetButtonClicked = () => {
    this.reset();
  };

  reset = () => {
    console.log("resetting");
    this.setState({ isFinished: false });
    this.resetNodeStyles();
    const grid = this.getInitialGrid();
    this.endPointsRerenderToggle = true;
    this.setState({ grid });
  };

  resetNodeStyles = () => {
    for (let node in this.refs) {
      ReactDOM.findDOMNode(this.refs[node]).classList.remove(
        `node-visited`,
        `node-shortest-path`,
        `node-wall`
      );
    }
  };

  handleMouseDown = (row, col) => {
    if (this.state.isFinished || this.state.isRunning) return;
    this.mouseKeyDown = true;
    if (this.isStartNode(row, col) || this.isFinishNode(row, col)) {
      this.endPointKeyDown = this.isStartNode(row, col) ? "start" : "finish";
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.remove(
        `node-${this.endPointKeyDown}`
      );
    } else {
      this.toggleNodeWall(row, col);
    }
  };

  handleMouseLeave = (row, col) => {
    if (this.state.isFinished || this.state.isRunning) return;
    if (this.endPointKeyDown) {
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.remove(
        `node-${this.endPointKeyDown}`
      );
    }
  };

  handleMouseEnter = (row, col) => {
    if (this.state.isFinished || !this.mouseKeyDown || this.state.isRunning)
      return;
    if (this.endPointKeyDown) {
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.add(
        `node-${this.endPointKeyDown}`
      );
    } else {
      if (!this.isStartNode(row, col) && !this.isFinishNode(row, col))
        this.toggleNodeWall(row, col);
    }
  };

  handleMouseUp = (row, col) => {
    if (this.state.isFinished || this.state.isRunning) return;
    if (this.endPointKeyDown) {
      let endPoint =
        this.endPointKeyDown === "start" ? this.startNode : this.finishNode;
      endPoint.row = row;
      endPoint.col = col;
      this.endPointsRerenderToggle = false;
    }
    this.endPointKeyDown = false;
    this.mouseKeyDown = false;
  };

  toggleNodeWall = (row, col) => {
    const node = this.state.grid[row][col];
    node.isWall = !node.isWall;
    ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.toggle(
      "node-wall"
    );
  };

  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < this.gridHeight; row++) {
      const currentRow = [];
      for (let col = 0; col < this.gridWidth; col++) {
        currentRow.push(this.createNode(row, col));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  createNode = (row, col) => {
    return {
      row,
      col,
      isStart: this.isStartNode(row, col),
      isFinish: this.isFinishNode(row, col),
      distance: Infinity,
      isWall: false,
      previousNode: null,
    };
  };

  animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    console.log(
      "endpointsPropsToggle in animateDijkstra:before toggle",
      this.endPointsRerenderToggle
    );
    this.endPointsRerenderToggle = !this.endPointsRerenderToggle;
    console.log(
      "endpointsPropsToggle in animateDijkstra: after toggle",
      this.endPointsRerenderToggle
    );
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, this.speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        ReactDOM.findDOMNode(
          this.refs[`node-${node.row}-${node.col}`]
        ).classList.add("node-visited");
      }, this.speed * i);
    }
  };

  animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        ReactDOM.findDOMNode(
          this.refs[`node-${node.row}-${node.col}`]
        ).classList.add("node-shortest-path");
      }, this.speed * i);
    }
    this.setState({ isRunning: false, isFinished: true });
  };

  visualizeDijkstra = () => {
    this.setState({ isRunning: true });
    const { grid } = this.state;
    const startNode = grid[this.startNode.row][this.startNode.col];
    const finishNode = grid[this.finishNode.row][this.finishNode.col];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getShortestPathNodesInOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  render() {
    console.log("rerendering");
    const { grid } = this.state;
    return (
      <>
        <Controls
          isFinished={this.state.isFinished}
          isRunning={this.state.isRunning}
          resetButtonClicked={this.handleResetButtonClicked}
          visualizeDijkstra={this.visualizeDijkstra}
          handleSpeedChange={this.handleSpeedChange}
          handleGridSizeChange={this.handleGridSizeChange}
        />

        <button
          onClick={() => {
            console.log(grid[this.startNode.row][this.startNode.col]);
            console.log(grid[this.finishNode.row][this.finishNode.col]);
            console.log(
              ReactDOM.findDOMNode(
                this.refs[`node-${this.startNode.row}-${this.startNode.col}`]
              )
            );
            console.log(
              ReactDOM.findDOMNode(
                this.refs[`node-${this.finishNode.row}-${this.finishNode.col}`]
              )
            );
            console.log(grid[12][11]);
            console.log(grid[12][41]);
          }}
        >
          Status
        </button>
        <div className="grid">
          {console.log(
            "endpointsPropsToggle in render",
            this.endPointsRerenderToggle
          )}
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((node, nodeIndex) => {
                const { row, col, isStart, isFinish } = node;
                //console.log(`reevaluating node-${row}-${col}`);
                return (
                  <Node
                    key={`node-${row}-${col}`}
                    ref={`node-${row}-${col}`}
                    row={row}
                    col={col}
                    isStart={isStart && this.endPointsRerenderToggle}
                    isFinish={isFinish && this.endPointsRerenderToggle}
                    onMouseDown={this.handleMouseDown}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    onMouseUp={this.handleMouseUp}
                  ></Node>
                );
              })}
            </div>
          ))}
        </div>
      </>
    );
  }
}
/* 
TODO
1. Make grid responsive, using material ui grid container and grid item maybe? 
2. Check edge cases when dragging end points (like when leaving grid and returning, or when dragging one endpoint over the other, 
  or trying to put end point on a wall, or clicking on end point etc)
3. Change icons for end points.


7. Add DFS, BFS

BUG:

1. Clicking on end point node disable styling.

*/
