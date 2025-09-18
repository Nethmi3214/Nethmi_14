const express = require('express');
const app = express();
const cors = require('cors');
const port = '3001';
const host = 'localhost';
const mongoose = require('mongoose');
const router = require('./router');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

const uri = 'mongodb+srv://nethmiabeysinghe14_db_user:A4Dyr2nADMziORsP@cluster0.ea4cbe9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connect = async () => {
    try{
        await mongoose.connect(uri);
        console.log('Connected to MOngoDB')
    }
    catch(error) {
        console.log('MongoDB Error: ', error)
    }
};

connect(); 

const server = app.listen(port, host, () => {
    console.log(`node server is listening to ${server.address().port}`)
});

app.use('/api', router);