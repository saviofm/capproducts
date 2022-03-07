
"use strict";



const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");
const cds_swagger = require ('cds-swagger-ui-express');


cds.on("bootstrap", app => {
    app.use(
        [
            proxy(),

            cds_swagger(
                {
                    //"basePath": "/swagger",
                    "diagram": "true"
                }
            )
        ]
    )
});

module.exports = cds.server;