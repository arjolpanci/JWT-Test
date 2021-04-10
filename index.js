const express = require('express');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT_NO = 3000;

app.listen(PORT_NO, () => {
    console.log(`Server started on port ${PORT_NO}`);
});

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(__dirname + '/views'));
app.use(cors());

app.set('view engine', 'ejs');

//let secret = crypto.randomBytes(64).toString('hex');

dotenv.config();
let secret = process.env.TOKEN_SECRET;

let logged = false;

let users = [
    {
        user: 'admin',
        pw: ''
    }
];

let secretData = [
    {
        data1: "sensitive data 1"
    },
    {
        data2: "sensitive data 2"
    },
    {
        data3: "sensitive data 3"
    },
    {
        data4: "sensitive data 4"
    },
];

(async ()=>{
    users[0].pw = await bcrypt.hash('securepassword', 10);
}) ();

function auth(req, res, next) {
    const header = req.headers['authorization'];
    if(!header) return res.status(401).render('unauthorized');
    
    const token = header.split(' ')[1];

    if(!token) return res.status(401).render('unauthorized');

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err);
        if(err) return res.status(401).render('unauthorized');
        
        req.user = user;
        
        next();
    })
}

app.get('/', (req, res) => {
    logged = false;
    res.status(200).render('index');
});

app.post('/', async (req, res) => {
    let body = req.body;
    let username = body.user;
    let password = body.pw;

    let index = 0;
    try{
        let authed = false;
        for (let user of users){
            if(user.user == username){
                match = await bcrypt.compare(password, user.pw);
                if(match){
                    authed = true;
                    break;
                }else{
                    authed = false;
                    break;
                }
            }
            index++;
        }
        if(authed){
            var token = jwt.sign({user: users[index].user}, secret, {expiresIn: '1h'});
            logged = true;
            res.status(200).send(token);
        }else{
            res.status(400).render('index');
        }
    } catch(err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }

    
});

app.get('/dashboard', (req, res) => {
    if(logged){
        res.status(200).render('dashboard');
    }else{
        res.status(401).render('unauthorized');
    }
    
});

app.get('/api/getsecret', auth, (req,res) => {
    res.status(200).send(secretData);
});