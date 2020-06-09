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
    };
  }
  mouseIsPressed = false;
  startNodePressed = false;

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
    this.mouseIsPressed = true;
    if (row === this.startNode.row && col === this.startNode.col) {
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.remove(
        "node-start"
      );
      this.startNodePressed = true;
    } else {
      if (row !== this.startNode.row || col !== this.startNode.col)
        this.toggleNodeWall(row, col);
    }
  };

  handleMouseLeave = (row, col) => {
    if (this.startNodePressed) {
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.remove(
        "node-start"
      );
    }
  };

  handleMouseEnter = (row, col) => {
    //console.log("startNode dragged", this.startNodePressed);
    //console.log("mouse is pressed", this.state.mouseIsPressed);
    if (!this.mouseIsPressed) return;
    if (
      this.startNodePressed ||
      (row === this.startNode.row && col === this.startNode.col)
    ) {
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.add(
        "node-start"
      );
    } else {
      if (row !== this.startNode.row || col !== this.startNode.col)
        this.toggleNodeWall(row, col);
    }
  };

  handleMouseUp = (row, col) => {
    if (this.startNodePressed) {
      this.startNode = { row, col };
    }
    this.startNodePressed = false;
    this.mouseIsPressed = false;
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
      isStart: row === this.startNode.row && col === this.startNode.col,
      isFinish: row === this.finishNode.row && col === this.finishNode.col,
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
        /* document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path"; */
        ReactDOM.findDOMNode(
          this.refs[`node-${node.row}-${node.col}`]
        ).className = "node node-shortest-path";
      }, this.speed * i);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[this.startNode.row][this.startNode.col];
    const finishNode = grid[this.finishNode.row][this.finishNode.col];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getShortestPathNodesInOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    console.log(this.state.grid);
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
          <RestrictedSlider onGridSizeChange={this.handleGridSizeChange} />
          <IconButton color="primary" onClick={() => this.visualizeDijkstra()}>
            <PlayCircleFilledWhiteIcon style={{ fontSize: "2em" }} />
          </IconButton>
          <button
            onClick={() => {
              console.log(this.refs);
            }}
          >
            Status
          </button>
          <SimpleSlider onSpeedChange={this.handleSpeedChange} />
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
TODOS:
1. make grid responsive, using material ui grid container and grid item maybe? 
2. try to add functionality to drag start and end indicators.
3. try to add functionality to change height and width of the grid. 
4. deal with wall toggling when passing over it while mouse is pressed
5. can't cancel walls.

5. toggling walls on nodes works without recreating grid, maybe try to implement other attributes (mainly isvisited) as well.
*/
