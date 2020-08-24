import React, { Component } from "react";
import ReactDOM from "react-dom";

import Node from "../Node/Node";
import Controls, { DEFAULT_SPEED } from "../Controls/Controls";

import "./Visualizer.css";

import GridContext from "../../Context/grid-context";

export default class Visualizer extends Component {
  static contextType = GridContext;

  constructor(props) {
    super(props);
    this.speed = DEFAULT_SPEED;
    this.mouseDown = false;
    this.startNodeMouseDown = false;
  }

  handleSpeedChanged = (speed) => {
    this.speed = speed;
  };

  handleReset = () => {
    this.context.updateState("isFinished", false);
    this.context.resetGridKeepWalls(this.resetNodeStyles, {
      /* resetWalls: false, */
      setWalls: true,
    });
  };

  handleGridSizeChange = (height) => {
    if (height === this.context.gridHeight) return;
    this.context.resizeGrid(height, this.resetNodeStyles, {
      resetWalls: true,
      resetDust: true,
    });
  };

  resetNodeStyles = ({
    resetWalls,
    resetDust,
    setWalls,
    resetVisited,
    resetShortestPath,
  }) => {
    for (let node in this.refs) {
      const row = parseInt(node.split("-")[1]);
      const col = parseInt(node.split("-")[2]);
      const nodeDOM = ReactDOM.findDOMNode(this.refs[node]);
      if (resetWalls) {
        nodeDOM.classList.remove("node-wall");
      }
      if (resetDust) {
        if (nodeDOM.classList.length > 1) {
          const dust = nodeDOM.classList[1];
          nodeDOM.classList.remove(`${dust}`);
        }
      }
      if (setWalls) {
        nodeDOM.classList.remove("node-wall");
        if (this.context.state.grid[row][col].isWall)
          nodeDOM.classList.add("node-wall");
      }
      if (resetVisited) {
        nodeDOM.classList.remove(`node-visited`);
      }
      if (resetShortestPath) {
        nodeDOM.classList.remove(`node-shortest-path`);
      }

      if (!this.context.isStartNode(row, col))
        nodeDOM.classList.remove(`node-start`);
      else {
        nodeDOM.classList.add(`node-start`);
      }
    }
  };

  handleMouseDown = (row, col) => {
    const { drawingMode, drawingElement } = this.props;
    const { isFinished, isRunning } = this.context.state;
    if (isFinished || isRunning) return;
    this.mouseDown = true;
    if (this.context.isStartNode(row, col)) {
      this.startNodeMouseDown = true;
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.remove(
        `node-start`
      );
      console.log(
        `removed startNode in handleMouseDown from node-${row}-${col}`
      );
    } else {
      if (drawingMode === "rectangle" || drawingMode === "filled rectangle") {
        this.rectLocStart = { row, col };
      }
      if (drawingElement === "wall") {
        this.changeNodeWall(row, col, { toggle: true });
      }
      if (drawingElement === "dust") {
        this.changeNodeDust(row, col, { add: true });
      }
    }
  };

  handleMouseEnter = (row, col) => {
    const { drawingMode, drawingElement } = this.props;
    const { isFinished, isRunning } = this.context.state;
    if (isFinished || !this.mouseDown || isRunning) return;
    if (this.startNodeMouseDown) {
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.add(
        `node-start`
      );
    } else if (drawingMode === "filled rectangle") {
      this.createAndRenderRectangle(row, col, { fill: true, add: true });
    } else if (drawingMode === "rectangle") {
      this.createAndRenderRectangle(row, col, { fill: false, add: true });
    } else if (drawingMode === "free") {
      if (drawingElement === "wall") {
        this.changeNodeWall(row, col, { toggle: true });
      }
      if (drawingElement === "dust") {
        this.changeNodeDust(row, col, { add: true });
      }
    }
  };

  handleMouseLeave = (row, col) => {
    const { drawingMode } = this.props;
    const { isFinished, isRunning } = this.context.state;
    if (isFinished || isRunning) return;
    if (this.startNodeMouseDown) {
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.remove(
        `node-start`
      );
      console.log(
        "removed node-start in handleMouseLeave from node" + row + "-" + col
      );
    } else if (this.mouseDown) {
      if (drawingMode === "rectangle") {
        this.createAndRenderRectangle(row, col, {
          fill: false,
          toggle: true,
        });
      } else if (drawingMode === "filled rectangle") {
        this.createAndRenderRectangle(row, col, { fill: true, toggle: true });
      }
    }
  };

