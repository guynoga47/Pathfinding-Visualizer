import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathfindingVisualizer.css";
import { dijkstra, getShortestPathNodesInOrder } from "./Algorithms/dijkstra";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  };

  handleMouseEnter = (row, col) => {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  };
  handleMouseUp = () => {
    this.setState({ mouseIsPressed: false });
  };

  animateDijkstra(visitedNodesInOrder, finishNode) {
    visitedNodesInOrder.forEach((node, i) => {
      if (i === visitedNodesInOrder.length - 1) {
        setTimeout(() => {
          console.log(`finished dijkstra, i: ${i}`);
          this.animateShortestPath(getShortestPathNodesInOrder(finishNode));
        }, 50 * i);
        return;
      }
      setTimeout(() => {
        const { row, col } = node;
        const newGrid = [...this.state.grid];
        newGrid[row][col].isVisited = true;
        this.setState({ grid: newGrid });
      }, 50 * i);
    });
  }

  animateShortestPath(shortestPathNodesInOrder) {
    console.log(shortestPathNodesInOrder);
    shortestPathNodesInOrder.forEach((node, i) => {
      setTimeout(() => {
        const { row, col } = node;
        console.log(node);
        const newGrid = [...this.state.grid];
        newGrid[row][col].isVisited = false;
        newGrid[row][col].isShortestPath = true;
        console.log(node);
        this.setState({ grid: newGrid });
      }, 50 * i);
    });
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    this.animateDijkstra(visitedNodesInOrder, finishNode);
  }

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
        </div>
        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((node, nodeIndex) => {
                const {
                  row,
                  col,
                  isStart,
                  isFinish,
                  isWall,
                  isVisited,
                  isShortestPath,
                } = node;
                return (
                  <Node
                    key={nodeIndex}
                    row={row}
                    col={col}
                    isStart={isStart}
                    isFinish={isFinish}
                    isWall={isWall}
                    isVisited={isVisited}
                    isShortestPath={isShortestPath}
                    onMouseDown={this.handleMouseDown}
                    onMouseEnter={this.handleMouseEnter}
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

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(row, col));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  newGrid[row][col] = { ...node, isWall: !node.isWall };
  return newGrid;
};
