import React from "react";
import { createRoot } from "react-dom/client";
import CinematicBirthdayExperience from "./cinematic-birthday-experience";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CinematicBirthdayExperience />
  </React.StrictMode>
);