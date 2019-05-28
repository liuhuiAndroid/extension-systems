
function initView() {
    console.log('initView')
    new QRCode(document.getElementById("qrcode_andoid"),
        {
            text:  "https://sj.qq.com/myapp/detail.htm?apkName=com.iyueke.ok.kids",
            width: 130,
            height: 130,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    new QRCode(document.getElementById("qrcode_ios"),
        {
            text: "https://itunes.apple.com/cn/app/id1458950540",
            width: 130,
            height: 130,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    $("#qrcode_andoid").find("img").css({ "text-align": "center", "margin": "auto" });
    $("#qrcode_ios").find("img").css({ "text-align": "center", "margin": "auto" });
}