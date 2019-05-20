let mouse = true;
let to = "",tt = "";
let starttime = null,endtime = null;
window.onload = function(){
    $("#loading").show();
    let key = sessionStorage.getItem("key");
    let userId = localStorage.yuhanguserId;
    let department = 2;
    if(key === "Engineering"){
        let data = {filePath:"项目查看",department:department};
        $.ajax({
            url:'http://www.youguangchina.cn/YuHang/project/getListFiles',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                // console.log(data);
                if(data.files.length === 0){
                    $(".content_index").append("<p class=\"p\">暂无数据！</p>");
                }
                else {
                    for(let i = 0;i<data.files.length;i++){
                        $(".content_index").append("<div class=\"project_box\" onclick='projectin($(this).children(\".project_font\").text(),\"项目查看/\" +   $(this).children(\".project_font\").text())'" +
                            "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='C_mous(event,$(\".project_box\").index(this))'>\n" +
                            "            <div class=\"project_img\"></div>\n" +
                            "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                            "            <div class=\"C_project_right\" >\n" +
                            "                <a href=\"#\" class=\"C_project_right_one\" onclick=\'C_down($(\".C_project_right_one\").index(this))\'>下载</a>\n" +
                            "            </div>\n" +
                            "        </div>")
                    }
                    $(".content_index").attr("data-id",data.currentPath);
                }

                $("#loading").hide();
            },
            error:function () {
              console.log("error");
            }
        });
    }
    else if(key === "List"){
        let data = {filePath:"项目清单",department:department};
        $.ajax({
            url:'http://www.youguangchina.cn/YuHang/project/getListFiles',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                // console.log(data);
                if(data.files.length === 0){
                    $(".List_content_index").append("<p class=\"p\">暂无数据！</p>");
                }
                else {
                    for(let i = 0;i<data.files.length;i++){
                        $(".List_content_index").append("<div class=\"project_box\" onclick='listin($(this).children(\".project_font\").text())'" +
                            "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='C_mous(event,$(\".project_box\").index(this))'>\n" +
                            "            <div class=\"project_img\"></div>\n" +
                            "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                            "            <div class=\"C_project_right\" >\n" +
                            "                <a href=\"#\" class=\"C_project_right_one\" onclick=\'C_down($(\".C_project_right_one\").index(this))\'>下载</a>\n" +
                            "            </div>\n" +
                            "        </div>")
                        $(".List_content_index").attr("data-id",data.currentPath);
                    }
                }

                $("#loading").hide();
            },
            error:function () {
                console.log("error");
            }
        });
    }
    else if(key === "Log"){
        let data = {filePath:"项目日志",department:department};
        let html;
        let E = window.wangEditor;
        let editor = new E("#editor");
        editor.customConfig.menus = ['head', 'bold', 'fontSize', 'fontName', 'italic', 'underline', 'strikeThrough',
            'foreColor', 'backColor', 'justify',  'table', 'undo',  'redo'];
        editor.customConfig.uploadImgShowBase64 = true;
        editor.create();
        $(".log_two_sub").click(function () {
            html=editor.txt.html();//获取商品详情
            Upload(html);
        });
        $.ajax({
            url:'http://www.youguangchina.cn/YuHang/project/getListFiles',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                // console.log(data);
                if(data.files.length === 0){
                    $(".log_indexbox").append("<p class=\"p\">暂无数据！</p>");
                }
                else {
                    for(let i = 0;i<data.files.length;i++){
                        $(".log_indexbox").append("<div data-t='" + data[i] + "' class=\"project_box\" onclick='login($(this).children(\".project_font\").text())'" +
                            "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='C_mous(event,$(\".project_box\").index(this))'>\n" +
                            "            <div class=\"project_img\"></div>\n" +
                            "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                            "            <div class=\"C_project_right\" >\n" +
                            "                <a href=\"#\" class=\"C_project_right_one\" onclick=\'C_down($(\".C_project_right_one\").index(this))\'>下载</a>\n" +
                            "            </div>\n" +
                            "        </div>")
                    }
                    $(".log_indexbox").attr("data-id",data.currentPath);
                }
                $("#loading").hide();
            },
            error:function () {
                console.log("error");
            }
        });
    }

    $('#demo').daterangepicker({
        "opens": "left",
        locale: {
            format: "YYYY-MM-DD",
            separator: " 至 ",
            daysOfWeek: ["日","一","二","三","四","五","六"],
            monthNames: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
            cancelLabel:"取消",
            applyLabel:"确定",
        }
    }, function(start, end) {
        starttime = start.format('YYYY-MM-DD');
        endtime = end.format('YYYY-MM-DD');
        $("#config-demo").val(start.format('YYYY/MM/DD') + "-" + end.format('YYYY/MM/DD'))
    });
};

//上传按钮动效
$(".header_down").mouseenter(function () {
    $(this).removeClass("disappear").addClass("appear");
});
$(".header_down").mouseleave(function () {
    $(this).removeClass("appear").addClass("disappear");
});

let j = 0,cc = 0,ff = 0;
let a = {},c = {},f = {};
a[0] = "项目查看";
c[0] = "项目清单";
f[0] = "项目日志";

