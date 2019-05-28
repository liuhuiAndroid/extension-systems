function initView() {
    console.log("initView ... ")

    var id = $.getUrlParam('id');
    var code = $.getUrlParam('code');
    var type = $.getUrlParam('type');
    console.log("id = " + id)
    console.log("code = " + code)

    if (type == 2) {
        $('#hint').text("成为推广人")
        new QRCode(document.getElementById("qrcode"), {
            text: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5ca721e672cc146&redirect_uri=https%3a%2f%2fiyueke.net%2fwechat%2fWeixin%2fGetOAuth&response_type=code&scope=snsapi_userinfo&state=ORGQR|" + id + "|" + code + "#wechat_redirect",
            width: 192,
            height: 192
        });
    } else{
        $('#hint').text("成为学生，预约试听")
        new QRCode(document.getElementById("qrcode"), {
            text: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5ca721e672cc146&redirect_uri=https%3a%2f%2fiyueke.net%2fwechat%2fWeixin%2fGetOAuth&response_type=code&scope=snsapi_userinfo&state=PROMOTERSQR|" + id + "|" + code + "#wechat_redirect",
            width: 192,
            height: 192
        });
    }

}