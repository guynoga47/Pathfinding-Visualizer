import React from "react";

import DialogContent from "@material-ui/core/DialogContent";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Descriptor from "./Descriptor.jsx";
import parameters from "./parameters";
import functions from "./functions";

import DialogContainer from "../DialogContainer/DialogContainer";
import APIDescriptorStyles from "./APIDescriptor.Styles.jsx";

const useStyles = APIDescriptorStyles;

const APIDescriptor = ({ showAPI, setShowAPI }) => {
  const classes = useStyles();
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
    <DialogContainer
      title={"API Description"}
      setShowDialog={setShowAPI}
      showDialog={showAPI}
    >
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
    </DialogContainer>
  );
};

export default APIDescriptor;
