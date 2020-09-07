import React from "react";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  topAppBar: {
    position: "relative",
  },
  input: {
    display: "none",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  editorBtn: {
    color: "white",
    marginRight: "1em",
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
  warnMsgBtn: {
    marginBottom: 0,
    fontWeight: 500,
  },
  popover: {
    pointerEvents: "none",
  },
  popoverText: {
    padding: "5px",
  },
}));

export const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
