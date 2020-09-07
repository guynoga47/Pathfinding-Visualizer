/* eslint-disable no-undef */
import React, { useContext, useEffect, useState, useRef } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import IconClose from "@material-ui/icons/Close";
import IconSave from "@material-ui/icons/GetApp";
import IconLoad from "@material-ui/icons/Publish";

import editorStyles, { Transition } from "./Editor.Styles";
import APIDescriptor from "./APIDescriptor/APIDescriptor";
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

  const [anchorElSaveScript, setAnchorSaveScript] = React.useState(null);
  const [anchorElLoadScript, setAnchorElLoadScript] = React.useState(null);

  let ace = useRef(null);
  const { editorScript } = context.state;
  let code = editorScript;

  /*
  no need to deep copy, because strings management is probably managed with ref count, so code is detached from editorScript as soon as onChange
  happens, and we avoid changing the state directly
  */

  const onChange = (currentCode) => {
    /* we dont want to set state on each change because it causes stuttering when typing*/
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

  const handleLoadUserScript = (event) => {
    const reader = new FileReader();
    reader.onload = () => {
      const { editorScript } = JSON.parse(reader.result);
      context.loadUserScript(editorScript);
    };
    reader.readAsText(event.target.files[0]);
  };

  const handleSaveUserCode = () => {
    context.updateState("editorScript", code, context.saveUserScript);
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

  const handlePopoverOpen = (event) => {
    switch (event.currentTarget.id) {
      case "btn-saveScript":
        setAnchorSaveScript(event.currentTarget);
        break;
      case "btn-loadScript":
        setAnchorElLoadScript(event.currentTarget);
        break;
      default:
        console.log("Default case entered in Editor.jsx: handlePopoverOpen");
    }
  };

  const handlePopoverClose = (event) => {
    switch (event.currentTarget.id) {
      case "btn-saveScript":
        setAnchorSaveScript(null);
        break;
      case "btn-loadScript":
        setAnchorElLoadScript(null);
        break;
      default:
        console.log("Default case entered in Editor.jsx: handlePopoverClose");
    }
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
              className={classes.editorBtn}
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <IconClose />
            </IconButton>
            <input
              accept=".json"
              className={classes.input}
              id="icon-button-load-script"
              onChange={handleLoadUserScript}
              onClick={(event) => {
                //to allow consecutive selection of same files, we need to clear input value after each click.
                event.target.value = "";
              }}
              type="file"
            />
            <label htmlFor="icon-button-load-script">
              <IconButton
                id={"btn-loadScript"}
                className={classes.editorBtn}
                onMouseOver={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                component={"span"}
                htmlFor="icon-button-load-config"
              >
                <IconLoad />
              </IconButton>
            </label>
            <IconButton
              id={"btn-saveScript"}
              className={classes.editorBtn}
              edge="start"
              color="inherit"
              onMouseOver={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
              onClick={handleSaveUserCode}
              aria-label="close"
            >
              <IconSave />
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

      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorElSaveScript)}
        anchorEl={anchorElSaveScript}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>Save Script</Typography>
      </Popover>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorElLoadScript)}
        anchorEl={anchorElLoadScript}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>Load Script</Typography>
      </Popover>
    </div>
  );
};

export default Editor;
