/*index.js*/
var container = $('div#container');
var winW = $(window).width();
var winH = $(window).height();

//运动旋转音效
var runingmic = document.getElementById("runingmic");
runingmic.volume = 0.5;

//中奖音效
var pausemic = document.getElementById("pausemic");
pausemic.volume = 1.0;

var levelType = -1;
var luckNum = 0;

var running = false;
var cNum = 0;

var timer = null;

container.css({
    width: winW + 'px',
    height: winH + 'px'
});

var selectnumber = $('div.select-number');
var totalClass = [];
var allClass = [];
var firstType = "";

/*-----------------------------初始化抽奖数据---------------------------------------*/

// 假定总共参与抽奖的人数，会从localStorage中更新
var totalPerson = 340;

var prizes = JSON.parse(localStorage.getItem('prizes'));
if (!prizes) {
    alert('请先设置好奖品');
}

var users = JSON.parse(localStorage.getItem('users'));
if (!users || users.length === 0) {
    alert('请先设置好参与人员');
} else {
    totalPerson = users.length;
}

var players = JSON.parse(localStorage.getItem('players')) || [];
if (!players.length) {
    players = JSON.parse(localStorage.getItem('users'));
    if (players) {
        localStorage.setItem('players', JSON.stringify(players));
    }
}

var levelTypeTitle = prizes.map(function (item) {
    return item.name
}) || ['特等奖', '一等奖', '二等奖', '三等奖'].reverse();
var LuckNumTitle = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

//已中奖的工号
var isWinningeds = JSON.parse(localStorage.getItem('isWinningeds')) || [];
var isWinningedsJson = JSON.parse(localStorage.getItem('isWinningedsJson')) || [];

/*-----------------------------------开始抽奖-----------------------------------------*/

// 根据参数获得随机数 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// getRandomIntInclusive
function getNumberForRadom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值 
}

//获得中奖人员
function winningFn(type) {
    console.log(JSON.stringify(isWinningeds.sort(function (x, y) {
        return x - y
    })));

    if (isWinningeds.length >= totalPerson || players.length < 1) {
        alert('剩余抽奖人数不足！！！ 请点击右下角垃圾桶，清除已抽奖数据，再重新开始');
        return false;
    }

    var isrepeat = false; //是否中过奖

    // 中奖的索引号
    var winningeIndex = getNumberForRadom(0, players.length - 1);
    console.log('winningeIndex' + winningeIndex);
    // 判断是否是重复中奖
    if (isWinningeds && isWinningeds.length) {
        for (var i = 0; i < isWinningeds.length; i++) {
            if (isWinningeds[i] === players[winningeIndex].gonghao) {
                isrepeat = true;
                console.log(winningeIndex + '--- repeat ----- ' + players[winningeIndex].gonghao + ' -------- re-random --------');
            }
        }
    }

    if (isrepeat) {
        return winningFn(type);
    } else {
        // 保存已经中奖的工号
        console.log(players[winningeIndex], players)
        isWinningeds.push(parseInt(players[winningeIndex].gonghao.trim()));
        localStorage.setItem('isWinningeds', JSON.stringify(isWinningeds))
        isWinningedsJson.push({
            level: type,
            prize: levelTypeTitle[type],
            name: (players[winningeIndex] && players[winningeIndex].name) || 'unknown',
            value: players[winningeIndex].gonghao,
            avatar: './img/avatar/' + players[winningeIndex].avatar || ('image' + ('0000' + players[winningeIndex].gonghao.trim()).slice(-3) + '.png')
        });
        localStorage.setItem('isWinningedsJson', JSON.stringify(isWinningedsJson))
        console.log('winningFn ' + winningeIndex, players[winningeIndex]);
        return players.splice(winningeIndex, 1)[0]
    }
}

// 中奖翻牌HTML
function showHaveHTML(type) {
    console.log(firstType, type)
    // 判断是否换了抽奖等级
    if (firstType !== '') {
        container.find('div.select-number').remove();
    }

    var selectNumbers = container.find('div.select-number');
    if (!selectNumbers.length) {

        showJiangText(type); //显示标题

        var html = ""
        var newArr = [];
        if (isWinningedsJson && isWinningedsJson.length) {
            for (var i = 0; i < isWinningedsJson.length; i++) {
                if (isWinningedsJson[i].level == type) {
                    newArr.push(isWinningedsJson[i])
                }
            }
        }
        if (newArr && newArr.length) {
            for (var i = 0; i < newArr.length; i++) {
                html += '<div class="select-number list" style="right:10px;top:0px;transform: scale(0.6,0.6);margin:0 auto;position:relative">\
						<div class="block">\
                            <img src="' + newArr[i].avatar + '" class="img-circle">\
                            <span>' + newArr[i].name + '</span>\
						</div>\
					</div>';
            }
        }

        $('#luck-list').append(html);
    }
}

