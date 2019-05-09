window.onload = function () {
    $(function () {
        $('.weui-navbar__item').on('click', function () {
            $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');

            $(".weui-tab__panel .weui_tab_bd_item_active").removeClass('weui_tab_bd_item_active');
            var data_toggle = jQuery(this).attr("href");
            $(data_toggle).addClass("weui_tab_bd_item_active");
        });
    });

    $.ajax({
        url: 'promoter_code.json',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            // 生成二维码
            new QRCode(document.getElementById("qrcode"), data.url);
        }
    })

    $.ajax({
        url: 'promoter_list_data.json',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            for (i in data.data) {
                var tr;
                tr = '<td>' + data.data[i].name + '</td><td>' + data.data[i].phone + '</td><td>' + data.data[i].time + '</td>'
                $("#student-table").append('<tr>' + tr + '</tr>')
            }
        }
    })

}
