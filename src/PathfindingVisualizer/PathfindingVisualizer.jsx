import React, { PureComponent } from "react";
import Node from "./Components/Node/Node";
import SimpleSlider from "./Components/SimpleSlider/SimpleSlider";
import RestrictedSlider from "./Components/RestrictedSlider/RestrictedSlider";
import IconButton from "@material-ui/core/IconButton";
import PlayCircleFilledWhiteIcon from "@material-ui/icons/PlayCircleFilledWhite";
import "./PathfindingVisualizer.css";
import { dijkstra, getShortestPathNodesInOrder } from "./Algorithms/dijkstra";
import ReactDOM from "react-dom";

const DEFAULT_GRID_HEIGHT = 25;
const DEFAULT_GRID_WIDTH = 50;

export default class PathfindingVisualizer extends PureComponent {
  constructor(props) {
    super(props);
    this.speed = 20;
    this.gridHeight = DEFAULT_GRID_HEIGHT;
    this.gridWidth = DEFAULT_GRID_WIDTH;
    this.startNode = {
      row: Math.floor(DEFAULT_GRID_HEIGHT / 2),
      col: Math.floor(DEFAULT_GRID_WIDTH / 5),
    };
    this.finishNode = {
      row: Math.floor(DEFAULT_GRID_HEIGHT / 2),
      col: Math.floor((DEFAULT_GRID_WIDTH * 4) / 5),
    };
    this.state = {
      grid: [],
      forceRerender: false,
      isRunning: false,
    };
  }
  mouseKeyDown = false;
  endPointKeyDown = "";

  isStartNode(row, col) {
    return row === this.startNode.row && col === this.startNode.col;
  }

  isFinishNode(row, col) {
    return row === this.finishNode.row && col === this.finishNode.col;
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  handleSpeedChange = (speed) => {
    this.speed = speed;
  };

  handleGridSizeChange = (height) => {
    console.log(height);
    this.gridWidth = height * 2;
    this.gridHeight = height;
    const startNode = {};
    startNode.row = Math.floor(this.gridHeight / 2);
    startNode.col = Math.floor(this.gridWidth / 5);
    const finishNode = {};
    finishNode.row = Math.floor(this.gridHeight / 2);
    finishNode.col = Math.floor((this.gridWidth * 4) / 5);
    this.startNode = startNode;
    this.finishNode = finishNode;
    const grid = this.getInitialGrid();
    this.setState({ grid });

    //this.reset(); need to implement, need to reassign refs.
  };

  handleMouseDown = (row, col) => {
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
    if (this.endPointKeyDown) {
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.remove(
        `node-${this.endPointKeyDown}`
      );
    }
  };

  handleMouseEnter = (row, col) => {
    if (!this.mouseKeyDown) return;
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
    if (this.endPointKeyDown) {
      let endPoint =
        this.endPointKeyDown === "start" ? this.startNode : this.finishNode;
      endPoint.row = row;
      endPoint.col = col;
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

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
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
        ).className = "node node-visited";
      }, this.speed * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        ReactDOM.findDOMNode(
          this.refs[`node-${node.row}-${node.col}`]
        ).className = "node node-shortest-path";
      }, this.speed * i);
    }
    this.setState({ isRunning: false });
  }

  visualizeDijkstra() {
    this.setState({ isRunning: true });
    const { grid } = this.state;
    const startNode = grid[this.startNode.row][this.startNode.col];
    const finishNode = grid[this.finishNode.row][this.finishNode.col];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getShortestPathNodesInOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    console.log("rerendering");
    const { grid } = this.state;
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2em",
            marginRight: "7.5em",
          }}
        >
          <RestrictedSlider
            onGridSizeChange={this.handleGridSizeChange}
            disabled={this.state.isRunning}
          />
          <IconButton color="primary" onClick={() => this.visualizeDijkstra()}>
            <PlayCircleFilledWhiteIcon style={{ fontSize: "2em" }} />
          </IconButton>
          <button
            onClick={() => {
              console.log(this.state.isRunning);
            }}
          >
            Status
          </button>
          <SimpleSlider
            onSpeedChange={this.handleSpeedChange}
            disabled={this.state.isRunning}
          />
        </div>
        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((node, nodeIndex) => {
                const { row, col, isWall, isStart, isFinish } = node;
                return (
                  <Node
                    key={rowIndex * this.gridWidth + nodeIndex}
                    ref={`node-${row}-${col}`}
                    row={row}
                    col={col}
                    isStart={isStart}
                    isFinish={isFinish}
                    isWall={isWall}
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
4. Disable sliders when algorithm is running
5. Add a reset button or reset functionality and invoke it at the correct times.
6. Change Speed Slider values (Currently opposite of what it should)

7. Add DFS, BFS
*/
