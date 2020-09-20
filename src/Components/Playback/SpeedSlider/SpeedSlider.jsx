import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "../Sliders/Base";
import SpeedSliderStyles from "./SpeedSlider.Styles";

const useStyles = SpeedSliderStyles;

export default function SpeedSlider({ disabled, min, max, onSpeedChange }) {
  const classes = useStyles();
  const [value, setValue] = React.useState((max + min) / 2);
  const handleChange = (event, sliderValue) => {
    let calculatedSpeed = Math.abs(sliderValue - (max + min));
    setValue(sliderValue);
    onSpeedChange(calculatedSpeed);
  };

  return (
    <div className={classes.root}>
      <Typography id="continuous-slider" gutterBottom>
        Speed
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs>
          <Slider
            value={value}
            max={max}
            min={min}
            onChange={handleChange}
            disabled={disabled}
            aria-labelledby="continuous-slider"
          />
        </Grid>
      </Grid>
    </div>
  );
}
