import React, { Component } from "react";
import ReactDOM from "react-dom";

import Node from "../Node/Node";
import Playback, { DEFAULT_SPEED } from "../Playback/Playback";

import "./Visualizer.css";

import GlobalContext from "../../Context/global-context";

export default class Visualizer extends Component {
  static contextType = GlobalContext;

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
    this.context.resetGridWithCurrentConfiguration(this.applyNodesStyles, {
      setWalls: true,
      setDust: true,
    });
  };

  handleGridSizeChange = (height) => {
    if (height === this.context.gridHeight) return;
    this.context.resizeGrid(height, this.applyNodesStyles, {
      removeWalls: true,
      removeDust: true,
      removeHighlight: true,
    });
  };

  applyNodesStyles = ({
    removeHighlight,
    removeWalls,
    removeDust,
    setWalls,
    setDust,
    setHighlight,
  }) => {
    const { grid } = this.context.state;
    const { robot } = this.context;
    for (let nodeRef in this.refs) {
      const row = parseInt(nodeRef.split("-")[1]);
      const col = parseInt(nodeRef.split("-")[2]);
      const gridNode = grid[row][col];
      const mapNode = robot.map[row][col];
      const nodeDOM = ReactDOM.findDOMNode(this.refs[nodeRef]);
      if (removeWalls) {
        nodeDOM.classList.remove("node-wall");
      }
      if (removeDust) {
        if (nodeDOM.classList.length > 1) {
          const dust = nodeDOM.classList[1];
          nodeDOM.classList.remove(`${dust}`);
        }
      }
      if (removeHighlight) {
        if (mapNode.isMapped) {
          nodeDOM.classList.remove("highlight");
          if (gridNode.dust) {
            nodeDOM.classList.add(`dust-${gridNode.dust}`);
          }
        }
      }
      if (setWalls) {
        nodeDOM.classList.remove("node-wall");
        if (gridNode.isWall) {
          nodeDOM.classList.add("node-wall");
        }
      }
      if (setDust) {
        if (gridNode.dust) {
          nodeDOM.classList.add(`dust-${gridNode.dust}`);
        }
      }
      if (setHighlight) {
        if (mapNode.isMapped) {
          nodeDOM.classList.add("highlight");
          if (gridNode.dust) {
            const dust = nodeDOM.classList[1];
            nodeDOM.classList.remove(`${dust}`);
          }
        }
      }
      if (!this.context.isStartNode(row, col))
        nodeDOM.classList.remove(`node-start`);
      else {
        nodeDOM.classList.add(`node-start`);
      }
    }
  };

  handleMouseDown = (row, col) => {
    const { drawMethod, drawItem, isFinished, isRunning } = this.context.state;

    if (isFinished || isRunning) return;
    this.mouseDown = true;
    if (this.context.isStartNode(row, col)) {
      this.startNodeMouseDown = true;
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.remove(
        `node-start`
      );
    } else {
      if (drawMethod === "rectangle" || drawMethod === "filled rectangle") {
        this.rectLocStart = { row, col };
      }
      if (drawItem === "wall") {
        this.changeNodeWall(row, col, { toggle: true });
      }
      if (drawItem === "dust") {
        this.changeNodeDust(row, col, { add: true });
      }
    }
  };

  handleMouseEnter = (row, col) => {
    const { drawMethod, drawItem, isFinished, isRunning } = this.context.state;

    if (isFinished || !this.mouseDown || isRunning) return;
    if (this.startNodeMouseDown) {
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.add(
        `node-start`
      );
    } else if (drawMethod === "filled rectangle") {
      this.createAndRenderRectangle(row, col, { fill: true, add: true });
    } else if (drawMethod === "rectangle") {
      this.createAndRenderRectangle(row, col, { fill: false, add: true });
    } else if (drawMethod === "free") {
      if (drawItem === "wall") {
        this.changeNodeWall(row, col, { toggle: true });
      }
      if (drawItem === "dust") {
        this.changeNodeDust(row, col, { add: true });
      }
    }
  };

  handleMouseLeave = (row, col) => {
    const { drawMethod, isFinished, isRunning } = this.context.state;

    if (isFinished || isRunning) return;
    if (this.startNodeMouseDown) {
      ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]).classList.remove(
        `node-start`
      );
    } else if (this.mouseDown) {
      if (drawMethod === "rectangle") {
        this.createAndRenderRectangle(row, col, {
          fill: false,
          toggle: true,
        });
      } else if (drawMethod === "filled rectangle") {
        this.createAndRenderRectangle(row, col, { fill: true, toggle: true });
      }
    }
  };

  createAndRenderRectangle = (row, col, { fill, add, toggle }) => {
    const { drawItem } = this.context.state;
    const rectangleNodes = this.calculateRectangleNodes(row, col, {
      fill,
    });

    if (add) {
      if (drawItem === "wall") {
        rectangleNodes.forEach((node) =>
          this.changeNodeWall(node.row, node.col, { add: true })
        );
      }
      if (drawItem === "dust") {
        rectangleNodes.forEach((node) =>
          this.changeNodeDust(node.row, node.col, { add: true })
        );
      }
    } else {
      if (drawItem === "wall") {
        rectangleNodes.forEach((node) =>
          this.changeNodeWall(node.row, node.col, { toggle: true })
        );
      }
      if (drawItem === "dust") {
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
  changeNodeDust = (row, col, { remove, add }) => {
    const node = this.context.state.grid[row][col];
    if (node.isWall) return;
    const nodeDOM = ReactDOM.findDOMNode(this.refs[`node-${row}-${col}`]);
    const [MIN_DUST, MAX_DUST] = [0, 9];
    if (!this.context.isStartNode(row, col)) {
      const dust = node.dust;
      if (add) {
        if (node.dust < MAX_DUST) {
          nodeDOM.classList.add(`dust-${dust + 1}`);
          if (dust > MIN_DUST) {
            nodeDOM.classList.remove(`dust-${dust}`);
          }
          node.dust++;
        } else if (node.dust === MAX_DUST) {
          nodeDOM.classList.remove(`dust-${MAX_DUST}`);
          node.dust = MIN_DUST;
        }
      } else if (remove) {
        nodeDOM.classList.remove(`dust-${dust}`);
        node.dust = MIN_DUST;
      }
    }
  };

  visualize = (visitedNodesInOrder) => {
    if (!visitedNodesInOrder || visitedNodesInOrder.length === 0) {
      this.unlockControls();
      return;
    }
    const { simulationType } = this.context.state;

    const visualizationArray =
      simulationType === "sweep"
        ? this.inflateFirstNodeOccurencesAccordingToDust(visitedNodesInOrder)
        : visitedNodesInOrder;

    for (let i = 0; i <= visualizationArray.length; i++) {
      if (i === visualizationArray.length) {
        setTimeout(() => {
          this.unlockControls();
        }, this.speed * i);
        return;
      }
      const node = visualizationArray[i];
      const { row, col } = node;
      const nodeDOM = ReactDOM.findDOMNode(
        this.refs[`node-${node.row}-${node.col}`]
      );
      setTimeout(() => {
        let { availableSteps } = this.context.state;
        if (nodeDOM === null) {
          console.log([nodeDOM, node]);
        }
        nodeDOM.classList.add("node-visited");
        if (simulationType === "sweep")
          this.changeNodeDust(row, col, { remove: true });
        if (node !== visualizationArray[i - 1]) {
          this.context.updateState("availableSteps", availableSteps - 1);
        }
      }, this.speed * i);
      setTimeout(() => {
        nodeDOM.classList.remove("node-visited");
      }, this.speed * (i + 1));
    }
  };

  inflateFirstNodeOccurencesAccordingToDust = (visitedNodesInOrder) => {
    /* 
    This function task is to allow the visualization to express a delay when the robot traverses over a node with dust.
    The delay is only visual and unrelated to the amount of steps which we calculated the visualization list by.
    */
    const set = new Set();
    const visualizationArray = [];
    visitedNodesInOrder.forEach((node) => {
      const { row, col } = node;
      const setComparableNode = JSON.stringify({ row, col });
      if (!set.has(setComparableNode)) {
        set.add(setComparableNode);
        for (let i = 0; i < node.dust + 1; i++) {
          visualizationArray.push(node);
        }
      } else {
        visualizationArray.push(node);
      }
    });
    return visualizationArray;
  };

  unlockControls = () => {
    this.context.updateState("isRunning", false);
    this.context.updateState("isFinished", true);
    if (this.context.state.editorSimulation) {
      this.context.updateState("editorSimulation", false);
    }
  };

  handlePlay = () => {
    const {
      simulationType,
      availableSteps,
      activeAlgorithm,
      startNode,
      editorSimulation,
      grid,
    } = this.context.state;
    const {
      convertAvailableStepsToBatteryCapacity,
      updateState,
      robot,
    } = this.context;

    const activeAlgorithmCallback =
      (simulationType === "map" || simulationType === "sweep") &&
      !editorSimulation &&
      activeAlgorithm.func;

    if (convertAvailableStepsToBatteryCapacity() === 0) return;

    updateState("isRunning", true);

    robot.syncMapLayoutWithGrid(grid);

    const robotPath = editorSimulation
      ? editorSimulation.path
      : activeAlgorithmCallback(
          grid,
          robot.map,
          robot.map[startNode.row][startNode.col],
          availableSteps
        );

    if (simulationType === "map" && editorSimulation?.type !== "replay") {
      robot.updateMap(robotPath);
    }
    if (editorSimulation) {
      this.context.updateState("editorSimulation", {
        ...editorSimulation,
        path: null,
      });
    }
    this.visualize(robotPath);
  };

  handleClearWalls = () => {
    const { gridHeight, gridWidth, isStartNode } = this.context;
    const { grid } = this.context.state;

    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        if (!isStartNode(row, col)) {
          if (grid[row][col].isWall) {
            this.changeNodeWall(row, col, { remove: true });
          }
        }
      }
    }
    this.context.updateState("request", false);
  };

  handleClearDust = () => {
    const { gridHeight, gridWidth, isStartNode } = this.context;
    const { grid } = this.context.state;

    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        if (!isStartNode(row, col)) {
          if (grid[row][col].dust) {
            this.changeNodeDust(row, col, { remove: true });
          }
        }
      }
    }
    this.context.updateState("request", false);
  };

  componentDidUpdate() {
    const { request, editorSimulation, configLoaded } = this.context.state;
    const isEditorSimulationRequired = () =>
      /*
      We require that the config loading process as part of the playback would be finished as well, before calling visualize.
      This is necessary because in order to access some DOM node elemnts we need the Visualizer component to sense a change in the "grid" 
      state parameter, so it would rerender it in it's correct size and also assign refs values to all of its nodes. the grid changes only 
      after loading the config, but the editorSimulation state update is not coupled with the config state update so the asynchronity of setState
      allows that editorSimulation.path can be updated before it's associated config has loaded.
      so here we actually verify that both state changes happened and only then we call visualize that relies on DOM access using refs. 
      */
      editorSimulation.path &&
      (configLoaded || editorSimulation.type === "user");

    if (isEditorSimulationRequired()) {
      this.handlePlay();
    }
    if (request === "clearWalls") {
      this.handleClearWalls();
    }
    if (request === "clearDust") {
      this.handleClearDust();
    }
    if (configLoaded) {
      this.applyNodesStyles({
        removeWalls: true,
        removeDust: true,
        setWalls: true,
        setDust: true,
      });
      this.context.updateState("configLoaded", false);
    }
    if (request === "highlightMap") {
      this.applyNodesStyles({ setHighlight: true });
    }
    if (request === "removeHighlightMap") {
      this.applyNodesStyles({ removeHighlight: true });
    }
  }

  render() {
    const { grid } = this.context.state;
    return (
      <>
        <Playback
          onReset={this.handleReset}
          onPlay={this.handlePlay}
          onSpeedChange={this.handleSpeedChanged}
          onGridSizeChange={this.handleGridSizeChange}
        />
        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((node) => {
                const { row, col } = node;
                return (
                  <Node
                    key={`node-${row}-${col}`}
                    ref={`node-${row}-${col}`}
                    row={row}
                    col={col}
                    isStart={this.context.isStartNode(row, col)}
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