//项目查看界面点击文件夹进入项目工程页数据读取ok
function projectin(e,i) {
    $(".content_index").attr("data-id","1");
    to = e;
    tt = i;
    $(".retu").show();
    $(".content_index").hide();
    $("#loading").show();
    $(".content_box").show();
    $(".project_box").remove();
    $(".content_box").children().remove();
    $(".tc_title").text(e);
    j++;
    a[j] = e;
    let filePath = i;
    let department = "2";
    let data = {filePath:filePath,department:department};
    let img = "";
    let cla = "list_imga";
    let hanshu = "";
    let offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
    $.ajax({
        url:'http://www.youguangchina.cn/YuHang/project/getListFiles',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            console.log(data);
            if(data.files.length === 0){
                $(".content_box").append("<p class=\"p\">暂无数据- _ - |||</p>");
            }
            else {
                for(let i = 0;i<data.files.length;i++){
                    if(data.files[i].fileType === "doc"||data.files[i].fileType === "docx"){
                        img = "../../images/index/document.png";
                        cla = "list_imga";
                        offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "pdf"){
                        img = "../../images/index/img.png";
                        cla = "list_img";
                        offfic = "";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "txt"){
                        img = "../../images/index/document.png";
                        cla = "list_imga";
                        offfic = "";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "xls"||data.files[i].fileType === "xlsx"){
                        img = "../../images/index/form.png";
                        cla = "list_imga";
                        offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "jpg"||data.files[i].fileType === "png"){
                        img = "../../images/index/jpg.png";
                        cla = "list_imga";
                        offfic = "";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "dwg"||data.files[i].fileType === "dwt"||data.files[i].fileType === "dwf"){
                        img = "../../images/engineering/cad.png";
                        cla = "list_img";
                        offfic = "";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "directory"){
                        let k = data.files[i].filePath;
                        // console.log(k);
                        img = "../../images/index/new directory.png";
                        cla = "project_imgg";
                        offfic = "#";
                        hanshu = "projectin(\"" + data.files[i].fileName + "\" , \"" + k + "\")";
                    }
                    else {
                        img = "../../images/engineering/unknow.png";
                        cla = "list_imga";
                        offfic = "";
                        hanshu = null;
                    }
                    $(".content_box").append("<div data-id='" + data.files[i].fileType + "' data-page='" + data.files[i].filePath + "' class=\"project_box\" " +
                        "onclick='" + hanshu +"'  onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='mous(event,$(\".project_box\").index(this))'>\n" +
                        "            <a class=\"" + cla + " aa\" href=\"" + offfic +  data.files[i].url + "\"" +
                        " style='background-image: url(\"" + img + "\")'></a>\n" +
                        "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                        "            <div class=\"project_right\">\n" +
                        "                <span class=\"project_right_one\" onclick='down($(\".project_right_one\").index(this))'>下载</span>\n" +
                        "            </div>\n" +
                        "        </div>");
                }
            }
            $(".content_box").attr("data-id",data.currentPath);
            $("#loading").hide();
        },
        error:function () {
            console.log("error");
        }
    });
}
//项目查看界面时间排序
$(".e_order").click(function () {
    $("#loading").show();
    let department = 2;
    let tc = "";
    tc = $(".content_index").attr('data-id');
    if(tc === "项目查看"){
        $(".content_index").show();
        $(".content_box").hide();
        let data = {filePath:"项目查看",department:department};
        $(".project_box").remove();
        $.ajax({
            url:'http://www.youguangchina.cn/YuHang/project/getListFilesByTime',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                for(let i = 0;i<data.files.length;i++){
                    $(".content_index").append("<div class=\"project_box\" onclick='projectin($(this).children(\".project_font\").text(),\"项目查看/\" +   $(this).children(\".project_font\").text())'" +
                        "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='C_mous(event,$(\".project_box\").index(this))'>\n" +
                        "            <div class=\"project_img\"></div>\n" +
                        "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                        "            <div class=\"C_project_right\" >\n" +
                        "                <a href=\"#\" class=\"C_project_right_one\" onclick=\'C_down($(\".C_project_right_one\").index(this))\'>下载</a>\n" +
                        "            </div>\n" +
                        "        </div>")
                }
                $("#loading").hide();
            },
            error:function () {
                console.log("error");
            }
        });
    }
    else {
        $(".retu").css("visibility","visible");
        $(".content_index").hide();
        $("#loading").show();
        $(".content_box").show();
        $(".project_box").remove();
        $(".tc_title").text(to);
        let filePath = tt;
        let data = {filePath:filePath,department:department};
        let img = "";
        let cla = "list_imga";
        let hanshu = "";
        let offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
        // console.log($(".tc_title").text);
        $.ajax({
            url:'http://www.youguangchina.cn/YuHang/project/getListFilesByTime',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                // console.log(data,data.files.length);
                for(let i = 0;i<data.files.length;i++){
                    console.log(data.files[i].fileType);
                    if(data.files[i].fileType === "doc"||data.files[i].fileType === "docx"){
                        img = "../../images/index/document.png";
                        cla = "list_imga";
                        offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "dwg"||data.files[i].fileType === "dwt"||data.files[i].fileType === "dwf"){
                        img = "../../images/engineering/cad.png";
                        cla = "list_img";
                        offfic = "";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "pdf"){
                        img = "../../images/index/img.png";
                        cla = "list_img";
                        offfic = "";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "txt"){
                        img = "../../images/index/document.png";
                        cla = "list_imga";
                        offfic = "";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "xls"||data.files[i].fileType === "xlsx"){
                        img = "../../images/index/form.png";
                        cla = "list_imga";
                        offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "jpg"||data.files[i].fileType === "png"){
                        img = "../../images/index/jpg.png";
                        cla = "list_imga";
                        offfic = "";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "directory"){
                        let k = data.files[i].filePath;
                        // console.log(k);
                        img = "../../images/index/new directory.png";
                        cla = "project_imgg";
                        offfic = "#";
                        hanshu = "projectin(\"" + data.files[i].fileName + "\" , \"" + k + "\")";
                    }
                    else {
                        img = "../../images/engineering/unknow.png";
                        cla = "list_imga";
                        offfic = "";
                        hanshu = null;
                    }
                    $(".content_box").append("<div data-id='" + data.files[i].fileType + "' data-page='" + data.files[i].filePath + "' class=\"project_box\" " +
                        "onclick='" + hanshu +"'  onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='mous(event,$(\".project_box\").index(this))'>\n" +
                        "            <a class=\"" + cla + " aa\" href=\"" + offfic +  data.files[i].url + "\"" +
                        " style='background-image: url(\"" + img + "\")'></a>\n" +
                        "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                        "            <div class=\"project_right\">\n" +
                        "                <span class=\"project_right_one\" onclick='down($(\".project_right_one\").index(this))'>下载</span>\n" +
                        "            </div>\n" +
                        "        </div>");
                }
                $(".content_box").attr("data-id",data.currentPath);
                $("#loading").hide();
            },
            error:function () {
                console.log("error");
            }
        });
    }
});
//项目清单时间排序
$(".list_order").click(function () {
    $("#loading").show();
    let tc = $(".List_content_index").attr('data-id');
    let department = 2;
    if(tc === "项目清单"){
        $(".List_content_index").show();
        $(".List_content_box").hide();
        let data = {filePath:"项目清单",department:department};
        $(".project_box").remove();
        $.ajax({
            url:'http://www.youguangchina.cn/YuHang/project/getListFilesByTime',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                // console.log(data);
                for(let i = 0;i<data.files.length;i++){
                    $(".List_content_index").append("<div class=\"project_box\" onclick='listin($(this).children(\".project_font\").text())'" +
                        "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='C_mous(event,$(\".project_box\").index(this))'>\n" +
                        "            <div class=\"project_img\"></div>\n" +
                        "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                        "            <div class=\"C_project_right\" >\n" +
                        "                <a href=\"#\" class=\"C_project_right_one\" onclick=\'C_down($(\".C_project_right_one\").index(this))\'>下载</a>\n" +
                        "            </div>\n" +
                        "        </div>")
                    $(".List_content_index").attr("data-id",data.currentPath);
                }
                $("#loading").hide();
            },
            error:function () {
                console.log("error");
            }
        });
    }
    else {
        $(".retu").css("visibility","visible");
        $(".project_box").remove();
        $(".List_content_box").show();
        $("#loading").show();
        $(".List_content_index").hide();
        $(".header_down").show();
        $(".tc_title").text(to);
        let filePath = "项目清单/" +to;
        let data = {filePath:filePath,department:department};
        // console.log(data);
        let img = "";
        let cla = "list_imga";
        let offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
        $.ajax({
            url:'http://www.youguangchina.cn/YuHang/project/getListFilesByTime',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                // console.log(data);
                for(let i = 0;i<data.files.length;i++){
                    if(data.files[i].fileType === "doc"||data.files[i].fileType === "docx"){
                        img = "../../images/index/document.png";
                        cla = "list_imga";
                        offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
                    }
                    else if(data.files[i].fileType === "pdf"){
                        img = "../../images/index/img.png";
                        cla = "list_img";
                        offfic = "";
                    }
                    else if(data.files[i].fileType === "dwg"||data.files[i].fileType === "dwt"||data.files[i].fileType === "dwf"){
                        img = "../../images/engineering/cad.png";
                        cla = "list_img";
                        offfic = "";
                    }
                    else if(data.files[i].fileType === "txt"){
                        img = "../../images/index/document.png";
                        cla = "list_imga";
                        offfic = "";
                    }
                    else if(data.files[i].fileType === "xls"||data.files[i].fileType === "xlsx"){
                        img = "../../images/index/form.png";
                        cla = "list_imga";
                        offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
                    }
                    // else if(data.files[i].fileType === "directory"){
                    //     img = "../../images/index/engineer.png";
                    //     cla = "project_imgg";
                    //     offfic = "#";
                    // }
                    else if(data.files[i].fileType === "jpg"||data.files[i].fileType === "png"){
                        img = "../../images/index/jpg.png";
                        cla = "list_imga";
                        offfic = "";
                    }
                    else {
                        img = "../../images/engineering/unknow.png";
                        cla = "list_imga";
                        offfic = "";
                    }
                    $(".List_content_box").append("<div data-type='" + data.files[i].fileType+ "' data-page='" + data.files[i].filePath + "' class=\"project_box\"" +
                        "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='mous(event,$(\".project_box\").index(this))'>\n" +
                        "            <a class=\"" + cla + " aa\" href=\"" + offfic +  data.files[i].url + "\"" +
                        " style='background-image: url(\"" + img + "\")'></a>\n" +
                        "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                        "            <div class=\"project_right\">\n" +
                        "                <span class=\"project_right_one\" onclick='down($(\".project_right_one\").index(this))'>下载</span>\n" +
                        "                <span class=\"project_right_two\" onclick='Rename($(\".project_right_two\").index(this))'>重命名</span>\n" +
                        "                <span class=\"project_right_three\" onclick='Delete($(\".project_right_three\").index(this))'>删除</span>\n" +
                        "            </div>\n" +
                        "        </div>");
                }
                $(".List_content_box").attr("data-id",data.currentPath);
                $(".List_content_box").attr("data-name",to);
                $("#loading").hide();
            },
            error:function () {
                console.log("error");
            }
        });
    }
});
//项目日志排序
$(".log_order").click(function () {
    $("#loading").show();
    let tc = $(".log_indexbox").attr('data-id');
    let department = 2;
    if(tc === "项目日志"){
        $(".log_indexbox").show();
        $(".log_index_content").hide();
        let data = {filePath:"项目日志",department:department};
        $(".project_box").remove();
        $.ajax({
            url:'http://www.youguangchina.cn/YuHang/project/getListFilesByTime',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                // console.log(data);
                for(let i = 0;i<data.files.length;i++){
                    $(".log_indexbox").append("<div data-t='" + data[i] + "' class=\"project_box\" onclick='login($(this).children(\".project_font\").text())'" +
                        "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='C_mous(event,$(\".project_box\").index(this))'>\n" +
                        "            <div class=\"project_img\"></div>\n" +
                        "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                        "            <div class=\"C_project_right\" >\n" +
                        "                <a href=\"#\" class=\"C_project_right_one\" onclick=\'C_down($(\".C_project_right_one\").index(this))\'>下载</a>\n" +
                        "            </div>\n" +
                        "        </div>")
                }
                $(".log_indexbox").attr("data-id",data.currentPath);
                $("#loading").hide();
            },
            error:function () {
                console.log("error");
            }
        });
    }
    else {
        $(".retu").css("visibility","visible");
        let name = to;
        $(".content_indexbox").show();
        $(".log_index").hide();
        $(".project_box").remove();
        $(".log_indexbox").hide();
        $("#loading").show();
        $(".log_newbox").show();
        $(".log_index_content").show();
        $(".tc_title").text(to);
        let filePath = "项目日志/" + name;
        let data = {filePath:filePath,department:department};
        console.log(data);
        let projectName = to;
        $.ajax({
            url:'http://www.youguangchina.cn/YuHang/project/getListFilesByTime',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                for(let i = 0;i<data.files.length;i++){
                    $(".content_indexbox").append("<div class=\"project_box\"" +
                        "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='mous(event,$(\".project_box\").index(this))'>\n" +
                        "                <div class=\"log_imga aa\" onclick='see($(\".log_imga\").index(this))'></div>\n" +
                        "                <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                        "            <div class=\"project_right\">\n" +
                        "                <span class=\"project_right_two\" onclick='Rename($(\".project_right_two\").index(this))'>重命名</span>\n" +
                        "                <span class=\"project_right_three\" onclick='logDelete($(\".project_right_three\").index(this))'>删除</span>\n" +
                        "            </div>\n" +
                        "            </div>");
                }
                $(".content_indexbox").attr("data-id",data.currentPath);
                $(".content_indexbox").attr("data-tt",projectName);
                $("#loading").hide();
            },
            error:function () {
                console.log("error");
            }
        });
    }
});



