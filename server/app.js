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
    let publicData = ''; // 发布的信息
    let questInfo = ''; // 发布的问卷内容
    let sql = '';
    req.on('data',function(data){
        publicData = JSON.parse(data);
        questInfo = JSON.parse(publicData.questInfo);
    })
    req.on('end',function(data){
        function insert(){
            return new Promise(function(resolve,reject){
                if(publicData.projectName == ''){
                    // 未填写问卷名
                    res.send({
                        code: 3,
                        status: 'error'
                    })
                }else if(questInfo.length == 0){
                    // 未填写问题
                    res.send({
                        code: 2,
                        status: 'error'
                    })
                }else{
                    // 信息无误，将用户名、问卷名、发布时间插入到projects表
                    sql = 'insert into projects(username,projectName,time) values(?,?,?)'
                    pool.query(sql,[publicData.username,publicData.projectName,publicData.time],(err,results)=>{
                        if(err){
                            console.log(err);
                            res.send({
                                code: 0,
                                status: 'error'
                            })
                        }else{
                            resolve();
                        }
                    })
                }
            })
        }
        insert()
        .then(()=>{
            // 通过问卷名和用户名查找生成的id
            sql = 'select projectId from projects where username=? and projectName=?'
            pool.query(sql,[publicData.username,publicData.projectName],(err,results)=>{
                let result = toDataArr(results);
                let id = result[0].projectId;
                // 通过id将问题的内容，格式和选项插入questions表
                sql = 'insert into questions(projectId,title,type,answers) values(?,?,?,?)'
                for(let i=0;i<questInfo.length;i++){
                    pool.query(sql,[id,questInfo[i].questTitle,questInfo[i].type,JSON.stringify(questInfo[i].answers)],(err,results)=>{
                        if(err){
                            console.log(err);
                            res.send({
                                code: 0,
                                status: 'error'
                            })
                        }else{
                        }
                    })
                }
                res.send({
                    code: 1,
                    status: 'success'
                })
            })
        })
    })
})
// 获取所有问卷信息

app.get('/square',function(req,res){
    pool.query('select * from projects',(err,results)=>{
        results = results.reverse();
        res.send(results);
    })
})

// 获取我的发布

app.post('/myPublic',function(req,res){
    let publicData = ''
    req.on('data',function(data){
        publicData = JSON.parse(data);
    })
    req.on('end',function(data){
        pool.query('select * from projects where username=?',[publicData.username],(err,results)=>{
            if(err){
                console.log(err);
                res.send({
                    code: 0,
                    status: 'error'
                })
            }else if(results == ''){
                // 用户未发表问卷，查询为空
                res.send({
                    code: 2,
                    status: 'null'
                })
            }else{
                // 取出数据要对数组进行reverse，才能获取正确顺序
                let result = toDataArr(results).reverse();
                res.send({
                    code: 1,
                    status: 'success',
                    publicData: result
                })
            }
        })
    })
})

// 点击参加问卷获取问卷信息
app.get('/getProject',function(req,res){
    let result = '';
    let sql = '';
    let data = req.query;
    function getProject(){
        return new Promise(function(resolve,reject){
            // 在projects表中查询问卷的信息
            sql = 'select * from projects where username=? and projectName=?';
            pool.query(sql,[data.username,data.projectName],(err,results)=>{
                if(err){
                    console.log(err);
                    res.send({
                        code: 0,
                        status: 'error'
                    });
                }else{
                    result = toDataArr(results);
                    resolve();
                }
            })
        })
    }
    getProject()
    .then(()=>{
        // 通过获取projectId在questions表中查询问题信息
        result = result[0];
        sql = 'select * from questions where projectId=?'
        pool.query(sql,[result.projectId],(err,results)=>{
            if(err){
                console.log(err);
                res.send({
                    data: 0,
                    status: 'error'
                })
            }else{
                result = toDataArr(results).reverse();
                // 将问题信息中的answer解析成字符串
                for(let i=0;i<result.length;i++){
                    result[i].answers = JSON.parse(result[i].answers);
                }
            }
            res.send({
                code: 1,
                statis: 'success',
                questions: result
            });
        })
    })
})


app.listen(3000);