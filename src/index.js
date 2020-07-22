import React from "react";
import { render } from "react-dom";

require("dotenv").config();

import App from "./App";

render(<App />, document.getElementById("react-app-container"));
