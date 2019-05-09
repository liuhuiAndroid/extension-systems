window.onload = function () {
    $(function () {

    });

}

function checkForm() {
    var tel = $("#mobile").val();
    var verificationCode = $("#verificationCode").val();
    var name = $("#name").val();
    if (!(/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(tel))) {
        alert("请填写有效的手机号");
        return false;
    }
    var $toast = $('#toast');
    $.ajax({
        url: "register-promoter-success.json",
        type: "get",
        dataType: "json",
        success: function (data) {
            if (data.status == 0) {
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
