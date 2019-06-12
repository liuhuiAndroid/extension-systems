var mCode;
var mOrg;
var mOrgName;
var mCurrentItem = 0;
var mCurrentShareDetail = '成为学生，预约试听';

var minirefreshStudent = null
var currentPageStudent = 0

var minirefreshPromoter = null
var currentPagePromoter = 0

function initView() {

    // 引入任何一个主题后，都会有一个 MiniRefresh 全局变量
    minirefreshStudent = new MiniRefresh({
        container: '#minirefreshStudent',
        down: {
            isAuto: true,
            callback: function () {
                console.log('callback down')
                currentPageStudent = 0
                getListData(mCode, mOrg, true)
            }
        },
        up: {
            isAuto: false,
            callback: function () {
                console.log('callback up')
                currentPageStudent++
                getListData(mCode, mOrg, false)
            }
        }
    });

    // 引入任何一个主题后，都会有一个 MiniRefresh 全局变量
    minirefreshPromoter = new MiniRefresh({
        container: '#minirefreshPromoter',
        down: {
            isAuto: true,
            callback: function () {
                console.log('callback down')
                currentPagePromoter = 0
                getLowerLevelListData(mCode, mOrg, true)
            }
        },
        up: {
            isAuto: false,
            callback: function () {
                console.log('callback up')
                currentPagePromoter++
                getLowerLevelListData(mCode, mOrg, false)
            }
        }
    });

    var headimg = sessionStorage.getItem("headimg")
    var code = $.getUrlParam('code');
    mCode = code;
    var salesmanname = sessionStorage.getItem("salesmanname")
    var gender = $.getUrlParam('gender');
    var saleid = $.getUrlParam('saleid');
    console.log("headimg = " + headimg)
    console.log("code = " + code)
    console.log("salesmanname = " + salesmanname)
    console.log("saleid = " + saleid)

    $('#head_img').attr("src", headimg);
    $('#head_img2').attr("src", headimg);
    if (1 == gender) {
        $('#sex').attr("src", "./images/iyueke_man.png");
        $('#sex2').attr("src", "./images/iyueke_man.png");
    } else {
        $('#sex').attr("src", "./images/iyueke_woman.png");
        $('#sex2').attr("src", "./images/iyueke_woman.png");
    }

    $("#name").html(salesmanname)
    $("#name2").html(salesmanname)

    $(function () {
        $('.weui-navbar__item').on('click', function () {
            $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');

            $(".weui-tab__panel .weui_tab_bd_item_active").removeClass('weui_tab_bd_item_active');
            var data_toggle = jQuery(this).attr("href");
            $(data_toggle).addClass("weui_tab_bd_item_active");

            mCurrentShareDetail = '成为' + mOrgName + '学生，预约试听'
            if (jQuery(this).attr("href") == "#tab1") {
                mCurrentItem = 1
                console.log("mCurrentItem set =  " + mCurrentItem)
                initWeChat()
            } else if (jQuery(this).attr("href") == "#tab2") {
                mCurrentItem = 2
                mCurrentShareDetail = '成为' + mOrgName + '推广人'
                console.log("mCurrentItem set =  " + mCurrentItem)
                initWeChat()
            } else if (jQuery(this).attr("href") == "#tab3") {
                mCurrentItem = 1
                console.log("mCurrentItem set =  " + mCurrentItem)
                currentPagePromoter = 0
                getLowerLevelListData(mCode, mOrg, true)
                initWeChat()
            } else if (jQuery(this).attr("href") == "#tab4") {
                mCurrentItem = 1
                console.log("mCurrentItem set =  " + mCurrentItem)
                currentPageStudent = 0
                getListData(mCode, mOrg, true)
                initWeChat()
            } else if (jQuery(this).attr("href") == "#tab5") {
                mCurrentItem = 1
                console.log("mCurrentItem set =  " + mCurrentItem)
                currentPageStudent = 0
                getActivityData(mOrg)
            }
        });
    });

    $("tbody tr:odd").addClass("odd");
    $("tbody tr:even").addClass("even");

    // 选择机构
    var org = sessionStorage.getItem("org")
    console.log("before org = " + org)
    var orgobj = JSON.parse(org);
    console.log("orgobj.length = " + orgobj.length)
    if (orgobj.length == 1) {
        console.log("orgobj.Name = " + orgobj[0].Name)
        console.log("orgobj.ID = " + orgobj[0].ID)
        $("#org_name").html(orgobj[0].Name)
        $("#org_name2").html(orgobj[0].Name)
        // 生成推广学生二维码
        new QRCode(document.getElementById("qrcode"), {
            text: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5ca721e672cc146&redirect_uri=https%3a%2f%2fiyueke.net%2fwechat%2fWeixin%2fGetOAuth&response_type=code&scope=snsapi_userinfo&state=PROMOTERSQR|" + orgobj[0].ID + "|" + code + "#wechat_redirect",
            width: 192,
            height: 192,
        });
        console.log("学生二维码：")
        // 生成推广推广者二维码
        $("#qrcode_sale").html("");
        new QRCode(document.getElementById("qrcode_sale"), {
            text: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5ca721e672cc146&redirect_uri=https%3a%2f%2fiyueke.net%2fwechat%2fWeixin%2fGetOAuth&response_type=code&scope=snsapi_userinfo&state=ORGQR|" + orgobj[0].ID + "|" + code + "#wechat_redirect",
            width: 192,
            height: 192,
        });
        console.log("推广者二维码：" + "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5ca721e672cc146&redirect_uri=https%3a%2f%2fiyueke.net%2fwechat%2fWeixin%2fGetOAuth&response_type=code&scope=snsapi_userinfo&state=ORGQR|" + orgobj[0].ID + "|" + code + "#wechat_redirect")

        // 获取推广学生列表信息
        mOrg = orgobj[0].ID
        mOrgName = orgobj[0].Name
        currentPageStudent = 0
        getListData(code, orgobj[0].ID, true)

        $("#btn_switch_org").hide();
        initWeChat()
    } else {
        // 选择机构
        var $androidActionSheet = $('#androidActionsheet');
        var $androidMask = $androidActionSheet.find('.weui-mask');

        for (i in orgobj) {
            var str = '<div class="weui-actionsheet__cell" onclick="selectOrg(' + orgobj[i].ID + ',\'' + orgobj[i].Name + '\')">' + orgobj[i].Name + '</div>'
            $("#org_menu").append(str)
        }

        $androidActionSheet.fadeIn(200);

        $("#btn_switch_org").show();
        $('#btn_switch_org').on('click', function () {
            $androidActionSheet.fadeIn(200);
        });
    }
}

