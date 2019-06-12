var activityId;
var unionid;
var orgid;
var groupid;
var $loadingToast;

function initView() {
    $loadingToast = $('#loadingToast');
    $loadingToast.fadeIn(100);

    activityId = $.getUrlParam('id');
    unionid = $.getUrlParam('unionid');
    orgid = $.getUrlParam('orgid');
    groupid = $.getUrlParam('groupid');
    if(groupid == null){
        groupid = 0;
    }
    console.log('activityId = ' + activityId)
    console.log('groupid = ' + groupid)

    getImage()
    initWeChat()
}

// 获取二维码图片
function getImage() {
    $.ajax({
        type: "GET",
        url: "https://iyueke.net/wechat/MyActivity/GetShareImg?channel=1&unionid=" + unionid
            + "&activityid=" + activityId + "&orgid=" + orgid + "&groupid=" + groupid,
        contentType: 'application/json',
        success: function (data) {
            console.log("image:" + data);
            $('#container').html("");
            $('#container').append('<img src="' + data + '" style="width: 100%"></img>');

            $loadingToast.fadeOut(100);
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
            link: 'https://iyueke.net/wechatpage/activity-detail.html?id=' + activityId + "&unionid=" + unionid + "&orgid=" + orgid,
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
            link: 'https://iyueke.net/wechatpage/activity-detail.html?id=' + activityId + "&unionid=" + unionid + "&orgid=" + orgid,
            imgUrl: 'https://iyueke.net/wechatpage/images/iyueke_icon.png', // 分享图标
            success: function () {
            },
            cancel: function () {
            }
        });
        console.log('end wx.ready')
    });
}