var $loginActionsheet
var buyMask$loginMask
var $buyActionsheet
var $buyMask

var activityid
var orgid
var groupid
var unionid
var openid

function initView() {

    activityid = $.getUrlParam('activityid');
    orgid = $.getUrlParam('orgid');
    groupid = $.getUrlParam('groupid');
    unionid = $.getUrlParam('unionid');
    openid = $.getUrlParam('openid');

    if (groupid == 0) {
        $('#groupPage').css("display", "none");
    } else {
        $('#groupPage').css("display", "inline");
    }

    $loginActionsheet = $('#loginActionsheet');
    $loginMask = $('#loginMask');
    $loginMask.on('click', hideLoginActionSheet);

    $buyActionsheet = $('#buyActionsheet');
    $buyMask = $('#buyMask');
    $buyMask.on('click', hideBuyActionSheet);

    $('#generate_code').on('click', function () {
        if (isEmpty($("#mobile").val())) {
            alert("请输入手机号");
            return false;
        }
        if (!(/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test($("#mobile").val()))) {
            alert("请输入有效的手机号");
            return false;
        }
        settime();
        getCode();
    });

    var countdown = 60;
    var _generate_code = $('#generate_code');
    function settime() {
        if (countdown == 0) {
            // console.log('true');
            _generate_code.attr("disabled", false);
            _generate_code.text("获取验证码");
            countdown = 60;
            return false;
        } else {
            // console.log('false');
            _generate_code.attr("disabled", true);
            _generate_code.text(" " + countdown + "秒 ");
            countdown--;
        }
        setTimeout(function () {
            settime();
        }, 1000);
    }

    function getCode() {
        var obj = {
            phoneNum: $("#mobile").val(),
            isVoice: "0"
        };
        var objJson = JSON.stringify(obj);
        var objJsonEn = aesEncrypt(objJson, aesKey, iv);
        $.ajax({
            type: "POST",
            data: JSON.stringify({ param: objJsonEn }),
            url: "https://api.iyueke.net/api/PhoneVm/GetCode",
            contentType: 'application/json',
            success: function (data) {
                if (data.code == 0) {
                    // alert("获取验证码成功");
                } else {
                    alert(data.message);
                }
            },
        });
    }

    $('.weui-navbar__item').on('click', function () {
        $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');

        $(".weui-tab__panel .weui_tab_bd_item_active").removeClass('weui_tab_bd_item_active');
        var data_toggle = jQuery(this).attr("href");
        $(data_toggle).addClass("weui_tab_bd_item_active");

    });

    checkJoinGroup()
    initWeChat()
    // 获取活动详情
    getActivityDetail()
}

// 隐藏登录Dialog
function hideLoginActionSheet() {
    $loginActionsheet.removeClass('weui-actionsheet_toggle');
    $loginMask.fadeOut(200);
}

// 隐藏支付Dialog
function hideBuyActionSheet() {
    $buyActionsheet.removeClass('weui-actionsheet_toggle');
    $buyMask.fadeOut(200);
}

var currentType = 1

// 单独购买
function singlePurchase() {
    currentType = 1
    $('#dialogPrice').html('￥' + singlePrice)
    showDialog()
}

// 参与团购
function groupBuying() {
    currentType = 2
    $('#dialogPrice').html('￥' + groupPrice)
    showDialog()
}

function showDialog() {
    var token = sessionStorage.getItem("token")
    if (token != null && token != '') {
        $buyActionsheet.addClass('weui-actionsheet_toggle');
        $buyMask.fadeIn(200);
    } else {
        // 未登录需要登录
        $loginActionsheet.addClass('weui-actionsheet_toggle');
        $loginMask.fadeIn(200);
    }
}

// 微信支付
function pay() {
    // 创建订单 type - 1：特价 2：拼团 3：打折
    var token = sessionStorage.getItem("token")
    console.log('pay... token = ' + token)
    if (token != null && token != '') {
        isRepeatPurchase()
    } else {
        // 登录
        $loginActionsheet.addClass('weui-actionsheet_toggle');
        $loginMask.fadeIn(200);
    }
}

