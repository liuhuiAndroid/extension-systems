var aesKey = ")O[NB]6,YF}+efcaj{+oESb9d8>Z'e9M";
var newAesKey = null;
var iv = "L+\~f4,Ir)b$=pkf";
/**
 * 加密数据
 * param {type} data 待加密的字符串
 * param {type} keyStr 秘钥
 * param {type} ivStr 向量
 * returns {unresolved} 加密后的数据
 */
var aesEncrypt = function (data, keyStr, ivStr) {
    var sendData = CryptoJS.enc.Utf8.parse(data);
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var iv = CryptoJS.enc.Utf8.parse(ivStr);
    var encrypted = CryptoJS.AES.encrypt(sendData, key, { iv: iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    //return CryptoJS.enc.Base64.stringify(encrypted.toString(CryptoJS.enc.Utf8));
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
};
/**
 *
 * param {type} data BASE64的数据
 * param {type} key 解密秘钥
 * param {type} iv 向量
 * returns {undefined}
 */
var aesDecrypt = function (data, keyStr, ivStr) {
    var key = CryptoJS.enc.Utf8.parse(keyStr);
    var iv = CryptoJS.enc.Utf8.parse(ivStr);
    //解密的是基于BASE64的数据，此处data是BASE64数据
    var decrypted = CryptoJS.AES.decrypt(data, key, { iv: iv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return decrypted.toString(CryptoJS.enc.Utf8);
};

(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
})(jQuery);

//判断字符是否为空的方法
function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}