  createAndRenderRectangle = (row, col, { fill, add, toggle }) => {
    const { drawingElement } = this.props;
    const rectangleNodes = this.calculateRectangleNodes(row, col, {
      fill,
    });
    if (add) {
      if (drawingElement === "wall") {
        rectangleNodes.forEach((node) =>
          this.changeNodeWall(node.row, node.col, { add: true })
        );
      }
      if (drawingElement === "dust") {
        rectangleNodes.forEach((node) =>
          this.changeNodeDust(node.row, node.col, { add: true })
        );
      }
    } else {
      if (drawingElement === "wall") {
        rectangleNodes.forEach((node) =>
          this.changeNodeWall(node.row, node.col, { toggle: true })
        );
      }
      if (drawingElement === "dust") {
        rectangleNodes.forEach((node) =>
          this.changeNodeDust(node.row, node.col, { remove: true })
        );
      }
    }
  };

  handleMouseUp = (row, col) => {
    const { isFinished, isRunning, grid } = this.context.state;
    const { updateState } = this.context;
    const node = grid[row][col];
    const nodeDOM = ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]);
    console.log(this.context.state.grid[row][col]);
    console.log(
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList
    );
    console.log(this.context.state.grid[row][col].dust);

    if (isFinished || isRunning) return;
    if (this.startNodeMouseDown) {
      if (node.isWall) {
        this.changeNodeWall(row, col, { remove: true });
      }
      if (node.dust) {
        this.changeNodeDust(row, col, { remove: true });
      }
      nodeDOM.classList.add(`node-start`);
      updateState("startNode", { row: row, col: col });
    }
    this.startNodeMouseDown = false;
    this.mouseDown = false;
  };

  calculateRectangleNodes = (row, col, { fill }) => {
    const rectangleNodes = [];
    const startPoint = this.rectLocStart;
    const endPoint = { row, col };
    const upperPoint = startPoint.row < endPoint.row ? startPoint : endPoint;
    const leftPoint = startPoint.col < endPoint.col ? startPoint : endPoint;
    const rowDiff = Math.abs(startPoint.row - endPoint.row);
    const colDiff = Math.abs(startPoint.col - endPoint.col);
    for (let i = upperPoint.row; i <= rowDiff + upperPoint.row; i++) {
      for (let j = leftPoint.col; j <= colDiff + leftPoint.col; j++) {
        if (!fill) {
          if (
            (j === startPoint.col ||
              j === endPoint.col ||
              i === startPoint.row ||
              i === endPoint.row) &&
            !this.context.isStartNode(i, j)
          ) {
            rectangleNodes.push({ row: i, col: j });
          }
        } else {
          rectangleNodes.push({ row: i, col: j });
        }
      }
    }
    return rectangleNodes;
  };

  changeNodeWall = (row, col, { toggle, add, remove }) => {
    const node = this.context.state.grid[row][col];
    const nodeDOM = ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]);

    if (!this.context.isStartNode(row, col)) {
      if (node.dust) {
        this.changeNodeDust(row, col, { remove: true });
      }
      if (toggle) {
        nodeDOM.classList.toggle("node-wall");
        node.isWall = !node.isWall;
      } else if (add) {
        nodeDOM.classList.add("node-wall");
        node.isWall = true;
      } else if (remove) {
        nodeDOM.classList.remove("node-wall");
        node.isWall = false;
      }
    }
  };
  changeNodeDust = (row, col, { remove, add, fixed }) => {
    const node = this.context.state.grid[row][col];
    if (node.isWall) return;
    const nodeDOM = ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]);
    if (!this.context.isStartNode(row, col)) {
      const dust = node.dust;
      if (add) {
        if (node.dust < 9) {
          nodeDOM.classList.add(`dust-${dust + 1}`);
          if (dust > 0) {
            nodeDOM.classList.remove(`dust-${dust}`);
          }
          node.dust++;
        } else if (node.dust === 9) {
          nodeDOM.classList.remove(`dust-9`);
          node.dust = 0;
        }
      } else if (remove) {
        nodeDOM.classList.remove(`dust-${dust}`);
        node.dust = 0;
      }
    }
  };

  visualize = (visitedNodesInOrder) => {
    const visualizationArray = [];
    visitedNodesInOrder.forEach((node) => {
      for (let i = 0; i < node.dust + 1; i++) {
        visualizationArray.push(node);
      }
    });
    for (let i = 0; i < visualizationArray.length; i++) {
      const node = visualizationArray[i];
      const { row, col } = node;
      const nodeDOM = ReactDOM.findDOMNode(
        this.refs[`node-${node.row}-${node.col}`]
      );
      if (i === visualizationArray.length) {
        setTimeout(() => {
          this.context.updateState("isRunning", false);
          this.context.updateState("isFinished", true);
        }, this.speed * i);
        return;
      }
      setTimeout(() => {
        let { availableSteps } = this.context.state;
        nodeDOM.classList.add("node-visited");
        this.changeNodeDust(row, col, { remove: true });
        this.context.updateState("availableSteps", availableSteps - 1);
      }, this.speed * i);
      setTimeout(() => {
        nodeDOM.classList.remove("node-visited");
      }, this.speed * (i + 1));
    }
  };

  /* removeDust = (node) => {
    const nodeDOM = ReactDOM.findDOMNode(
      this.refs[`node-${node.row}-${node.col}`]
    );
    nodeDOM.classList.remove(`dust-${node.dust}`);
    if (node.dust > 0) {
      node.dust--;
      nodeDOM.classList.add(`dust-${node.dust}`);
    }
  }; */

  visualizeShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      if (i === nodesInShortestPathOrder.length - 1) {
        setTimeout(() => {
          this.context.updateState("isRunning", false);
          this.context.updateState("isFinished", true);
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

  handlePlay = () => {
    const {
      simulationType,
      availableSteps,
      activeMappingAlgorithm,
      activePathfindingAlgorithm,
      startNode,
      grid,
    } = this.context.state;
    const {
      convertAvailableStepsToBatteryCapacity,
      updateState,
    } = this.context;
    const { robot } = this.context;

    const activeAlgorithmCallback =
      simulationType === "map"
        ? activeMappingAlgorithm.func
        : simulationType === "sweep"
        ? activePathfindingAlgorithm.func
        : undefined;

    if (
      !activeAlgorithmCallback ||
      convertAvailableStepsToBatteryCapacity() === 0
    )
      return;
    updateState("isRunning", true);

    robot.syncMapLayoutWithGrid(grid);

    const robotPath = activeAlgorithmCallback(
      grid,
      robot.map,
      robot.map[startNode.row][startNode.col],
      availableSteps
    );

    if (simulationType === "map") {
      robot.updateMap(robotPath);
    }
    this.visualize(robotPath);
    /* this.context.updateState("isRunning", false);
    this.context.updateState("isFinished", true); */
  };

  handleClearWalls = () => {
    const { setClearWallsRequest } = this.props;
    for (let row = 0; row < this.context.gridHeight; row++) {
      for (let col = 0; col < this.context.gridWidth; col++) {
        if (!this.context.isStartNode(row, col)) {
          if (this.context.state.grid[row][col].isWall) {
            this.changeNodeWall(row, col, { remove: true });
          }
        }
      }
    }
    setClearWallsRequest({ requested: false, cleared: true });
  };
  handleClearDust = () => {
    const { setClearDustRequest } = this.props;
    for (let row = 0; row < this.context.gridHeight; row++) {
      for (let col = 0; col < this.context.gridWidth; col++) {
        if (!this.context.isStartNode(row, col)) {
          if (this.context.state.grid[row][col].dust) {
            this.changeNodeDust(row, col, { remove: true });
          }
        }
      }
    }
    setClearDustRequest({ requested: false, cleared: true });
  };

  componentDidUpdate() {
    if (this.props.isClearWallsRequested.requested) {
      this.handleClearWalls();
    }
    if (this.props.isClearDustRequested.requested) {
      this.handleClearDust();
    }
    if (this.context.state.layoutLoaded) {
      this.resetNodeStyles({
        setWalls: true,
        resetVisited: true,
        resetShortestPath: true,
      });
      this.context.updateState("layoutLoaded", false);
    }
    if (this.props.isHighlightMapRequested) {
      const { map } = this.context.robot;
      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[0].length; col++) {
          if (map[row][col].isMapped) {
            ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.add(
              `highlight`
            );
          }
        }
      }
    }
    if (!this.props.isHighlightMapRequested) {
      const { map } = this.context.robot;
      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[0].length; col++) {
          if (map[row][col]) {
            ReactDOM.findDOMNode(
              this.refs[`node-${row}-${col}`]
            ).classList.remove(`highlight`);
          }
        }
      }
    }
  }

  render() {
    const { grid } = this.context.state;
    return (
      <>
        <Controls
          onResetButtonClicked={this.handleReset}
          onPlayButtonClicked={this.handlePlay}
          onSpeedChange={this.handleSpeedChanged}
          onGridSizeChange={this.handleGridSizeChange}
        />
        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((node) => {
                const { row, col, isStart, dust } = node;
                return (
                  <Node
                    key={`node-${row}-${col}`}
                    ref={`node-${row}-${col}`}
                    row={row}
                    col={col}
                    isStart={isStart}
                    dust={dust}
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