//项目查看、项目清单、项目日志页面项目文件的下载ok
function down(e) {
    let type = $(".project_box").eq(e).data('id');
    if(type === "directory"){
        let path = $(".content_box").data('id');
        downZipEvent('http://www.youguangchina.cn/YuHang/file/zipdownload',path);
    }
    else {
        let filePath = $(".project_box").eq(e).data('page');
        // console.log(filePath);
        let url = "http://www.youguangchina.cn/YuHang/file/download";
        let form = $("<form></form>").attr("action",url).attr("method","post");
        form.append($("<input></input>").attr("type","hidden").attr("name","filePath").attr("value",filePath));
        form.appendTo('body').submit().remove();
        $(".project_right").eq(e).hide();
    }
}
function downZipEvent(url,filepath) {
    let form = $("<form>");
    form.attr("style", "display:none");
    form.attr("target", "");
    form.attr("method", "post");
    form.attr("action", url);
    let input1 = $("<input>");
    input1.attr("type", "hidden");
    input1.attr("name", "filePath");
    input1.attr("value", filepath);
    $("body").append(form);
    form.append(input1);
    form.submit();
    form.remove();
}
function C_down(e) {
    // console.log(e);
    let key = sessionStorage.getItem("key");
    let path = "";
    if(key === "Engineering"){
        let name = $(".project_font").eq(e).text();
        path = "项目查看/" + name + "/工程部";
    }
    else if(key === "List"){
        let name = $(".project_font").eq(e).text();
        path = "项目清单/" + name;
    }
    else if(key === "Log"){
        let name = $(".project_font").eq(e).text();
        path = "项目日志/" + name;
    }
    downZipEvent('http://www.youguangchina.cn/YuHang/file/zipdownload',path);
    event.stopPropagation();
}

