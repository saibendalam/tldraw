import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import expressWs from "express-ws";

// @ts-expect-error import directly from dist folder
import pkg from "./bin/utils.cjs"
import { WebSocketServer } from "ws";
import path from "path"
const { setupWSConnection} =pkg;
const { app } = expressWs(express());
const port = process.env.PORT || 3333;
const wss =  new WebSocketServer({ server: app,path:"/" });
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const authenticate = (auth, obj) => {
  return true;
};
app.use(express.static(path.resolve(__dirname, "../../publish")));
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ hello: "world" });
});
app.ws('/collaboration/:document', (ws, req) => {
  console.log("got",req.params.document )
  setupWSConnection(ws, req, { docName: req.params.document })
})
app.listen(port, () => {
  console.log(`express server started on ${port}`);
});
