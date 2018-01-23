/*ball.js*/

var winW = $(window).width();
var winH = $(window).height();
$('div.star').css({
	width: winW + 'px',
	height: winH + 'px',
});

var html = "";
for (var i = 0; i < 30; i++) {
	var random = Math.random();
	html += '<img class="star-img"\
	style="z-index:2;left:' + Math.random() * winW + 'px;top:' + Math.random() * winH + 'px;width:' + 50 * random + 'px;height:' + 50 * random + 'px;"\
	src = "./img/stars/star.png" / > ';
}
$('div.star').html(html);


// $(function() {
// 	var winW = $(window).width();
// 	var winH = $(window).height();

// 	$('#canvas').css({
// 		width: winW + 'px',
// 		height: winW + 'px',
// 		top: '-50px'
// 	})
// 	var canvas = document.getElementById("canvas");
// 	var cobj = canvas.getContext("2d");
// 	var starArr = [];
// 	for (var i = 0; i < 100; i++) {
// 		var starObj = {
// 			radius1: 1 + 5 * Math.random(),
// 			radius2: 1 + 1 * Math.random(),
// 			x: 1 + (canvas.width) * Math.random(),
// 			y: 1 + (canvas.width) * Math.random(),
// 			// num: Math.ceil(4 + 4 * Math.random()),
// 			num: 5,
// 			color: '#fff',
// 			// color: "rgb(" + parseInt(255 * Math.random()) + "," + parseInt(255 * Math.random()) + "," + parseInt(255 * Math.random()) + ")",
// 			angle: 360 * Math.random(),
// 			changeAngle: -5 + 10 * Math.random()
// 		}
// 		starArr.push(starObj);
// 	}
// 	setInterval(function() {
// 		cobj.clearRect(0, 0, 500, 500);
// 		for (var i = 0; i < starArr.length; i++) {
// 			starArr[i].angle += starArr[i].changeAngle;
// 			cobj.save();
// 			cobj.beginPath();
// 			cobj.translate(starArr[i].x, starArr[i].y);
// 			cobj.rotate(starArr[i].angle * Math.PI / 180);
// 			cobj.scale(Math.sin(starArr[i].angle * Math.PI / 180), Math.sin(starArr[i].angle * Math.PI / 180))
// 			cobj.globalAlpha = Math.abs(Math.sin(starArr[i].angle * Math.PI / 180));
// 			drawStar(0, 0, starArr[i].radius1, starArr[i].radius2, starArr[i].num, "fill", starArr[i].color);
// 			cobj.restore();
// 		}
// 	}, 60)

// 	function drawStar(x, y, radius1, radius2, num, drawType, color) {
// 		var angle = 360 / (num * 2);
// 		var arr = [];
// 		for (var i = 0; i < num * 2; i++) {
// 			var starObj = {};
// 			if (i % 2 == 0) {
// 				starObj.x = x + radius1 * Math.cos(i * angle * Math.PI / 180);
// 				starObj.y = y + radius1 * Math.sin(i * angle * Math.PI / 180);
// 			} else {
// 				starObj.x = x + radius2 * Math.cos(i * angle * Math.PI / 180);
// 				starObj.y = y + radius2 * Math.sin(i * angle * Math.PI / 180);
// 			}
// 			arr.push(starObj);
// 		}
// 		cobj.beginPath();
// 		cobj.fillStyle = color;
// 		cobj.strokeStyle = color;
// 		cobj.moveTo(arr[0].x, arr[0].y);
// 		for (var i = 1; i < arr.length; i++) {
// 			cobj.lineTo(arr[i].x, arr[i].y);
// 		}
// 		cobj.closePath();
// 		if (drawType == "fill") {
// 			cobj.fill();
// 		} else {
// 			cobj.stroke();
// 		}
// 	}
// })