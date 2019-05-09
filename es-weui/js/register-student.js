window.onload = function () {
    $(function () {
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

        function getCode(){
            $.ajax({
                url: "https://iyueke.net/wechatapi/ActionApi/Salesman/CheckTel?tel=123",
                type: "get",
                dataType: "json",
                success: function (data) {
                    if (data.code == 0) {
                        alert("获取验证码成功");
                    }else{
                        alert(data.message);
                    }
                }
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

        $("#chooseCity").cityPicker({
            title: "请选择地址",
            onChange: function (picker, values, displayValues) {
                console.log(values, displayValues);
            }
        });
    }
}
