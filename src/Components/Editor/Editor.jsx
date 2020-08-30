/* eslint-disable no-undef */
import React, { useContext, useEffect, useState, useRef } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";

import editorStyles, { Transition } from "./Editor.Styles";
import Message from "./Message";

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
3. Look in the scope if there are any functions that use other function we didn't include.
4. Adjust auto complete of editor to include the functions we added to the scope.
*/

const useStyles = editorStyles;

const Editor = (props) => {
  const classes = useStyles();
  const context = useContext(GridContext);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

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

      setSuccess(`Well done!
      You may exit the editor and click the Play button.`);
      context.updateState("userRun", { path: result });
      /* setTimeout(() => {
        handleClose();
      }, 4000); */
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClear = () => {
    code = DEFAULT_EDITOR_MARKUP;
    context.updateState("userScript", code);
  };

  const handleClose = () => {
    setError("");
    setSuccess("");
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
              color="inherit"
              onClick={handleClear}
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
          message={error}
          setMessage={setError}
          messageTitle={`Error!\n`}
          variant="filled"
          severity="error"
        />
        <Message
          message={success}
          setMessage={setSuccess}
          messageTitle={`Loading Completed!\n`}
          variant="filled"
          severity="success"
        />
      </Dialog>
    </div>
  );
};

export default Editor;
