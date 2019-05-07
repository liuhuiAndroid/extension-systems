window.onload = function () {
    $(function () {
        $("#chooseCity").cityPicker({
            title: "请选择地址",
            onChange: function (picker, values, displayValues) {
                console.log(values, displayValues);
            }
        });
    }
}
