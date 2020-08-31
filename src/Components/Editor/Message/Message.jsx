import React from "react";

import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Alert, AlertTitle } from "@material-ui/lab";

import messageStyles from "./Message.Styles";
import { Typography } from "@material-ui/core";

const useStyles = messageStyles;

const Message = (props) => {
  const classes = useStyles();
  const {
    message,
    setMessage,
    topTitle,
    bottomTitle,
    variant,
    severity,
    animationDelay,
  } = props;
  return (
    <Modal
      className={classes.modal}
      open={Boolean(message)}
      onClose={() => setMessage("")}
      disableEnforceFocus
      disableAutoFocus
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={Boolean(message)} timeout={{ enter: animationDelay, exit: 0 }}>
        <div className={classes.paper}>
          <Alert variant={variant} severity={severity}>
            <AlertTitle>
              <Typography variant="h5">{topTitle}</Typography>
            </AlertTitle>
            {message}
            <Typography variant="h6">{bottomTitle}</Typography>
          </Alert>
        </div>
      </Fade>
    </Modal>
  );
};

export default Message;
