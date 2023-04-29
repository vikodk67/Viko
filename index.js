const express = require('express');
const app = express();
const fs = require("fs")
const Database = require("@replit/database")
const db = new Database()
const {ProjectName} = require("./settings.json")
const formidableMiddleware = require('express-formidable');
const si = require('systeminformation');
const ipFilter = require('express-ipfilter').IpFilter
const path = require('path');
const session = require('express-session')
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
const countapi = require('countapi-js');

const infokan = ProjectName
app.use(cookieParser())
app.set("json spaces", 2)
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function makeid(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result+=characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const randomperip = makeid(15)
// session
app.use(session({ secret: 'vikoapi', cookie: { maxAge: 86400000 }}))

// alertfunc
function alertTrow(r,e,a,d,ax){
  pki = {
    title: ProjectName,
    alertRegis: r,
    alertErr: e,
    alertAlready: a,
    buttonDisable: d,
    randomTxt: randomperip
  }
  return pki
}
var port = process.env.PORT||8080||8000
const pth = process.cwd();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/ai/delete', (req, res) => {
   db.delete(req.query.user)
   res.json("delete runing")
})
app.get('/register', (req, res) => {
  if(req.session.sysGoto==1){
  res.redirect("/dasboard")
  } else {
    if(req.session.user==1) {
   res.render(process.cwd()+'/views/register',alertTrow(1,0,0,1,req.session.user))
  } else {
    res.render(process.cwd()+'/views/register', alertTrow(0,0,0,0))
    }
  }
});

app.get('/stats', async function(req, res) {
    
    dt = new Date();
  try {
    if(req.session.sysGoto==1){
    si.currentLoad().then(data => {
      si.osInfo().then(db => {
       si.system().then(d => {
    res.json({
      result: {
        cpuLoad: data.currentLoadUser.toFixed(0),
        serverTime: dt,
        manufacter:d.manufacturer,
        model:d.model,
        versi: require("./package.json").version,
        logofile: db.logofile,
        codepage: db.codepage,
        platform: db.platform
      }
    });
   })
  })
  }).catch(error => res.json({Err: error}));
  } else {res.json({result: "login required", trigger: 1})}
  }catch(error){
    console.log(error)
  }
});
// area login
app.get('/login', (req, res, next) => {
  res.render(process.cwd()+'/views/login', {
    warning: 0,
    warningWrongpw: 0,
    log: "",
    title: ProjectName
  })
  
  next()
},(req, res, next) => {
  res.render(process.cwd()+'/views/login', {
    warning: 0,
    warningWrongpw: 0,
    log: "Silahkan login",
    title: ProjectName
  })
                                                        })
app.post('/login', function(req, res) {
    username = req.body.gmail
    password = req.body.password
    if(req.session.sysGoto==1) throw res.redirect("/dasboard")
    if (username.length >= 17) {
        res.json("anda hacker😔☝️, 403 forbidden")
     } else {
    db.get(username).then(value => {
       if(value==null){
      res.render(process.cwd()+'/views/login', {
      warning: 1,
      warningWrongpw: 0,
      log: "",
      title: ProjectName
       })
       } else {
        if(value.password==password){
          req.session.sysGoto = 1
          req.session.kunci = value.apikey
          req.session.username = username
          req.session.password = password
          req.session.ipadse = value.ip
          setTimeout(function(){           
            res.redirect("/dasboard")
          },1000)        
        } else {
     res.render(process.cwd()+'/views/login', {
      warning: 0,
      warningWrongpw: 1,
      log: "",
      title: ProjectName
       })
      }
     }
    });
   }
})
// area login end

app.get('/settings', async (req, res, next) => {
  if(req.session.sysGoto==1) {
    res.render("../views/settings",{apikey: req.session.kunci})
  } else {
    res.render(process.cwd()+'/views/login', {
      warning: 0,
      warningWrongpw: 0,
      log: "Terjadi kesalahan, 403 silahkan login terlebih dahulu untuk melakukan pe settingan",
      title: ProjectName
      })
  }
})