//点击新建工程日志进入编辑界面ok
$(".log_new_box").click(function () {
    $(".log_index").show();
    $(".log_index_content").hide();
    $(".retu").css("visibility","hidden");
    $(this).hide();
});
//点击编辑界面取消按钮功能ok
$(".log_two_cancel").click(function () {
    $(".log_index_content").show();
    $(".log_index").hide();
    $(".content_index").show();
    $(".log_new_box").show();
    $(".retu").css("visibility","visible");
});

//项目清单上传功能1
$('.header_file').on('change',function () {
    let n =  $(".List_content_box").data('name');
    // console.log(n);
    $('#loading').show();
    let form = new FormData();
    let fileName=$(this).get(0).files[0];
    let name = $(".List_content_box").data('id');
    let userId = localStorage.yuhanguserId;
    let department = 2;
    // console.log(fileName,name);
    form.append("userId",userId);
    form.append("department",department);
    form.append("file", fileName);
    form.append("filePath", name);
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://www.youguangchina.cn/YuHang/file/upload",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    };
    $.ajax(settings).done(function (res) {
        listin(n);
        $('#loading').hide();
    });
});

//文件右键菜菜单功能ok
function mouseov() {
    mouse = false;
}
function mouseou() {
    mouse = true;
}
document.addEventListener("contextmenu", function(event){
    event.preventDefault();
});
function mous(i,e) {
    if(i.which === 3){
        $(".project_right").hide();
        // 获取鼠标的x轴
        let x = i.clientX;
        //获取鼠标的Y轴
        let y = i.clientY;
        // console.log(x,y);
        //对我们设定的菜单元素位置移动到当前鼠标右键点击的位置，并且显示出来
        $(".project_box").eq(e).children(".project_right").css({ 'top': y + 'px', 'left': x + 'px', 'display':
            'block', 'position': 'fixed' }).show();
    }
}
function C_mous(i,e) {
    console.log(i,e);
    if(i.which === 3){
        $(".C_project_right").hide();
        // 获取鼠标的x轴
        let x = i.clientX;
        //获取鼠标的Y轴
        let y = i.clientY;
        // console.log(x,y);
        //对我们设定的菜单元素位置移动到当前鼠标右键点击的位置，并且显示出来
        let key = sessionStorage.getItem("key");
        if(key === "Engineering"){
            $(".project_box").eq(e).children(".C_project_right").css({ 'top': y + 'px', 'left': x + 'px', 'display':
                'block', 'position': 'fixed' }).show();
        }
        else if(key === "List"){
            $(".project_box").eq(e).children(".C_project_right").css({ 'top': y + 'px', 'left': x + 'px', 'display':
                'block', 'position': 'fixed' }).show();
        }
        else if(key === "Log"){
            $(".project_box").eq(e).children(".C_project_right").css({ 'top': y + 'px', 'left': x + 'px', 'display':
                'block', 'position': 'fixed' }).show();
        }
    }
}
$(".index-content").mousedown(function (e) {
    if(mouse === true){
        $(".project_right").hide();
        $(".C_project_right").hide();
    }
});

//项目清单的文件夹点击读取数据功能ok
function listin(e) {
    $(".List_content_index").attr("data-id","1");
    to = e;
    $(".retu").show();
    $(".project_box").remove();
    $(".List_content_box").show();
    $("#loading").show();
    $(".List_content_index").hide();
    $(".List_content_box").children().remove();
    $("#header_down").show();
    $(".tc_title").text(e);
    let filePath = "项目清单/" + e;
    cc++;
    c[cc] = e;
    let department = "2";
    let data = {filePath:filePath,department:department};
    let img = "";
    let cla = "list_imga";
    let offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
    $.ajax({
        url:'http://www.youguangchina.cn/YuHang/project/getListFiles',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            console.log(data);
            $("#loading").hide();
            if(data.files.length === 0){
                $(".List_content_box").append("<p class=\"p\">暂无数据- _ - |||</p>");
            }
            else {
                for(let i = 0;i<data.files.length;i++){
                    if(data.files[i].fileType === "doc"||data.files[i].fileType === "docx"){
                        img = "../../images/index/document.png";
                        cla = "list_imga";
                        offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
                    }
                    else if(data.files[i].fileType === "pdf"){
                        img = "../../images/index/img.png";
                        cla = "list_img";
                        offfic = "";
                    }
                    else if(data.files[i].fileType === "txt"){
                        img = "../../images/index/document.png";
                        cla = "list_imga";
                        offfic = "";
                    }
                    else if(data.files[i].fileType === "xls"||data.files[i].fileType === "xlsx"){
                        img = "../../images/index/form.png";
                        cla = "list_imga";
                        offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
                    }
                    else if(data.files[i].fileType === "directory"){
                        img = "../../images/index/engineer.png";
                        cla = "project_imgg";
                        offfic = "#";
                    }
                    else if(data.files[i].fileType === "jpg"||data.files[i].fileType === "png"){
                        img = "../../images/index/jpg.png";
                        cla = "list_imga";
                        offfic = "";
                    }
                    else if(data.files[i].fileType === "dwg"||data.files[i].fileType === "dwt"||data.files[i].fileType === "dwf"){
                        img = "../../images/engineering/cad.png";
                        cla = "list_img";
                        offfic = "";
                    }
                    else {
                        img = "../../images/engineering/unknow.png";
                        cla = "list_imga";
                        offfic = "";
                    }
                    $(".List_content_box").append("<div data-type='" + data.files[i].fileType+ "' data-page='" + data.files[i].filePath + "' class=\"project_box\"" +
                        "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='mous(event,$(\".project_box\").index(this))'>\n" +
                        "            <a class=\"" + cla + " aa\" href=\"" + offfic +  data.files[i].url + "\"" +
                        " style='background-image: url(\"" + img + "\")'></a>\n" +
                        "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                        "            <div class=\"project_right\">\n" +
                        "                <span class=\"project_right_one\" onclick='down($(\".project_right_one\").index(this))'>下载</span>\n" +
                        "                <span class=\"project_right_two\" onclick='Rename($(\".project_right_two\").index(this))'>重命名</span>\n" +
                        "                <span class=\"project_right_three\" onclick='Delete($(\".project_right_three\").index(this))'>删除</span>\n" +
                        "            </div>\n" +
                        "        </div>");
                }
            }
            $(".List_content_box").attr("data-id",data.currentPath);
            $(".List_content_box").attr("data-name",e);
        },
        error:function () {
            console.log("error");
        }
    });
}

