let rls = new Vue({
    el:"#reimbursement_lists",
    data:{
        /*
        * 接口地址
        * */
        path:'http://www.youguangchina.cn/YuHang/',
       /*
       *   报销审核列表
       * */
        audit_lists:[],
        /*
        * 显示loading
        * */
        loadingFlag:true,
        /*
        * 是否查看
        * */
        showFlag:false,
        /*生产部报销上传内容*/
        reimbursements_obj:{
            title:'',
            name:'',
            upload_icon:[],
            description:''
        },
        /*
        * hover icon
        * */
        hover_icon:'-1',
    },
    methods:{
         /*
         * 同意
         * */
        clickAgree:function (item_id) {
            this.setStatus(item_id,"confirmReimb","同意");
        },
        /*
        * 设置状态
        * */
        setStatus:function(item_id,msg,title){
            let confirmFlag = confirm("是否确认" + title + "报销???");
            if(confirmFlag){
                let that = this;
                $.ajax({
                    type: "POST",
                    url: that.path + "reimb/" + msg,
                    data:JSON.stringify({
                        reimbId:item_id
                    }),
                    cache: false,
                    dataType: "json",
                    contentType: "application/json",
                    success: function (msg) {
                        that.initData();
                    }
                });
            }
        },
        /*
        * 查看
        * */
        clickSee:function (item_id) {
            let that = this;
            that.showFlag = true;
            $.ajax({
                type: "GET",
                url: `${that.path}reimb/getReimbById/${item_id}`,
                data:``,
                cache: false,
                dataType: "json",
                contentType: "application/json",
                success: function (msg) {
                    that.reimbursements_obj = {
                        title:msg.title,
                        name:msg.name,
                        upload_icon:msg.pics,
                        description:msg.explanation
                    }
                }
            });
        },
        /*
        * 拒绝
        * */
        clickRefuse:function (item_id) {
            this.setStatus(item_id,"rejectReimb","拒绝");
        },
        /*
        * 删除
        * */
        clickDel:function (item_id) {
            this.setStatus(item_id,"deleteReimb","删除");
        },
        /*
        * 获取审核列表
        * */
        getReimLists:function(){
            let that = this;
            let promise = new Promise(function (resolve,reject) {
                $.ajax({
                    type: "GET",
                    url: that.path + "reimb/getAllReimb/0/10",
                    data:``,
                    cache: false,
                    dataType: "json",
                    contentType: "application/json",
                    success: function (msg){
                        let datas = msg.reimbs;
                        that.audit_lists = [];
                        datas.forEach((item,index,arr) => {
                            that.audit_lists.push({
                                id:item.id,
                                reimbId:item.reimbId,
                                time:item.time,
                                file:item.pic,
                                title:item.title,
                                name:item.name,
                                status:item.status
                            });
                        });
                        if(msg.count > 0){
                            let cp = Math.ceil(msg.count/10);
                            // 初始化分页
                            resolve(cp);
                        }
                        that.loadingFlag = false;
                    }
                });
            });
            promise.then(function (msg) {
                that.pageFull(msg);
            });
        },
        // 分页
        pageFull:function(cp){
            let that = this;
            $("#demo1").paginate({
                count:cp,
                start:1,
                display: 10,
                border: false,
                images:false,
                text_color:'#3E4646',
                background_color:'#f8f8f8',
                background_hover_color:'#3D3D3D',
                text_hover_color:'#fff',
                onChange: function(page) {
                    that.loadingFlag = true;
                    that.audit_lists = [];
                    setTimeout(function () {
                        $.ajax({
                            type: "GET",
                            url: `${that.path}reimb/getAllReimb/${page - 1}/10`,
                            data:``,
                            cache: false,
                            dataType: "json",
                            contentType: "application/json",
                            success: function (msg) {
                                let datas = msg.reimbs;
                                that.audit_lists = [];
                                datas.forEach((item,index,arr) => {
                                    that.audit_lists.push({
                                        id:item.id,
                                        reimbId:item.reimbId,
                                        time:item.time,
                                        file:item.pic,
                                        title:item.title,
                                        name:item.name,
                                        status:item.status
                                    });
                                });
                                that.loadingFlag = false;
                            }
                        });
                    },100);
                }
            });
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
            setTimeout(function () {
                that.getReimLists();
            },100);
            window.onresize = function(){
                that.setHeight();
            }
            that.setHeight();
        },
        /*
        * 返回列表
        * */
        res_lists:function () {
                let that = this;
                that.showFlag = false;
        }
    }
});
$(document).ready(function () {
    //初始化数据
    rls.initData();

});
