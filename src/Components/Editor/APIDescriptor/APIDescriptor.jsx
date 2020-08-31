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

export default function ScrollDialog(props) {
  const { showAPI, setShowAPI } = props;
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
      scroll="paper"
      maxWidth="md"
      fullWidth
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle
        id="scroll-dialog-title"
        textAlign="center"
        disableTypography
        style={{ letterSpacing: 0 }}
      >
        <Typography variant="h4" style={{ textAlign: "center" }}>
          API Description
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6">Parameters:</Typography>
        <Divider
          variant="inset"
          style={{ marginLeft: 0, marginBottom: "1em" }}
        />
        {parameters.map((property) => (
          <Descriptor
            name={property.name}
            snippet={property.snippet}
            description={property.description}
            descriptionElementRef={descriptionElementRef}
          />
        ))}

        <Typography variant="h6">Functions:</Typography>
        <Divider
          variant="inset"
          style={{ marginLeft: 0, marginBottom: "1em" }}
        />
        {functions.map((func) => (
          <Descriptor
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
}
