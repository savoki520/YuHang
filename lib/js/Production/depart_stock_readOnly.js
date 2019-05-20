let depart_stock = new Vue({
    el:"#depart_stock",
    data:{
        /*
        * 搜索项
        * */
        searchVal:'',
        /*
        * 接口地址
        * */
        path:'http://www.youguangchina.cn/YuHang/',
        /*
        * 当前选定的父类目id
        * */
        selectedParentId:'1001',
        /*
        * 库存父类目
        * */
        parent_items:[],
        /*
        * 父类目创建窗口是否展示
        * */
        parentItemFlag:false,
        /*子类目创建窗口是否展示*/
        childItemFlag:false,
        /*
        * 创建的类目信息或者是显示的类目信息
        * */
        parentItemInfo:{
            title:''
        },
        /*
        * 创建的子类目信息或者是显示的类目信息
        * */
        childrenItemInfo:{
            id:'',
            title:'',
            stock:'',
            icon:''
        },
        /*
        * 当前显示的子类目
        * */
        subcategorys:[]
    },
    methods:{
        // 点击新建父类目
        createParentItem:function () {
            let that = this;
            that.parentItemFlag = true;
        },
        // 创建
        confirmParent:function () {
            let that = this;
            if(that.parentItemInfo.id != '' && that.parentItemInfo.title != ''){
                that.parent_items.push({
                    title:that.parentItemInfo.title
                });
                that.createParentItemData(that.parentItemInfo.title);
                that.parentItemInfo = {
                    title:''
                };
                alert("父类目创建成功!");
                that.parentItemFlag = false;
            }else{
                alert("父类目创建失败!请检查输入内容");
            }
        },
        // 调用创建接口
        createParentItemData:function(title){
            let that = this;
            $.ajax({
                type: "POST",
                url: that.path + "goods/newCate",
                data:`cate_name=${title}`,
                cache: false,
                success: function (msg) {

                }
            });
        },
        // 取消
        cancelParent:function () {
            let that = this;
            that.parentItemFlag = false;
        },
        // 点击父类目项
        clickParentModeItem:function(item_title,item_id){
            let that = this;
            that.selectedParentId = item_id;
            $.ajax({
                type: "POST",
                url: that.path + "goods/searchByCate",
                data:`category_name=${item_title}`,
                cache: false,
                success: function (msg) {
                    let goods = [];
                    for(let i = 0;i < msg.goods.length;i++){
                        goods.push({
                            id:msg.goods[i].id,
                            title:msg.goods[i].goods_name,
                            icon:msg.goods[i].pic,
                            stock:msg.goods[i].inventory,
                            num:0
                        });
                    }
                    that.subcategorys = goods;
                }
            });
        },
        // 递归获取指定元素
        recursionNode:function(item){
            if(item.classList.contains("dib_item")){
                return item;
            }
            return this.recursionNode(item.parentElement);
        },
        // 取消子类目
        cancelChildren:function () {
            let that = this;
            that.childItemFlag = false;
        },
        // 判断子类目的输入框或者内容是否为空
        hasEmpty:function () {
            let children = this.childrenItemInfo;
            if(children.title == "" || children.stock == "" || children.icon == ""){
                return false;
            }
            return true;
        },
        /*搜索关键字*/
        searchVal_input:function () {
            console.log(depart_stock.searchVal);
        },
        /*
        * 获取父类目
        * */
        getParentData:function () {
            let that = this;
            let promise = new Promise(function (resolve,reject) {
                $.ajax({
                    type: "GET",
                    url: that.path + "goods/getAllCate",
                    data:``,
                    cache: false,
                    success: function (msg) {
                        let parent_items = [];
                        for(let i = 0;i < msg.length;i++){
                            parent_items.push({
                                id:msg[i].category_id,
                                title:msg[i].category_name
                            });
                        }
                        that.parent_items = parent_items;
                        resolve(parent_items[0]);
                    }
                });
            });
            promise.then(function (msg) {
                that.getSonData(msg);
            });
        },
        /*
        * 获取子项数据
        * */
        getSonData:function (son_item) {
            let that = this;
            $.ajax({
                type: "POST",
                url: that.path + "goods/searchByCate",
                data:`category_name=${son_item.title}`,
                cache: false,
                success: function (msg) {
                    let goods = [];
                    for(let i = 0;i < msg.goods.length;i++){
                        goods.push({
                            id:msg.goods[i].id,
                            title:msg.goods[i].goods_name,
                            icon:msg.goods[i].pic,
                            stock:msg.goods[i].inventory,
                            num:0
                        });
                    }
                    that.subcategorys = goods;
                    that.selectedParentId = son_item.id;
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
    }
});
/*
* 初始化数据
* */
function initData(){
    /*
    * 父类目数据初始化
    * */
    depart_stock.getParentData();

    window.onresize = function(){
        depart_stock.setHeight();
    }
    depart_stock.setHeight();
}
$(document).ready(function () {
    initData();
});