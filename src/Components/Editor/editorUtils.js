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

export const EXECUTE = `buildPath(grid,map,dockingStation,availableSteps);`;

export const setInterpreterScope = (context, interpreter) => {
  const { grid, availableSteps, startNode } = context.state;
  const { robot } = context;
  interpreter.setValueToScope("grid", interpreter.nativeToPseudo(grid));
  interpreter.setValueToScope("map", interpreter.nativeToPseudo(robot.map));
  interpreter.setValueToScope(
    "dockingStation",
    interpreter.nativeToPseudo(robot.map[startNode.row][startNode.col])
  );
  interpreter.setValueToScope("availableSteps", availableSteps);
};
