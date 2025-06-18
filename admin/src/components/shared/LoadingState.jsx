import React from "react";

const LoadingState = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-cyber-green">{message}</div>
    </div>
  );
};

export default LoadingState;