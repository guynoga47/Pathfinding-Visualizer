import React, { PureComponent } from "react";
import StartNodeIcon from "@material-ui/icons/KeyboardArrowRight";
import FinishNodeIcon from "@material-ui/icons/TrackChanges";
import "./Node.css";

/* using class component because we are using refs in the Pathfinding component, and refs can only be applied to
class components */

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
    } = this.props;
    const extraClassName = isStart
      ? "node-start"
      : isFinish
      ? "node-finish"
      : "";
    if (isStart || isFinish) {
      console.log(`rendering node-${row}-${col}`);
      console.log(`${extraClassName}`);
    }
    const nodeJSX = (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
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
