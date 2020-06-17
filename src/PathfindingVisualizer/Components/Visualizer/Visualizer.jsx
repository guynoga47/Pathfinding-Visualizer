import React, { PureComponent } from "react";
import Node from "../Node/Node";
import Controls, { DEFAULT_SPEED } from "../Controls/Controls";
import "./Visualizer.css";
import { getShortestPathNodesInOrder } from "../../Algorithms/algorithmUtils.js";
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

export default class Visualizer extends PureComponent {
  constructor(props) {
    super(props);
    this.speed = DEFAULT_SPEED;
    this.gridHeight = DEFAULT_GRID_HEIGHT;
    this.gridWidth = DEFAULT_GRID_WIDTH;
    const {
      defaultStartNode,
      defaultFinishNode,
    } = calculateDefaultGridEndPointsLocations(this.gridHeight, this.gridWidth);

    this.state = {
      grid: [],
      startNode: defaultStartNode,
      finishNode: defaultFinishNode,
    };
  }
  mouseKeyDown = false;
  endPointKeyDown = "";

  isStartNode = (row, col) => {
    return row === this.state.startNode.row && col === this.state.startNode.col;
  };

  isFinishNode = (row, col) => {
    return (
      row === this.state.finishNode.row && col === this.state.finishNode.col
    );
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
    this.setState(
      { startNode: defaultStartNode, finishNode: defaultFinishNode },
      () => this.reset()
    );
  };

  handleResetButtonClicked = () => {
    this.props.setIsFinished(false);
    const grid = this.resetGridKeepWalls();
    console.log(grid);
    this.setState({ grid }, () => {
      this.resetNodeStyles({ resetWalls: false });
    });
  };

  resetGridKeepWalls = () => {
    const grid = [];
    for (let row = 0; row < this.gridHeight; row++) {
      const currentRow = [];
      for (let col = 0; col < this.gridWidth; col++) {
        currentRow.push(
          this.createNode(row, col, this.state.grid[row][col].isWall)
        );
      }
      grid.push(currentRow);
    }
    return grid;
  };

  reset = () => {
    this.props.setIsFinished(false);
    const grid = this.getInitialGrid();
    this.setState({ grid }, () => {
      this.resetNodeStyles({ resetWalls: true });
    });
  };

  resetNodeStyles = ({ resetWalls, resetVisited, resetShortestPath }) => {
    const wallsStyle = resetWalls ? `node-wall` : undefined;
    for (let node in this.refs) {
      ReactDOM.findDOMNode(this.refs[node]).classList.remove(
        `node-visited`,
        `node-shortest-path`,
        `${wallsStyle}`
      );
      if (
        !this.isStartNode(
          parseInt(node.split("-")[1]),
          parseInt(node.split("-")[2])
        )
      )
        ReactDOM.findDOMNode(this.refs[node]).classList.remove(`node-start`);
      else {
        console.log(node);
      }
      if (
        !this.isFinishNode(
          parseInt(node.split("-")[1]),
          parseInt(node.split("-")[2])
        )
      )
        ReactDOM.findDOMNode(this.refs[node]).classList.remove(`node-finish`);
      else {
        console.log(node);
      }
    }
  };

  handleMouseDown = (row, col) => {
    if (this.props.isFinished || this.props.isRunning) return;
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
    if (this.props.isFinished || this.props.isRunning) return;
    if (this.endPointKeyDown) {
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.remove(
        `node-${this.endPointKeyDown}`
      );
    }
  };