// 选择机构
function selectOrg(orgid, name) {
    $("#org_name").html(name)
    $("#org_name2").html(name)
    var code = $.getUrlParam('code');
    var $androidActionSheet = $('#androidActionsheet');
    var $androidMask = $androidActionSheet.find('.weui-mask');

    $androidActionSheet.fadeOut(200);
    // 生成推广学生二维码
    $("#qrcode").html("");
    new QRCode(document.getElementById("qrcode"), {
        text: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5ca721e672cc146&redirect_uri=https%3a%2f%2fiyueke.net%2fwechat%2fWeixin%2fGetOAuth&response_type=code&scope=snsapi_userinfo&state=PROMOTERSQR|" + orgid + "|" + code + "#wechat_redirect",
        width: 192,
        height: 192,
    });
    // 生成推广推广者二维码
    $("#qrcode_sale").html("");
    new QRCode(document.getElementById("qrcode_sale"), {
        text: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5ca721e672cc146&redirect_uri=https%3a%2f%2fiyueke.net%2fwechat%2fWeixin%2fGetOAuth&response_type=code&scope=snsapi_userinfo&state=ORGQR|" + orgid + "|" + code + "#wechat_redirect",
        width: 192,
        height: 192,
    });
    console.log("推广者二维码：" + "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5ca721e672cc146&redirect_uri=https%3a%2f%2fiyueke.net%2fwechat%2fWeixin%2fGetOAuth&response_type=code&scope=snsapi_userinfo&state=ORGQR|" + orgid + "|" + code + "#wechat_redirect")

    // 获取推广学生列表信息
    mOrg = orgid
    mOrgName = name
    currentPageStudent = 0
    getListData(code, orgid, true)
    initWeChat()
}

// 初始化微信分享功能
function initWeChat() {
    console.log('initWeChat')
    wx.ready(function () {
        console.log('before wx.ready')
        // 分享到微信
        wx.onMenuShareAppMessage({
            title: '爱约课', // 分享标题
            desc: mCurrentShareDetail, // 分享描述 
            imgUrl: 'https://iyueke.net/wechatpage/images/iyueke_icon.png', // 分享图片
            link: 'https://iyueke.net/wechatpage/share.html?id=' + mOrg + '&code=' + mCode + '&type=' + mCurrentItem, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
            },
            cancel: function () {
            }
        });

        // 分享到朋友圈
        wx.onMenuShareTimeline({
            title: '爱约课二维码', // 分享标题
            link: 'https://iyueke.net/wechatpage/share.html?id=' + mOrg + '&code=' + mCode + '&type=' + mCurrentItem, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://iyueke.net/wechatpage/images/iyueke_icon.png', // 分享图标
            success: function () {
            },
            cancel: function () {
            }
        });
        console.log('end wx.ready')
    });
}

