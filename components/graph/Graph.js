import React from "react";
import { Canvas } from "./Canvas";

export const Graph = ({ expressionResults, updateResolution }) => {
  return (
    <div className="graph-container">
      <Canvas
        expressionResults={expressionResults}
        updateResolution={updateResolution}
      />
    </div>
  );
};
