import scopeFunctions from "../../Algorithms/algorithmUtils";

export const DEFAULT_EDITOR_MARKUP = `function buildPath(grid, map, dockingStation, availableSteps){
    return getNeighbors(grid[0][0], grid);
}`;
export const EXECUTE = `buildPath(grid,map,dockingStation,availableSteps);`;

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

/* export const establishEnvironment = () => {
  const initApi = (interpreter, globalObject) => {
    // Add an API function for the alert() block.
    console.log(getNeighbors.toString());

    let wrapper = function (node, grid) {
      return interpreter.createPrimitive(getNeighbors(node, grid));
    };
        interpreter.setProperty(
      globalObject,
      "getNeighbors",
      interpreter.createNativeFunction(wrapper)
    );
    wrapper = function (text) {
      return interpreter.createPrimitive(alert(text));
    };
    interpreter.setProperty(
      globalObject,
      "alert",
      interpreter.createNativeFunction(wrapper)
    );

    // Add an API function for the prompt() block.

  };
  return initApi;
}; */

export const setInterpreterScope = (context, interpreter) => {
  const { grid, availableSteps, startNode } = context.state;
  const { robot } = context;
  /*   console.log(getNeighbors.toString()); */
  interpreter.setValueToScope("grid", interpreter.nativeToPseudo(grid));
  interpreter.setValueToScope("map", interpreter.nativeToPseudo(robot.map));
  interpreter.setValueToScope(
    "dockingStation",
    interpreter.nativeToPseudo(robot.map[startNode.row][startNode.col])
  );
  interpreter.setValueToScope("availableSteps", availableSteps);
  /* interpreter.setValueToScope(
    "getNeighbors",
    interpreter.nativeToPseudo(getNeighbors)
  );
  interpreter.setValueToScope(
    "isNeighbors",
    interpreter.nativeToPseudo(isNeighbors)
  ); */

  for (const func of scopeFunctions) {
    interpreter.setValueToScope(func.name, interpreter.nativeToPseudo(func));
  }
};

function Exception(message) {
  this.message = message;
  this.name = "Exception";
}

export const validateResult = (context, result) => {
  if (!Array.isArray(result)) {
    throw new Exception(
      `Result is typeof ${typeof result}. Array return type is required.`
    );
  } else if (result.length === 0) {
    throw new Exception(`Returned array should not be empty.`);
  } else {
    //Check that any of the nodes got the appropriate parameters.
    //Check that the first and last nodes are dockingStation.
    //Check that every i,i+1 nodes, are neighbors.
  }
};
export const checkTimeLimitExceeded = (interpreter) => {
  const start = new Date().getTime();
  while (true) {
    if (interpreter.step()) {
      let now = new Date().getTime() - start;
      let secondsPassed = Math.floor((now / 1000) % 60);
      if (secondsPassed === 3) {
        throw new Exception(
          "Timelimit exception, check for infinite loops or performance bottlenecks!"
        );
      }
    } else {
      break;
    }
  }
};
