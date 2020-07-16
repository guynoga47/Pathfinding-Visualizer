import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStylesFacebook = makeStyles((theme) => ({
  bottom: {
    color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  top: {
    color: "#1f2833",
    animationDuration: "550ms",

    left: 0,
  },
  circle: {
    strokeLinecap: "round",
  },
}));

function CustomCircularProgress(props) {
  const classes = useStylesFacebook();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={40}
        thickness={4}
        {...props}
      />
    </div>
  );
}
export default CustomCircularProgress;
