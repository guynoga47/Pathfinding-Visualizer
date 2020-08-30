import React from "react";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  topAppBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  editorBtn: {
    color: "white",
    "&:hover": {
      color: "#66FCF1 !important",
      background: "#1f2833",
      borderColor: "black !important",
      transition: "all 0.4s ease 0s",
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    /*border: "2px solid #000", */
    boxShadow: theme.shadows[5],
  },
}));

export const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
