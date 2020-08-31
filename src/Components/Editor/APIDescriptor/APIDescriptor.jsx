import React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import Descriptor from "./Descriptor.jsx";

import parameters from "./parameters";
import functions from "./functions";

import APIDescriptorStyles, {
  PaperComponent,
} from "./APIDescriptor.Styles.jsx";

const useStyles = APIDescriptorStyles;

const APIDescriptor = (props) => {
  const { showAPI, setShowAPI } = props;
  const classes = useStyles();
  const handleClose = () => {
    setShowAPI(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (showAPI) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [showAPI]);

  return (
    <Dialog
      open={showAPI}
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
          API Description
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6">Parameters:</Typography>
        <Divider className={classes.divider} variant="inset" />
        {parameters.map((param) => (
          <Descriptor
            key={param.name}
            name={param.name}
            snippet={param.snippet}
            description={param.description}
            descriptionElementRef={descriptionElementRef}
          />
        ))}

        <Typography variant="h6">Functions:</Typography>
        <Divider className={classes.divider} variant="inset" />
        {functions.map((func) => (
          <Descriptor
            key={func.name}
            name={func.name}
            description={func.description}
            snippet={func.snippet}
            descriptionElementRef={descriptionElementRef}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          DISMISS
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default APIDescriptor;
