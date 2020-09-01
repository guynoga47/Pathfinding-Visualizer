/* eslint-disable no-undef */
import React, { useContext, useEffect, useState, useRef } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import APIDescriptor from "./APIDescriptor/APIDescriptor";

import editorStyles, { Transition } from "./Editor.Styles";
import Message from "./Message/Message";
import { infoMessage } from "./Message/messages";

import AceEditor from "react-ace";
import Interpreter from "js-interpreter";

import {
  DEFAULT_EDITOR_MARKUP,
  EXECUTE,
  compileToES5,
  loadScript,
  checkTimeLimitExceeded,
  restrictEditingSegment,
  extendAutocomplete,
  establishEnvironment,
  validateResult,
} from "./editorUtils.js";

import GridContext from "../../Context/grid-context";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import "ace-builds/webpack-resolver";

/*
TODO: 

1. Save script (as js file, optional)
2. Verification on CLEAR commands. Modal with ACCEPT CANCEL buttons.
*/

const useStyles = editorStyles;

const Editor = (props) => {
  const classes = useStyles();
  const context = useContext(GridContext);
  const [firstMount, setFirstMount] = useState(true);
  const [showError, setShowError] = useState("");
  const [showClearWarning, setShowClearWarning] = useState("");
  const [showSuccess, setShowSuccess] = useState("");
  const [showInfo, setShowInfo] = useState(infoMessage);
  const [showAPI, setShowAPI] = useState(false);

  let ace = useRef(null);
  const { userScript } = context.state;
  let code = userScript;
  /*
  no need to deep copy, because strings management is probably managed with ref count, so code is detached from userScript as soon as onChange
  happens, and we avoid changing the state directly
  */

  const { open, setCodeEditorOpen } = props;

  const onChange = (currentCode) => {
    code = currentCode;
  };

  const handleLoad = () => {
    /*set some flag to visualizer to initialize handlePlay function with the evaluation of the user code*/
    context.updateState("userScript", code);
    let myInterpreter = new Interpreter(compileToES5(code));
    myInterpreter.appendCode(EXECUTE);
    establishEnvironment(context, myInterpreter);

    try {
      checkTimeLimitExceeded(myInterpreter);

      myInterpreter.run();
      const result = myInterpreter.pseudoToNative(myInterpreter.value);

      validateResult(result, context);

      setShowSuccess(`Well done!
      You may exit the editor and click the Play button.`);
      context.updateState("userRun", { path: result });
    } catch (err) {
      setShowError(err.message);
      context.updateState("userRun", false);
    }
  };

  const handleCancelClearRequest = () => {
    setShowClearWarning("");
  };

  const handleConfirmClearRequest = () => {
    setShowClearWarning("");
    code = DEFAULT_EDITOR_MARKUP;
    context.updateState("userScript", code);
  };

  const handleClose = () => {
    setShowError("");
    setShowSuccess("");
    context.updateState("userScript", code);
    setCodeEditorOpen(false);
  };

  useEffect(() => {
    const loadBabel = loadScript;
    loadBabel("https://unpkg.com/@babel/standalone/babel.min.js");
  }, []);

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.topAppBar}>
          <Toolbar>
            <IconButton
              className={classes.editorBtn}
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}></Typography>
            <Button
              autoFocus
              className={classes.editorBtn}
              onClick={() => setShowInfo(infoMessage)}
              color="inherit"
            >
              INFO
            </Button>
            <Button
              autoFocus
              className={classes.editorBtn}
              color="inherit"
              onClick={() => setShowAPI(true)}
            >
              API
            </Button>
            <Button
              autoFocus
              className={classes.editorBtn}
              color="inherit"
              onClick={() => {
                context.updateState("userScript", code);
                setShowClearWarning(
                  "Are you sure you want to restore code back to default?"
                );
              }}
            >
              CLEAR
            </Button>
            <Button
              autoFocus
              className={classes.editorBtn}
              color="inherit"
              onClick={handleLoad}
            >
              LOAD
            </Button>
          </Toolbar>
        </AppBar>
        <AceEditor
          ref={ace}
          name="ace-editor"
          mode="javascript"
          theme="monokai"
          width={"100%"}
          height={"100%"}
          value={userScript}
          fontSize={18}
          onLoad={(editor) => {
            restrictEditingSegment(editor);
            extendAutocomplete(editor);
          }}
          showPrintMargin={false}
          onChange={onChange}
          setOptions={{
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
        <Message
          message={showError}
          setMessage={setShowError}
          animationDelay={500}
          topTitle={`Error!\n`}
          variant="filled"
          severity="error"
        />
        <Message
          message={showSuccess}
          setMessage={setShowSuccess}
          animationDelay={500}
          topTitle={`Loading Completed!\n`}
          variant="filled"
          severity="success"
        />
        <Message
          message={showInfo}
          setMessage={setShowInfo}
          onClose={() => setFirstMount(false)}
          animationDelay={firstMount ? 1500 : 500}
          topTitle={`Welcome!\n`}
          bottomTitle={`Enjoy and code carefully!`}
          variant="filled"
          severity="info"
        />
        <Message
          message={showClearWarning}
          setMessage={setShowClearWarning}
          animationDelay={500}
          topTitle={`Warning!\n`}
          variant="filled"
          severity="warning"
        >
          <Grid container direction="row" justify="flex-end">
            <Grid item>
              <Button
                className={classes.warnMsgBtn}
                variant="outlined"
                color="secondary"
                onClick={handleCancelClearRequest}
              >
                CANCEL
              </Button>
            </Grid>
            <Grid item>
              <Button
                className={classes.warnMsgBtn}
                variant="outlined"
                color="secondary"
                onClick={handleConfirmClearRequest}
              >
                CONFIRM
              </Button>
            </Grid>
          </Grid>
        </Message>
        <APIDescriptor showAPI={showAPI} setShowAPI={setShowAPI} />
      </Dialog>
    </div>
  );
};

export default Editor;
