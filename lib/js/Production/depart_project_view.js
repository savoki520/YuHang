let dpv = new Vue({
    el:"#depart_project_view",
    data:{
        /*
        * 显示loading
        * */
        loadingFlag:true,
        /*
        * 搜索项
        * */
        searchVal:'',
        sv:"aq",
       /*
       *子项是否显示
       * */
       childrenItemFlag:false,
       timer:'',
       /*
       * 当前显示的右击列表id
       * */
       rightChickId:-1,
        /*
        * 接口地址
        * */
       path:'http://www.youguangchina.cn/YuHang/',
       /*
       * 文件夹项
       * */
       dib_items:document.getElementsByClassName("dib_item"),
        /*
        * 预览展示区域
        * */
       preview_package:null,
        /*
        * 当前悬停项id
        * */
       hover_id:-1,
        /*
        * 上层数组
        * */
        upCeng:[],
       /*
       *  当前层
       * */
       dq_path:'',
       /*
       *项目文件夹(第一层)
       * */
       parentPackages:[]
    },
    methods:{
        /*
        * 点击项目文件夹
        * */
        clickPackage:function (type,index,url,item,event) {
            let that = this;
            let node = event.target;
            if(!node.classList.contains("rl_item")){
                let data;
                if(type == "directory"){
                    data = JSON.stringify({
                        filePath:url,
                        department:"1"
                    });
                    that.getFileInfo(data);
                }else{
                    window.open(item.href);
                }

            }
        },
        /*
        * 数据排序
        * */
        sortData:function(msg){
             let that = this;
             if(msg == "id"){

             }else if(msg == "time"){
                 let data = JSON.stringify({
                     filePath:that.dq_path,
                     department:"1"
                 });
                 that.getFileInfo(data,"sort");
             }
        },
        /*
        * 返回上一层
        * */
        res_btn:function(){
            let that = this;
            let data;
            let index1;
            that.upCeng.forEach((item,index,arr)=>{
                if(item == that.dq_path){
                    data = JSON.stringify({
                        filePath:arr[index - 1],
                        department:"1"
                    });
                    index1 = index;
                }
            });
            let arrs = [];
            for(let i = 0;i < that.upCeng.length;i++){
                if(i < index1 - 1){
                    arrs.push(that.upCeng[i]);
                }
            }
            that.upCeng = arrs;
            that.getFileInfo(data);
        },
        /*
        * 禁止右击事件,设置body鼠标按下事件
        * */
        stopDefaultEvent:function () {
            document.body.oncontextmenu = function (event){
                if(!event.target.classList.contains("depart_icc_bottom")){
                    tools.cancelHandler(event);
                }
            }
            /*鼠标按下*/
            document.body.addEventListener("mousedown",function (event) {
                if(event.button == 2){
                    if(event.target.classList.contains("dibi_top") || event.target.classList.contains("dibi_bottom") || event.target.classList.contains("sdsi_top") || event.target.classList.contains("sdsi_bottom")) {
                        let right_lists = event.target.parentElement.getElementsByClassName("right_lists")[0];
                        let id = event.target.parentElement.getAttribute("data-val");
                        dpv.rightChickId = id;
                        if (event.target.classList.contains("dibi_top") || event.target.classList.contains("sdsi_top")) {
                            right_lists.style.left = event.offsetX + "px";
                            right_lists.style.top = event.offsetY + "px";
                        }
                        if (event.target.classList.contains("dibi_bottom") || event.target.classList.contains("sdsi_bottom")) {
                            let pre = event.target.previousElementSibling;
                            let h = tools.getStyle(pre, "height");
                            right_lists.style.left = event.offsetX + "px";
                            right_lists.style.top = event.offsetY + parseInt(h.split("px")[0]) + "px";
                        }
                    }else if(event.target.classList.contains("right_lists")){
                        console.log(event.target.classList.contains("right_lists"));
                    }else{
                        dpv.rightChickId = -1;
                    }
                }else if(event.button == 0){
                    if(!event.target.classList.contains("dibi_top") &&  !event.target.classList.contains("dibi_bottom") && !event.target.classList.contains("rl_item")){
                        dpv.rightChickId = -1;
                    }
                }
            });
            /*悬停事件*/
            // document.body.addEventListener("mouseover",function (event) {
            //     let sds_item = event.target.parentElement;
            //     if(event.target.parentElement.classList.contains("dib_item")){
            //         dpv.hover_id = sds_item.getAttribute("data-val");
            //     }
            //     sds_item.addEventListener("mouseout",function () {
            //         dpv.hover_id = -1;
            //     });
            // });
        },
        /*
        * 文件下载
        * */
        downLoadPackage:function(item_type,href,path) {
            let that = this;
            if(item_type == "directory") {
                // zip下载
                let form = document.createElement("form");
                $(form).attr("style", "display:none");
                $(form).attr("target", "");
                $(form).attr("method", "post");
                $(form).attr("action", that.path + "file/zipdownload");
                let input1 = document.createElement("input");
                $(input1).attr("type", "hidden");
                $(input1).attr("name", "filePath");
                $(input1).attr("value", href);
                $("body").append(form);
                $(form).append(input1);
                $(form).submit();
                $(form).remove();
            }else{
                //普通文件下载
                window.location.href = `${path}`;
                let form = document.createElement("form");
                $(form).attr("style", "display:none");
                $(form).attr("target", "");
                $(form).attr("method", "post");
                $(form).attr("action", that.path + "file/download");
                let input1 = document.createElement("input");
                $(input1).attr("type", "hidden");
                $(input1).attr("name", "filePath");
                $(input1).attr("value", path);
                $("body").append(form);
                $(form).append(input1);
                $(form).submit();
                $(form).remove();
            }
          dpv.rightChickId = -1;
        },
        /*
        * 重命名
        * */
        // reName:function(item_type,href,path,name){
        //     let that = this;
        //     let context = prompt("文件重命名");
        //     if(context){
        //         let data;
        //         let rename;
        //         if(item_type != 'directory'){
        //             rename = context  + "." + item_type;
        //             data = JSON.stringify({
        //                 "oriname":name,
        //                 "rename":rename,
        //                 "path":path.split(name)[0]
        //             });
        //         }else{
        //             rename = context;
        //             data = JSON.stringify({
        //                 "oriname":name,
        //                 "rename":rename,
        //                 "path":href.split(name)[0]
        //             });
        //         }
        //         let promise = new Promise(function (resolve,reject) {
        //             $.ajax({
        //                 type: "POST",
        //                 url: that.path + "file/renameFile",
        //                 data:data,
        //                 cache: false,
        //                 dataType: "json",
        //                 contentType: "application/json",
        //                 success: function (msg) {
        //                     resolve();
        //                 }
        //             });
        //         });
        //         promise.then(function () {
        //             let data = JSON.stringify({
        //                 filePath:that.dq_path,
        //                 department:"1"
        //             });
        //             that.getFileInfo(data);
        //         });
        //     }
        //     dpv.rightChickId = -1;
        // },
        /*
        * 文件预览 word excel pdf img txt
        * */
        previewFile:function (type,url) {
            let that = this;
            /*
            * 文件类型
            * */
            if(type == "doc"){
                window.open(`https://view.officeapps.live.com/op/view.aspx?src=${url}`);
            }else if(type == "xls"){
                window.open(`https://view.officeapps.live.com/op/view.aspx?src=${url}`);
            }else if(type == "pdf"){
                window.open(`${url}`);
            }else if(type == "txt"){
                window.open(`${url}`);
            }else if(type == "jpg" || type == "jpeg" || type == "png"){
                window.open(`${url}`);
            }
            // window.location.href="" ;
        },
        /*
        * 点击灰色区域
        * */
        clickGrayBack:function () {
            let that = this;
            that.priviewFlag = false;
        },
        /*搜索关键字*/
        searchVal_input:function () {
            let that = this;
            that.timerSearch()(dpv.searchVal);
            that.sv = "sv";
        },
        /*
        * 防抖
        * */
        timerSearch:function(){
            let that = this;
            return function (search) {
                clearTimeout(that.timer);
                that.timer = setTimeout(()=>{
                    let data;
                    if(search == ''){
                        that.upCeng = [];
                        that.getFilePackage();
                    }else{
                        data = JSON.stringify({
                            "fileName":search,
                            "filePath":that.dq_path
                        });
                        that.getFileInfo(data,"search");
                    }
                },1000);
            }
        },
        /*
       * 获取一层文件夹列表
       * */
        getFilePackage:function(){
            let that = this;
            let data = JSON.stringify({
                filePath:"项目查看",
                department:"1"
            });
            that.getFileInfo(data);
            that.sv = "aq";
        },
        // 获取文件信息
        getFileInfo:function(data,sort){
            let that = this;
            let path;
            if(sort && sort == "sort"){
                path = "project/getListFiles";
            }else if(sort && sort == "search"){
                path = "project/searchByFileName";
            }else{
                path = "project/getListFilesByTime"
            }
            setTimeout(function () {
                $.ajax({
                    type: "POST",
                    url: that.path + path,
                    data:data,
                    cache: false,
                    dataType: "json",
                    contentType: "application/json",
                    success: function (msg) {
                        let files = msg.files;
                        let parentPackages = [];
                        for(let i = 0;i < files.length;i++){
                            if(files[i].fileType == "directory"){
                                parentPackages.push({
                                    id:i,
                                    title:files[i].fileName,
                                    icon:'../../images/depart/package_depart.png',
                                    type:files[i].fileType,
                                    href:files[i].filePath,
                                    path:''
                                });
                            }else{
                                let icon = "";
                                if(files[i].fileType == "jpeg" || files[i].fileType == "png" || files[i].fileType == "jpg"){
                                    icon = "../../images/depart/img_logo.png";
                                }else if(files[i].fileType == "pdf"){
                                    icon = "../../images/depart/pdf.png";
                                }else if(files[i].fileType == "xls"){
                                    icon = "../../images/depart/bg.png";
                                }else if(files[i].fileType == "doc"){
                                    icon = "../../images/depart/wd.png";
                                }else if(files[i].fileType == "txt"){
                                    icon = "../../images/depart/wd.png";
                                }else{
                                    icon = "../../images/depart/wz.png";
                                }
                                parentPackages.push({
                                    id:i,
                                    title:files[i].fileName,
                                    icon:icon,
                                    type:files[i].fileType,
                                    href:files[i].url,
                                    path:files[i].filePath
                                });
                            }
                        }
                        that.parentPackages = parentPackages;
                        let count = 0;
                        that.upCeng.forEach((item,index,arr) => {
                            if(msg.currentPath && item == msg.currentPath){
                                count++;
                            }
                        });
                        if(count==0){
                            that.upCeng.push(msg.currentPath);
                        }
                        that.dq_path = msg.currentPath ;
                        if(that.sv == "sv"){
                            that.childrenItemFlag = false;
                        }else if(that.sv == "aq"){
                            if(that.upCeng.length > 1){
                                that.childrenItemFlag = true;
                            }else{
                                that.childrenItemFlag = false;
                            }
                        }
                        that.loadingFlag = false;
                    }
                });
            },100);
        },
        /*
        * 计算高度
        * */
        setHeight:function(){
            let h;
            if(tools.getViewportOffset().h >= 860){
                h = tools.getViewportOffset().h * 0.7 + "px";
            }else if(tools.getViewportOffset().h < 860 && tools.getViewportOffset().h > 700){
                h = tools.getViewportOffset().h * 0.55 + "px";
            }else{
                h = tools.getViewportOffset().h * 0.45+ "px";
            }
            $('#weChat').slimScroll({
                width:'100%',
                height:h,
                wheelStep: 5
            });
            $('#weChat').css("backgroundColor","#F8F8F8");
        },
        /*
        * 初始化数据
        * */
        initData:function () {
            let that = this;
            // 设置事件
            that.stopDefaultEvent();
            // 获取文件夹
            that.getFilePackage();

            window.onresize = function(){
                that.setHeight();
            }
            that.setHeight();
        }
    }
});
tools.domReady(dpv.initData);