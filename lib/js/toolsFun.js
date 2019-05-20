/*
* 基本函数封装类
* time：2019-01-11
* author：熊豆豆
* */


$(function () {
    //锁屏确认
    if(localStorage.yuhanglock=="true"){
        $('#lock-enter').show();
    }
    $('#username').empty();
    $('#username').html(localStorage.yuhangrelname+",欢迎您");


    $('#dataTime').empty();
    $('#dataTime').html(GetNowTime());





});







//ajax请求
function http(url,Method,DataJson) {
    return $.ajax({
        url: url,
        type: Method,
        contentType: "application/json",
        dataType:"json",
        data: JSON.stringify(DataJson)
    });
}


//上传文件




/*
* 获取当前时间
* */
function GetNowTime() {
    var myDate = new Date();
    //获取当前年
    var year=myDate.getFullYear();
    //获取当前月
    var month=myDate.getMonth()+1;
    //获取当前日
    var date=myDate.getDate();
    var h=myDate.getHours();       //获取当前小时数(0-23)
    var m=myDate.getMinutes();     //获取当前分钟数(0-59)
    var s=myDate.getSeconds();
    var now=year+'-'+getNow(month)+"-"+getNow(date)+" "+getNow(h)+':'+getNow(m)+":"+getNow(s);
    return now;
}
function getNow(s) {
    return s < 10 ? '0' + s: s;
}



/*
* 发送数据到下一网页
* */
var params = function(args){
    var p = [];
    for(var n in args)
        p.push( n + '=' + args[n]);
    return encodeURI('?' + p.join('&'));

};
//接收上一页面传递的数据
var args = function(params){
    var a = {};
    params = params || location.search;
    if(!params) return {};
    params = decodeURI(params);
    params.replace(/(?:^\?|&)([^=&]+)(?:\=)([^=&]+)(?=&|$)/g,function(m,k,v){  a[k] = v; });
    return a;
};




//文件上传
function httpFileUpload(form) {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://www.youguangchina.cn/VisitSystem/video/upload",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    };
    return $.ajax(settings);
}


//文件下载
function downZipEvent(url,filepath) {
    var form = $("<form>");
    form.attr("style", "display:none");
    form.attr("target", "");
    form.attr("method", "post");
    form.attr("action", url);
    var input1 = $("<input>");
    input1.attr("type", "hidden");
    input1.attr("name", "filePath");
    input1.attr("value", filepath);
    $("body").append(form);
    form.append(input1);
    form.submit();
    form.remove();
}











//设置cookie
function setCookie(name,value,day){
    var date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = name + '=' + value + ';expires='+ date;
}
//获取cookie
function getCookie(name){
    var reg = RegExp(name+'=([^;]+)');
    var arr = document.cookie.match(reg);
    if(arr){
        return arr[1];
    }else{
        return '';
    }
}
//删除cookie
function delCookie(name){
    setCookie(name,null,-1);
}



//菜单取消
function Cancelmenu() {
    $('div.folder').removeClass('active');
    event.stopPropagation();
}



/*
    *新建文件夹、文件
    * */