function checkAndCommit() {
    var tel = $("#mobile").val();
    var code = $("#code").val();
    console.log("===---------------===")
    console.log("mobile = " + tel)
    console.log("code = " + code)
    console.log("===---------------===")
    if (isEmpty(tel)) {
        alert("请输入手机号");
        return false;
    }
    if (!(/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(tel))) {
        alert("请输入有效的手机号");
        return false;
    }
    if (isEmpty(code)) {
        alert("请输入验证码");
        return false;
    }
    if (!$("#weuiAgree").is(":checked")) {
        alert("请阅读并同意《爱约课用户服务协议》");
        return false;
    }
    var obj = {
        unionid: unionid,
        openid: openid,
        orgid: orgid,
        tel: tel,
        code: code,
    };
    var objJson = JSON.stringify(obj);
    console.log("objJson : " + objJson);
    var objJsonEn = aesEncrypt(objJson, aesKey, iv);
    console.log("objJsonEn : " + objJsonEn);
    $.ajax({
        type: "POST",
        data: JSON.stringify({ param: objJsonEn }),
        url: "https://iyueke.net/wechatapi/ActionApi/Activity/StudentRegister",
        contentType: 'application/json',
        success: function (data) {
            if (data.code == 0) {
                sessionStorage.setItem("token", data.data.Token);
                hideLoginActionSheet()
            } else {
                alert(data.msg);
            }
        }
    });
    return false;
}

function onBridgeReady(orderid, data) {
    console.log("调起微信数据data:" + data);
    var dataObj = JSON.parse(data);
    console.log("appId:" + dataObj.appId);

    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
            "appId": dataObj.appId,     //公众号名称，由商户传入     
            "timeStamp": dataObj.timeStamp,         //时间戳，自1970年以来的秒数     
            "nonceStr": dataObj.nonceStr, //随机串     
            "package": dataObj.package,
            "signType": "MD5",         //微信签名方式：     
            "paySign": dataObj.paySign //微信签名 
        },
        function (res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                // 使用以上方式判断前端返回,微信团队郑重提示：
                //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                getOrderState(orderid)
            } else {
                alert("支付失败!" + JSON.stringify(res));
            }
        });
}

// 根据订单号获取微信支付参数
function getWeChatPayParams(orderid) {
    console.log("orderid : " + orderid);
    var obj = {
        orderid: orderid,
        openid: openid
    };
    var objJson = JSON.stringify(obj);
    console.log("objJson : " + objJson);
    var objJsonEn = aesEncrypt(objJson, aesKey, iv);
    console.log("objJsonEn : " + objJsonEn);
    objJsonEn = encodeURIComponent(objJsonEn)
    console.log("encodeURI objJsonEn : " + objJsonEn);

    $.ajax({
        type: "GET",
        url: "https://iyueke.net/wechat/WxPay/PayJS?param=" + objJsonEn,
        contentType: 'application/json',
        success: function (data) {
            // 调起微信支付
            console.log("调起微信支付");
            onBridgeReady(orderid, data)
            hideBuyActionSheet()
        }
    });
}

