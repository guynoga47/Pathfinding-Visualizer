import { saveAs } from "file-saver";

export const handleCreateConfigurationsFile = (event, configs) => {
  const files = event.currentTarget.files;
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = (event) => {
      configs.current = configs.current.concat([event.currentTarget.result]);
    };
    reader.readAsText(file);
  }
  setTimeout(() => {
    const jsonFile = {};

    configs.current.forEach((config, i) => {
      const { grid, map, startNode, availableSteps } = JSON.parse(config);
      jsonFile[`cfg${i}`] = {
        grid,
        map,
        startNode,
        availableSteps,
      };
    });
    const blob = new Blob([JSON.stringify(jsonFile)]);
    saveAs(blob, `configs.json`);
  }, 2000);
};