var folder={};
folder.getEngineering=function($Id,$Name,$FileName,$Path,$Type){
    var folderhtml=' <div id="file'+$Id+'" data-filename="'+$FileName+'" data-filetype="'+$Type+'" data-filepath="'+$Path+'" class="folder pull-left" data-fileType="directory">\n' +
        '                <img src="../../images/design/pic3.png" alt="">\n' +
        '                <span>'+$Name+'</span>\n' +
        '<div class="menu">\n' +
        '    <ul><li onclick="Directorydownload()">下载</li><li onclick="Cancelmenu()">取消</li></ul>\n' +
        '</div>' +
        '            </div>';
    return folderhtml;
};
folder.getProduction=function($Id,$Name,$FileName,$Path,$Type){
    var folderhtml='<div id="file'+$Id+'" data-filename="'+$FileName+'" data-filetype="'+$Type+'" data-filepath="'+$Path+'" class="folder pull-left" data-fileType="directory">\n' +
        '                <img src="../../images/design/pic4.png" alt="">\n' +
        '                <span>'+$Name+'</span>\n' +
        '<div class="menu">\n' +
        '    <ul><li onclick="Directorydownload()">下载</li><li onclick="Cancelmenu()">取消</li></ul>\n' +
        '</div>' +
        '            </div>';
    return folderhtml;
};
folder.getNew=function($currentPath,$Id,$Name,$FileName,$Path,$Type,$url){
    var folderhtml="";
    switch ($Type) {
        case "directory":
            folderhtml+=' <div currentPath="'+$currentPath+'" id="file'+$Id+'" data-filename="'+$FileName+'" data-filetype="'+$Type+'" data-filepath="'+$Path+'" class="folder pull-left">\n' +
                '                <img src="../../images/design/pic1.png" alt="">\n' +
                '                <span>'+$Name+'</span>\n' +
                '<div class="menu">\n' +
                '    <ul><li onclick="Directorydownload()">下载</li><li onclick="FileDirecdelete()">删除</li><li onclick="FileDireRename()">重命名</li><li onclick="Cancelmenu()">取消</li></ul>\n' +
                '</div>' +
                '            </div>';

            break;
        case "xls":
        case "xlsx":
            folderhtml+='<div currentPath="'+$currentPath+'" id="file'+$Id+'" data-filename="'+$FileName+'" data-filetype="'+$Type+'" data-url="'+$url+'" data-filepath="'+$Path+'" class="folder pull-left">\n' +
                '            <img src="../../images/design/pic7.png" alt="">\n' +
                '            <p>'+$Name+'</p>\n' +
                '<div class="menu">\n' +
                '    <ul><li onclick="Filedownload()">下载</li><li onclick="FileDirecdelete()">删除</li><li onclick="FileDireRename()">重命名</li><li onclick="Cancelmenu()">取消</li></ul>\n' +
                '</div>' +
                '        </div>';
            break;
        case "txt":
        case "doc":
        case "docx":
            folderhtml+='<div currentPath="'+$currentPath+'" id="file'+$Id+'" data-filename="'+$FileName+'" data-filetype="'+$Type+'" data-url='+$url+' data-filepath="'+$Path+'" class="folder pull-left">\n' +
                '            <img src="../../images/design/pic6.png" alt="">\n' +
                '            <p>'+$Name+'</p>\n' +
                '<div class="menu">\n' +
                '    <ul><li onclick="Filedownload()">下载</li><li onclick="FileDirecdelete()">删除</li><li onclick="FileDireRename()">重命名</li><li onclick="Cancelmenu()">取消</li></ul>\n' +
                '</div>' +
                '        </div>';
            break;
        case "pdf":
            folderhtml+='<div currentPath="'+$currentPath+'" id="file'+$Id+'" data-filename="'+$FileName+'" data-filetype="'+$Type+'" data-url='+$url+' data-filepath="'+$Path+'" class="folder pull-left">\n' +
                '            <img src="../../images/design/pic5.png" alt="">\n' +
                '            <p>'+$Name+'</p>\n' +
                '<div class="menu">\n' +
                '    <ul><li onclick="Filedownload()">下载</li><li onclick="FileDirecdelete()">删除</li><li onclick="FileDireRename()">重命名</li><li onclick="Cancelmenu()">取消</li></ul>\n' +
                '</div>' +
                '        </div>';
            break;
        case "jpg":
        case "png":
        case "jepg":
        case "gif":
        case "bmp":
            folderhtml+='<div currentPath="'+$currentPath+'" id="file'+$Id+'" data-filename="'+$FileName+'" data-filetype="'+$Type+'" data-url='+$url+' data-filepath="'+$Path+'" class="folder pull-left">\n' +
                '            <img src="../../images/design/pic8.png" alt="">\n' +
                '            <p>'+$Name+'</p>\n' +
                '<div class="menu">\n' +
                '    <ul><li onclick="Filedownload()">下载</li><li onclick="FileDirecdelete()">删除</li><li onclick="FileDireRename()">重命名</li><li onclick="Cancelmenu()">取消</li></ul>\n' +
                '</div>' +
                '        </div>';
            break;
    }
    return folderhtml;
};
folder.getDClick=function(item){
    var data={
        "file_path":$(item).attr('data-filepath')
    };
    location.href='ProjectDD.html'+params(data);
};
folder.getFClick=function(item){
    var data={
        "url":$(item).attr('data-url'),
        "type":$(item).attr('data-filetype'),
        "path":$(item).attr('data-filepath')
    };
    window.open('../FilePreview/WordPreview.html'+params(data));
};
//优秀项目查看
folder.getExDClick=function(item){
    var data={
        "file_path":$(item).attr('data-filepath')
    };
    location.href='ExProjectDD.html'+params(data);
};


