/* eslint-disable no-undef */
import React, { useContext, useState, useRef } from "react";

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
import IconSettings from "@material-ui/icons/Settings";

import editorStyles, { Transition } from "./Editor.Styles";
import APIDescriptor from "./APIDescriptor/APIDescriptor";
import Message from "./Message/Message";
import Benchmark from "./Benchmark/Benchmark";

import { handleCreateConfigurationsFile } from "./configsHelper";

import { INFO_MSG, SUCCESS_MSG, WARNING_MSG } from "./Message/messages";

import AceEditor from "react-ace";

import {
  createSandboxedInterpreter,
  checkTimeLimitExceeded,
  restrictEditingSegment,
  extendAutocomplete,
  validate,
  getBenchmarkAlgorithms,
  getBenchmarkConfigs,
  transformScoresToBenchmarkData,
  measure,
} from "./editorUtils.js";

import { DEFAULT_EDITOR_MARKUP } from "./code";

import GlobalContext from "../../Context/global-context";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

import "ace-builds/webpack-resolver";

const useStyles = editorStyles;

const Editor = ({ open, setCodeEditorOpen }) => {
  const classes = useStyles();

  const context = useContext(GlobalContext);

  const [firstMount, setFirstMount] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showClearWarning, setShowClearWarning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInfo, setShowInfo] = useState(INFO_MSG);
  const [showAPI, setShowAPI] = useState(false);
  const [showBenchmark, setShowBenchmark] = useState(false);

  const [anchorElSaveScript, setAnchorSaveScript] = React.useState(null);
  const [anchorElLoadScript, setAnchorElLoadScript] = React.useState(null);
  const [
    anchorElCreateConfigurationsFile,
    setAnchorElCreateConfigurationsFile,
  ] = React.useState(null);

  const [validatedResult, setValidatedResult] = React.useState(false);

  let ace = useRef(null);
  let cache = useRef(null);

  const { editorScript } = context.state;
  /*
  no need to deep copy, because strings management is probably managed with ref count, so code is detached from editorScript as soon as onChange
  happens, and we avoid changing the state directly
  */
  let code = editorScript;

  const onChange = (currentCode) => {
    /* we dont want to set state on each change because it causes stuttering when typing*/
    code = currentCode;
  };

  const handleClearButtonClick = () => {
    context.updateState("editorScript", code);
    setShowClearWarning(WARNING_MSG);
  };

  const handleAPIButtonClick = () => {
    context.updateState("editorScript", code);
    setShowAPI(true);
  };

  const handleInfoButtonClick = () => {
    context.updateState("editorScript", code);
    setShowInfo(INFO_MSG);
  };

  const handleBenchmark = () => {
    const isCachedBenchmarkAvailable = () => {
      return cache?.current?.benchmark;
    };
    const cacheBenchmark = (scores) => {
      cache.current = {
        ...cache.current,
        benchmark: transformScoresToBenchmarkData(scores),
      };
    };
    if (isCachedBenchmarkAvailable()) {
      setShowBenchmark(cache.current.benchmark);
      return;
    }
    const { simulationType } = context.state;

    const benchmarkAlgorithms = getBenchmarkAlgorithms(simulationType).concat([
      { name: "User Script", code: code },
    ]);
    const benchmarkConfigs = getBenchmarkConfigs(simulationType);
    const scores = [];
    for (const [i, algorithm] of benchmarkAlgorithms.entries()) {
      scores.push([]);
      for (const [configName, config] of Object.entries(benchmarkConfigs)) {
        scores[parseInt(i)].push({
          algName: algorithm.name,
          configName: `${configName}`,
          config,
          result: measure(algorithm, config, simulationType),
        });
      }
    }
    cacheBenchmark(scores);
    setShowBenchmark(cache.current.benchmark);
  };

  const handleValidateScript = () => {
    const cacheValidatedResult = (result) => {
      cache.current = {
        ...cache.current,
        validatedResult: result,
      };
    };

    const isCachedValidatedResultAvailable = () => {
      return cache?.current?.validatedResult;
    };

    const { editorScript } = context.state;
    if (code !== editorScript) {
      context.updateState("editorScript", code);
      cache.current = null;
    } else if (isCachedValidatedResultAvailable()) {
      setShowSuccess(SUCCESS_MSG);
      return;
    }

    try {
      const interpreter = createSandboxedInterpreter(code, context);

      checkTimeLimitExceeded(interpreter);

      interpreter.run();

      const result = interpreter.pseudoToNative(interpreter.value);

      validate(result, context);

      setShowSuccess(SUCCESS_MSG);

      setValidatedResult(result);

      cacheValidatedResult(result);
    } catch (err) {
      setShowError(err.message);
      context.updateState("editorSimulation", false);
    }
  };

  const handleLoadUserScript = (event) => {
    cache.current = null;
    context.updateState("editorScript", code);
    const reader = new FileReader();
    reader.onload = () => {
      const { editorScript } = JSON.parse(reader.result);
      context.loadUserScript(editorScript);
    };
    reader.readAsText(event.target.files[0]);
  };

  const handleSaveUserScript = () => {
    context.updateState("editorScript", code, context.saveUserScript);
  };

  const handleCancelClearRequest = () => {
    setShowClearWarning(false);
  };

  const handleConfirmClearRequest = () => {
    setShowClearWarning(false);
    code = DEFAULT_EDITOR_MARKUP;
    context.updateState("editorScript", code);
  };

  const handleRun = () => {
    setTimeout(() => {
      context.updateState("editorSimulation", {
        path: validatedResult,
        isActive: "user",
      });
    }, 500);
    setShowSuccess(false);
    handleClose();
  };

  const handleDismiss = () => {
    context.updateState("editorSimulation", false);
    setShowSuccess(false);
  };

  const handleBenchmarkReplay = (replay, config) => {
    const adjustBenchmarkConfigToLoaderRequirements = (config) => {
      const { map } = config.robot;
      const { simulationType } = context.state;
      return { ...config, map, simulationType };
    };
    const { loadConfiguration } = context;
    context.updateState(
      "editorSimulation",
      { path: replay, isActive: "replay" },
      loadConfiguration,
      adjustBenchmarkConfigToLoaderRequirements(config)
    );
    setShowBenchmark(false);
    setShowSuccess(false);
    handleClose();
  };

  const handleClose = () => {
    context.updateState("editorScript", code);
    cache.current = null;
    setValidatedResult(false);
    setCodeEditorOpen(false);
  };

  const handlePopoverOpen = (event) => {
    switch (event.currentTarget.id) {
      case "btn-saveScript":
        setAnchorSaveScript(event.currentTarget);
        break;
      case "btn-loadScript":
        setAnchorElLoadScript(event.currentTarget);
        break;
      case "btn-createConfigurationsFile":
        setAnchorElCreateConfigurationsFile(event.currentTarget);
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
      case "btn-createConfigurationsFile":
        setAnchorElCreateConfigurationsFile(null);
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
        <AppBar className={classes.appBar}>
          <Toolbar className={classes.toolBar}>
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
                onMouseEnter={() => {
                  context.updateState("editorScript", code);
                }}
                onMouseOver={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                component={"span"}
                htmlFor="icon-button-load-script"
              >
                <IconLoad />
              </IconButton>
            </label>

            <IconButton
              id={"btn-saveScript"}
              className={classes.editorBtn}
              edge="start"
              color="inherit"
              onMouseEnter={() => {
                context.updateState("editorScript", code);
              }}
              onMouseOver={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
              onClick={handleSaveUserScript}
              aria-label="close"
            >
              <IconSave />
            </IconButton>

            <input
              accept=".json"
              multiple="multiple"
              className={classes.input}
              id="icon-button-create-configs"
              onChange={(event) =>
                handleCreateConfigurationsFile(event, configs)
              }
              onClick={(event) => {
                //to allow consecutive selection of same files, we need to clear input value after each click.
                event.target.value = "";
              }}
              type="file"
            />
            <label htmlFor="icon-button-create-configs">
              <IconButton
                id={"btn-createConfigurationsFile"}
                className={classes.editorBtn}
                onMouseEnter={() => {
                  context.updateState("editorScript", code);
                }}
                onMouseOver={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                component={"span"}
                htmlFor="icon-button-create-configs"
              >
                <IconSettings />
              </IconButton>
            </label>

            <Typography variant="h6" className={classes.title}></Typography>
            <Button
              autoFocus
              className={classes.editorBtn}
              onClick={handleInfoButtonClick}
              color="inherit"
            >
              INFO
            </Button>
            <Button
              autoFocus
              className={classes.editorBtn}
              color="inherit"
              onClick={handleAPIButtonClick}
            >
              API
            </Button>
            <Button
              autoFocus
              className={classes.editorBtn}
              color="inherit"
              onClick={handleClearButtonClick}
            >
              CLEAR
            </Button>
            <Button
              autoFocus
              className={classes.editorBtn}
              color="inherit"
              onClick={handleValidateScript}
            >
              VALIDATE
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
          dismissable
          variant="filled"
          severity="warning"
        >
          <Grid container direction="row" justify="flex-end">
            <Grid item>
              <Button
                className={classes.msgBtn}
                variant="outlined"
                color="secondary"
                onClick={handleCancelClearRequest}
              >
                CANCEL
              </Button>
            </Grid>
            <Grid item>
              <Button
                className={classes.msgBtn}
                variant="outlined"
                color="secondary"
                onClick={handleConfirmClearRequest}
              >
                CONFIRM
              </Button>
            </Grid>
          </Grid>
        </Message>

        <Message
          message={showSuccess}
          setMessage={setShowSuccess}
          animationDelay={500}
          topTitle={`Validated Successfully!\n`}
          dismissable
          variant="filled"
          severity="success"
        >
          <Grid container direction="row" justify="flex-end">
            <Grid item>
              <Button
                className={classes.msgBtn}
                style={{ marginRight: "12em", marginLeft: 0 }}
                variant="outlined"
                color="secondary"
                onClick={handleDismiss}
              >
                DISMISS
              </Button>
              <Button
                className={classes.msgBtn}
                variant="outlined"
                color="secondary"
                onClick={handleBenchmark}
              >
                BENCHMARK
              </Button>
            </Grid>
            <Grid item>
              <Button
                className={classes.msgBtn}
                variant="outlined"
                color="secondary"
                onClick={handleRun}
              >
                RUN
              </Button>
            </Grid>
          </Grid>
        </Message>
        <APIDescriptor showAPI={showAPI} setShowAPI={setShowAPI} />
        {showBenchmark && (
          <Benchmark
            showBenchmark={showBenchmark}
            setShowBenchmark={setShowBenchmark}
            onBenchmarkReplay={handleBenchmarkReplay}
          />
        )}
      </Dialog>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{ paper: classes.paper }}
        open={Boolean(anchorElSaveScript)}
        anchorEl={anchorElSaveScript}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>Save Script</Typography>
      </Popover>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{ paper: classes.paper }}
        open={Boolean(anchorElLoadScript)}
        anchorEl={anchorElLoadScript}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>Load Script</Typography>
      </Popover>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{ paper: classes.paper }}
        open={Boolean(anchorElCreateConfigurationsFile)}
        anchorEl={anchorElCreateConfigurationsFile}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography className={classes.popoverText}>
          Create Configurations File
        </Typography>
      </Popover>
    </div>
  );
};

export default Editor;
