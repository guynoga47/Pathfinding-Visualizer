import React, { PureComponent } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import { dijkstra, getShortestPathNodesInOrder } from "./Algorithms/dijkstra";
import ReactDOM from "react-dom";
/* 
const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35; */

export default class PathfindingVisualizer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      startNode: { row: 10, col: 15 },
      finishNode: { row: 10, col: 35 },
    };
  }
  mouseIsPressed = false;
  startNodePressed = false;

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown = (row, col) => {
    this.mouseIsPressed = true;
    if (row === this.state.startNode.row && col === this.state.startNode.col) {
      ReactDOM.findDOMNode(this.inputRefs[row * 50 + col]).classList.remove(
        "node-start"
      );
      this.startNodePressed = true;
    } else {
      if (row !== this.state.startNode.row || col !== this.state.startNode.col)
        this.toggleNodeWall(row, col);
    }
  };

  handleMouseLeave = (row, col) => {
    if (this.startNodePressed) {
      ReactDOM.findDOMNode(this.inputRefs[row * 50 + col]).classList.remove(
        "node-start"
      );
    }
  };

  handleMouseEnter = (row, col) => {
    //console.log("startNode dragged", this.state.startNodePressed);
    //console.log("mouse is pressed", this.state.mouseIsPressed);
    if (!this.mouseIsPressed) return;
    if (
      this.startNodePressed ||
      (row === this.state.startNode.row && col === this.state.startNode.col)
    ) {
      ReactDOM.findDOMNode(this.inputRefs[row * 50 + col]).classList.add(
        "node-start"
      );
    } else {
      if (row !== this.state.startNode.row || col !== this.state.startNode.col)
        this.toggleNodeWall(row, col);
    }
  };

  handleMouseUp = (row, col) => {
    if (this.startNodePressed) {
      this.setState({ startNode: { ...this.state.startNode, row, col } });
      this.startNodePressed = false;
    }
    this.startNodePressed = false;
    this.mouseIsPressed = false;
  };

  toggleNodeWall = (row, col) => {
    const node = this.state.grid[row][col];
    node.isWall = true;
    ReactDOM.findDOMNode(this.inputRefs[row * 50 + col]).classList.add(
      "node-wall"
    );
  };

  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
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
      isStart:
        row === this.state.startNode.row && col === this.state.startNode.col,
      isFinish:
        row === this.state.finishNode.row && col === this.state.finishNode.col,
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
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        ReactDOM.findDOMNode(
          this.inputRefs[node.row * 50 + node.col]
        ).className = "node node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        /* document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path"; */
        ReactDOM.findDOMNode(
          this.inputRefs[node.row * 50 + node.col]
        ).className = "node node-shortest-path";
      }, 10 * i);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[this.state.startNode.row][this.state.startNode.col];
    const finishNode =
      grid[this.state.finishNode.row][this.state.finishNode.col];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getShortestPathNodesInOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  inputRefs = [];
  setRef = (ref) => {
    this.inputRefs.push(ref);
  };

  render() {
    const { grid } = this.state;
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2em",
          }}
        >
          <button onClick={() => this.visualizeDijkstra()}>
            Visualize Dijkstra's Algorithm
          </button>
          <button
            onClick={() => {
              console.log(`mouse is pressed: ${this.mouseIsPressed}`);
              console.log(`start node is pressed: ${this.startNodePressed}`);
              console.log(this.state.startNode);
            }}
          >
            Press status
          </button>
        </div>
        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((node, nodeIndex) => {
                const { row, col, isWall, isStart, isFinish } = node;
                return (
                  <Node
                    key={rowIndex * 50 + nodeIndex}
                    ref={this.setRef}
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
