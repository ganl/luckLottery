/*ball.js*/
var scene = $('div.scene');
var winW = $(window).width();
var winH = $(window).height();

//运动旋转音效
var runingmic=document.getElementById("runingmic");
runingmic.volume=0.5;
//中奖音效
var pausemic=document.getElementById("pausemic");
pausemic.volume=1.0;

var levelType = -1;
var luckNum = 0;

var running = false;
var cNum = 0;

//总共参与抽奖的人数
var totalperson = 192;

scene.css({
    width: winW + 'px',
    height: winH + 'px'
});

/*-----------------------------初始化抽奖数据---------------------------------------*/

var initdatas = localStorage.getItem('initdatas') ? JSON.parse(localStorage.getItem('initdatas')) : [];
if (!initdatas.length) {
    for (var i = 0; i < totalperson; i++) {
        if (i < 10) {
            initdatas.push('00' + i);
        } else if (i < 100) {
            initdatas.push('0' + i);
        } else {
            initdatas.push(i + '');
        }
    }

    localStorage.setItem('initdatas', JSON.stringify(initdatas))
}


/*-----------------------------------开始抽奖-----------------------------------------*/
var one = $('#one');
var two = $('#two');
var three = $('#three');
var ball = $('#ball');
var out = $('div.out');
var selectnumber = $('div.select-number');
var totalClass = [];
var allClass = [];
var firstType = "";

var levelTypeTitle = ['特等奖', '一等奖', '二等奖', '三等奖', '幸运奖'];
var LuckNumTitle = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

//已中奖的号码
var isWinningeds = localStorage.getItem('isWinningeds') ? JSON.parse(localStorage.getItem('isWinningeds')) : [];
var isWinningedsJson = localStorage.getItem('isWinningedsJson') ? JSON.parse(localStorage.getItem('isWinningedsJson')) : [];

// 根据参数获得随机数
function getNumberForRadom(max, min) {
    return parseInt(Math.random() * ((max - min) + 1));
}

//获得中奖号码
function winningFn(type) {
    console.log(JSON.stringify(isWinningeds.sort(function (x, y) {
        return x - y
    })));
    var oneth = getNumberForRadom(9, 0); //个位
    var twoth = getNumberForRadom(9, 0); //十位

    var threeth = parseInt(oneth + twoth * 10); //十位
    var baith = totalperson.toString().substr(1, 2); //切取后面两位数

    var isrepeat = false; //是否中过奖

    // 中奖的索引号
    var winningeIndex = 0;

    //中奖号码索引
    if (threeth > baith) {
        winningeIndex = getNumberForRadom(0, 0) * 100 + threeth
    } else {
        winningeIndex = getNumberForRadom(1, 0) * 100 + threeth
    }

    // 判断是否是重复中奖号码
    if (isWinningeds && isWinningeds.length) {
        for (var i = 0; i < isWinningeds.length; i++) {
            if (isWinningeds[i] === winningeIndex) {
                isrepeat = true;
                console.log(winningeIndex + '--- repeat ------------- re-random --------');
            }
        }
    }

    if (isrepeat) {
        return winningFn(type);
    } else {
        // 保存已经中奖的号码
        isWinningeds.push(winningeIndex);
        localStorage.setItem('isWinningeds', JSON.stringify(isWinningeds))
        isWinningedsJson.push({
            type: type,
            name: userList[winningeIndex].name,
            value: initdatas[winningeIndex]
        });
        localStorage.setItem('isWinningedsJson', JSON.stringify(isWinningedsJson))
        return winningeIndex
    }
}

