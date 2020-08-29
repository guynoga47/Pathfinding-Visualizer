/* eslint-disable no-undef */
import scopeFunctions from "../../Algorithms/algorithmUtils";
import validators from "./validators";
import Exception from "../../Classes/Exception";
export const DEFAULT_EDITOR_MARKUP = `function buildPath(grid, map, dockingStation, availableSteps){

  const visitedNodesInOrder = [grid[12][25], grid[12][26], grid[12][27], grid[12][28], grid[12][29], grid[12][28], grid[12][27], grid[12][26], grid[12][25]];

  return visitedNodesInOrder;

}`;
export const EXECUTE = `buildPath(grid,map,dockingStation,availableSteps);`;

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
  // inline must be true to syntax highlight PHP without opening <?php tag
  editor.getSession().setMode({ path: "ace/mode/javascript", inline: true });

  // Prevent editing first and last line of editor
  editor.commands.on("exec", function (e) {
    var rowCol = editor.selection.getCursor();
    if (rowCol.row === 0 || rowCol.row + 1 === editor.session.getLength()) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
};

export const compileToES5 = (code) => {
  return Babel.transform(code, {
    presets: ["es2015"],
    sourceType: "script",
  }).code;
};

export const establishEnvironment = (context, interpreter) => {
  const { grid, availableSteps, startNode } = context.state;
  const { robot } = context;

  const args = [
    { name: "grid", value: grid },
    { name: "map", value: robot.map },
    { name: "dockingStation", value: robot.map[startNode.row][startNode.col] },
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

export const validateResult = (result, context) => {
  for (const validate of validators) {
    validate(result, context);
  }
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
