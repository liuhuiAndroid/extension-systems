window.onload = function () {
    $(function () {
        $('.weui-navbar__item').on('click', function () {
            $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');

            $(".weui-tab__panel .weui_tab_bd_item_active").removeClass('weui_tab_bd_item_active');
            var data_toggle = jQuery(this).attr("href");
            $(data_toggle).addClass("weui_tab_bd_item_active");
        });
    });

    // 生成二维码
    new QRCode(document.getElementById("qrcode"), "http://www.iyueke.net");

    $.ajax({
        url: 'data.json',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            //方法中传入的参数data为后台获取的数据
            for (i in data.data) //data.data指的是数组，数组里是8个对象，i为数组的索引
            {
                var tr;
                tr = '<td>' + data.data[i].name + '</td><td>' + data.data[i].phone + '</td><td>' + data.data[i].time + '</td>'
                $("#student-table").append('<tr>' + tr + '</tr>')
            }
        }
    })

}