// 中奖翻牌HTML
function showHaveHTML(type) {
    console.log(firstType, type)
    // 判断是否换了抽奖等级
    if (firstType != '' && firstType != type) {
        scene.find('div.select-number').remove();
    }

    var selectNumbers = scene.find('div.select-number');
    if (!selectNumbers.length) {

        showJiangText(type); //显示标题

        var html = ""
        var newArr = [];
        if (isWinningedsJson && isWinningedsJson.length) {
            for (var i = 0; i < isWinningedsJson.length; i++) {
                if (isWinningedsJson[i].type == type) {
                    newArr.push(isWinningedsJson[i])
                }
            }
        }
        if (newArr && newArr.length) {
            for (var i = 0; i < newArr.length; i++) {
                html += '<div class="select-number list" style="right:10px;top:0px;transform: scale(0.6,0.6);margin:0;position:relative">\
						<div class="block">\
                            <img src="./img/items/image' + ( '0000' + (userList[(parseInt(newArr[i].value) % totalperson)].index * 2 - 1) ).slice(-3) + '.png" class="img-circle">\
                            <span>' + userList[(parseInt(newArr[i].value) % totalperson)].name + '</span>\
						</div>\
					</div>';
            }
        }
        $('#luck-list').append(html);
        // scene.append(html);
    }
}

function setJiangPingLevel(level) {
    levelType = level;
    cNum = 0; // 清零
    var $levelType = $('#levelType');

    $levelType.html(levelTypeTitle[levelType]);
}

function setLuckNum(num) {
    cNum = 0; // 清零
    luckNum = num;
    var $luckNum = $('#lucknum');

    $luckNum.html(LuckNumTitle[luckNum]);
}

// 开始抽奖
function getJiangPing() {

    var type = -1;
    if (levelType == -1) {
        alert('请选择奖项类型');
        return;
    } else {
        type = levelType;
    }

    if(luckNum == 0){
        alert('请选择中奖人数');
        return;
    }

    //显示已经中奖的号码
    console.log(JSON.stringify(isWinningedsJson));
    showHaveHTML(type);

    // 是否显示获奖标题
    showJiangText(type);
    firstType = type;

    if(running) { // if running, then stop it. and get the lucky man

        $('button.btn-success').attr('disabled', true);

        /*------------------------------抽奖开始------------------------------------*/

        // 中奖号码
        var winninge = initdatas[winningFn(type)];

        // 塞入中奖html
        var zhongjiangclass = randomString(6);

        // 界面上显示中奖号码
        getHTML(winninge, zhongjiangclass);

        // 打印中奖号码和索引
        console.log('中奖的索引' + winninge);

        /*------------------------------抽奖结束------------------------------------*/

        // 存入数组
        allClass.push({
            classname: zhongjiangclass,
            type: type
        });
        totalClass.push({
            classname: zhongjiangclass,
            type: type
        });

        // 生成抽奖右移动画
        var keyframes = "@keyframes " + zhongjiangclass + "{\
				0% {opacity:1;right:50%;top:50%;transform: scale(1,1);margin:-100px -240px 0 0;}\
				50%{opacity:0.1;}\
				100% {opacity:1;right:10px;top:0px;transform: scale(0.6,0.6);margin:0;position:relative;}\
			}";
        $('#styles').append(keyframes);

        runingmic.pause();

        $('#ball').css({
            'animation-play-state': 'paused',
            animation: 'choujiang 4s cubic-bezier(0.025, 0.735, 0.025, 0.990) 1 forwards'
        });
        out.css({
            animation: 'choujiangScale2 2s 4s forwards'
        });
        // var imgUrl = userList[(parseInt(winninge) % totalperson)].avatar;
        var imgUrl = './img/items/image' + ( '0000' + (userList[(winninge % totalperson)].index * 2 - 1) ).slice(-3) + '.png';
        var userName = userList[(parseInt(winninge) % totalperson)].name

        out.one("animationend", function () {
            showLuckAnimate(imgUrl, levelTypeTitle[levelType], userName, zhongjiangclass);
        });


        cNum++;

        if(luckNum == cNum) { // 一次抽奖的人数已经达到，允许下次抽奖
            running = false;
            $('button.dropdown-toggle').attr('disabled', false);
            $('button.btn-success').text('开始抽奖');
            $('button.btn-success').removeAttr("disabled");
        }

        return true;

    }


    // 禁止改变抽奖条件
    $('button.dropdown-toggle').attr('disabled', true);
    $('button.btn-success').text('停止抽奖');
    running = true;

    runingmic.currentTime = 0;
    runingmic.play();

    // 动起来， 100次
    $('#ball').css({
        // animation: 'choujiang 4s cubic-bezier(0.025, 0.735, 0.025, 0.990) 1 forwards'
        animation: 'choujiang 4s cubic-bezier(0, 0, 0.990, 0.990) 100 forwards'
    });

}

