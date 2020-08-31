import React from "react";

import DialogContentText from "@material-ui/core/DialogContentText";

import SyntaxHighlighter from "react-syntax-highlighter";
import { hybrid } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Typography } from "@material-ui/core";

const Descriptor = (props) => {
  const { name, snippet, description } = props;
  return (
    <DialogContentText
      id="scroll-dialog-description"
      ref={props.descriptionElementRef}
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
