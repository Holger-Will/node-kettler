const Koa = require( 'koa' )
const IO = require( 'koa-socket' )
const serve = require('koa-static');
var router = require('koa-router')();
var SerialPort = require("serialport");
var port = new SerialPort("/dev/ttyUSB0",{
  parser: SerialPort.parsers.readline('\n'),
  baudRate: 9600
})

var awards = [{
  "name":"500m",
  "desc": "it's a start",
  "distance":500,
  "image": "5km.svg",
  "awarded":false
},{
  "name":"1km",
  "desc": "it's a start",
  "distance":1000,
  "image": "1km.svg",
  "awarded":false
},{
  "name":"5km",
  "desc": "it's a start",
  "distance":5000,
  "image": "5km.svg",
  "awarded":false
}]


var userAchievements=[]

var cTraining
resetTraining()
function resetTraining(){
  cTraining={
    timestamp: (new Date()).getTime(),
    pulse:0,
    rpm:0,
    speed:0,
    distance:0,
    rp:0,
    energy:0,
    time:0,
    ap:0,
    rp_sum:0,
    rp_avg:0,
    rpm_sum:0,
    rpm_avg:0,
    pulse_sum:0,
    pulse_avg:0,
    speed_avg:0,
    speed_sum:0
  }
}

var interval
port.on('data', async function (data) {
  //console.log(data)
  var dat=data.split("\t")
  if(dat.length<8) return
  var pulse = parseInt(dat[0])
  var rpm = parseInt(dat[1])
  var speed = parseInt(dat[2])/10
  var distance = parseInt(dat[3])/10
  var rp = parseInt(dat[4])
  var energy = parseInt(dat[5])*0.239006
  var tt=dat[6].split(":")
  var time = parseInt(tt[0])*60+parseInt(tt[1])
  var ap = parseInt(dat[7])
  if(c_user!=null){
    c_user.totaldistance+=(distance-cTraining.distance)
    c_user.totalenergy+=(energy-cTraining.energy)
    c_user.totaltime+=(time-cTraining.time)
    var deltaT=(time-cTraining.time)
    cTraining.rp_sum+=rp*deltaT
    cTraining.rp_avg=Math.floor(cTraining.rp_sum/time)
    cTraining.speed_sum+=speed*deltaT
    cTraining.speed_avg=Math.floor(cTraining.speed_sum/time)
    cTraining.pulse_sum+=pulse*deltaT
    cTraining.pulse_avg=Math.floor(cTraining.pulse_sum/time)
    cTraining.rpm_sum+=rpm*deltaT
    cTraining.rpm_avg=Math.floor(cTraining.rpm_sum/time)
    db.put(c_user.mail,c_user)
    io.broadcast("user",c_user)
    userAchievements.forEach(function(item,index){
      if(item.distance<=c_user.totaldistance*1000) { //&& item.awarded==false
        item.awarded=true
        io.broadcast("award",item)
      }
    })
    db.put(c_user.mail+"_achievements",userAchievements)
  }

  checkAndSend("pulse",pulse)
  checkAndSend("rpm",rpm)
  checkAndSend("speed",speed)
  checkAndSend("distance",distance)
  checkAndSend("rp",rp)
  checkAndSend("energy",energy)
  checkAndSend("time",time)
  checkAndSend("ap",ap)

  //io.broadcast("data",`Pulse:${pulse} RPM:${rpm}  SPEED:${speed}  DIST:${distance} Power:${rp} ENEGRY:${energy} TIIME:${time} POWER2:${ap}`)
});

function checkAndSend(name,value){
  if(cTraining[name]!=value){
    cTraining[name]=value
    io.broadcast(name,value)
  }
}

var levelup = require('levelup')
var db = levelup('./data',{valueEncoding:"json"})
//db.put("users",[{name:"Holger",mail:"h.will@klimapartner.de",img:"triangle.svg"},{name:"Juliane",mail:"j.will@klimapartner.de",img:"star.svg"}])
db.put("h.will@klimapartner.de",{name:"Holger",mail:"h.will@klimapartner.de",img:"triangle.svg",workouts:[],totaldistance:0,maxspeed:0,maxpulse:0,maxpower:0,totaltime:0,totalenergy:0,days:[],weeks:[],months:[]})
//db.put("j.will@klimapartner.de",{name:"Juliane",mail:"j.will@klimapartner.de",img:"star.svg",workouts:[],totaldistance:0,maxspeed:0,maxpulse:0,maxpower:0,totaltime:0,totalenergy:0,days:[],weeks:[],months:[]})

//db.put("h.will@klimapartner.de_achievements",awards)

var c_user = null

const app = new Koa()
const io = new IO()

function save_training(){
  if(c_user.workouts[c_user.workouts.length-1].time<=0) c_user.workouts.pop()
  db.put(c_user.mail,c_user)
}

app.use(serve('client'));

router.get("/listusers",async function(ctx,next){
  ctx.body=await getData("users")
})

router.get("/login",async function(ctx,next){
  c_user=await getData(ctx.query.u)
  userAchievements=await getData(ctx.query.u+"_achievements")
  ctx.body=c_user
})
router.get("/logout",async function(ctx,next){
  clearInterval(interval)
  save_training()
  port.write("RS\n",function(){})
  resetTraining()
  c_user=null
  io.broadcast("training stoped")
  io.broadcast("loged out")
  ctx.body="ok"
})

router.get("/reset",async function(ctx,next){
  port.write("RS\n",function(){})
  resetTraining()
  ctx.body="ok"
})

function getData(key){
  return new Promise(function(resolve,reject){
    db.get(key,function(err,value){if(err){reject()}else{resolve(value)}})
  })
}

router.get("/stop",async function(ctx,next){
  clearInterval(interval)
  save_training()
  port.write("RS\n",function(){})
  resetTraining()
  io.broadcast("training stoped")
  ctx.body="hallo"
})

router.get("/start",async function(ctx,next){
  interval = setInterval(function(){
  port.write("ST\n",function(err){})
  },500)
  cTraining.timestamp=(new Date()).getTime()
  c_user.workouts.push(cTraining)
  io.broadcast("user",c_user)
  io.broadcast("training started")
  ctx.body="hallo"
})

router.get("/adduser",async function(ctx,next){
  ctx.body="hallo"
})

router.get("/getCurrentUser",async function(ctx,next){
  if(c_user==null) {
    ctx.body="unknown"
  }else{
    ctx.body=c_user
  }
})

io.attach( app )



// pulse rpm speed*10 distance requested_power energy mm:ss actual_power
//
// var interval = setInterval(function(){
// port.write("ST\n",function(err){})
// },500)

app.use(router.routes())
app.use(router.allowedMethods());
app.listen( process.env.PORT || 3000 )
