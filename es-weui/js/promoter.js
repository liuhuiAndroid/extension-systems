function initView() {
    var headimg = $.getUrlParam('headimg');
    var code = $.getUrlParam('code');
    var orgname = $.getUrlParam('orgname');
    var salesmanname = $.getUrlParam('salesmanname');
    var gender = $.getUrlParam('gender');
    console.log("headimg = " + headimg)
    console.log("code = " + code)
    console.log("salesmanname = " + salesmanname)

    $('#head_img').attr("src", headimg);
    if(1 == gender){
        $('#sex').attr("src", "./images/iyueke_man.png");
    }else{
        $('#sex').attr("src", "./images/iyueke_woman.png");
    }
    
    $("#name").html(salesmanname)
    $("#org_name").html(orgname)

    new QRCode(document.getElementById("qrcode"), "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5ca721e672cc146&redirect_uri=https%3a%2f%2fiyueke.net%2fwechat%2fWeixin%2fGetOAuth");

    $(function () {
        $('.weui-navbar__item').on('click', function () {
            $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');

            $(".weui-tab__panel .weui_tab_bd_item_active").removeClass('weui_tab_bd_item_active');
            var data_toggle = jQuery(this).attr("href");
            $(data_toggle).addClass("weui_tab_bd_item_active");
        });
    });

    $("tbody tr:odd").addClass("odd");
    $("tbody tr:even").addClass("even");

    getListData(code)

    initWeChat()
}

function initWeChat() {
    console.log('initWeChat')
    wx.ready(function () {
        console.log('before wx.ready')
        wx.onMenuShareAppMessage({
            title: '叮咚叮咚~暖心小心思从天而降', // 分享标题
            desc: '高冷No Way! Kugel完全送礼手册，拿走不谢。', // 分享描述 
            imgUrl: 'https://bdactivity.oss-cn-hangzhou.aliyuncs.com/chrismas/shareImg.jpg', // 分享图片
            // desc: '安视优', // 分享描述
            link: 'http://alfi.51i.cc/api/chrismas/crs05.html', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                if (!is_shared && is_zj == 0) {
                    $.post('http://alfi.51i.cc/Luckdraw/LuckdrawXmas/WxShare?openid=' + localStorage.getItem('crs_openid') + '&channel=' + localStorage.getItem('source'), function (data) {
                        alert('分享成功,赠送您一次抽奖机会~')
                        self.location = 'index.html'
                    })
                } else {
                    //alert('您已中奖或今天已分享过啦~')
                }
            },
            cancel: function () {
            }
        });

        wx.onMenuShareTimeline({
            title: '叮咚叮咚~暖心小心思从天而降', // 分享标题
            link: 'http://alfi.51i.cc/api/chrismas/crs05.html', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://bdactivity.oss-cn-hangzhou.aliyuncs.com/chrismas/shareImg.jpg', // 分享图标
            success: function () {
                if (!is_shared && is_zj == 0) {
                    $.post('http://alfi.51i.cc/Luckdraw/LuckdrawXmas/WxShare?openid=' + localStorage.getItem('crs_openid') + '&channel=' + localStorage.getItem('source'), function (data) {
                        alert('分享成功,赠送您一次抽奖机会~')
                        self.location = 'index.html'

                    })
                } else {
                    //alert('您已中奖或今天已分享过啦~')
                }
            },
            cancel: function () {
            }
        });
        console.log('end wx.ready')
    });
}

function getListData(code) {
    console.log("getListData code = " + code)
    var obj = {
        salesmanID: code
    };
    var objJson = JSON.stringify(obj);
    var objJsonEn = aesEncrypt(objJson, aesKey, iv);
    console.log("objJsonEn:" + objJsonEn);

    $.ajax({
        type: "POST",
        data: JSON.stringify({ param: objJsonEn }),
        url: "https://iyueke.net/wechatapi/ActionApi/Salesman/GetPopularizeRecordBySalesmanID",
        contentType: 'application/json',
        success: function (data) {
            if (data.code == 0) {
                for (i in data.data) {
                    var tr;
                    tr = '<td>' + data.data[i].StudentName + '</td><td>' + data.data[i].StudentTel + '</td><td>' + data.data[i].CreateDate + '</td>'
                    $("#student-table").append('<tr>' + tr + '</tr>')
                }
            } else {
                alert(data.msg);
            }
        }
    });
}