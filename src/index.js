const express = require('express');

const axios = require('axios');

const routes = require('./routes');

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:false}));

app.use(routes);

const PORT = process.env.PORT || 4000;

async function main(){

    await app.listen(PORT, () => {
        console.log(`app started on ${PORT}`)
    });

};

main().catch(console.log);