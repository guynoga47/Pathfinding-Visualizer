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
import {
  restrictEditingSegment,
  setInterpreterScope,
  EXECUTE,
} from "./editorUtils.js";
import Interpreter from "js-interpreter";

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

  const handleRun = () => {
    /*set some flag to visualizer to initialize handlePlay function with the evaluation of the user code*/
    handleClose();

    code += EXECUTE;
    var myInterpreter = new Interpreter(code);

    setInterpreterScope(context, myInterpreter);

    let count;
    /*     for (count = 0; count < 10000000; count++) {
      let x = myInterpreter.step();
    } */
    try {
      myInterpreter.run();
    } catch (error) {
      console.log(error);
      return;
    }
    var r = myInterpreter.pseudoToNative(myInterpreter.value);
    console.log(r);

    if (count === 10000000) {
      /*handle time frame loop - throw error timeout limit exceeded*/
      return;
    }

    /*
    use interpreter to check for infinite loops.
    use try catch block to detect and show runtime errors.
    we can try to still sandbox the code by strictly defining the context. either sending window (global),
    or sending an object of objects like {grid:grid, map:map...} and the function.
     */
  };

  const handleClose = () => {
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
            <Button autoFocus color="inherit" onClick={handleRun}>
              RUN
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
