function initView() {

    var token = sessionStorage.getItem("token")
    console.log("token = " + token)

    var openid = $.getUrlParam('openid');
    var unionid = $.getUrlParam('unionid');
    var orgid = $.getUrlParam('orgid');
    var saleid = $.getUrlParam('saleid');
    console.log("openid = " + openid)
    console.log("unionid = " + unionid)
    console.log("orgid = " + orgid)
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

}

function checkAndCommit() {

    var openid = $.getUrlParam('openid');
    var unionid = $.getUrlParam('unionid');
    var orgid = $.getUrlParam('orgid');
    var saleid = $.getUrlParam('saleid');
    console.log("===---------------===")
    console.log("openid = " + openid)
    console.log("unionid = " + unionid)
    console.log("orgid = " + orgid)
    console.log("saleid = " + saleid)

    var tel = $("#mobile").val();
    var code = $("#code").val();
    var name = $("#name").val();
    console.log("mobile = " + tel)
    console.log("code = " + code)
    console.log("name = " + name)
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
    if (isEmpty(name)) {
        alert("请输入姓名");
        return false;
    }
    if (!$("#weuiAgree").is(":checked")) {
        alert("请阅读并同意《爱约课用户服务协议》");
        return false;
    }
    // var $toast = $('#toast');
    var obj = {
        openid: openid,
        unionid: unionid,
        parentsalesmanid: saleid, // 需要找后台确认
        organizationID: orgid,
        name: name,
        code: code,
        tel: tel
    };
    var objJson = JSON.stringify(obj);
    var objJsonEn = aesEncrypt(objJson, aesKey, iv);
    console.log("objJsonEn:" + objJsonEn);
    $.ajax({
        type: "POST",
        data: JSON.stringify({ param: objJsonEn }),
        url: "https://iyueke.net/wechatapi/ActionApi/Salesman/AddSalesman",
        contentType: 'application/json',
        success: function (data) {
            if (data.code == 0) {
                // 弹出注册成功
                // if ($toast.css('display') != 'none') return;
                // $toast.fadeIn(100);
                // setTimeout(function () {
                //     $toast.fadeOut(100);
                // }, 2000);
                console.log("save token:" + data.data.Token);
                sessionStorage.setItem("token", data.data.Token);
                sessionStorage.setItem("org", JSON.stringify(data.data.OrgInfoList));
                sessionStorage.setItem("headimg", data.data.HeadImg);
                sessionStorage.setItem("salesmanname", data.data.salesmanName);
                window.location.href = 'promoter.html?u=' + unionid + "&code=" + data.data.ID
                    + "&gender=" + data.data.Gender + "&saleid=" + saleid + "&unionid=" + unionid;
                // + "&headimg=" + data.data.HeadImg + "&salesmanname=" + data.data.salesmanName 
            } else {
                alert(data.msg);
            }
        }
    });
    return false;
}
