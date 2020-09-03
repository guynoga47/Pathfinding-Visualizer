import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "../Sliders/Base";

const useStyles = makeStyles({
  root: {
    width: 200,
    marginLeft: "2em",
    textAlign: "center",
  },
});

export default function ContinuousSlider(props) {
  const classes = useStyles();
  const { disabled, min, max } = props;
  const [value, setValue] = React.useState((max + min) / 2);
  const handleChange = (event, sliderValue) => {
    let calculatedSpeed = Math.abs(sliderValue - (max + min));
    setValue(sliderValue);
    props.onSpeedChange(calculatedSpeed);
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
