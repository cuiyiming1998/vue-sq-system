const mysql = require('mysql'),
    express = require('express'),
    request = require('request'),
    qs = require('querystring'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    app = express();


app.all('*',function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With');
    res.header('Access-control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By','3.2.1');
    res.header('Content-Type','application/json;charset=urf-8');
    next();
    
});

// 创建连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'cymcymcym',
    database: 'aqsystem',
    dateStrings: true
});

console.log('已连接');

// 封装一个解析返回数据函数，返回值是一个数组
toDataArr = function(data){
    let String = JSON.stringify(data);
    String = JSON.parse(String);
    return String;
}

// get请求
function get(sql,path){
    app.get(path,(req,res)=>{
        pool.query(sql,function(err,results){
            if(err){
                console.log(err);
                res.send({
                    code: 0,
                    status: 'error'
                })
            }else{
                res.send({
                    code: 1,
                    data: results
                })
            }
        })
    })
}

//登录验证
app.post('/login',function(req,res){
    let loginData = '';
    let sql = 'select * from user where username=?';
    req.on('data',function(data){
        // 解析data为json数据
        loginData = JSON.parse(data);
    })
    req.on('end',function(data){
        pool.query(sql,[loginData.username],(err,results)=>{
            if(results[0] == undefined){
                // 判断用户是否存在
                res.send({
                    code: 1,
                    status: 'error'
                })
            }else if(results[0].password == loginData.password){
                // 判断密码是否相等
                res.send({
                    data: results[0],
                    code: 0,
                    status: 'success'
                })
            }else{
                res.send({
                    code: 1,
                    status: 'error'
                })
            }
        })
    })
})

// 注册验证
app.post('/signup',function(req,res){
    let signData = '';
    let selectSql = 'select * from user where username=?';
    req.on('data',function(data){
        signData = JSON.parse(data);
    });
    req.on('end',function(data){
        pool.query(selectSql,[signData.username],(err,results)=>{
            let result = toDataArr(results);
            // 注册的用户名不重复
            if(result.length == 0){
                let insertSql = 'insert into user(username,password,email) values(?,?,?)'
                pool.query(insertSql,[signData.username,signData.password,signData.email],(err,results)=>{
                    if(err){
                        console.log(err);
                    }else{
                        res.send({
                            code: 1,
                            status: 'success'
                        })
                    }
                })
            }else{
                res.send({
                    code: 0,
                    status: 'error'
                })
            }
        })
    })
})

// 发布问卷
app.post('/public',function(req,res){
    let publicData = '';
    let questInfo = ''
    let sql = '';
    req.on('data',function(data){
        publicData = JSON.parse(data);
        questInfo = JSON.parse(publicData.questInfo);
    })
    req.on('end',function(data){
        var id = null;
        var questLength = null;
        function insertProj(){
            return new Promise(function(resolve,reject){
                sql = 'insert into projects(username,projectName,time) values(?,?,?)'
                // 将用户名与时间插入projects表
                pool.query(sql,[publicData.username,publicData.projectName,publicData.time],(err,results)=>{
                    if(err){
                        console.log(err)
                    }else{
                        resolve(1);
                    }
                })
            })
        }
        insertProj()
        .then(()=>{
            //插入成功后查询projectId
            sql= 'select projectId from projects where username=? and projectName=?'
            pool.query(sql,[publicData.username,publicData.projectName],(err,results)=>{
                if(err){
                    console.log(err);
                }else{
                    // 根据projectId将问题存入questions表
                    let result = toDataArr(results);
                    id = result[0].projectId;
                    questLength = questInfo.length;
                    sql = 'insert into questions(projectId,title) values(?,?)'
                    for(let i=0;i<questLength;i++){
                        pool.query(sql,[id,questInfo[i].questTitle],(err,results)=>{
                            if(err){
                                console.log(err)
                                res.send({
                                    code: 0,
                                    status: 'error'
                                })
                            }else{
                                // 查询questId
                                sql = 'select questId from questions where projectId=? and title=?'
                                pool.query(sql,[id,questInfo[i].questTitle],(err,results)=>{
                                    let result = toDataArr(results);
                                    let length = result.length;
                                    // 通过questId将选项信息插入到options表
                                    sql = 'insert into options(questId,type,options) values(?,?,?)';
                                    for(let i=0;i<length;i++){
                                        pool.query(sql,[result[i].questId,questInfo[i].type,JSON.stringify(questInfo[i].answers)],(err,results)=>{
                                            if(err){
                                                console.log(err)
                                                res.send({
                                                    code: 0,
                                                    status: 'error'
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                    res.send({
                        code: 1,
                        status: 'success'
                    })
                }
            })
        })
    })
})

// 获取所有问卷信息

app.get('/square',function(req,res){
    const dataStr = ''
        pool.query('select * from projects',(err,results)=>{
            results = results.reverse();
            res.send(results);
        })
})


app.listen(3000);