// 删除功能1
function Delete(i) {
    let oriname = $(".project_box").eq(i).children(".project_font").text();
    let type = $(".project_box").eq(i).data('type');
    let key = sessionStorage.getItem("key");
    let path;
    let userId = localStorage.yuhanguserId;
    let department = 2;
    if(key === "List"){
        path = $(".List_content_box").data('id') + "/" + oriname;
    }
    else if(key === "Log"){
        path = $(".content_indexbox").data('id') + "/" + oriname;
    }
    let data = {filePath:path,fileType:type,userId:userId,department:department};
    $.ajax({
        url:'http://www.youguangchina.cn/YuHang/recycle/addRubbish',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            let n =  $(".List_content_box").data('name');
            listin(n);
        },
        error:function (data) {
            console.log(data);
        }
    });
}
function logDelete(i) {
    let n = $(".content_indexbox").data('tt');
    let oriname = $(".project_box").eq(i).children(".project_font").text();
    let userId = localStorage.yuhanguserId;
    let department = 2;
    let data = {project_name:n,title:oriname,userId:userId,department:department};
    $.ajax({
        url:'http://www.youguangchina.cn/YuHang/log/deleteLog',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            let n = $(".content_indexbox").data('tt');
            login(n);
        },
        error:function (data) {
            console.log(data);
        }
    });
}
//重命名功能ok
let m = null;
function Rename(i) {
    m = i;
    $(".List_Renamebox").show();
    $(".project_right").hide();
    // $(".List_renamefont").text($(".project_box").eq(i).children(".project_font").text());
    let oriname = $(".project_box").eq(m).children(".project_font").text();
    $("input[name='folder']").val(oriname);
}
//确定重命名功能1
$(".List_rename_sub").click(function () {
    let oriname = $(".project_box").eq(m).children(".project_font").text();
    let rename = $("input[name='folder']").val();
    let reg = RegExp(/\/|\\|\:|\?|\*|\"|<|>|\|/);
    if(rename.match(reg)){
        alert("含有/\\:?*\"<>|特殊符号，请重新输入");
        $("input[name='folder']").val('');
    }
    else {
        let key = sessionStorage.getItem("key");
        let path;
        let userId = localStorage.yuhanguserId;
        let department = 2;
        if(key === "List"){
            path = $(".List_content_box").data('id');
        }
        else if(key === "Log"){
            path = $(".content_indexbox").data('id');
        }
        let data = {oriname:oriname,rename:rename,filePath:path,userId:userId,department:department};
        console.log(data);
        $.ajax({
            url:'http://www.youguangchina.cn/YuHang/file/renameFile',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                console.log(data);
                if(key === "List"){
                    let n =  $(".List_content_box").data('name');
                    listin(n);
                }
                else if(key === "Log"){
                    let n = $(".content_indexbox").data('tt');
                    login(n);
                }
                $(".List_Renamebox").hide();
                m = 0;
            },
            error:function (data) {
                console.log(data + "error");
            }
        });
    }
});

$(".List_renamefont").on('keydown',function(event){
//获取keyCode
    let keyCode = event.keyCode;
    if(keyCode===13){
        event.preventDefault();
    }
});


//重命名取消功能ok
$(".List_rename_cancel").click(function () {
   $(".List_Renamebox").hide();
   m = null;
});

//项目日志的文件夹读取数据功能ok
function login(e) {
    $(".log_indexbox").attr("data-id","1");
    to = e;
    ff++;
    f[ff] = e;
    $(".retu").show();
    let name = e;
    $(".content_indexbox").show();
    $(".log_index").hide();
    $(".project_box").remove();
    $(".log_indexbox").hide();
    $("#loading").show();
    $(".log_newbox").show();
    $(".log_index_content").show();
    $(".tc_title").text(e);
    $(".content_indexbox").children().remove();
    let filePath = "项目日志/" + name;
    let department = "2";
    let data = {filePath:filePath,department:department};
    let projectName = e;
    $.ajax({
        url:'http://www.youguangchina.cn/YuHang/project/getListFiles',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            console.log(data);
            if(data.files.length === 0){
                $(".content_indexbox").append("<p class=\"p\">暂无数据- _ - |||</p>");
            }
            else {
                for(let i = 0;i<data.files.length;i++){
                    $(".content_indexbox").append("<div class=\"project_box\"" +
                        "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='mous(event,$(\".project_box\").index(this))'>\n" +
                        "                <div class=\"log_imga aa\" onclick='see($(\".log_imga\").index(this))'></div>\n" +
                        "                <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                        "            <div class=\"project_right\">\n" +
                        "                <span class=\"project_right_two\" onclick='Rename($(\".project_right_two\").index(this))'>重命名</span>\n" +
                        "                <span class=\"project_right_three\" onclick='logDelete($(\".project_right_three\").index(this))'>删除</span>\n" +
                        "            </div>\n" +
                        "            </div>");
                }
            }
            $(".content_indexbox").attr("data-tt",projectName);
            $(".content_indexbox").attr("data-id",data.currentPath);
            $("#loading").hide();
        },
        error:function () {
            console.log("error");
        }
    });
}

// 项目日志的查看功能ok
function see(e) {
    let path = $(".content_indexbox").data('tt');
    let logName = $(".log_imga").eq(e).siblings(".project_font").text();
    let data = {path:path,logName:logName};
    $.ajax({
        url:'http://www.youguangchina.cn/YuHang/log/readLog',
        type:'post',
        data:data,
        success:function (data) {
            $(".log_show_title").text(logName);
            $(".log_show").show();
            $(".log_show_center").children().remove();
            $(".log_show_center").append(data.content);
            $(".log_index_content").hide();
        },
        error:function (data) {
            console.log(data);
        }
    });
}

//项目日志的上传功能1
function Upload(text) {
    $(".retu").css("visibility","visible");
    let name = $(".log_one_input").val();
    let projectName = $(".content_indexbox").data("tt");
    let userId = localStorage.yuhanguserId;
    let department = 2;
    let data = {title:name,content:text,projectName:projectName,userId:userId,department:department};
    // console.log(data);
    $.ajax({
        url:'http://www.youguangchina.cn/YuHang/log/upLog',
        type:'post',
        data:{title:name,content:text,projectName:projectName,userId:userId,department:department},
        success:function (data) {
            // console.log(data);
            login(projectName);
            $(".log_new_box").show();
        },
        error:function () {
            console.log("error");
        }
    });
}

//滚动条
$('.ListBox').slimScroll({
    width:'100%',
    height: '93%',
    wheelStep: 5
});

