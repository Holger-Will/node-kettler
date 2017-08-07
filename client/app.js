
/**
 * NoSleep.js v0.5.0 - git.io/vfn01
 * Rich Tibbett
 * MIT license
 **/
(function(root) {
  // UA matching
  var ua = {
    Android: /Android/ig.test(navigator.userAgent),
    iOS: /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent)
  };

  var media = {
    WebM: "data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA=",
    MP4: "data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAABsW1kaWEAAAAgbWRoZAAAAAB8JbCAfCWwgAAAA+gAAAAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEcc3RibAAAALhzdHNkAAAAAAAAAAEAAACobXA0dgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAAFJlc2RzAAAAAANEAAEABDwgEQAAAAADDUAAAAAABS0AAAGwAQAAAbWJEwAAAQAAAAEgAMSNiB9FAEQBFGMAAAGyTGF2YzUyLjg3LjQGAQIAAAAYc3R0cwAAAAAAAAABAAAAAQAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAEwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGB1ZHRhAAAAWG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAK2lsc3QAAAAjqXRvbwAAABtkYXRhAAAAAQAAAABMYXZmNTIuNzguMw=="
  };

  function addSourceToVideo(element, type, dataURI) {
    var source = document.createElement('source');
    source.src = dataURI;
    source.type = "video/" + type;
    element.appendChild(source);
  }

  // NoSleep instance constructor
  var NoSleep = function() {
    if (ua.iOS) {
      this.noSleepTimer = null;
    } else if (ua.Android) {
      // Set up no sleep video element
      this.noSleepVideo = document.createElement('video');
      this.noSleepVideo.setAttribute("loop", "");

      // Append nosleep video sources
      addSourceToVideo(this.noSleepVideo, "webm", media.WebM);
      addSourceToVideo(this.noSleepVideo, "mp4", media.MP4);
    }

    return this;
  };

  // Enable NoSleep instance
  NoSleep.prototype.enable = function(duration) {
    if (ua.iOS) {
      this.disable();
      this.noSleepTimer = window.setInterval(function() {
        window.location.href = '/';
        window.setTimeout(window.stop, 0);
      }, duration || 15000);
    } else if (ua.Android) {
      this.noSleepVideo.play();
    }
  };

  // Disable NoSleep instance
  NoSleep.prototype.disable = function() {
    if (ua.iOS) {
      if (this.noSleepTimer) {
        window.clearInterval(this.noSleepTimer);
        this.noSleepTimer = null;
      }
    } else if (ua.Android) {
      this.noSleepVideo.pause();
    }
  };

  // Append NoSleep API to root object
  root.NoSleep = NoSleep;
})(this);
var noSleep = new NoSleep();

