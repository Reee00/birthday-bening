import React from "react";

export default function Toast({ message, show }) {
  return (
    <div
      id="toast"
      className={`toast${show ? " show" : ""}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}