//返回上一级菜单
function retu() {
    $("#loading").show();
    let filePath = $(".content_box").attr('data-id');
    let department = 2;
    let data = {filePath:filePath,department:department};
    $(".project_box").remove();
    j--;
    $(".tc_title").text(a[j]);
    if(a[j] === "项目查看"){
        $(".retu").hide();
        $(".content_index").attr("data-id","项目查看");
        $(".content_index").show();
        $(".content_box").hide();
        let data = {filePath:"项目查看",department:department};
        $.ajax({
            url:'http://www.youguangchina.cn/YuHang/project/getListFiles',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                for(let i = 0;i<data.files.length;i++){
                    $(".content_index").append("<div class=\"project_box\" onclick='projectin($(this).children(\".project_font\").text(),\"项目查看/\" +   $(this).children(\".project_font\").text())'" +
                        "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='C_mous(event,$(\".project_box\").index(this))'>\n" +
                        "            <div class=\"project_img\"></div>\n" +
                        "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                        "            <div class=\"C_project_right\" >\n" +
                        "                <a href=\"#\" class=\"C_project_right_one\" onclick=\'C_down($(\".C_project_right_one\").index(this))\'>下载</a>\n" +
                        "            </div>\n" +
                        "        </div>")
                }
                $(".content_index").attr("data-id",data.currentPath);
                $("#loading").hide();
            },
            error:function () {
                console.log("error");
            }
        });
    }
    else {
        $.ajax({
            url:'http://www.youguangchina.cn/YuHang/project/getSuperiorFiles',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                $(".project_box").remove();
                for(let i = 0;i<data.files.length;i++){
                    if(data.files[i].fileType === "doc"||data.files[i].fileType === "docx"){
                        img = "../../images/index/document.png";
                        cla = "list_imga";
                        offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "pdf"){
                        img = "../../images/index/img.png";
                        cla = "list_img";
                        offfic = "";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "txt"){
                        img = "../../images/index/document.png";
                        cla = "list_imga";
                        offfic = "";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "xls"||data.files[i].fileType === "xlsx"){
                        img = "../../images/index/form.png";
                        cla = "list_imga";
                        offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "jpg"||data.files[i].fileType === "png"){
                        img = "../../images/index/jpg.png";
                        cla = "list_imga";
                        offfic = "";
                        hanshu = null;
                    }
                    else if(data.files[i].fileType === "directory"){
                        let k = data.files[i].filePath;
                        console.log(k);
                        img = "../../images/index/new directory.png";
                        cla = "project_imgg";
                        offfic = "#";
                        hanshu = "projectin(\"" + data.files[i].fileName + "\" , \"" + k + "\")";
                    }
                    else {
                        img = "../../images/engineering/unknow.png";
                        cla = "list_imga";
                        offfic = "";
                        hanshu = null;
                    }
                    $(".content_box").append("<div data-id='" + data.files[i].fileType + "' data-page='" + data.files[i].filePath + "' class=\"project_box\" " +
                        "onclick='" + hanshu +"'  onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='mous(event,$(\".project_box\").index(this))'>\n" +
                        "            <a class=\"" + cla + " aa\" href=\"" + offfic +  data.files[i].url + "\"" +
                        " style='background-image: url(\"" + img + "\")'></a>\n" +
                        "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                        "            <div class=\"project_right\">\n" +
                        "                <span class=\"project_right_one\" onclick='down($(\".project_right_one\").index(this))'>下载</span>\n" +
                        "            </div>\n" +
                        "        </div>");
                }
                $(".content_box").attr("data-id",data.currentPath);
                $("#loading").hide();
            },
            error:function () {
                console.log("error");
            }
        });
    }
}

function list_retu() {
    $("#header_down").hide();
    $("#loading").show();
    $(".List_content_index").attr("data-id","项目清单").show();
    $(".List_content_box").hide();
    $(".retu").hide();
    let filePath = $(".List_content_box").attr('data-id');
    let department = 2;
    let data = {filePath:filePath,department:department};
    cc--;
    $(".tc_title").text(c[cc]);
    $.ajax({
        url:'http://www.youguangchina.cn/YuHang/project/getSuperiorFiles',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            console.log(data);
            $(".project_box").remove();
            for(let i = 0;i<data.files.length;i++){
                $(".List_content_index").append("<div class=\"project_box\" onclick='listin($(this).children(\".project_font\").text())'" +
                    "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='C_mous(event,$(\".project_box\").index(this))'>\n" +
                    "            <div class=\"project_img\"></div>\n" +
                    "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                    "            <div class=\"C_project_right\" >\n" +
                    "                <a href=\"#\" class=\"C_project_right_one\" onclick=\'C_down($(\".C_project_right_one\").index(this))\'>下载</a>\n" +
                    "            </div>\n" +
                    "        </div>")
                $(".List_content_index").attr("data-id",data.currentPath);
            }
            $("#loading").hide();
        },
        error:function () {
            console.log("error");
        }
    });
}

function log_retu() {
    $("#loading").show();
    $(".log_newbox").hide();
    $(".retu").hide();
    let filePath = $(".content_indexbox").attr('data-id');
    let department = 2;
    let data = {filePath:filePath,department:department};
    if($(".log_show").css("display") === "block"){
        $(".log_show").hide();
        $(".content_indexbox").show();
        login(f[ff]);
        $("#loading").hide();
        ff--;
        $(".tc_title").text(f[ff]);
    }
    else {
        $(".log_indexbox").show();
        $(".log_index_content").hide();
        $(".log_indexbox").attr("data-id","项目日志");
        $.ajax({
            url:'http://www.youguangchina.cn/YuHang/project/getSuperiorFiles',
            type:'post',
            data:JSON.stringify(data),
            dataType:'json',
            contentType:'application/json',
            success:function (data) {
                $(".project_box").remove();
                console.log(data);
                for(let i = 0;i<data.files.length;i++){
                    $(".log_indexbox").append("<div data-t='" + data[i] + "' class=\"project_box\" onclick='login($(this).children(\".project_font\").text())'" +
                        "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='C_mous(event,$(\".project_box\").index(this))'>\n" +
                        "            <div class=\"project_img\"></div>\n" +
                        "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                        "            <div class=\"C_project_right\" >\n" +
                        "                <a href=\"#\" class=\"C_project_right_one\" onclick=\'C_down($(\".C_project_right_one\").index(this))\'>下载</a>\n" +
                        "            </div>\n" +
                        "        </div>")
                }
                $(".content_indexbox").attr("data-id",data.currentPath);
                ff--;
                $(".tc_title").text(f[ff]);
                $("#loading").hide();
            },
            error:function () {
                console.log("error");
            }
        });
    }
}

