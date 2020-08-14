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
    this.mouseKeyDown = false;
    this.endPointKeyDown = "";
  }

  handleSpeedChanged = (speed) => {
    this.speed = speed;
  };

  handleReset = () => {
    this.context.updateState("isFinished", false);
    this.context.resetGridKeepWalls(this.resetNodeStyles, {
      /* resetWalls: false, */
      setWalls: true,
      resetVisited: true,
      resetShortestPath: true,
    });
  };

  handleGridSizeChange = (height) => {
    if (height === this.context.gridHeight) return;
    this.context.resizeGrid(height, this.resetNodeStyles, {
      resetWalls: true,
      resetVisited: true,
      resetShortestPath: true,
    });
  };

  resetNodeStyles = ({
    resetWalls,
    setWalls,
    resetVisited,
    resetShortestPath,
  }) => {
    for (let node in this.refs) {
      const row = parseInt(node.split("-")[1]);
      const col = parseInt(node.split("-")[2]);
      if (resetWalls) {
        ReactDOM.findDOMNode(this.refs[node]).classList.remove("node-wall");
      }
      if (setWalls) {
        ReactDOM.findDOMNode(this.refs[node]).classList.remove("node-wall");
        if (this.context.state.grid[row][col].isWall)
          ReactDOM.findDOMNode(this.refs[node]).classList.add("node-wall");
      }
      if (resetVisited) {
        ReactDOM.findDOMNode(this.refs[node]).classList.remove(`node-visited`);
      }
      if (resetShortestPath) {
        ReactDOM.findDOMNode(this.refs[node]).classList.remove(
          `node-shortest-path`
        );
      }

      if (!this.context.isStartNode(row, col))
        ReactDOM.findDOMNode(this.refs[node]).classList.remove(`node-start`);
      else {
        ReactDOM.findDOMNode(this.refs[node]).classList.add(`node-start`);
      }
      if (!this.context.isFinishNode(row, col))
        ReactDOM.findDOMNode(this.refs[node]).classList.remove(`node-finish`);
      else {
        ReactDOM.findDOMNode(this.refs[node]).classList.add(`node-finish`);
      }
    }
  };

  handleMouseDown = (row, col) => {
    const { drawingMode } = this.props;
    const { isFinished, isRunning } = this.context.state;
    if (isFinished || isRunning) return;
    this.mouseKeyDown = true;
    if (
      this.context.isStartNode(row, col) ||
      this.context.isFinishNode(row, col)
    ) {
      this.endPointKeyDown = this.context.isStartNode(row, col)
        ? "start"
        : "finish";
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.remove(
        `node-${this.endPointKeyDown}`
      );
    } else {
      if (drawingMode === "rectangle" || drawingMode === "obstacle") {
        this.rectLocStart = { row, col };
      }
      this.changeNodeWall(row, col, { toggle: true });
    }
  };

  handleMouseLeave = (row, col) => {
    const { drawingMode } = this.props;
    const { isFinished, isRunning } = this.context.state;
    if (isFinished || isRunning) return;
    if (this.endPointKeyDown) {
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.remove(
        `node-${this.endPointKeyDown}`
      );
    } else if (!this.context.isStartNode() && !this.context.isFinishNode()) {
      if (drawingMode === "rectangle") {
        if (this.mouseKeyDown) {
          this.createAndRenderRectangle(row, col, {
            fill: false,
            toggle: true,
          });
        }
      } else if (drawingMode === "obstacle") {
        if (this.mouseKeyDown) {
          this.createAndRenderRectangle(row, col, { fill: true, toggle: true });
        }
      }
    }
  };

  handleMouseEnter = (row, col) => {
    const { drawingMode } = this.props;
    const { isFinished, isRunning } = this.context.state;
    if (isFinished || !this.mouseKeyDown || isRunning) return;
    if (this.endPointKeyDown) {
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.add(
        `node-${this.endPointKeyDown}`
      );
    } else if (drawingMode === "obstacle") {
      this.createAndRenderRectangle(row, col, { fill: true, add: true });
    } else if (drawingMode === "rectangle") {
      this.createAndRenderRectangle(row, col, { fill: false, add: true });
    } else if (drawingMode === "free") {
      this.changeNodeWall(row, col, { toggle: true });
    }
  };

  createAndRenderRectangle = (row, col, { fill, add, toggle }) => {
    const rectangleNodes = this.calculateRectangleNodes(row, col, {
      fill,
    });
    if (add) {
      rectangleNodes.forEach((node) =>
        this.changeNodeWall(node.row, node.col, { add })
      );
    } else {
      rectangleNodes.forEach((node) =>
        this.changeNodeWall(node.row, node.col, { toggle })
      );
    }
  };

  handleMouseUp = (row, col) => {
    const { isFinished, isRunning, startNode, finishNode } = this.context.state;
    if (isFinished || isRunning) return;
    if (this.endPointKeyDown) {
      let endPoint = this.endPointKeyDown === "start" ? startNode : finishNode;
      endPoint.row = row;
      endPoint.col = col;
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.add(
        `node-${this.endPointKeyDown}`
      );
    }
    this.endPointKeyDown = false;
    this.mouseKeyDown = false;
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
            !this.context.isStartNode(i, j) &&
            !this.context.isFinishNode(i, j)
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

  changeNodeWall = (row, col, { toggle, add }) => {
    const node = this.context.state.grid[row][col];
    if (toggle) {
      if (
        !this.context.isStartNode(row, col) &&
        !this.context.isFinishNode(row, col)
      ) {
        ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.toggle(
          "node-wall"
        );
        node.isWall = !node.isWall;
      }
    } else if (add) {
      if (
        !this.context.isStartNode(row, col) &&
        !this.context.isFinishNode(row, col)
      ) {
        ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.add(
          "node-wall"
        );
        node.isWall = true;
      }
    }
  };

  visualize = (visitedNodesInOrder /* nodesInShortestPathOrder */) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.context.updateState("isRunning", false);
          this.context.updateState("isFinished", true);
        }, this.speed * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        let { availableSteps } = this.context.state;
        ReactDOM.findDOMNode(
          this.refs[`node-${node.row}-${node.col}`]
        ).classList.add("node-visited");
        this.context.updateState("availableSteps", availableSteps - 1);
      }, this.speed * i);
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        ReactDOM.findDOMNode(
          this.refs[`node-${node.row}-${node.col}`]
        ).classList.remove("node-visited");
      }, this.speed * (i + 1));
    }
  };

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
      modifyVisitedNodesConsideringBatteryAndReturnPath,
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

    /*     const gridCpy = this.context.getGridDeepCopy(grid);
    const mapCpy = this.context.getGridDeepCopy(robot.map); */

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
        if (
          !this.context.isStartNode(row, col) &&
          !this.context.isFinishNode(row, col)
        ) {
          if (this.context.state.grid[row][col].isWall) {
            this.changeNodeWall(row, col, { toggle: true });
          }
        }
      }
    }
    setClearWallsRequest({ requested: false, cleared: true });
  };

  componentDidUpdate() {
    if (this.props.isClearWallsRequested.requested) {
      this.handleClearWalls();
    }
    if (this.context.state.layoutLoaded) {
      //intended to detect loadLayout action.
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
                const { row, col, isStart, isFinish } = node;
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