app.get('/auth/:id/logout', (req, res, next) => {
  ctr = req.params.id
  if(ctr==req.session.username){
    req.session.destroy(function(err) {})
    setTimeout(function(){           
      res.redirect("/login")
    },1200)
  } else {
   res.render(process.cwd()+'/views/login', {
      warning: 0,
      warningWrongpw: 0,
      log: "Terjadi kesalahan, 403 silahkan login terlebih dahulu",
      title: ProjectName
      })
   
  }
})

app.get('/api/:id', async function(req, res, next) {
    result = req.params.id
 ipmu = req.headers['x-forwarded-for'] ? (req.headers['x-forwarded-for']).split(',')[0] : ""
  
  if(ipmu==require('./settings.json').ip_ban){
    res.json({result: "Ip anda telah di ban, mungkin anda melakukan pelanggaran", status: 403})
  } else {
  key = await db.get(req.query.username);
    x = req.query.apikey
    try {
    if (x==key.apikey){
    output = require("./dir/"+result)
    rest = await output(req, res)
      
    res.json({status: 200, account: req.query.username, ip_address: req.headers['x-forwarded-for'] ? (req.headers['x-forwarded-for']).split(',')[0] : "", result: rest, information: await require("./settings.json").info})
    
    } else {
  res.json({status: 401, result: "Apikey tidak valid atau parameter kosong"})
    }
    }catch(error) {
      if(error=="TypeError: Cannot read properties of null (reading 'apikey')"){
     res.render(process.cwd()+"/views/alert",{mslh: `Username tidak ditemukan, silahkan register untuk mendapatkan apikey`, title: 404})
      } else {
    res.render(process.cwd()+"/views/alert",{mslh: error+ "<br>path: /api/"+result, title: 500})
      }
    }
  }   
});
app.get('/contact/bot-report', (req, res) => {
  msg = req.query.msg
  if(msg==null){
  res.json({result: ":( no comand"})
  } else {
    res.redirect("http://wa.me/6281358514465?text="+msg)
  }
})
app.get('/dasboard', async(req, res) => {
  
  ipmu = req.headers['x-forwarded-for'] ? (req.headers['x-forwarded-for']).split(',')[0] : ""
  console.log("["+ipmu+"]")
  
  if(req.session.sysGoto==1){
    db.list().then(keys => {
    
    res.render(process.cwd()+'/views/index',{
    user: req.session.username,
    pw: req.session.password,
    apikey: req.session.kunci,
    title: ProjectName,
    ip_asli: req.session.ipadse,
    information: require("./settings.json").info,
    ip: ipmu,
    ip_ban: require('./settings.json').ip_ban,
    readApi: fs.readdirSync("./dir"),
    account_database: keys.length
    })
   });

  } else {
    res.redirect("/login")
  }
})

app.post('/register', function(req, res) {
    piko = makeid(19)
    console.log('body: ',req.body);
    username = req.body.gmail
    password = req.body.password
    if(req.session.sysGoto==1) {
    res.redirect("/auth/register")
    } else {
      db.list().then(keys => {
        check = keys.includes(username);
      if(check==true) { res.render(process.cwd()+'/views/register',alertTrow(0,0,1,0))
      } else {
        
      if (username.length >= 17) {
        res.json("anda hacker😔☝️, 403 forbidden")
      } else {
      if(req.query.key==randomperip){
        db.set(username, {password: password, apikey: makeid(10), ip: req.headers['x-forwarded-for'] ? (req.headers['x-forwarded-for']).split(',')[0] : "" }).then(() => {}).catch((e)=>{
      res.json("database bermasalah "+e)
      });
      
    res.render(process.cwd()+'/views/register',alertTrow(1,0,0,1))
      } else {
        res.send("403 forbidden, please contact the owner if there is a problem")
      }
      }

     }
    });
    }
});
// public file db.get("key").then(value => {});
app.use('/', express.static('public'))

// error throw
app.get('/auth/register', function(req, res, next) {
if(req.session.user==1) {
 res.json({err:"403 forbidden"})
} else {
  res.redirect("/register")
}
})

app.use((req, res) => res.render(process.cwd()+"/views/alert",{mslh: "Halaman tidak ditemukan :(", title: 404})
);

app.listen(port, () => {
  console.log('server started');
});