var  svgns="http://www.w3.org/2000/svg"
function gauge(start_wert,end_wert,step,text_step,start_winkel,end_winkel){
  this.svg = document.createElementNS(svgns,"svg")
  this.svg.setAttribute("viewBox","0 0 100 80")
  this.svg.setAttribute("style","overflow:visible")

this.svg.appendChild(circle(50,50,42,"outer_gauge_circle2"))
  this.svg.appendChild(circle(50,50,47,"outer_gauge_circle"))
this.svg.appendChild(circle(50,50,45,"outer_gauge_circle3"))

  var dx = (end_winkel-start_winkel)/(end_wert-start_wert)
  for(var i = start_wert;i<= end_wert;i+=step){
    if(i%text_step==0){
      this.svg.appendChild(tick(50,50,43,3,start_winkel+i*dx,i,"gauge_tick_line2","gauge_tick_text"))
    }
    else{
      this.svg.appendChild(tick(50,50,43,2,start_winkel+i*dx,null,"gauge_tick_line","gauge_tick_text"))
    }
  }
  var n = needle(50,50,40,3,"gauge_needle")
  n.setAttribute("style",`transition: all 1s;transform-origin:50px 50px;`)
  this.svg.appendChild(n)
  this.needle=n
  this.setValue=function(val){
    var w = start_winkel+val*dx
    n.style.transform=`rotate(${w}deg)`
  }
}
function tick(cx,cy,r,l,w,tx,lclass,tclass){
  var c=document.createElementNS(svgns,"line")
  c.setAttribute("x1",0)
  c.setAttribute("y1",-r)
  c.setAttribute("x2",0)
  c.setAttribute("y2",l-r)
  c.setAttribute("class",lclass)
  c.setAttribute("transform",`translate(${cx},${cy}) rotate(${w})`)
  if(tx!=null){
    var t=document.createElementNS(svgns,"text")
    t.setAttribute("x","0px")
    t.setAttribute("y",-r+l+6)
    t.setAttribute("class",tclass)
    t.appendChild(document.createTextNode(tx))
    var tmp=document.createElementNS(svgns,"g")
    tmp.appendChild(c)
    tmp.appendChild(t)
    tmp.setAttribute("transform",`translate(${cx},${cy}) rotate(${w})`)
    c.removeAttribute("transform")
    return tmp
  }
  return c
}
function getPointOnCircle(cx,cy,r,w){
  var svg = document.createElementNS(svgns,"svg")
  var p = svg.createSVGPoint();
  p.x = 0;
  p.y = -1;
  var m = svg.createSVGMatrix();
  var p2 = p.matrixTransform(m.rotate(w));
  p2.x = cx + p2.x*r;
  p2.y = cy + p2.y*r;
  return p2
}
function circle(cx,cy,r,cssclass){
  var p1 = getPointOnCircle(cx,cy,r,-115)
  var p2 = getPointOnCircle(cx,cy,r,115)
  var c=document.createElementNS(svgns,"path")
  c.setAttribute("d",`M${p1.x} ${p1.y} A${r} ${r} 0 1 1 ${p2.x} ${p2.y}z`)
  c.setAttribute("class",cssclass)
  return c
}
function needle(x,y,l,w,nclass){
  var g=document.createElementNS(svgns,"g")
  var c=document.createElementNS(svgns,"path")
  c.setAttribute("d",`M${x-w/2} ${y}l${w/2} ${-l}l${w/2} ${l}l${-w/2} ${w/1.5}z`)
  c.setAttribute("class",nclass)
  g.appendChild(c)
  c=document.createElementNS(svgns,"circle")
  c.setAttribute("cx",x)
  c.setAttribute("cy",y)
  c.setAttribute("r",1)
  g.appendChild(c)
  return g
}


function Digit_Display(p_count,a_count,unit){
  var value=0
  var step=-0.1
  var newvalue=0
  var container = document.createElement("div")
  container.setAttribute("class","digit_display")
  container.setAttribute("style","display:flex;flex-direction:row")
  var integer = document.createElement("div")
  var rest = document.createElement("div")
  var un = document.createElement("div")
  var komma = document.createElement("div")
  integer.setAttribute("class","num1")
  rest.setAttribute("class","num2")
  un.setAttribute("class","unit")
  komma.setAttribute("class","komma")
  var integerArray=zeroArray(new Array(p_count))
  var restArray=zeroArray(new Array(a_count))
  function zeroArray(a){
    for(var i = 0;i<a.length;i++){
      a[i]="0"
    }
    return a
  }
  integer.appendChild(document.createTextNode(integerArray.join("")))
  rest.appendChild(document.createTextNode(restArray.join("")))
  komma.appendChild(document.createTextNode(","))
  un.appendChild(document.createTextNode(unit))
  container.appendChild(integer)
  container.appendChild(komma)
  container.appendChild(rest)
  container.appendChild(un)
  this.shadow=container
  this.setValue = function(val){
    newvalue=val
    step=(newvalue-value)/10
    setLoop()
  }
  function setLoop(){

    if(newvalue!=value){
      setTimeout(function(){
        displayValue(value+step)
        if(step>0){
          if(newvalue>=value){
            setLoop()
          }else{
            displayValue(newvalue)
          }
        }else{
          if(newvalue<=value){
            setLoop()
          }else{
            displayValue(newvalue)
          }
        }
      },50)
    }
  }
  function displayValue(val){
    value=Math.floor(val*100)/100
    zeroArray(integerArray)
    zeroArray(restArray)
    var vas=val.toString()
    if(!vas.includes(".")) vas+=".00"
    var va = vas.split(".")

    for(var i = 0;i<va[0].length;i++){
      integerArray[i+(integerArray.length-va[0].length)]=va[0][i]
    }
    for(var i = 0;i<Math.min(a_count,va[1].length);i++){
      restArray[i]=va[1][i]
    }

    integer.replaceChild(document.createTextNode(integerArray.join("")),integer.firstChild)
    rest.replaceChild(document.createTextNode(restArray.join("")),rest.firstChild)
  }
}