// 获取二级推广人列表
function getLowerLevelListData(code, orgid, type) {
    var token = sessionStorage.getItem("token")
    console.log("getLowerLevelListData code = " + code + ", orgid = " + orgid)
    var obj = {
        salesmanID: code,
        orgid: orgid,
        Token: token,
        page: currentPagePromoter
    };
    var objJson = JSON.stringify(obj);
    var objJsonEn = aesEncrypt(objJson, aesKey, iv);
    console.log("objJsonEn:" + objJsonEn);

    $.ajax({
        type: "POST",
        data: JSON.stringify({ param: objJsonEn }),
        url: "https://iyueke.net/wechatapi/ActionApi/Salesman/GetLowerLevelSalesmanBySalesmanID",
        contentType: 'application/json',
        success: function (data) {
            if (data.code == 0) {
                if (type) {
                    $("#promoter-table tbody").html("");
                }

                for (i in data.data) {
                    var tr;
                    tr = '<td>' + data.data[i].Name + '</td><td>' + data.data[i].Tel + '</td><td>' + data.data[i].CreateDate + '</td>'
                    $("#promoter-table").append('<tr>' + tr + '</tr>')
                }

                $("tbody tr:odd").addClass("odd");
                $("tbody tr:even").addClass("even");
            } else {
                alert(data.msg);
            }

            if (type) {
                minirefreshPromoter.endDownLoading();
            }

            if (data.data.length != 10) {
                console.log("miniRefresh.endUpLoading(true)")
                minirefreshPromoter.endUpLoading(true);
            } else {
                console.log("miniRefresh.endUpLoading(false)")
                minirefreshPromoter.endUpLoading(false);
            }
        }
    });
}

// 获取推广学生汇总信息
function getListData(code, orgid, type) {
    var code = $.getUrlParam('code');
    var token = sessionStorage.getItem("token")
    console.log("getListData code = " + code + ", orgid = " + orgid)
    var obj = {
        salesmanID: code,
        orgid: orgid,
        Token: token,
        page: currentPageStudent
    };
    var objJson = JSON.stringify(obj);
    var objJsonEn = aesEncrypt(objJson, aesKey, iv);
    console.log("objJsonEn:" + objJsonEn);

    $.ajax({
        type: "POST",
        data: JSON.stringify({ param: objJsonEn }),
        url: "https://iyueke.net/wechatapi/ActionApi/Salesman/GetPopularizeRecordCountBySalesmanID",
        contentType: 'application/json',
        success: function (data) {
            if (data.code == 0) {
                if (type) {
                    $("#student-table tbody").html("");
                }

                for (i in data.data) {
                    console.log("getListData data.data[i].ID = " + data.data[i].ID)
                    if (data.data[i].ID == code) {
                        var tr;
                        tr = '<td>' + data.data[i].Name + '</td><td>' + data.data[i].Number
                            + '</td><td><a class="weui-btn weui-btn_mini weui-btn_primary" href="javascript:void(0)" onclick="jumpToDetail()">查看详情</a></td>'
                        $("#student-table").append('<tr>' + tr + '</tr>')
                    } else {
                        var tr;
                        tr = '<td>' + data.data[i].Name + '</td><td>' + data.data[i].Number + '</td><td></td>'
                        $("#student-table").append('<tr>' + tr + '</tr>')
                    }
                }

                $("tbody tr:odd").addClass("odd");
                $("tbody tr:even").addClass("even");
            } else {
                alert(data.msg);
            }

            if (type) {
                minirefreshStudent.endDownLoading();
            }

            if (data.data.length != 10) {
                console.log("miniRefresh.endUpLoading(true)")
                minirefreshStudent.endUpLoading(true);
            } else {
                console.log("miniRefresh.endUpLoading(false)")
                minirefreshStudent.endUpLoading(false);
            }
        }
    });
}

// 获取机构活动列表信息
function getActivityData(orgid) {
    console.log("getActivityData orgid:" + orgid);
    var token = sessionStorage.getItem("token")
    var obj = {
        orgid: orgid,
        token: token
    };
    var objJson = JSON.stringify(obj);
    var objJsonEn = aesEncrypt(objJson, aesKey, iv);
    console.log("objJsonEn:" + objJsonEn);

    $.ajax({
        type: "POST",
        data: JSON.stringify({ param: objJsonEn }),
        url: "https://iyueke.net/wechatapi/ActionApi/Activity/GetActivityList",
        contentType: 'application/json',
        success: function (data) {
            console.log("data:");
            if (data.code == 0) {
                console.log("data.code == 0");
                $("#activity_ul").html("");
                for (i in data.data) {
                    var li = '<img src="' + data.data[i].BannerUrl + '" style="width: 98%;margin:5px" onclick="jumpToActivityDetail(' + data.data[i].ID + ',' + "" + ')"/>'
                    $("#activity_ul").append('<li>' + li + '</li>')
                }
                console.log("data end");
            } else {
                alert(data.msg);
            }
        }
    });
}

// 查看详情
function jumpToDetail() {
    window.location.href = 'promoter-detail.html?code=' + mCode + '&orgid=' + mOrg
}

// 查看活动
function jumpToActivityDetail(activityId, Page) {
    var unionid = $.getUrlParam('unionid');
    console.log('unionid = ' + unionid)
    window.location.href = 'activity-detail.html?id=' + activityId + "&unionid=" + unionid + "&orgid=" + mOrg
}
