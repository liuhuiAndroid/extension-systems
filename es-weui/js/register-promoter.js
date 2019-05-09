function initView() {
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
            url: "https://api.uniapk.cn/api/PhoneVm/GetCode",
            contentType: 'application/json',
            success: function (data) {
                if (data.code == 0) {
                    alert("获取验证码成功");
                } else {
                    alert(data.message);
                }
            },
        });
    }

    var countdown = 60;
    var _generate_code = $('#generate_code');
    function settime() {
        if (countdown == 0) {
            console.log('true');

            _generate_code.attr("disabled", false);
            _generate_code.text("获取验证码");
            countdown = 60;
            return false;
        } else {
            console.log('false');
            _generate_code.attr("disabled", true);
            _generate_code.text(" " + countdown + "秒 ");
            countdown--;
        }
        setTimeout(function () {
            settime();
        }, 1000);
    }

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
}

function checkAndCommit() {
    var tel = $("#mobile").val();
    var code = $("#code").val();
    var name = $("#name").val();
    if (isEmpty(tel)) {
        alert("请输入手机号");
        return false;
    }
    if (isEmpty(code)) {
        alert("请输入验证码");
        return false;
    }
    if (isEmpty(name)) {
        alert("请输入姓名");
        return false;
    }
    if (!(/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(tel))) {
        alert("请输入有效的手机号");
        return false;
    }
    if (!$("#weuiAgree").is(":checked")) {
        alert("请阅读并同意《爱约课用户服务协议》");
        return false;
    }
    var $toast = $('#toast');
    $.ajax({
        url: "register-promoter-success.json",
        type: "get",
        dataType: "json",
        success: function (data) {
            if (data.status == 0) {
                // 弹出注册成功
                if ($toast.css('display') != 'none') return;
                $toast.fadeIn(100);
                setTimeout(function () {
                    $toast.fadeOut(100);
                }, 2000);
            }
        }
    });
    return false;
}

//判断字符是否为空的方法
function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}
