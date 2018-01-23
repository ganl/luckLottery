function drawBall(ball) {
	this.ball = ball; //parent父元素
	this.config = {
		rows: 11, //行数
		between: 7, //两行之前的间隔数
		begin: 1, //开始第一个数量
	};
	this.largeRows = 6; //外圈大圆数量
	// this.config = {
	// 	rows: 9, //行数
	// 	between: 5, //两行之前的间隔数
	// 	begin: 1, //开始第一个数量
	// };
	// this.largeRows = 40; //外圈大圆数量
	this.radius = 300; //圆球半径
	this.bottomlengh = 150; //圆球生成时离顶部的距离
	this.bigradius = 100; //大圆与小圆之间的半径差
	this.angles = []; //圆球所有点坐标
	this.large = []; //最大的一圈园坐标
	this.length = 0; //圆的总数量
	this.html = ""; //所有的li元素字符串
	this.rows = [];
	this.styles = []; //平铺时所有li的位置记录
	this.keyframes = ""; //平铺keyframes
	this.keyframesball = ""; //圆球keyframesball
	this.index = 0;
	this.keyframesdaluan = ""
	this.timer = null;
	this.ballArr = [];
	this.sizebegin = 35;
};

drawBall.prototype = {
	init: function() {
		var winW = $(window).width();
		var winH = $(window).height();
		this.radius = parseInt(winH / 1.5 / 2);
		this.bottomlengh = (winH - parseInt(winH / 1.5)) / 2



		this.getLength();
		this.showLi();
	},
	getLength: function() { //140
		for (var i = 0; i < this.config.rows; i++) {
			if (i <= this.config.rows / 2) {
				this.rows.push(this.config.begin + this.config.between * i)
			} else {
				this.rows.push(this.config.begin + this.config.between * ((this.config.rows - 1) - i))
			}
		}
		// 算出总的length长度
		for (var i = 0, len = this.rows.length; i < len; i++) {
			this.length += this.rows[i];
		}
		// console.log(this.length);
	},
	// 平铺li
	showLi: function() {
		var items = this.length + this.largeRows;
		for (var i = 0; i < items; i++) {
			// console.log(this.PrefixInteger(userList[(i % totalperson)].index, 3) + '.png', i)
			var style = "position:inherit;display: inline-block;margin:15px;"
			this.html += "<li style='" + style + "'><img src='./img/items/image" + this.PrefixInteger(userList[(i % totalperson)].index, 3) + ".png'></li>"
			// this.html += "<li style='" + style + "'><img src='" + userList[(i % 194)].avatar  + "'></li>"
		};
		this.ball.innerHTML = this.html;
		this.donghua();
	},
	PrefixInteger: function(num, length) {
		return (Array(length).join('0') + num).slice(-length);
	},
	// donghua
	donghua: function() {
		var _this = this;
		var lis = $(this.ball).find('li')
		for (var i = 0; i < lis.length; i++) {
			this.styles.push({
				left: $(lis[i]).offset().left,
				top: $(lis[i]).offset().top
			})
		};
		this.styles.sort(function() {
			return 0.5 - Math.random()
		});
		for (var i = 0; i < lis.length; i++) {
			$(lis[i]).css({
				position: 'fixed',
				left: '50%',
				top: '50%',
				margin: '-20px 0 0 -10px'
			})
		};
		for (var i = 0; i < this.styles.length; i++) {
			var key = 'gorun' + i;
			this.keyframes = this.keyframes + "@keyframes " + key + "{\
				0% {left:50%;top:50%,transform:scale(2,4)}\
				100% {left:" + this.styles[i].left + "px;top:" + this.styles[i].top + "px;transform:scale(1,1)}\
			}"
		};
		$('#styles').append(this.keyframes);
		for (var i = 0; i < lis.length; i++) {
			var key = 'gorun' + i;
			$(lis[i]).css({
					animation: key + " 1s ease " + (i / 60 + "s forwards"),
				})
				// 监听结束动画
			if (i == lis.length - 1) {
				if (!_this.index) {
					$(lis[i]).one("animationend", function() {
						setTimeout(function() {
							_this.index = 1;
							_this.draw();
						}, 20);
					});
				}
			};
		};
	},
	// 算圆球的三维点
	angle: function() {
		var num = 0;
		this.angles = [];
		for (var i = 0; i < this.length; i++) {
			var obj = {};
			if (i == 0) {
				obj.theta = 0;
				obj.phi = 0;
				obj.numsize = this.sizebegin;
			} else if (i == this.length - 1) {
				obj.theta = Math.PI;
				obj.phi = 0;
				obj.numsize = this.sizebegin;
			} else {
				var total = 0;
				for (var j = 0, lenj = this.rows.length; j < lenj; j++) {
					total += this.rows[j];
					if (i > (total - this.rows[j] - 1) && i < total) {
						obj.theta = Math.PI / (lenj - 1) * j;
						obj.phi = Math.PI * 2 / this.rows[j] * i;
						if (j <= (lenj - 1)) {
							obj.numsize = this.sizebegin + (j - 1) * 3 * 0.9 * 0.8
						} else {
							obj.numsize = this.sizebegin + ((lenj - 1) * 2 - j - 1) * 3 * 0.9 * 0.8;
						}
					};
				};
			}
			obj.type = 'small';
			this.angles.push(obj);
		}
	},
	// 算最大圆的三围点
	drawLarge: function() {
		this.large = [];
		for (var i = 0; i <= this.largeRows; i++) {
			for (var j = 0, lenj = this.rows.length; j < lenj; j++) {
				if (j == (this.rows.length - 1) / 2) {
					this.large.push({
						theta: Math.PI / (lenj - 1) * j,
						phi: Math.PI * 2 / this.largeRows * i,
						type: 'large',
						numsize: this.sizebegin + (j - 1) * 2.5
					})
				};
			};
		}
	},
	// 画圆
	draw: function() {
		this.angle();
		this.drawLarge();
		var newDatas = this.angles.concat(this.large);
		this.getHtml(newDatas);
	},
	//确定圆的位置 生成 keyframesball
	getHtml: function(datas) {
		var _this = this;
		var lis = $(this.ball).find('li');
		var ballarrs = [];

		for (var i = 0; i < lis.length; i++) {
			ballarrs.push({
				left: $(lis[i]).offset().left,
				top: $(lis[i]).offset().top,
			})
		}
		for (var i = 0; i < lis.length; i++) {
			$(lis[i]).css({
				left: ballarrs[i].left,
				top: ballarrs[i].top
			})
		}
		for (var i = 0, len = datas.length; i < len; i++) {
			var theta = datas[i].theta
			var phi = datas[i].phi
				// x y z 
			var z = this.radius * Math.sin(theta) * Math.cos(phi);
			if (datas[i].type == 'large') {
				var radius = this.radius + this.bigradius
				var z = radius * Math.sin(theta) * Math.cos(phi);
				var x = radius * Math.sin(theta) * Math.sin(phi) + this.radius + datas[i].numsize;
				var y = radius * Math.cos(theta) + this.radius;
			} else {
				var x = this.radius * Math.sin(theta) * Math.sin(phi) + this.radius + datas[i].numsize;
				var y = this.radius * Math.cos(theta) + this.radius;
			}

			// keyframesball
			if ($(lis[i]).length) {
				ballarrs.push({
					left: $(lis[i]).offset().left,
					top: $(lis[i]).offset().top,
				})
				var key = 'gorunball' + i;
				this.keyframesball = this.keyframesball + "@keyframes " + key + "{\
					0% {width:55px;height:55px;left:" + $(lis[i]).offset().left + "px;top:" + $(lis[i]).offset().top + ";transform:" + $(lis[i]).css('transform') + ";position:fixed}\
					100% {width:30px;height:30px;left:" + x + "px;top:" + (y + this.bottomlengh) + "px;transform:translateZ(" + z + "px) rotateY(" + phi + "rad) rotateX(" + (theta - Math.PI / 2) + "rad);position:absolute}\
				}";
				this.ballArr.push({
					width: '30px',
					height: '30px',
					left: x + 'px',
					top: y + this.bottomlengh + 'px',
					transform: "translateZ(" + z + "px) rotateY(" + phi + "rad) rotateX(" + (theta - Math.PI / 2) + "rad)",
					position: 'absolute'
				});
			}
		};

		this.drawBallForLi();
	},
	// 生成园动画
	drawBallForLi: function() {
		var lis = $(this.ball).find('li');
		var _this = this
		$(_this.ball).css({
			width: this.radius * 2 + 100 + 'px',
		});

		// 存key
		$('#styles').append(this.keyframesball);
		for (var i = 0; i < lis.length; i++) {
			var key = 'gorunball' + i;
			$(lis[i]).css({
				margin: 0,
				animation: key + " 1s ease " + (i / 60 + "s forwards"),
			});
			// 最后一个运动完毕执行
			if (i == lis.length - 1) {
				$(lis[i]).one("animationend", function() {
					$(_this.ball).css({
						animation: 'myball 40s linear infinite',
						transformStyle: 'preserve-3d'
					});
					// 显示抽奖按钮
					$('div.bonus').removeClass('hide');

					// setTimeout(function() {
					// 	_this.getChangeBall();
					// }, 1000);
				});

			};
		};
	},

	// 变化圆球
	getChangeBall: function() {
		var lis = $(this.ball).find('li');


		$(this.ball).css({
			animationPlayState: 'paused',
			animation: 'scaletozelo 1s linear forwards',
		});


	},
};