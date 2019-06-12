var miniRefresh = null

function initView() {

    $("tbody tr:odd").addClass("odd");
    $("tbody tr:even").addClass("even");

    var code = $.getUrlParam('code');
    var orgid = $.getUrlParam('orgid');

    console.log('initView')
    // 引入任何一个主题后，都会有一个 MiniRefresh 全局变量
    miniRefresh = new MiniRefresh({
        container: '#minirefresh',
        down: {
            isAuto: true,
            callback: function () {
                // 下拉事件
                console.log('callback down')
                currentPage = 0
                getListData(code, orgid, true)
            }
        },
        up: {
            isAuto: false,
            callback: function () {
                // 上拉事件
                console.log('callback up')
                currentPage++
                console.log("currentPage = " + currentPage)
                getListData(code, orgid, false)
            }
        }
    });
}

var currentPage = 0

// 获取推广学生列表信息
function getListData(code, orgid,type) {
    var token = sessionStorage.getItem("token")
    console.log("getListData code = " + code + ", orgid = " + orgid)
    var obj = {
        salesmanID: code,
        orgid: orgid,
        Token: token,
        page: currentPage
    };
    var objJson = JSON.stringify(obj);
    var objJsonEn = aesEncrypt(objJson, aesKey, iv);
    console.log("objJsonEn:" + objJsonEn);

    $.ajax({
        async: false,
        type: "POST",
        data: JSON.stringify({ param: objJsonEn }),
        url: "https://iyueke.net/wechatapi/ActionApi/Salesman/GetPopularizeRecordBySalesmanID",
        contentType: 'application/json',
        success: function (data) {
            console.log("get data success");

            if (data.code == 0) {
                if (type) {
                    $("#student-table tbody").html("");
                }

                for (i in data.data) {
                    var tr;
                    tr = '<td>' + data.data[i].Name + '</td><td>' + data.data[i].Tel + '</td><td>' + data.data[i].CreateDate + '</td>'
                    $("#student-table").append('<tr>' + tr + '</tr>')
                }
            } else {
                alert(data.msg);
            }

            if(type){
                miniRefresh.endDownLoading();
            }

            if (data.data.length != 10) {
                console.log("miniRefresh.endUpLoading(true)")
                miniRefresh.endUpLoading(true);
            }else{
                console.log("miniRefresh.endUpLoading(false)")
                miniRefresh.endUpLoading(false);
            }
            
            console.log("get data end");
        }
    });
}