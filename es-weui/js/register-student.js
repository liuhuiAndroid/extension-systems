function initView() {

    var token = sessionStorage.getItem("token")
    console.log("token = " + token)

    var openid = $.getUrlParam('openid');
    var unionid = $.getUrlParam('unionid');
    var saleid = $.getUrlParam('saleid');
    console.log("openid = " + openid)
    console.log("unionid = " + unionid)
    console.log("saleid = " + saleid)

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
    console.log("click ... ")

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

    $("#chooseCity").cityPicker({
        title: "请选择地址",
        onChange: function (picker, values, displayValues) {
            console.log(values, displayValues);
        }
    });

}

function checkAndCommit() {

    var openid = $.getUrlParam('openid');
    var unionid = $.getUrlParam('unionid');
    var saleid = $.getUrlParam('saleid');
    var headImg = $.getUrlParam('headimg');
    console.log("===---------------===")
    console.log("openid = " + openid)
    console.log("unionid = " + unionid)
    console.log("saleid = " + saleid)
    console.log("headImg = " + headImg)

    var tel = $("#mobile").val();
    var code = $("#code").val();
    var cnname = $("#cnname").val();
    var enname = $("#enname").val();
    var sex = $("#sex").val();
    var birthday = $("#birthday").val();
    var address = $("#address").val();
    console.log("mobile = " + tel) 
    console.log("code = " + code)
    console.log("cnname = " + cnname)
    console.log("enname = " + enname)
    console.log("sex = " + sex)
    console.log("birthday = " + birthday)
    console.log("address = " + address)
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
    if (isEmpty(cnname)) {
        alert("请输入宝贝姓名");
        return false;
    }
    if (isEmpty(enname)) {
        alert("请输入宝贝英文名");
        return false;
    }
    if (isEmpty(birthday)) {
        alert("请选择宝贝生日");
        return false;
    }
    if (isEmpty(address)) {
        alert("请选择地址");
        return false;
    }
    if (!$("#weuiAgree").is(":checked")) {
        alert("请阅读并同意《爱约课用户服务协议》");
        return false;
    }
    // Tel、HeadImg、VerificationCode、Gender、
    // Name、EnName、Birthday、Province、City、Area、openid、unionid、SalesmanID
    var obj = {
        openid: openid,
        unionid: unionid,
        SalesmanID: saleid,
        Tel: tel,
        VerificationCode: code,
        Name: cnname,
        EnName: enname,
        Gender: sex,
        Birthday: birthday,
        address:address,
        Province:"省",
        City:"市",
        Area:"区",
        HeadImg:headImg
    };
    var objJson = JSON.stringify(obj);
    var objJsonEn = aesEncrypt(objJson, aesKey, iv);
    console.log("objJsonEn:" + objJsonEn);
    $.ajax({
        type: "POST",
        data: JSON.stringify({ param: objJsonEn }),
        url: "https://iyueke.net/wechatapi/ActionApi/Popularize_Student/AddStudent",
        contentType: 'application/json',
        success: function (data) {
            if (data.code == 0) {
                window.location.href = 'register-student-successful.html';
            } else {
                alert(data.msg);
            }
        }
    });
    return false;
}