//搜索功能
$("#file-search").click(function () {
    $("#loading").show();
    let a = "";
    let fileName = $("input[name='search']").val();
    let tc = "",data;
    let key = sessionStorage.getItem("key");
    $(".project_box").remove();
    let filePath;
    if(key === "Engineering"){
        tc = $(".content_index").attr('data-id');
        a = "content_box";
        if(tc === "项目查看"){
            filePath = tc;
            if(starttime != null){
                fileName = null;
            }
            data = {fileName:fileName,filePath:filePath,beginTime:starttime,overTime:endtime};
            // data = {fileName:fileName,filePath:filePath};
            $.ajax({
                url:'http://www.youguangchina.cn/YuHang/project/searchByFileName',
                type:'post',
                data:JSON.stringify(data),
                dataType:'json',
                contentType:'application/json',
                success:function (data) {
                    // console.log(data);
                    for(let i = 0;i<data.files.length;i++){
                        $(".content_index").append("<div class=\"project_box\" onclick='projectin($(this).children(\".project_font\").text(),\"项目查看/\" +   $(this).children(\".project_font\").text())'" +
                            "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='C_mous(event,$(\".project_box\").index(this))'>\n" +
                            "            <div class=\"project_img\"></div>\n" +
                            "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                            "            <div class=\"C_project_right\" >\n" +
                            "                <a href=\"#\" class=\"C_project_right_one\" onclick=\'C_down($(\".C_project_right_one\").index(this))\'>下载</a>\n" +
                            "            </div>\n" +
                            "        </div>")
                    }
                    $(".content_index").attr("data-id",data.currentPath);
                    $("#loading").hide();
                },
                error:function () {
                    console.log("error");
                }
            });
        }
        else {
            filePath = $(".content_box").data('id');
            if(starttime != null){
                fileName = null;
            }
            data = {fileName:fileName,filePath:filePath,beginTime:starttime,overTime:endtime};
            // data = {fileName:fileName,filePath:filePath};
            duqu(data,a);
        }
    }
    else if(key === "List"){
        tc = $(".List_content_index").attr('data-id');
        a = "List_content_box";
        if(tc === "项目清单"){
            filePath = tc;
            if(starttime != null){
                fileName = null;
            }
            data = {fileName:fileName,filePath:filePath,beginTime:starttime,overTime:endtime};
            // console.log(data);
            $.ajax({
                url:'http://www.youguangchina.cn/YuHang/project/searchByFileName',
                type:'post',
                data:JSON.stringify(data),
                dataType:'json',
                contentType:'application/json',
                success:function (data) {
                    console.log(data);
                    for(let i = 0;i<data.files.length;i++){
                        $(".List_content_index").append("<div class=\"project_box\" onclick='listin($(this).children(\".project_font\").text())'" +
                            "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='C_mous(event,$(\".project_box\").index(this))'>\n" +
                            "            <div class=\"project_img\"></div>\n" +
                            "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                            "            <div class=\"C_project_right\" >\n" +
                            "                <a href=\"#\" class=\"C_project_right_one\" onclick=\'C_down($(\".C_project_right_one\").index(this))\'>下载</a>\n" +
                            "            </div>\n" +
                            "        </div>")
                        $(".List_content_index").attr("data-id",data.currentPath);
                    }
                    $("#loading").hide();
                },
                error:function () {
                    console.log("error");
                }
            });
        }
        else {
            filePath = $(".List_content_box").data('id');
            if(starttime != null){
                fileName = null;
            }
            data = {fileName:fileName,filePath:filePath,beginTime:starttime,overTime:endtime};
            console.log(data);
            duqu(data,a);
        }
    }
    else if(key === "Log"){
        tc = $(".log_indexbox").attr('data-id');
        if(tc === "项目日志"){
            filePath = tc;
            if(starttime != null){
                fileName = null;
            }
            data = {fileName:fileName,filePath:filePath,beginTime:starttime,overTime:endtime};
            // data = {fileName:fileName,filePath:filePath};
            $.ajax({
                url:'http://www.youguangchina.cn/YuHang/project/searchByFileName',
                type:'post',
                data:JSON.stringify(data),
                dataType:'json',
                contentType:'application/json',
                success:function (data) {
                    // console.log(data);
                    for(let i = 0;i<data.files.length;i++){
                        $(".log_indexbox").append("<div data-t='" + data[i] + "' class=\"project_box\" onclick='login($(this).children(\".project_font\").text())'" +
                            "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='C_mous(event,$(\".project_box\").index(this))'>\n" +
                            "            <div class=\"project_img\"></div>\n" +
                            "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                            "            <div class=\"C_project_right\" >\n" +
                            "                <a href=\"#\" class=\"C_project_right_one\" onclick=\'C_down($(\".C_project_right_one\").index(this))\'>下载</a>\n" +
                            "            </div>\n" +
                            "        </div>")
                    }
                    $(".log_indexbox").attr("data-id",data.currentPath);
                    $("#loading").hide();
                },
                error:function () {
                    console.log("error");
                }
            });
        }
        else {
            filePath = $(".content_indexbox").data('id');
            if(starttime != null){
                fileName = null;
            }
            data = {fileName:fileName,filePath:filePath,beginTime:starttime,overTime:endtime};
            // data = {fileName:fileName,filePath:filePath};
            console.log(data);
            $.ajax({
                url:'http://www.youguangchina.cn/YuHang/project/searchByFileName',
                type:'post',
                data:JSON.stringify(data),
                dataType:'json',
                contentType:'application/json',
                success:function (data) {
                    // console.log(data);
                    for(let i = 0;i<data.files.length;i++){
                        $(".content_indexbox").append("<div class=\"project_box\"" +
                            "onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='mous(event,$(\".project_box\").index(this))'>\n" +
                            "                <div class=\"log_imga aa\" onclick='see($(\".log_imga\").index(this))'></div>\n" +
                            "                <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                            "            <div class=\"project_right\">\n" +
                            "                <span class=\"project_right_two\" onclick='Rename($(\".project_right_two\").index(this))'>重命名</span>\n" +
                            "                <span class=\"project_right_three\" onclick='logDelete($(\".project_right_three\").index(this))'>删除</span>\n" +
                            "            </div>\n" +
                            "            </div>");
                    }
                    $("#loading").hide();
                    // $(".content_indexbox").attr("data-id",data.currentPath);
                    // $(".content_indexbox").attr("data-tt",projectName);
                },
                error:function () {
                    console.log("error");
                }
            });
        }
    }
});
function duqu(data,a) {
    $.ajax({
        url:'http://www.youguangchina.cn/YuHang/project/searchByFileName',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            console.log(data);
            for(let i = 0;i<data.files.length;i++){
                if(data.files[i].fileType === "doc"||data.files[i].fileType === "docx"){
                    img = "../../images/index/document.png";
                    cla = "list_imga";
                    offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
                }
                else if(data.files[i].fileType === "pdf"){
                    img = "../../images/index/img.png";
                    cla = "list_img";
                    offfic = "";
                }
                else if(data.files[i].fileType === "dwg"||data.files[i].fileType === "dwt"||data.files[i].fileType === "dwf"){
                    img = "../../images/engineering/cad.png";
                    cla = "list_img";
                    offfic = "";
                }
                else if(data.files[i].fileType === "txt"){
                    img = "../../images/index/document.png";
                    cla = "list_imga";
                    offfic = "";
                }
                else if(data.files[i].fileType === "xls"||data.files[i].fileType === "xlsx"){
                    img = "../../images/index/form.png";
                    cla = "list_imga";
                    offfic = "https://view.officeapps.live.com/op/view.aspx?src=";
                }
                else if(data.files[i].fileType === "directory"){
                    img = "../../images/index/engineer.png";
                    cla = "project_imgg";
                    offfic = "#";
                }
                else if(data.files[i].fileType === "jpg"||data.files[i].fileType === "png"){
                    img = "../../images/index/jpg.png";
                    cla = "list_imga";
                    offfic = "";
                }
                else {
                    img = "../../images/engineering/unknow.png";
                    cla = "list_imga";
                    offfic = "";
                }
                $("." + a + "").append("<div data-type='" + data.files[i].fileType+ "' data-page='" +
                    data.files[i].filePath + "' class=\"project_box\"" +
                    "            onmouseover='mouseov()' onmouseout='mouseou()' onmousedown='mous(event,$(\".project_box\").index(this))'>\n" +
                    "            <a class=\"" + cla + " aa\" href=\"" + offfic +  data.files[i].url + "\"" +
                    "                   style='background-image: url(\"" + img + "\")'></a>\n" +
                    "            <span class=\"project_font\">" + data.files[i].fileName + "</span>\n" +
                    "            <div class=\"project_right\">\n" +
                    "                <span class=\"project_right_one\" onclick='down($(\".project_right_one\").index(this))'>下载</span>\n" +
                    "                <span class=\"project_right_two\" onclick='Rename($(\".project_right_two\").index(this))'>重命名</span>\n" +
                    "                <span class=\"project_right_three\" onclick='Delete($(\".project_right_three\").index(this))'>删除</span>\n" +
                    "            </div>\n" +
                    "        </div>");
            }
            $("#loading").hide();
        },
        error:function () {
            console.log("error");
        }
    });
}