//文件下载
function Filedownload() {
    downZipEvent('http://www.youguangchina.cn/YuHang/file/download',$('div.folder.active').attr('data-filepath'));
    event.stopPropagation();
}
//文件夹下载
function Directorydownload() {
    downZipEvent('http://www.youguangchina.cn/YuHang/file/zipdownload',$('div.folder.active').attr('data-filepath'));
    event.stopPropagation();
}
//删除到回收站
function FileDirecdelete() {
    $('#loading').show();
    var json={
        "filePath":$('div.folder.active').attr('data-filepath'),
        "fileType":$('div.folder.active').attr('data-filetype')
    };
    http('http://www.youguangchina.cn/YuHang/recycle/addRubbish','POST',json).done(function (res) {
        $('#loading').hide();
        console.log(res);
        if(res=="success"){
            location.reload();
        }
        else {
            alert(res.error);
        }
        $('#loading').hide();
    }).fail(function() {
        alert('网络请求错误，请联系管理员！');
    });
    event.stopPropagation();
}
//重命名
function FileDireRename() {
    $("input[name='rename-folder']").val($('div.folder.active').attr('data-filename'));
    $('#rename-folder').show();
    event.stopPropagation();
}
$('#rename-folder-Cancel').on('click',function () {
    $('#rename-folder').hide();
    event.stopPropagation();
});
$('#rename-folder-Ok').on('click',function () {
    var json={
        "oriname":$('div.folder.active').attr('data-filename'),
        "rename":$("input[name='rename-folder']").val(),
        "path":$('div.folder.active').attr('currentPath')
    };
    var reg = RegExp(/\/|\\|\:|\?|\*|\"|<|>|\|/);
    if(json.rename.match(reg)){
        alert("含有/\\:?*\"<>|特殊符号，请重新输入");
        return;
    }
    $('#loading').show();
    http('http://www.youguangchina.cn/YuHang/file/renameFile','POST',json).done(function (res) {
        $('#loading').hide();
        if(res.result=="success"){
            location.reload();
        }
        else {
            alert(res.error);
        }
        $('#loading').hide();
    }).fail(function() {
        alert('网络请求错误，请联系管理员！');
    });
    event.stopPropagation();
});






/*
* time:2019-01-22
* */

//右击显示菜单
function rightClickMouse (obj, callback) {
    //去掉active
    $('div.folder').removeClass('active');
    //禁止浏览器默认事件
    $(document).delegate(obj,'contextmenu', function (e) {
        e.preventDefault();
    });
    //给选择器obj绑定右键事件
    $(document).delegate(obj,'mousedown', function (e) {
        var $t = $(this);
        if (e.which == 3) {
            if (typeof callback == 'function') {
                //右键执行回调函数
                callback($t);
            }
        }
    });
}
rightClickMouse('div.folder',function(t){
    $('div.folder').removeClass('active');
    console.log(t);
    $(t).addClass('active');
});







//锁屏
$('#lock-screen').on('click',function () {
   localStorage.yuhanglock="true";
   $('#lock-enter').show();
});
//解锁
$('#lock-enter-Ok').on('click',function () {
    $('#loading').show();
    var json={
        "account":localStorage.yuhangname,
        "password":$("input[name='lock']").val()
    };
    http('http://www.youguangchina.cn/YuHang/user/login','POST',json).done(function (res) {
        $('#loading').hide();
        localStorage.yuhanglock="false";
        $("input[name='lock']").val('');
        if(res.result="success"){
            $('#lock-enter').hide();
        }
        else {
            alert(res.error);
        }
    }).fail(function() {
        alert('网络请求错误，请联系管理员！');
    });
});
$('#lock-enter-Cancel').on('click',function () {
    $("input[name='lock']").val('');
});









//修改密码
$('#change-Password').on('click',function () {
    location.href="../login/changePassword.html";
});
$('#change_Password').on('click',function () {
    location.href="pages/login/changePassword.html";
});


//退出系统
$('#exit-System').on('click',function () {
    $('#exit-content').show();
});


$('#exit-cancel').on('click',function () {
    $('#exit-content').hide();
});

$('#exit-ok').on('click',function () {
    location.href="../login/login.html";
});

$('#exit_ok').on('click',function () {
    location.href="pages/login/login.html";
});












