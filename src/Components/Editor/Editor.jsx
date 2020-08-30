import React, { useContext, useRef } from "react";

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
  checkTimeLimitExceeded,
  restrictEditingSegment,
  setInterpreterScope,
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
  function loadScript(url, callback) {
    let script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) {
      //IE
      script.onreadystatechange = function () {
        if (
          script.readyState === "loaded" ||
          script.readyState === "complete"
        ) {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      //Others
      script.onload = function () {
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }

  loadScript("https://unpkg.com/@babel/standalone/babel.min.js", (e) => {
    // eslint-disable-next-line no-undef

    // eslint-disable-next-line no-undef
    console.log(Babel.transform);
  });

  const classes = useStyles();
  const context = useContext(GridContext);
  let ace = useRef(null);
  const { userScript } = context.state;
  let code = userScript;

  /*   <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.7.7/babel.min.js"></script>
<script text="text/babel">
var input = 'const getMessage = () => "Hello World";';
var output = Babel.transform(input, { presets: ['es2015'] }).code;
console.log(output);
</script>
  console.log(output); */

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
    let myInterpreter = new Interpreter(code);
    myInterpreter.appendCode(EXECUTE);

    /* myInterpreter.appendCode(`function getNeighbors(node, grid) {
        let x = 1;
        return x + 2;
      }`); */
    setInterpreterScope(context, myInterpreter);

    try {
      checkTimeLimitExceeded(myInterpreter);
      myInterpreter.run();
      const res = myInterpreter.pseudoToNative(myInterpreter.value);

      alert(res);
      console.log(res);
      handleClose();

      validateResult(context, res);
      context.updateState("userRun", { path: res });
      handleClose();
    } catch (error) {
      //display error in Modal.
      alert(error.message);
    }
  };

  const handleClear = () => {
    code = DEFAULT_EDITOR_MARKUP;
    context.updateState("userScript", code);
  };

  const handleClose = () => {
    /*To avoid appending EXECUTE substring on consequetive LOAD commands without running. */
    context.updateState("userScript", code);
    setCodeEditorOpen(false);
  };

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
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}></Typography>
            <Button autoFocus color="inherit" onClick={handleClear}>
              CLEAR
            </Button>
            <Button autoFocus color="inherit" onClick={handleLoad}>
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
