window.onload = function () {
    $(function () {
        $('#generate_code').on('click', function () {
            if ($("#mobile").val() == "" || isNaN($("#mobile").val()) || $("#mobile").val().length != 11) {
                alert("请填写正确的手机号！");
                return false;
            }
            settime();
        });

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
                _generate_code.text("重新发送(" + countdown + "秒)");
                countdown--;
            }
            setTimeout(function () {
                settime();
            }, 1000);
        }
    });

}
