const mysql = require('mysql'),
    express = require('express'),
    request = require('request'),
    qs = require('querystring'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.json());

app.all('*',function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With');
    res.header('Access-control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By','3.2.1');
    res.header('Content-Type','application/json;charset=urf-8');
    next();
    
});

const pool = mysql.createPool({
    host: '202.99.166.4',
    user: 'root',
    password: 'cymcymcym',
    database: 'aqsystem',
    dateStrings: true
});

console.log('连接成功！');

app.listen(8080,'localhost');