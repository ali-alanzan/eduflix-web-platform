import express from 'express';
import cors from 'cors';
import {readdirSync} from "fs";
import mongoose from 'mongoose';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

const morgan = require("morgan");

require("dotenv").config();



const csrfProtection = csrf({cookie: true});



// create express app

const app = express();

// apply middlewares
app.use(cors())
app.use(express.json({limit: "5mb"}));
app.use(cookieParser());
app.use(morgan("dev"));
app.use((req, res, next) => {
    console.log("this is my own middleware");
    next();
});



// db connection 
mongoose.connect(process.env.DATABASE).then( () => console.log('**DB CONNECTED**'))
.catch( (err) => console.log('DB CONNECTION ERR => ', err) );



// route
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));


app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// port
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is runinng on port ${port}`);
});