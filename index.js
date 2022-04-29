/* jshint esversion: 9 */
const express = require('express');
var bodyParser = require('body-parser');
const { Client } = require('pg');
const path = require('path');

const client = new Client({
    user: 'postgres',
    host: '', //HAS TO BE REMOTE MACHINE PRIVATE IP
    database: 'callcenter',
    password: 'test',
    port: 5432, //LEAVE AS default postgres port
});

const app = express();
const port = 3000;

client.connect().then(() => console.log("connected")).catch(console.log);

// server static files from public/
app.use('/public', express.static(path.join(__dirname, 'public')));

// parse application/json
app.use(bodyParser.json());


const serveFile = (name, res) => {
    return res.sendFile(path.join(__dirname + '/' + name));
};

app.get('/', (req, res) => {
    return serveFile('index.html', res);
});

app.get('/produktai', (req, res) => {
    return serveFile('produktai.html', res);
});

app.get('/skambuciai', (req, res) => {
    return serveFile('skambuciai.html', res);
});

app.get('/kontaktai', (req, res) => {
    return serveFile('kontaktai.html', res);
});

app.post('/register', async (req, res) => {
    console.log(req.body);
    const query = 'INSERT INTO Numbers(CompanyID, CallNumber, CallType, CallCountry) VALUES($1, $2, $3, $4)';
    const values = ['1', req.body.number, req.body.type, req.body.country];

    try {
        const response = await client.query(query, values);
        console.log(response);
        return res.json("ok").status(200);
    } catch (err) {
        console.error(err.stack);
        return res.json("error").status(500);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});