  handleMouseEnter = (row, col) => {
    if (this.props.isFinished || !this.mouseKeyDown || this.props.isRunning)
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
    if (this.props.isFinished || this.props.isRunning) return;
    if (this.endPointKeyDown) {
      let endPoint =
        this.endPointKeyDown === "start"
          ? this.state.startNode
          : this.state.finishNode;
      endPoint.row = row;
      endPoint.col = col;
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.add(
        `node-${this.endPointKeyDown}`
      );
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

  createNode = (row, col, isWall = false) => {
    return {
      row,
      col,
      isStart: this.isStartNode(row, col),
      isFinish: this.isFinishNode(row, col),
      distance: Infinity,
      isWall: isWall,
      previousNode: null,
    };
  };

  visualize = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.visualizeShortestPath(nodesInShortestPathOrder);
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

  visualizeShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      if (i === nodesInShortestPathOrder.length - 1) {
        setTimeout(() => {
          this.props.setIsRunning(false);
          this.props.setIsFinished(true);
        }, (this.speed + 30) * i);
      }
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        ReactDOM.findDOMNode(
          this.refs[`node-${node.row}-${node.col}`]
        ).classList.add("node-shortest-path");
      }, (this.speed + 30) * i);
    }
  };

  handlePlayButtonClicked = () => {
    //need to disable toolbar before choosing and then display error message accordingly.
    if (!this.props.activeAlgorithm) return;
    //maybe move this state up to App component and use a handler from app to set the state?
    this.props.setIsRunning(true);
    const { grid } = this.state;
    const startNode = grid[this.state.startNode.row][this.state.startNode.col];
    const finishNode =
      grid[this.state.finishNode.row][this.state.finishNode.col];
    console.log(this.props.activeAlgorithm);
    const visitedNodesInOrder = this.props.activeAlgorithm(
      grid,
      startNode,
      finishNode
    );
    const nodesInShortestPathOrder = getShortestPathNodesInOrder(finishNode);
    this.visualize(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  handleClearWalls = () => {
    console.log("handle clear walls");
    const { setClearWallsRequest } = this.props;
    for (let row = 0; row < this.gridHeight; row++) {
      for (let col = 0; col < this.gridWidth; col++) {
        if (!this.isStartNode(row, col) && !this.isFinishNode(row, col)) {
          if (this.state.grid[row][col].isWall) {
            this.toggleNodeWall(row, col);
          }
        }
      }
    }
    setClearWallsRequest({ requested: false, cleared: true });
  };

  componentDidUpdate() {
    console.log("in visualizer component did update");
    if (this.props.isClearWallsRequested.requested === true) {
      console.log("removing walls");
      this.handleClearWalls();
    }
  }

  render() {
    console.log("Visualizer component is rendering...");
    const { grid } = this.state;
    return (
      <>
        <Controls
          isFinished={this.props.isFinished}
          isRunning={this.props.isRunning}
          isAlgorithmSelected={this.props.activeAlgorithm}
          onResetButtonClicked={this.handleResetButtonClicked}
          onPlayButtonClicked={this.handlePlayButtonClicked}
          onSpeedChange={this.handleSpeedChange}
          onGridSizeChange={this.handleGridSizeChange}
        />
        <div className="grid">
          {console.log(grid.map)}
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((node) => {
                const { row, col, isStart, isFinish } = node;
                //console.log(`reevaluating node-${row}-${col}`);
                return (
                  <Node
                    key={`node-${row}-${col}`}
                    ref={`node-${row}-${col}`}
                    row={row}
                    col={col}
                    isStart={isStart}
                    isFinish={isFinish}
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
4. Deal with no path found case.
5. Shortest path draw is a bit choppy.
6. Add functionality to add weights, to support weighted search algorithms.




8. Generate random terrain feature?
9. Settings Button.
10. find better animation gradients and colors.
11. Adjust speed so it will fit dfs as well. (current max speed is too fast)
12. Adjust speed so it will reflect on the shortest path visualization as well.
13. Move color to theme and style all components with material ui.
14. Playback control to material ui speed dial?
15. Extend menu functionality to figure out how to style it better.
16. Move part of the state from PathfindingVisualizer to App, to make the code more
    modular for future feature implementations.
18. change visiting colors to better fit the theme.

*/
