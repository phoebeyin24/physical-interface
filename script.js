


//This is inspired by the cdn example from the p5.serial github: https://github.com/p5-serial/p5.serialport
let numStars = 50;
let x = [];
let y = [];
let dir = [];
let spd = [];
let b = 0
let alfa = 255
let circlesize;
let backgroundc = 255
// Declare a "SerialPort" object
let serial;
let latestData = "waiting for data";  //write incoming data to the canvas

//specify star's properties
function createStar(){
	for (let i = 0; i < numStars; i++){
		x[i] = random(width);
		y[i] = random(height);
		dir[i] = random(-PI, PI)
		spd[i] = random(0.1,1.2)
		
		}
}

function drawCircle(){
	b += 0.02;
	let float = cos(b)*50;
	fill(0,0,0,alfa);
	circle(width/2 , height/2 +float,circlesize);
	if (mouseIsPressed == true && alfa>=-10){
		alfa -=10;} else if (alfa<255){
			alfa += 10;
		}					
}
	



function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  createStar();

  // Instantiate our SerialPort object
  serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results
  serial.list();

  // Assuming our Arduino is connected, let's open the connection to it
  // Change this to the name of your arduino's serial port
  serial.open("COM3");

  // Here are the callbacks that you can register
  // When we connect to the underlying server
  serial.on('connected', serverConnected);

  // When we get a list of serial ports that are available
  serial.on('list', gotList);
  // OR
  //serial.onList(gotList);

  // When we some data from the serial port
  serial.on('data', gotData);
  // OR
  //serial.onData(gotData);

  // When or if we get an error
  serial.on('error', gotError);
  // OR
  //serial.onError(gotError);

  // When our serial port is opened and ready for read/write
  serial.on('open', gotOpen);
  // OR
  //serial.onOpen(gotOpen);

  serial.on('close', gotClose);
}

// We are connected and ready to go
function serverConnected() {
  print("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
  print("List of Serial Ports:");
  // theList is an array of their names
  for (let i = 0; i < thelist.length; i++) {
    // Display in the console
    print(i + " " + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  print("Serial Port is Open");
}

function gotClose(){
    print("Serial Port is Closed");
    latestData = "Serial Port is Closed";
}

//print error to console
function gotError(theerror) {
  print(theerror);
}

// There is data available to work with from the serial port
function gotData() {
  let currentString = serial.readLine();  // read the incoming string
  trim(currentString);                    // remove any trailing whitespace
  if (!currentString) return;             // if the string is empty, do no more
  console.log(currentString);             // print the string
  latestData = currentString;            // save it for the draw method
}

// We got raw from the serial port
function gotRawData(thedata) {
  print("gotRawData" + thedata);
}


//function to draw all the stars, and checking boundaries
function drawStars(){
    if (latestData < 245 && latestData>=30){
     fill(255) 
    }else if (latestData >= 250){
      fill(0);
    }
	for (let i = 0; i < latestData; i++){
		circle(x[i],y[i],random(3,8));
		x[i] = x[i] + spd[i]*cos(dir[i]);
		y[i] = y[i] + spd[i]*sin(dir[i]);
	
		if(x[i]>width||x[i]<0){
			dir[i] = PI - dir[i];
		}
		if(y[i]>height||y[i]<0){
			dir[i] = TWO_PI - dir[i];
		}
	}
}

function drawMoon(){
	fill(255,255,191,200);
	circle(width/2,height/2,circlesize);
}

function draw() {
  background(255);
  fill(0);
  drawCircle();
  circlesize = latestData;
  //using the potentiometer as a "controller" for the animation 
   if (latestData>=30 && latestData <=245){
		backgroundc -= 10;
		background(backgroundc)
		drawMoon();
		drawStars();
	}else if (latestData>=245){
        background(255,255,191,200);
        drawStars();
    }
  
  text(latestData, 10, 10);

}