// 审查是否可以参团
function checkJoinGroup() {
    var obj = {
        unionid: unionid,
        ActivityID: activityid,
        GroupID: groupid
    };
    var objJson = JSON.stringify(obj);
    var objJsonEn = aesEncrypt(objJson, aesKey, iv);
    console.log("objJsonEn : " + objJsonEn);

    $.ajax({
        type: "POST",
        data: JSON.stringify({ param: objJsonEn }),
        url: "https://iyueke.net/wechatapi/ActionApi/Activity/CheckJoinGroup",
        contentType: 'application/json',
        success: function (data) {
            // {"code":0,"msg":"允许开团","data":{"headImgList":null,"Token":""}}
            if (data.code == 0) {
                if (data.data.Token != null && data.data.Token != '') {
                    sessionStorage.setItem("token", data.data.Token);
                }
                if (data.data.Status == 0) { // 开团
                    // 允许开团
                } else if (data.data.Status == 1) { // 参团
                    $('#groupBuy').html('一键参团（4人团）')
                    // 允许参团
                } else if (data.data.Status == 3) {
                    alert('该团仅限参与一次');
                    $("#groupBuyContainer").disable();
                    $("#groupBuyDiv").css('background', '#cccccc')
                    $('#groupPage').css("display", "none");
                } else if (data.data.Status == 4) {
                    alert('超出团购截止日期');
                    $('#groupPage').css("display", "none");
                } else if (data.data.Status == 5) { // 开团
                    // 团已满员,允许开团
                    alert('团已满员');
                    $('#groupPage').css("display", "none");
                } else if (data.data.Status == 8) { // 开团
                    // 当前正在参与中
                    $('#desc').html('当前正在参与团购中')
                    $("#groupBuyContainer").disable();
                    $("#groupBuyDiv").css('background', '#cccccc')
                    groupid = data.data.GroupID
                    $('#groupPage').css("display", "inline");

                    if (data.data.headImgList != null && data.data.headImgList.length > 0) {
                        console.log('data.data.headImgList.size = ' + data.data.headImgList.length);
                        for (var i = 0; i < data.data.headImgList.length; i++) {
                            console.log('.............');
                            console.log(data.data.headImgList[i]);
                            if (i == 0) {
                                $("#imgHeader1").attr('src', data.data.headImgList[i]);
                            } else if (i == 1) {
                                $("#imgHeader2").attr('src', data.data.headImgList[i]);
                            } else if (i == 2) {
                                $("#imgHeader3").attr('src', data.data.headImgList[i]);
                            } else if (i == 3) {
                                $("#imgHeader4").attr('src', data.data.headImgList[i]);
                            }
                        }
                    }

                }
            } else {
                alert(data.msg);
            }
        }
    });
}

// 添加订单
function addOrderActivity() {
    var token = sessionStorage.getItem("token")
    var obj = {
        PayType: 2, // 2代表微信支付
        OpenClassID: 100001,
        GroupID: groupid, // 0代表不是团购
        ActivityID: activityid,
        DiscountTypeID: currentType, // type - 1：特价 2：拼团 3：打折
        unionid: unionid
    };
    var objJson = JSON.stringify(obj);
    var objJsonEn = aesEncrypt(objJson, aesKey, iv);
    console.log("objJsonEn : " + objJsonEn);
    $.ajax({
        headers: {
            Authorization: token
        },
        type: "POST",
        data: JSON.stringify({ param: objJsonEn }),
        url: "https://api.iyueke.net/api/Order/AddOrderActivity",
        contentType: 'application/json',
        success: function (data) {
            if (data.code == 0) {
                console.log("订单id : " + data.data.ID);
                // 根据订单号获取微信支付参数
                getWeChatPayParams(data.data.ID)
            } else {
                alert(data.msg);
            }
        }
    });
}

// 获取订单状态
function getOrderState(orderid) {
    var token = sessionStorage.getItem("token")
    var obj = {
        ID: orderid
    };
    var objJson = JSON.stringify(obj);
    var objJsonEn = aesEncrypt(objJson, aesKey, iv);
    console.log("objJsonEn : " + objJsonEn);
    $.ajax({
        headers: {
            Authorization: token
        },
        type: "POST",
        data: JSON.stringify({ param: objJsonEn }),
        url: "https://api.iyueke.net/api/Order/GetOrderState",
        contentType: 'application/json',
        success: function (data) {
            if (data.code == '0') {
                if (data.data.state == 1) {
                    alert("支付成功!");
                } else {
                    alert("支付中，请稍后!");
                }
                groupid = data.data.groupid
                // initWeChat()
                // checkJoinGroup()
                location.href = location.href
            } else if (data.code == 0) {
                alert(data.msg);
            }
        }
    });
}

