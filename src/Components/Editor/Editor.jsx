/* eslint-disable no-undef */
import React, { useContext, useEffect, useRef } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import editorStyles, { Transition } from "./Editor.Styles";

import AceEditor from "react-ace";
import Interpreter from "js-interpreter";

import {
  DEFAULT_EDITOR_MARKUP,
  EXECUTE,
  compileToES5,
  loadScript,
  checkTimeLimitExceeded,
  restrictEditingSegment,
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
1. add CLEAR button.
2. Save script (as js file, optional)
3. Style all buttons.
*/

const useStyles = editorStyles;

const Editor = (props) => {
  const classes = useStyles();
  const context = useContext(GridContext);
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

    let myInterpreter = new Interpreter(compileToES5(code));
    myInterpreter.appendCode(EXECUTE);
    establishEnvironment(context, myInterpreter);

    try {
      checkTimeLimitExceeded(myInterpreter);

      myInterpreter.run();
      const result = myInterpreter.pseudoToNative(myInterpreter.value);

      validateResult(result, context);

      context.updateState("userRun", { path: result });

      handleClose();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClear = () => {
    code = DEFAULT_EDITOR_MARKUP;
    context.updateState("userScript", code);
  };

  const handleClose = () => {
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
          onLoad={restrictEditingSegment}
          showPrintMargin={false}
          onChange={onChange}
          setOptions={{
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true,
            showLineNumbers: true,
            tabSize: 4,
          }}
        />
      </Dialog>
    </div>
  );
};

export default Editor;