// 显示获奖标题
function showJiangText(type) {
    if (scene.find('div.select-number').length) {
        $('#jiangpingsspan').text(levelTypeTitle[type]);
        $('div.jiangpingtext').addClass('show').removeClass('hide');
    } else {
        $('div.jiangpingtext').addClass('hide').removeClass('show');
    }
}

//显示中奖动画
function showLuckAnimate(imgUl, showLevel, userName, zhongjiangclass) {
    //播放中奖音效
    pausemic.currentTime = 0;
    pausemic.play();
    scene.append('<div class="animate-bg"><div class="light"></div><div class="lottery-animate-bg"><div class="lotteryuserhead"><img src="' + imgUl + '"/></div><div class="level">恭喜<span class="user-name">' + userName + '</span>获得<p class="awards-name">' + showLevel + '</p></div><div class="confirm-btn"><button class="btn btn-lg btn-success fl" onclick="confirmJiangPing(\''+ zhongjiangclass +'\')"><span>确定</span></button></div></div>');
    // setTimeout(function () {
    //     $(".animate-bg").animate({"opacity": "0"}, "slow", function () {
    //         $(".animate-bg").remove();
    //     });
    // }, 5000);
}

// 中奖翻牌HTML
function getHTML(number, classname) {
    console.log(userList[(parseInt(number) % totalperson)]);
    var html = '<div class="select-number ' + classname + '">\
                <div class="block">\
                    <img src="./img/items/image' + ( '0000' + (userList[(number % totalperson)].index * 2 - 1) ).slice(-3) + '.png" class="img-circle">\
                    <span>' + userList[(parseInt(number) % totalperson)].name + '</span>\
				</div>\
		</div>';
    $('#luck-list').append(html);
    // scene.append(html);
}

function confirmJiangPing(zhongjiangclass) {
    // 中奖动画移除
    $(".animate-bg").animate({"opacity": "0"}, "slow", function () {
        $(".animate-bg").remove();
    });

    // 翻牌
    $('div.' + zhongjiangclass).css({
        animation: 'selectnumberanimate 1s forwards'
    });

    // 移动奖牌
    $('div.' + zhongjiangclass).one("animationend", function () {

        $('div.' + zhongjiangclass).css({
            animation: zhongjiangclass + ' 2s forwards'
        });

        setTimeout(function () {
            $('div.' + zhongjiangclass).addClass('list');
        }, 1000);

        // 球放大并恢复运转
        setTimeout(function () {
            out.css({
                animation: 'choujiangScale3 2s forwards'
            });

            // 球恢复运行
            $('#ball').css({
                animation: 'myball 50s linear infinite'
            });
        }, 1000);

        // 运动完成自动继续抽奖
        $('div.' + zhongjiangclass).one("animationend", function () {
            var luck_list = document.getElementById('luck-list');
            luck_list.scrollTop = luck_list.scrollHeight;
            if(luckNum != cNum) { //

                runingmic.currentTime = 0;
                runingmic.play();

                $('#ball').css({
                    animation: 'choujiang 4s cubic-bezier(0.025, 0.735, 0.025, 0.990) 1 forwards'
                });
                $('#ball').one("animationend", function () {
                    getJiangPing()
                });
            } else {
                cNum = 0; // 清零
            }
            // $('button.btn').removeAttr("disabled");
        });

        // 清除动画
        // out.css({
        // 	animation: 'none',
        // });

        // 是否显示获奖标题
        showJiangText(levelType);
    });
}

/*生成随机字符串*/
function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