// 初始化微信分享功能
function initWeChat() {
    console.log('initWeChat')
    wx.ready(function () {
        console.log('before wx.ready')
        // 分享到微信
        wx.onMenuShareAppMessage({
            title: '给孩子的英语课，每个孩子的童年都值得拥有', // 分享标题
            desc: '生动有趣激发想象力的英语课', // 分享描述 
            imgUrl: 'https://iyueke.net/wechatpage/images/iyueke_icon.png', // 分享图片
            link: 'https://iyueke.net/wechatpage/activity-detail.html?id=' + activityid + "&unionid=" + unionid + "&orgid=" + orgid + "&groupid=" + groupid,
            type: 'link',
            dataUrl: '',
            success: function () {
            },
            cancel: function () {
            }
        });

        // 分享到朋友圈
        wx.onMenuShareTimeline({
            title: '给孩子的英语课，每个孩子的童年都值得拥有', // 分享标题
            link: 'https://iyueke.net/wechatpage/activity-detail.html?id=' + activityid + "&unionid=" + unionid + "&orgid=" + orgid + "&groupid=" + groupid,
            imgUrl: 'https://iyueke.net/wechatpage/images/iyueke_icon.png', // 分享图标
            success: function () {
            },
            cancel: function () {
            }
        });
        console.log('end wx.ready')
    });
}

//禁用
$.fn.disable = function () {
    $(this).addClass("disable");
};

//启用
$.fn.enable = function () {
    $(this).removeClass("disable");
};

// 验证是否重复购买
function isRepeatPurchase() {
    var token = sessionStorage.getItem("token")
    var obj = {
        Token: token, // 2代表微信支付
        unionid: unionid,
        OpenClassID: 100001
    };
    var objJson = JSON.stringify(obj);
    var objJsonEn = aesEncrypt(objJson, aesKey, iv);
    console.log("objJsonEn : " + objJsonEn);
    $.ajax({
        headers: {
            Authorization: token
        },
        type: "POST",
        data: JSON.stringify({ param: objJsonEn }),
        url: "https://iyueke.net/wechatapi/ActionApi/Activity/IsRepeatPurchase",
        contentType: 'application/json',
        success: function (data) {
            if (data.code == 0) {
                addOrderActivity()
            } else {
                alert(data.msg);
            }
        }
    });
}

var singlePrice
var groupPrice

// 获取活动详情
function getActivityDetail() {
    var token = sessionStorage.getItem("token")
    var obj = {
        Token: token, // 2代表微信支付
        ActivityID: activityid
    };
    var objJson = JSON.stringify(obj);
    console.log("获取活动详情：objJson : " + objJson);
    var objJsonEn = aesEncrypt(objJson, aesKey, iv);
    console.log("objJsonEn : " + objJsonEn);
    $.ajax({
        type: "POST",
        data: JSON.stringify({ param: objJsonEn }),
        url: "https://iyueke.net/wechatapi/ActionApi/Activity/GetActivityDetail",
        contentType: 'application/json',
        success: function (data) {
            if (data.code == 0) {
                for (var i = 0; i < data.data.length; i++) {
                    console.log('价格：' + data.data[i].DiscountPrice)
                    if (i == 0) {
                        $("#singlePrice").html('￥' + data.data[i].DiscountPrice);
                        singlePrice = data.data[i].DiscountPrice
                    } else if (i == 1) {
                        $("#groupPrice").html('￥' + data.data[i].DiscountPrice);
                        groupPrice = data.data[i].DiscountPrice
                    }
                }
                // {"code":0,"msg":"获取成功","data":[{"Title":"测试title","BeginDate":"2019-05-24T15:55:20.143","EndDate":"2019-06-24T15:55:20.143","Description":"测试的描述","DiscountPrice":0.02,"OpenClassID":100001,"DiscountTypeID":1,"Percentage":null},
                // {"Title":"测试title","BeginDate":"2019-05-24T15:55:20.143","EndDate":"2019-06-24T15:55:20.143","Description":"测试的描述","DiscountPrice":0.01,"OpenClassID":100001,"DiscountTypeID":2,"Percentage":null}]}
                console.log('获取活动详情：' + data.data)
            } else {
                alert(data.msg);
            }
        }
    });
}