let mess = true,messimg = 0,me = 0;
let d = setInterval(messs,1000);
let s = [],k = [],l = 0,u = 0;
//消息提示
$(".message").click(function () {
    if(mess){
        $(this).siblings(".dropdown-menu").show();
        mess = false;
        onlymessage(0,0);
        clearInterval(d);
    }
    else {
        $(this).siblings(".dropdown-menu").hide();
        mess = true;
        d = setInterval(messs,1000);
    }
});

// messs()为消息提示，有新消息时红点出现，message（）为第一次切换，
function messs() {
    let userId = localStorage.yuhanguserId;
    let department = 2;
    let onlyDepartment = 0;
    let history = 0;
    let data = {userId:userId,department:department,onlyDepartment:onlyDepartment,history:history};
    $.ajax({
        url:'http://www.youguangchina.cn/YuHang/reimbNotice/getNotice',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            me = data.notices.length;
            if(me > 0 ){
                $(".add").show();
            }
        },
        error:function () {
            console.log("error");
        }
    });
}

function onlymessage(i,h) {
    $(".add").hide();
    $(".menu-body").children().remove();
    s = [];
    k = [];
    l = 0;
    u = 0;
    let userId = localStorage.yuhanguserId;
    let department = 2;
    let onlyDepartment = i;
    let history = h;
    let o = "";
    let data = {userId:userId,department:department,onlyDepartment:onlyDepartment,history:history};
    $.ajax({
        url:'http://www.youguangchina.cn/YuHang/reimbNotice/getNotice',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            console.log(data);
            for(let i = 0;i<data.notices.length;i++){
                if(data.notices[i].tab === 1){
                    s[l] = data.notices[i].id;
                    l++;
                    if(data.notices[i].operation === 1){
                        o = "新建文件夹";
                    }
                    else if(data.notices[i].operation === 2){
                        o = "上传文件";
                    }
                    else if(data.notices[i].operation === 3){
                        o = "重命名文件";
                    }
                    else if(data.notices[i].operation === 4){
                        o = "新建项目";
                    }
                    else if(data.notices[i].operation === 5){
                        o = "重命名项目";
                    }
                    else if(data.notices[i].operation === 6){
                        o = "上传日志";
                    }
                    else if(data.notices[i].operation === 7){
                        o = "删除日志";
                    }
                    else if(data.notices[i].operation === 8){
                        o = "项目进度更新";
                    }
                    else if(data.notices[i].operation === 9){
                        o = "删除文件";
                    }
                    else if(data.notices[i].operation === 10){
                        o = "删除项目";
                    }
                    else if(data.notices[i].operation === 11){
                        o = "还原文件";
                    }
                    else if(data.notices[i].operation === 12){
                        o = "还原项目";
                    }
                    $(".menu-body").append('<ul>\n' +
                        '                            <li>\n' +
                        '                                ' + data.notices[i].name + '' +
                        '                                ' +  o  + '' +
                        '                                ' + data.notices[i].fileName +'\n' +
                        '                                <span class="time pull-right">' + data.notices[i].showTime + '</span>\n' +
                        '                            </li>\n' +
                        '                    </ul>')
                }
                else {
                    k[u] = data.notices[i].id;
                    u++;
                    if(data.notices[i].status2 === 1){
                        o = "已通过";
                    }
                    else {
                        o = "已拒绝"
                    }
                    $(".menu-body").append('<ul>\n' +
                        '                            <li>\n' +
                        '                                ' + data.notices[i].name + '' +
                        '                                ' +  '的报销申请'  + '' +
                        '                                ' + o +'\n' +
                        '                                <span class="time pull-right">' + data.notices[i].showTime + '</span>\n' +
                        '                            </li>\n' +
                        '                    </ul>')
                }
                }
        },
        error:function () {
            console.log("error");
        }
    });
}
let che = 1;//che表示已读和未读的只查看本部门消息，0为历史， 1为未读
//消息提示：只查看本部门的消息,messimg表示此时按钮的状态。0为未选中，1为选中
$(".check").click(function () {
    event.stopPropagation();
    $(".menu-body").children().remove();
    if(messimg === 0){
        $(this).attr('src',"../../images/index/checkbox2.png");
        messimg = 1;
        if(che === 0){
            onlymessage(1,1);//查看历史消息中的当前部门消息
        }
        else if(che === 1){
            onlymessage(1,0);//查看未读消息中的当前部门信息
        }
    }
   else {
        if(che === 0){
            onlymessage(0,1);//查看历史消息中的所有部门信息
        }
        else if(che === 1){
            onlymessage(0,0);//查看未读消息中的所有部门信息
        }
        messimg = 0;
        $(this).attr('src',"../../images/index/checkbox1.png");
    }
});

//消息提示：历史消息
//已读
$("#read").click(function () {
    $(".check").attr('src',"../../images/index/checkbox1.png");
    messimg = 0;
    che = 0;
   $("#unread").removeClass("active");
    $("#read").addClass("active");
    event.stopPropagation();
    onlymessage(0,1);
});
//未读
$("#unread").click(function () {
    $(".check").attr('src',"../../images/index/checkbox1.png");
    messimg = 0;
    che = 1;
    $("#read").removeClass("active");
    $("#unread").addClass("active");
    event.stopPropagation();
    onlymessage(0,0);
});
$( document ).bind("click", function( event ) {
    if(!mess&&$( event.target ).closest(".dropdown-menu").length === 0&&$( event.target ).closest(".message").length===0){

        $(".dropdown-menu").hide();
        mess = true;
        d = setInterval(messs,1000);
    }
});

$("#read_ok").click(function () {
    let userId = localStorage.yuhanguserId;
    let department = 2;
    let data = {userId:userId,department:department,noticeId:k,operateNotices:s};
    $.ajax({
        url:'http://www.youguangchina.cn/YuHang/reimbNotice/changeToWatched',
        type:'post',
        data:JSON.stringify(data),
        dataType:'json',
        contentType:'application/json',
        success:function (data) {
            console.log(data);
            $(".menu-body").children().remove();
        },
        error:function () {
            console.log("error");
        }
    });
});
