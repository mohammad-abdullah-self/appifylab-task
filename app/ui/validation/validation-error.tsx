"use client";

import React from "react";

interface ValidationErrorProps {
  message?: string | string[];
}

const ValidationError: React.FC<ValidationErrorProps> = ({ message }) => {
  if (!message) return null;

  return <div className="invalid-feedback d-block">{message}</div>;
};

export default ValidationError;
