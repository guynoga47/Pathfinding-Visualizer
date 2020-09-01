import React from "react";

import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Alert, AlertTitle } from "@material-ui/lab";

import messageStyles from "./Message.Styles";

const useStyles = messageStyles;

const Message = (props) => {
  const classes = useStyles();
  const { message, setMessage, messageTitle, variant, severity } = props;
  return (
    <Modal
      className={classes.modal}
      open={message}
      onClose={() => setMessage("")}
      disableEnforceFocus
      disableAutoFocus
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={message} timeout={{ enter: 500, exit: 0 }}>
        <div className={classes.paper}>
          <Alert variant={variant} severity={severity}>
            <AlertTitle>{messageTitle}</AlertTitle>
            {message}
          </Alert>
        </div>
      </Fade>
    </Modal>
  );
};

export default Message;
