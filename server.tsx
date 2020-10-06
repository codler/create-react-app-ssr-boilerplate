import "fetch-register";
import React from "react";
import { FetchersResources, FetcherResourcesCTX } from "./src/hooks/useFetch";
import { renderToStringAsync } from "react-async-ssr";
import { StaticRouter } from "react-router";

import App from "./src/App";
const express = require("express");
const fs = require("fs");

const renderAppHtmlToString = async (
  req,
  context,
  fetchersResources: FetchersResources
) => {
  return renderToStringAsync(
    <FetcherResourcesCTX.Provider value={fetchersResources}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </FetcherResourcesCTX.Provider>
  );
};

const app = express();

const port = 3002;

const route = async (req, res) => {
  const context: any = {};
  const fethchersResources: FetchersResources = { fethchersResources: {} };
  const appHtml = await renderAppHtmlToString(req, context, fethchersResources);

  // context.url will contain the URL to redirect to if a <Redirect> was used
  if (context.url) {
    res.writeHead(302, {
      Location: context.url,
    });
    res.end();
  } else {
    fs.readFile("./build/index.html", (err, data) => {
      const content = data
        .toString()
        .replace("<app/>", appHtml)
        .replace(
          "<resourcedata/>",
          `<script>window.__FETCHERS_RESOURCES__ = ${JSON.stringify(
            fethchersResources
          )};</script>`
        );
      res.send(content);
    });
  }
};

app.get("/", route);
app.use(express.static(__dirname + "/build"));
app.use(route);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
