import React, { useContext } from "react";

import SpeedSlider from "../SliderContinuous/ContinuousSlider";
import GridSizeSlider from "../SliderRestricted/RestrictedSlider";
import IconButton from "@material-ui/core/IconButton";
import PlayIcon from "@material-ui/icons/PlayCircleFilledWhite";
import ResetIcon from "@material-ui/icons/RotateLeftTwoTone";
import Spinner from "../Spinner/Spinner";

import ControlStyles from "./Controls.Styles";
import GridContext from "../../Context/grid-context";

export const DEFAULT_SPEED = 200;

const MIN_SPEED = 130;
const MAX_SPEED = 270;

const useStyles = ControlStyles;

const Controls = (props) => {
  const context = useContext(GridContext);
  const classes = useStyles();
  const {
    onResetButtonClicked,
    onPlayButtonClicked,
    onSpeedChange,
    onGridSizeChange,
  } = props;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "2em",
        marginRight: "7.5em",
      }}
    >
      <GridSizeSlider
        onGridSizeChange={onGridSizeChange}
        disabled={context.state.isRunning}
      />
      {context.state.isRunning ? (
        <IconButton disabled>
          <Spinner />
        </IconButton>
      ) : context.state.isFinished ? (
        <IconButton className={classes.button} onClick={onResetButtonClicked}>
          <ResetIcon style={{ fontSize: "2em" }} />
        </IconButton>
      ) : (
        <IconButton
          className={classes.button}
          onClick={onPlayButtonClicked}
          disabled={
            !context.state.activeMappingAlgorithm &&
            !context.state.activeCleaningAlgorithm
          }
        >
          <PlayIcon style={{ fontSize: "2em" }} />
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

/*
TODO
1. Centralize styles
*/
