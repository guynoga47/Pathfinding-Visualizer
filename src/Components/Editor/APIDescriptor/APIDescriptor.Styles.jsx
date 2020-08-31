import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import Draggable from "react-draggable";
import dragCursor from "../../../assets/cursors/move.cur";

export const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

export default makeStyles((theme) => ({
  divider: { marginLeft: 0, marginBottom: "1em" },
  topTitle: { textAlign: "center" },
  dialogTitle: { cursor: `url(${dragCursor}), pointer`, textAlign: "center" },
}));
