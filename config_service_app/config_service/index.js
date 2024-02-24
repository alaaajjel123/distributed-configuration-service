const fs = require('fs');
const fetch = require("node-fetch");
const cors = require("cors")
const express = require('express');
const path = require('path');
const axios = require('axios');
const _ = require('lodash');
const util = require('util');
const configServiceRouter = require('./routes/configRoutes');


const app = express();
const PORT = 2023;

const simpleGit = require('simple-git');
const git = simpleGit();

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(cors());

app.use(configServiceRouter);

const setTimeoutPromise = util.promisify(setTimeout);

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const redis = require('redis');

app.listen(PORT, () => {
    console.log(`Server at ${PORT}`);
 });

module.exports = app;

