import React from "react";

import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Alert, AlertTitle } from "@material-ui/lab";

import messageStyles from "./Message.Styles";
import { Typography } from "@material-ui/core";

const useStyles = messageStyles;

const Message = ({
  message,
  setMessage,
  onClose,
  topTitle,
  bottomTitle,
  variant,
  severity,
  dismissable,
  animationDelay,
  children,
}) => {
  const classes = useStyles();
  return (
    <Modal
      className={classes.modal}
      open={Boolean(message)}
      onClose={() => {
        setMessage("");
        onClose && onClose();
      }}
      disableEnforceFocus
      disableAutoFocus
      disableBackdropClick={dismissable}
      disableEscapeKeyDown={dismissable}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={Boolean(message)} timeout={{ enter: animationDelay, exit: 0 }}>
        <div className={classes.paper}>
          <Alert
            classes={{ icon: classes.alertIcon }}
            variant={variant}
            severity={severity}
          >
            <AlertTitle className={classes.alert}>
              <Typography variant="h5">{topTitle}</Typography>
            </AlertTitle>
            {message}
            {children}
            <Typography variant="h6">{bottomTitle}</Typography>
          </Alert>
        </div>
      </Fade>
    </Modal>
  );
};

export default Message;
