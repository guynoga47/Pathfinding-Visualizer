import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles({
  root: {
    width: 200,
    marginLeft: "2em",
    textAlign: "center",
  },
});

export default function ContinuousSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(17);
  const { disabled, min, max } = props;
  const handleChange = (event, newValue) => {
    /* let calculatedValue = Math.floor((1 / newValue) * 150); */
    let res = Math.abs(newValue - 35);
    console.log(res);
    setValue(newValue);
    props.onSpeedChange(res);
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