var myChart;
var line;
var step = 0.05;
var xMax =10.00;
var xMin =-10.00;
var yMax =10.00;
var yMin = -10.00;
var y =1.00;
var xValues = [];
var yValues = [];
var allSlopes = [];
var slopeData;
var f;
const parser = math.parser();
document.getElementById("yMin").value = yMin;
document.getElementById("xMin").value = xMin;
document.getElementById("yMax").value = yMax;
document.getElementById("xMax").value = xMax;
var ctx = document.getElementById('canvas').getContext('2d');
myChart = new Chart(ctx, {
type: "line",
data: {labels: xValues,
datasets: [{pointRadius: 0, borderColor:     
"rgba(0,0,255,0.5)", data: yValues}]},    
options: {
scales: {
y:{
    max: yMax,
    min: yMin,
    }

},
plugins: {
    legend: {
        display: false,
        labels: {
            color: 'rgb(255, 99, 132)'
        }
    }
    }
}
});

function load(){
    getLine();
    xValues = [];
    yValues =[];
    draw();
    calcSlope();
    updateChart(myChart);
    myChart.update();
    reset();

    // var ctx = document.getElementById('canvas').getContext('2d');

    // const startX = 1;
    // const startY = 1;
    // const slope = 5;

    // // Define the length of the line segment
    // const length = 100;

    // // Calculate the end point of the line segment
    // const endX = startX + length;
    // const endY = startY + length * slope;

    // // Draw the line segment on the canvas
    // ctx.beginPath();
    // ctx.moveTo(startX, startY);
    // ctx.lineTo(endX, endY);
    // ctx.stroke();
    
    }

function reset(){
y =1;
parser.clear();

}

function calcSlope(){
let stepx = math.round((xMax-xMin)/11,3);
let stepy = math.round((yMax-yMin)/11,3);
var count = 0;
let x = xMin;
let y = yMin;
let xvals = [];
while(y<yMax){
    var slope = new Array(); 
    while(x < xMax){         
    if(count ==1){
        slope.push(NaN);
        count = 0;
    }
        x+=stepx;
        slope.push(euler(x-stepx,y,stepx));
        slope.push(euler(x+stepx,y,stepx));
        console.log(slope);
        count++;
        xvals.push(x);
        x+=stepx;
        xvals.push(x);
        x+=stepx;
        xvals.push(x);
        x+=stepx;
        console.log(slope);
    }
    y+=stepy;
    allSlopes.push(slope);
}
slopeData={
    labels:xvals, 
    datasets:[
    { data: allSlopes}
    ]
};
xvals.forEach(element => {
    console.log(element);
});
}

function euler(x,y,h){
return y+differential(x,y)*h;
}
function draw(){
for (let x =xMin; x <= xMax; x += step) {
console.log("y= " + y);
xValues.push(math.round(x,5));
yValues.push(y);
y=RungeKutta(math.round(x,5),step,y);        

}

}
function printRK(){
document.getElementById("text").value= "";
document.getElementById("text").value += "X: ";
xValues.forEach(element =>{
    
    document.getElementById("text").value += " " + element;
}); 
document.getElementById("text").value += "\nY: ";
yValues.forEach(element =>{
    document.getElementById("text").value += " " + math.round(element,5);
});

}
function Euler(y,t, h){
return y+h*differential(t,y);
}
function backwardsEuler( y, t, h){
return (y + 3*h +h*(t+h))/(1+h);
}
function RungeKutta(t,h,y){
var k1 =differential(t,y);
var k2 =differential(t+0.5*h,y+0.5*k1*h);
var k3 =differential(t+0.5*h,y+0.5*k2*h);
var k4 =differential(t+h,y+k3*h);
console.log("RK= " +y+((k1/6)+(k2/3)+(k3/3)+(k4/6))*h);
return (y+((k1/6)+(k2/3)+(k3/3)+(k4/6))*h);
}

