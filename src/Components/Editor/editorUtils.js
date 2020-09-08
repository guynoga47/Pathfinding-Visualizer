/* eslint-disable no-undef */
import Interpreter from "js-interpreter";

import scopeFunctions from "../../Algorithms/algorithmUtils";
import * as mappingAlgorithms from "../../Algorithms/mappingAlgorithms";
import * as cleaningAlgorithms from "../../Algorithms/cleaningAlgorithms";

import configs from "./configs.json";

import validators from "./validators";
import Exception from "../../Classes/Exception";

export const DEFAULT_EDITOR_MARKUP = `function buildPath(grid, map, dockingStation, availableSteps){

  const visitedNodesInOrder = [grid[12][25], grid[12][26], grid[12][27], grid[12][28], grid[12][29], grid[12][28], grid[12][27], grid[12][26], grid[12][25]];

  return visitedNodesInOrder;

}`;

const EXECUTE = `buildPath(grid,map,dockingStation,availableSteps);`;

export const createSandboxedInterpreter = (code, context) => {
  const establishEnvironment = (context, interpreter) => {
    const { grid, availableSteps, startNode } = context.state;
    const { robot } = context;

    const args = [
      { name: "grid", value: grid },
      { name: "map", value: robot.map },
      {
        name: "dockingStation",
        value: robot.map[startNode.row][startNode.col],
      },
      { name: "availableSteps", availableSteps },
    ];

    args.forEach((arg) => {
      interpreter.setValueToScope(
        arg.name,
        interpreter.nativeToPseudo(arg.value)
      );
    });

    scopeFunctions.forEach((func) => {
      interpreter.setValueToScope(func.name, interpreter.nativeToPseudo(func));
    });
  };
  const compileToES5 = (code) => {
    return Babel.transform(code, {
      presets: ["es2015"],
      sourceType: "script",
    }).code;
  };

  const interpreter = new Interpreter(compileToES5(code));
  interpreter.appendCode(EXECUTE);
  establishEnvironment(context, interpreter);
  return interpreter;
};

export const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    //IE
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback && callback();
      }
    };
  } else {
    //Others
    script.onload = function () {
      callback && callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

export const restrictEditingSegment = (editor) => {
  editor.getSession().setMode({ path: "ace/mode/javascript", inline: true });
  // Prevent editing first and last line of editor
  editor.commands.on("exec", function (e) {
    const position = editor.selection.getCursor();
    if (position.row === 0 || position.row + 1 === editor.session.getLength()) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
};
export const extendAutocomplete = (editor) => {
  const funcProtoString = (func) => {
    const parsedFunc = func.toString();
    const args = parsedFunc.substring(0, parsedFunc.indexOf("=") - 1);
    const numArgs = args.split(",").length - 1;
    const resArgs = numArgs ? args : `(${args})`;
    return `${func.name}${resArgs};`;
  };

  const createWordsArray = (session, scopeFunctions, localKeywords) => [
    ...scopeFunctions.map((func) => {
      return {
        caption: func.name,
        value: funcProtoString(func),
        meta: "function",
      };
    }),
    ...session.$mode.$highlightRules.$keywordList.map(function (word) {
      return {
        caption: word,
        value: word,
        meta: "keyword",
      };
    }),
    ...localKeywords.map((word) => {
      return {
        caption: word,
        value: word,
        meta: "local",
      };
    }),
  ];

  const localKeywords = ["grid", "map", "availableSteps", "dockingStation"];
  const autoComplete = {
    getCompletions: (editor, session, pos, prefix, callback) => {
      callback(null, createWordsArray(session, scopeFunctions, localKeywords));
    },
  };
  editor.completers = [autoComplete];
};

export const validate = (result, context) => {
  for (const validator of validators) {
    validator(result, context);
  }
};

export const getBenchmarkAlgorithms = (simulationType) => {
  return simulationType === "map"
    ? mappingAlgorithms.data
    : cleaningAlgorithms.data;
};
export const getBenchmarkConfigs = () => {
  return configs;
};

const buildContextFromConfig = (config) => {
  const { grid, map, startNode, availableSteps } = config;
  /*
  we are creating a dummy Robot object for when building interpreter environment for the Benchmark because 
  we only need it to have a map property so we can send the same parameters and reuse a function which is being used in the regular
  user code validation process.
  */
  const robot = { map };
  return { state: { grid, startNode, availableSteps }, robot };
};

const calculateEfficiency = (path, config, simulationType) => {
  const { grid } = config;
  return simulationType === "sweep"
    ? (path.reduce((a, b) => ({ dust: a.dust + b.dust })) /
        grid.flat(Infinity).reduce((a, b) => ({ dust: a.dust + b.dust }))) *
        100
    : (path.length / (grid.length * grid[0].length)) * 100;
};

export const measure = (algorithm, config, simulationType) => {
  let Tstart, Tfinish;
  let interpreter;
  if (algorithm.name === "User Script") {
    interpreter = createSandboxedInterpreter(
      algorithm.code,
      buildContextFromConfig(config)
    );
    interpreter.run();
  }
  const { grid, map, startNode, availableSteps } = config;
  const dockingStation = map[startNode.row][startNode.col];
  Tstart = performance.now();
  const path =
    algorithm.name === "User Script"
      ? interpreter.pseudoToNative(interpreter.value)
      : algorithm.func(grid, map, dockingStation, availableSteps);
  Tfinish = performance.now();
  return {
    time: Tfinish - Tstart,
    efficiency: calculateEfficiency(path, config, simulationType),
  };
};

export const checkTimeLimitExceeded = (interpreter) => {
  const start = new Date().getTime();
  while (interpreter.step()) {
    let now = new Date().getTime() - start;
    let secondsPassed = Math.floor((now / 1000) % 60);
    if (secondsPassed === 3) {
      throw new Exception(
        "Time limit exceeded, check for infinite loops or performance bottlenecks!"
      );
    }
  }
};
