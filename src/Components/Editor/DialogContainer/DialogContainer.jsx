import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

import APIDescriptorStyles, {
  PaperComponent,
} from "../APIDescriptor/APIDescriptor.Styles.jsx";

const useStyles = APIDescriptorStyles;

const DialogContainer = ({ title, showDialog, setShowDialog, children }) => {
  const classes = useStyles();
  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    <Dialog
      open={Boolean(showDialog)}
      PaperComponent={PaperComponent}
      scroll="paper"
      maxWidth="md"
      fullWidth
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle
        id="draggable-dialog-title"
        className={classes.dialogTitle}
        disableTypography
      >
        <Typography variant="h4" className={classes.topTitle}>
          {title}
        </Typography>
      </DialogTitle>
      {children}
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          DISMISS
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogContainer;
