import React, { useContext } from "react";

import SpeedSlider from "./SpeedSlider/SpeedSlider";
import GridSizeSlider from "./GridSizeSlider/GridSizeSlider";
import IconButton from "@material-ui/core/IconButton";
import PlayIcon from "@material-ui/icons/PlayCircleFilledWhite";
import ResetIcon from "@material-ui/icons/RotateLeftTwoTone";
import Spinner from "./Spinner/Spinner";

import ControlStyles from "./Playback.Styles";
import GridContext from "../../Context/grid-context";

export const DEFAULT_SPEED = 200;

const MIN_SPEED = 130;
const MAX_SPEED = 270;

const useStyles = ControlStyles;

const Controls = ({ onReset, onPlay, onSpeedChange, onGridSizeChange }) => {
  const context = useContext(GridContext);
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <GridSizeSlider
        onGridSizeChange={onGridSizeChange}
        disabled={context.state.isRunning}
      />
      {context.state.isRunning ? (
        <IconButton disabled>
          <Spinner />
        </IconButton>
      ) : context.state.isFinished ? (
        <IconButton className={classes.button} onClick={onReset}>
          <ResetIcon className={classes.icon} />
        </IconButton>
      ) : (
        <IconButton
          className={classes.button}
          onClick={onPlay}
          disabled={
            !context.state.activeAlgorithm && !context.state.editorSimulation
          }
        >
          <PlayIcon className={classes.icon} />
        </IconButton>
      )}
      <SpeedSlider
        min={MIN_SPEED}
        max={MAX_SPEED}
        onSpeedChange={onSpeedChange}
        disabled={context.state.isRunning}
      />
    </div>
  );
};

export default Controls;