function setPrizeLevel(level) {
    clearInterval(timer)
    setRotationY(0);

    $('#'+['helix', 'grid'][getNumberForRadom(0, 1)]).click()
    levelType = level;
    cNum = 0; // 清零
    var $levelType = $('#levelType');

    $levelType.html(levelTypeTitle[levelType]);

    firstType = levelType;
    showJiangText(levelType);
    //显示已经中奖的号码
    showHaveHTML(levelType);

    $('button.btn-success').attr('disabled', true);

    setTimeout(function() {
        $('#sphere').click();
        $('button.btn-success').attr('disabled', false);
        rotationAuto(3000);
    }, 3000);
}

function setLuckNum(num) {
    cNum = 0; // 清零
    luckNum = num;
    var $luckNum = $('#lucknum');

    $luckNum.html(LuckNumTitle[luckNum]);
}

// 开始抽奖
function setPrize() {

    if (isWinningeds.length >= totalPerson || players.length < 1) {
        alert('剩余抽奖人数不足！！！ 请点击右下角垃圾桶，清除已抽奖数据，再重新开始');
        return false;
    }

    var type = -1;
    if (levelType == -1) {
        alert('请选择奖项类型');
        return;
    } else {
        type = levelType;
    }

    if (luckNum == 0) {
        alert('请选择中奖人数');
        return;
    }
    // 停止自动旋转
    clearInterval(timer);

    var personArrObj = [];

    if (running) { // if running, then stop it. and get the lucky man

        $('button.btn-success').attr('disabled', true);

        for (var i = 0; i < luckNum; i++) {
            /*------------------------------抽奖开始------------------------------------*/

            // 中奖对象
            var winner = winningFn(type);
            console.log('get Prize ' + levelTypeTitle[type], winner);
            if (winner === false) {
                break;
            }
            // 塞入中奖html
            var winnerclass = randomString(6);

            // 界面上显示中奖号码
            getHTML(winner, winnerclass);

            // 打印中奖号码
            console.log('中奖的工号:' + winner.gonghao);

            /*------------------------------抽奖结束------------------------------------*/

            // 存入数组
            allClass.push({
                classname: winnerclass,
                type: type
            });
            totalClass.push({
                classname: winnerclass,
                type: type
            });

            // 生成抽奖右移动画
            var keyframes = "@keyframes " + winnerclass + "{\
				0% {opacity:1;right:50%;top:50%;transform: scale(1,1);margin:-100px -240px 0 0;}\
				50%{opacity:0.1;}\
				100% {opacity:1;right:10px;top:0px;transform: scale(0.6,0.6);margin:0;position:relative;}\
			}";
            $('#styles').append(keyframes);

            var imgUrl = './img/avatar/' + winner.avatar || ('image' + ('0000' + user.gonghao.trim()).slice(-3) + '.png');
            var userName = winner.name;
            var gonghao = winner.gonghao;

            personArrObj.push({ imgurl: imgUrl, username: userName, gonghao: gonghao, winnerclass: winnerclass });
        }

        localStorage.setItem('players', JSON.stringify(players));
        tweenRotation && tweenRotation.stop();
        runingmic.pause();

        showLuckAnimate(levelTypeTitle[levelType], personArrObj);

        // if(luckNum == cNum) { // 一次抽奖的人数已经达到，允许下次抽奖
        //     running = false;
        //     $('button.dropdown-toggle').attr('disabled', false);
        //     $('button.btn-success').text('开始抽奖');
        //     $('button.btn-success').removeAttr("disabled");
        // }

        return true;
    }

    // 禁止改变抽奖条件
    $('button.dropdown-toggle').attr('disabled', true);
    $('button.btn-success').text('停止抽奖');
    running = true;

    runingmic.currentTime = 0;
    runingmic.play();

    // 转起来
    rotateBall();
}

