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

import {
  DEFAULT_EDITOR_MARKUP,
  createSandboxedInterpreter,
  loadScript,
  checkTimeLimitExceeded,
  restrictEditingSegment,
  extendAutocomplete,
  validateResult,
  getBenchmarkAlgorithms,
  getBenchmarkConfigs,
  measure,
} from "./editorUtils.js";

import GridContext from "../../Context/grid-context";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import "ace-builds/webpack-resolver";

/*
TODO: 

1. Save script (as js file, optional)

*/

const useStyles = editorStyles;

const Editor = (props) => {
  const classes = useStyles();
  const { open, setCodeEditorOpen } = props;

  const context = useContext(GridContext);

  const [firstMount, setFirstMount] = useState(true);
  const [showError, setShowError] = useState("");
  const [showClearWarning, setShowClearWarning] = useState("");
  const [showSuccess, setShowSuccess] = useState("");
  const [showInfo, setShowInfo] = useState(infoMessage);
  const [showAPI, setShowAPI] = useState(false);

  let ace = useRef(null);
  const { editorScript } = context.state;
  let code = editorScript;

  /*
  no need to deep copy, because strings management is probably managed with ref count, so code is detached from editorScript as soon as onChange
  happens, and we avoid changing the state directly
  */

  const onChange = (currentCode) => {
    code = currentCode;
  };

  const handleBenchmark = () => {
    const { simulationType, userAlgorithmResult } = context.state;
    if (!userAlgorithmResult) return;
    const benchmarkAlgorithms = getBenchmarkAlgorithms(simulationType).concat([
      { name: "User Script", code: code },
    ]);
    const benchmarkConfigs = getBenchmarkConfigs();
    const scores = [];
    for (const [i, algorithm] of benchmarkAlgorithms.entries()) {
      scores.push([]);
      for (const [cfgName, cfg] of Object.entries(benchmarkConfigs)) {
        scores[parseInt(i)].push({
          algName: algorithm.name,
          cfgName: `${cfgName}`,
          result: measure(algorithm, cfg, simulationType),
        });
      }
    }
  };

  const handleLoad = () => {
    /*set some flag to visualizer to initialize handlePlay function with the evaluation of the user code*/
    context.updateState("editorScript", code);
    const interpreter = createSandboxedInterpreter(code, context);

    try {
      checkTimeLimitExceeded(interpreter);

      interpreter.run();

      const result = interpreter.pseudoToNative(interpreter.value);

      validateResult(result, context);

      setShowSuccess(`Well done!
      You may exit the editor and click the Play button.`);
      context.updateState("userAlgorithmResult", {
        path: result,
      });
    } catch (err) {
      setShowError(err.message);
      context.updateState("userAlgorithmResult", false);
    }
  };

  const handleCancelClearRequest = () => {
    setShowClearWarning("");
  };

  const handleConfirmClearRequest = () => {
    setShowClearWarning("");
    code = DEFAULT_EDITOR_MARKUP;
    context.updateState("editorScript", code);
  };

  const handleClose = () => {
    setShowError("");
    setShowSuccess("");
    context.updateState("editorScript", code);
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
              onClick={handleBenchmark}
            >
              BENCHMARK
            </Button>
            <Button
              autoFocus
              className={classes.editorBtn}
              color="inherit"
              onClick={() => {
                context.updateState("editorScript", code);
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
          value={editorScript}
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
