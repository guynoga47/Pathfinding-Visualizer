import React, { PureComponent } from "react";
import "./Node.css";

export default class Node extends PureComponent {
  render() {
    const {
      row,
      col,
      isStart,
      isFinish,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
      dust,
    } = this.props;
    const extraClassName = isStart
      ? "node-start"
      : isFinish
      ? "node-finish"
      : "";

    /* this pattern of sending the handlers for div from the parent could be costly performance wise, because
    the functions recreates on each re-render. luckily we barely do any rerenders of the divs. */
    const nodeJSX = (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName} dust-${dust}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseUp={() => onMouseUp(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseLeave={() => onMouseLeave(row, col)}
        onDragStart={(e) => e.preventDefault()}
      ></div>
    );
    return nodeJSX;
  }
}