// 显示获奖标题
function showJiangText(type) {
    // if (container.find('div.select-number').length) {
        $('#jiangpingsspan').text(levelTypeTitle[type]);
        $('div.jiangpingtext').addClass('show').removeClass('hide');
    // } else {
        // $('div.jiangpingtext').addClass('hide').removeClass('show');
    // }
}

//显示中奖动画
function showLuckAnimate(showLevel, personObj) {
    //播放中奖音效
    pausemic.currentTime = 0;
    pausemic.play();

    var winnerclasses = [];

    if (luckNum > 1) {
        var style = '';
        container.append('<div class="animate-bg"><div class="lottery-animate-bg"><div id="multi-lottery"></div>');
        for (var i = 0; i < luckNum; i++) {
            switch (luckNum) {
                case 6:
                    style = 'margin: 0px 74px;';
                    break;
                case 8:
                    style = 'margin: 0px 30px;'
                    break;
            }
            $('#multi-lottery').append('<div class="lotteryuserhead2" style="' + style + '"><img src="' + personObj[i].imgurl + '"/><span class="user-name">' + personObj[i].username + '</span></div></div>');
            winnerclasses.push(personObj[i].winnerclass);
        }

        $('.lottery-animate-bg').append('<div class="clearfix"></div><div class="confirm-btn"><button class="btn btn-lg btn-success fl" onclick="confirmPrize(\'' + winnerclasses.join(',') + '\')"><span id="confirmWin">确定</span></button></div>');
    } else {
        container.append('<div class="animate-bg"><div class="light"></div><div class="lottery-animate-bg"><div class="lotteryuserhead"><img src="' + personObj[0].imgurl + '"/></div><div class="level">恭喜<span class="user-name">' + personObj[0].username + '</span>获得<p class="awards-name">' + showLevel + '</p></div><div class="confirm-btn"><button class="btn btn-lg btn-success fl" onclick="confirmPrize(\'' + personObj[0].winnerclass + '\')"><span id="confirmWin">确定</span></button></div></div>');
    }
    // setTimeout(function () {
    //     $(".animate-bg").animate({"opacity": "0"}, "slow", function () {
    //         $(".animate-bg").remove();
    //     });
    // }, 5000);
    // console.log(luckNum)
    // if(luckNum > 1){
    //     confirmWin
    //     var count = 3;
    //     countDown(count, winnerclass)
    // }

}

function countDown(val, winnerclass) {
    if (val == 0) {
        confirmPrize(winnerclass);
        return true;
    } else {
        $('#confirmWin').text('自动抽(' + val + 's)');
        val--;
    }
    timer = setTimeout(function () {
        countDown(val, winnerclass)
    }, 1000)
}

// 中奖翻牌HTML
function getHTML(user, classname) {
    var html = '<div class="select-number ' + classname + '">\
                <div class="block">\
                    <img src="./img/avatar/' + (user.avatar || ('image' + ('0000' + user.gonghao.trim()).slice(-3) + '.png')) + '" class="img-circle">\
                    <span>' + user.name + '</span>\
				</div>\
		</div>';
    $('#luck-list').append(html);
    // container.append(html);
}

function rotationAuto(timeout = 1000) {
    setTimeout(function () {
        if (timer) {
            clearInterval(timer);
        }
        // 球恢复运行
        setRotationY(0);
        timer = setInterval("autoRotate()", 100);
    }, timeout);
}

function confirmPrize(winnerclass) {

    var zjclass = winnerclass.split(',');

    // 中奖动画移除
    $(".animate-bg").animate({ "opacity": "0" }, "slow", function () {
        $(".animate-bg").remove();
    });

    zjclass.forEach(function (value) {

        // 翻牌
        $('div.' + value).css({
            animation: 'selectnumberanimate 1s forwards'
        });


        // 移动奖牌
        $('div.' + value).one("animationend", function () {

            $('div.' + value).css({
                animation: value + ' 2s forwards'
            });

            setTimeout(function () {
                $('div.' + value).addClass('list');
            }, 1000);

            // 球放恢复运转
            rotationAuto();

            // 运动完成自动继续抽奖
            $('div.' + value).one("animationend", function () {
                var luck_list = document.getElementById('luck-list');
                luck_list.scrollTop = luck_list.scrollHeight;
                running = false;
                $('button.dropdown-toggle').attr('disabled', false);
                $('button.btn-success').text('开始抽奖');
                $('button.btn-success').removeAttr("disabled");
            });

            // 是否显示获奖标题
            showJiangText(levelType);
        });
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