function DormandPrince(t,y){
var k1= h*differential(t,y);
var k2 = h*differential(t +math.round(1/5,5)*h,y+math.round(1/5,5)*k1);
var k3 = h*differential(t +(3/10)*h,y+(3/40)*k1+(9/40)*k2);
var k4 = h*differential(t+(4/5)*h,y+(44/45)*k1-(56/15)*k2+(32/9)*k3);
var k5  =h*differential(t+(8/9)*h,y+(19372/6561)*k1-(25360/2187)*k2+(64448/6561)*k3-(212/729)*k4);
var k6 = h*differential(t+h,y+(9017/3168)*k1-(355/33)*k2-(46732/5247)*k3+(49/176)*k4+(5103/18656)*k5);
var k7 = h*differential(t+h,y+(35/384)*k +(500/1113)*k3 + (125/192)*k4 -(2187/6784)*k5+(11/84)*k6);
var z = Math.abs((71/57600)*k1-(71/16695)*k3+(71/1920)*k4- (17253/339200)*k5+(22/525)*k6-(1/40)*7);
var s = Math.pow(0.5*h/z,0.2);
} 

function differential(t,ytemp){
equation = 'f(x,y) = ' + line; 
parser.evaluate(equation);
f = parser.get('f');
const y = f(t, ytemp);  
return y
}

function getLine(){
        line = document.getElementById("differential").value;
        y = parseInt(document.getElementById("y0").value);
        xMax = parseInt(document.getElementById("xMax").value);
        yMax = parseInt(document.getElementById("yMax").value);
        xMin = parseInt(document.getElementById("xMin").value);
        yMin = parseInt(document.getElementById("yMin").value);
}
function addLine(){

}
function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((element) => {
        element.data.push(data);
    });
    chart.update();
}
function resetCanvas(){
    ('canvas').remove(); 
}
function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
    });

    //chart.update();
}
function createDEFIELD(){

}
function pointSlope(slope, x, x1, y1){
    return slope * (x - x1) + y1;
}
function pointSlopeInverse(slope, x, y) {
    return (y - pointSlope(slope, 0, 0, 0)) / slope;
}
const generateLineSegments = () => {
    const lineSegments = [];
    var xstep = (xMax - xMin)/20;
    var ystep = (yMax- yMin)/20;
    var count = 0;
    for (let x = xMin+xstep; x < xMax; x+=xstep) {
        
        for (let y = yMin+ystep; y < yMax; y+=ystep){
            if (count % 2 === 0){
                var slope = f(x,y);
                var x1 = x-0.5;
                var y1 = pointSlope(slope,x1, x,y );
                var x2 = x+0.5;
                var y2 = pointSlope(slope,x2, x,y );
                lineSegments.push([{ x: x1, y: y1 }, { x: x2, y: y2 }]);
                
            }
            count++;
        }
        //count++;
        //const y = x;
    }

    return lineSegments;
};

    function updateChart(chart) {
        const lineSegments = generateLineSegments();
    
        const data = {
            labels: xValues,
            datasets: [
                {
                    pointRadius: 0.5,
                    pointHoverRadius: 10,
                    borderColor: "rgba(0,0,255,0.8)",
                    data: yValues
                },
                ...lineSegments.map((segment, index) => ({
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    borderColor: 'rgba( 160, 11, 11 )',
                    borderWidth: 1, 
                    data: segment,
                    fill: false,
                    showLine: true
                }))
            ]
        };
    
        myChart.destroy();
        var ctx = document.getElementById('canvas').getContext('2d');
        myChart = new Chart(ctx, {
            type: "line",
            data: data,
            options: {
                element: {
                    line: {
                        tension: 7
                    }
                },
                scales: {
                    y: {
                        max: yMax,
                        min: yMin,
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            color: 'rgb(255, 99, 132)'
                        }
                    }
                }
            }
        });
    
        xValues.forEach(element => console.log(element));
        yValues.forEach(element => console.log(element));
    }
    

document.getElementById('canvas').addEventListener('click', function(event) {
    // Get the position of the click event on the x-axis
    const xAxis = myChart.scales['x'];
    const clickX = xAxis.getValueForPixel(event.clientX - xAxis.left);

    // Find the closest index based on the x-axis value
    const index = findClosestIndex(xValues, clickX);

    // Now, 'index' contains the index of the clicked point in the xValues array
    console.log('Clicked index:', index);

    // You can use this index to get corresponding x and y values
    const clickedX = xValues[index];
    const clickedY = yValues[index];
    console.log('Clicked X:', clickedX);
    console.log('Clicked Y:', clickedY);

    // Perform any additional actions based on the clicked point
});

// Helper function to find the closest index in an array based on a value
function findClosestIndex(array, value) {
    let minDiff = Infinity;
    let closestIndex = -1;

    array.forEach((element, index) => {
        const diff = Math.abs(element - value);

        if (diff < minDiff) {
            minDiff = diff;
            closestIndex = index;
        }
    });

    return closestIndex;
}
