import React, { PureComponent } from "react";

import "./Node.css";

export default class Node extends PureComponent {
  render() {
    const {
      row,
      col,
      isStart,
      isFinish,
      isWall,
      isVisited,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
    } = this.props;
    const extraClassName = isStart
      ? "node-start"
      : isFinish
      ? "node-finish"
      : isWall
      ? "node-wall"
      : isVisited
      ? "node-visited"
      : "";
    /*     console.log(`rerendering node [${row},${col}]`); */

    return (
      <div
        id={`node-${row}-${col}`}
        /*         draggable={true} */
        className={`node ${extraClassName} non-draggable`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseUp={() => onMouseUp(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseLeave={() => onMouseLeave(row, col)}
        onDragStart={(e) => e.preventDefault()}
        /*         onDragStart={() => console.log("drag start")}
        onDragEnter={() => console.log("dragging entered")}
        onDragLeave={() => console.log("drag leaves")}
        onDragEnd={() => {
          console.log("dropped");
        }} */
      ></div>
    );
  }
}
