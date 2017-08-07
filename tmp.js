var SerialPort = require("serialport");
var port = new SerialPort("/dev/ttyUSB0",{
  parser: SerialPort.parsers.readline('\n'),
  baudRate: 9600
})
port.on("open",function(){
  console.log("serialport open")
  port.write("CM\n",function(err){console.log(err)})
  port.write("ID\n",function(err){console.log(err)})
  port.write("PW 100\n",function(err){console.log(err)})
})
port.on('data', function (data) {
  console.log('Data: ' + data);
});
