import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { start } from "../dist";
import { apiRoutes } from "./apiRoute";
import { customRoutes } from "./customRoute";

const app = start({
  apiRoutes,
  customRoutes,
});

app.use((ctx, next) => {
  console.log(ctx.req, "===========log");
  if (ctx.req.method === "POST") {
    ctx.body = "mybody";
  }
  next();
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
