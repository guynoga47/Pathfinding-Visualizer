import React, { Component } from "react";

import "./Node.css";

export default class Node extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.isVisited !== this.props.isVisited ||
      nextProps.isWall !== this.props.isWall ||
      nextProps.isShortestPath !== this.props.isShortestPath
    );
    /*  return true; */
  }

  render() {
    const {
      row,
      col,
      isStart,
      isFinish,
      isVisited,
      isWall,
      isShortestPath,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    } = this.props;
    const extraClassName = isStart
      ? "node-start"
      : isFinish
      ? "node-finish"
      : isVisited
      ? "node-visited"
      : isWall
      ? "node-wall"
      : isShortestPath
      ? "node-shortest-path"
      : "";
    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseUp={() => onMouseUp()}
        onMouseEnter={() => onMouseEnter(row, col)}
      ></div>
    );
  }
}

/* TODO:  */
/* 
1. Performance issues, find a way to reduce rerendering and copys on each operation.
2. implement the shortest path highlighting after finishing the algorithm. */
