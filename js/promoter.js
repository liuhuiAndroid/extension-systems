window.onload = function () {
    // document.querySelectorAll获取所有的a标签
    var aArr = document.querySelectorAll('a');
    // 循环遍历
    for (var i = 0; i < aArr.length; i++) {
        // 给每个获取到的元素添加点击事件
        aArr[i].onclick = function () {
            // 获取当前激活的tab选项卡
            var active = document.querySelector(".active");
            // 移除之前的选项卡激活属性
            active.classList.remove("active");
            // 给当前点击的选项卡添加激活属性
            this.classList.add("active");
            // 获取当前的section标签id名字
            var name = this.getAttribute("data-cont");
            // 根据获取到的名字获取当前的内容卡
            var section = document.getElementById(name);
            // 获取所有class为cont的元素，并循环遍历，取消所有内容卡的样式
            var cont = document.getElementsByClassName("cont");
            for (var i = 0; i < cont.length; i++) {
                cont[i].style.display = "none";
            }
            // 激活当前内容卡的样式
            section.style.display = "block";
        }
    }

    // 生成二维码
    new QRCode(document.getElementById("qrcode"), {
        text: "http://www.iyueke.net",
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

}
