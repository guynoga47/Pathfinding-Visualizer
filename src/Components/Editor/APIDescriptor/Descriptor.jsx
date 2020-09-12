import React from "react";

import DialogContentText from "@material-ui/core/DialogContentText";

import SyntaxHighlighter from "react-syntax-highlighter";
import { hybrid } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Typography } from "@material-ui/core";

const Descriptor = ({ name, snippet, description, descriptionElementRef }) => {
  return (
    <DialogContentText
      id="scroll-dialog-description"
      ref={descriptionElementRef}
      tabIndex={-1}
      style={{ width: "55em", outline: "none" }}
    >
      <Typography>
        <strong>{`${name}:`}</strong>
      </Typography>
      <SyntaxHighlighter
        customStyle={{ borderRadius: "5px" }}
        language="javascript"
        showLineNumbers
        style={hybrid}
      >
        {snippet}
      </SyntaxHighlighter>
      <Typography>{description}</Typography>
    </DialogContentText>
  );
};

export default Descriptor;
