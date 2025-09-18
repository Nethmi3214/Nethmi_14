const express = require('express');
const app = express();
const cors = require('cors')
const controller = require('./controller')

app.use(cors());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

app.get('/claims', (req, res) => {
    controller.getClaims(req, res, next => {
        res.send();
    });
});

app.post('/addClaims', (req, res) => {
    controller.addClaims(req.body, (callack) => {
        res.send();
    });
});

app.post('/updateClaims', (req, res) => {
    controller.updateClaims(req.body, (callack) => {
        res.send(callack);
    });
});

app.post('/deleteClaims', (req, res) => {
    controller.deleteClaims(req.body, (callack) => {
        res.send(callack);
    });
});

module.exports = app;