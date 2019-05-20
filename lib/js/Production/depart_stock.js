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
        seletedParentTitle:'',
        /*
        * 库存父类目
        * */
        parent_items:[],
        /*
        * 父类目创建窗口是否展示
        * */
        parentItemFlag:false,
        /*
        * 父类目修改
        * */
        parentItemUpdateFlag:false,
        /*子类目创建窗口是否展示*/
        childItemFlag:false,
        /*子类目修改*/
        childItemUpdateFlag:false,
        /*
        * 创建的类目信息或者是显示的类目信息
        * */
        parentItemInfo:{
            id:'',
            title:''
        },
        /*
        * 创建的子类目信息或者是显示的类目信息
        * */
        childrenItemInfo:{
            id:'',
            title:'',
            unit:'',
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
            if(that.parentItemInfo.title != ''){
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
            that.seletedParentTitle = item_title;
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
                            unit:msg.goods[i].unit,
                            num:0
                        });
                    }
                    that.subcategorys = goods;
                }
            });
        },
        /*
        * 点击子项显示修改
        * */
        clickItem:function(item_id,event){
            let that = this;
            let target = event.target;
            if(!target.classList.contains("close_item") && !target.classList.contains("db_btn") && !target.classList.contains("operat_reduce") && !target.classList.contains("operat_add")){
                that.childItemUpdateFlag = true;
                that.childrenItemInfo.id = item_id;
                that.subcategorys.forEach((item,index,arr) => {
                    if(item.id == item_id){
                        that.childrenItemInfo = {
                            id:item_id,
                            title:item.title,
                            unit:item.unit,
                            stock:item.stock,
                            icon:item.icon,
                            oldTitle:item.title
                        };
                    }
                });
            }

            // that.childrenItemInfo = {
            //     id:"",
            //     title:"",
            //     unit:"",
            //     stock:"",
            //     icon:""
            // };
            // 修改数据

        },
        /*
        * confirmUpdate 确认修改
        * */
        confirmUpdate:function(){
           let that = this;
           that.childItemUpdateFlag = false;
            $.ajax({
                type: "POST",
                url: that.path + "goods/alterInf",
                data:JSON.stringify({
                    oriname:that.childrenItemInfo.oldTitle,
                    rename:that.childrenItemInfo.title,
                    unit:that.childrenItemInfo.unit,
                    inventory:that.childrenItemInfo.stock,
                    picture:that.childrenItemInfo.icon
                }),
                cache: false,
                dataType: "json",
                contentType: "application/json",
                success: function (msg) {
                    that.subcategorys.forEach((item,index,arr) => {
                        if(item.id == that.childrenItemInfo.id){
                            item.id = that.childrenItemInfo.id;
                            item.title = that.childrenItemInfo.title;
                            item.unit = that.childrenItemInfo.unit;
                            item.stock = parseInt(that.childrenItemInfo.stock);
                            item.icon = that.childrenItemInfo.icon;
                        }
                    });
                    that.childrenItemInfo = {
                        id:"",
                        title:"",
                        unit:"",
                        stock:"",
                        icon:""
                    };

                }
            });
        },
        /*
        * 取消修改
        * */
        cancelUpdate:function(){
            let that = this;
            that.childItemUpdateFlag = false;
            that.childrenItemInfo = {
                id:'',
                title:'',
                unit:'',
                stock:'',
                icon:''
            }
        },
        /*
        * 双击修改
        * */
        dbl_update:function(id,title){
            let that = this;
            that.parentItemUpdateFlag = true;
            that.parentItemInfo = {
                id:id,
                title:title,
                oldTitle:title
            };
        },
        /*
        *确认父类目修改
        * */
        confirmParentUpdate:function(){
            let that = this;
            that.parentItemUpdateFlag = false;
            $.ajax({
                type: "POST",
                url: that.path + "goods/changeCate",
                data:JSON.stringify({
                    oriname:that.parentItemInfo.oldTitle,
                    rename:that.parentItemInfo.title
                }),
                cache: false,
                dataType: "json",
                contentType: "application/json",
                success: function (msg) {
                    console.log(msg);
                    that.parent_items.forEach((item,index,arr) => {
                        if(item.id == that.parentItemInfo.id){
                            item.title = that.parentItemInfo.title;
                        }
                    });
                    that.parentItemInfo = {
                        id:"",
                        title:"",
                        oldTitle:""
                    };
                }
            });
        },
        /*
        * 取消父类目修改
        * */
        cancelParentUpdate:function(){
            let that = this;
            that.parentItemUpdateFlag = false;
        },
        /*
        * 删除父类目
        * */
        delParentUpdate:function(){
            let that = this;
            that.parentItemUpdateFlag = false;
            let confrimA = confirm("确认删除当前类目吗？");
            if(confrimA){
                $.ajax({
                    type: "DELETE",
                    url: that.path + "goods/deleteCateGoryById/" + that.selectedParentId,
                    data:"",
                    cache: false,
                    dataType: "json",
                    contentType: "application/json",
                    success: function (msg) {
                        let result = msg.result;
                        if(result == "success"){
                            alert("删除成功!");
                            that.getParentData();
                        }else if(result == "fail"){
                            alert("当前类目下存在商品，删除失败!!!");
                        }
                    }
                });
            }
        },
        // 减少库存
        reduceChildStock:function (item_id) {
            let that = this;
            for(let i = 0;i < that.subcategorys.length;i++){
                if(that.subcategorys[i].id == item_id){
                    that.subcategorys[i].num--;
                }
            }
        },
        // 添加库存
        addChildStock:function (item_id) {
            let that = this;
            for(let i = 0;i < that.subcategorys.length;i++){
                if(that.subcategorys[i].id == item_id){
                    that.subcategorys[i].num++;
                }
            }
        },
        // 确认添加库存
        confirmAdd:function (item_id) {
            let that = this;
            for(let i = 0;i < that.subcategorys.length;i++){
                if(that.subcategorys[i].id == item_id){
                    that.subcategorys[i].stock += that.subcategorys[i].num;
                    that.subcategorys[i].num = 0;
                    if(that.subcategorys[i].stock < 0){
                        that.subcategorys[i].stock = 0;
                    }
                    that.updateStock(item_id,that.subcategorys[i].stock);
                }
            }
        },
        //修改库存
        updateStock:function(item_id,num){
            let that = this;
            $.ajax({
                type: "POST",
                url: that.path + "goods/changeInventory",
                data:`goods_id=${item_id}&changeNum=${num}`,
                cache: false,
                success: function (msg) {
                    // console.log(msg);
                }
            });

        },
        // 选择产品图片
        chooseChange:function (e) {
            let that = this;
            let file = e.target.files[0];
            if(typeof FileReader != 'undefined') {
                let reader = new FileReader();
                let imgFile;
                reader.readAsDataURL(file);
                reader.onload = function (res) {
                    imgFile = res.target.result;
                    that.childrenItemInfo.icon = imgFile;
                }
            }else {
                let URL = window.URL || window.webkitURL;
                let imageURL = URL.createObjectURL(file);
                that.childrenItemInfo.icon = imageURL;
            }
            e.target.value = '';
        },
        // 删除图片
        del_icon:function () {
            let that = this;
            that.childrenItemInfo.icon = "";
        },
        // 点击新建子类目
        clickChildrenItem:function(){
            let that = this;
            that.childItemFlag = true;
        },
        // 创建子类目
        confirmChildren:function () {
          let that = this;
          if(that.hasEmpty()){
              that.createSonParent(that.childrenItemInfo);
              that.childItemFlag = false;
              alert("创建成功!");
          }else{
              alert("创建失败,请检查输入内容");
          }
        },
        // 创建子类目商品
        createSonParent:function(data_info){
            let that = this;
            let category;
            for(let i = 0;i < that.parent_items.length;i++){
                if(that.parent_items[i].id == that.selectedParentId){
                    category = that.parent_items[i].title;
                }
            }
            let data  = JSON.stringify({
                goods_name:data_info.title,
                pic:data_info.icon,
                unit:data_info.unit,
                category:category,
                inventory:parseInt(data_info.stock)
            });
            $.ajax({
                type: "POST",
                url: that.path + "goods/newGoods",
                data:data,
                cache: false,
                dataType: "json",
                contentType: "application/json",
                success: function (msg) {
                    let arr = that.parent_items;
                    for(let i = 0;i < arr.length;i++){
                        if(that.selectedParentId == arr[i].id){
                            that.getSonData(arr[i]);
                        }
                    }
                    that.childrenItemInfo = {
                        id:'',
                        title:'',
                        unit:'',
                        stock:'',
                        icon:''
                    }
                }
            });
        },
        //鼠标悬停
        mouseover_item:function(event){
            let that = this;
            let item = event.target;
            let zd_item = that.recursionNode(item);
            let icon = zd_item.getElementsByClassName("close_item")[0];
            icon.style.display = "block";
        },
        //鼠标离开
        mouseout_item:function(event){
            let that = this;
            let item = event.target;
            let zd_item = that.recursionNode(item);
            let icon = zd_item.getElementsByClassName("close_item")[0];
            icon.style.display = "none";
        },
        // 删除子项
        close_item:function(item_id,item_icon){
            let that = this;
            let arr = item_icon.split("\/");
            let tc_win = confirm("确认删除子项???");
            if(tc_win){
                let data = JSON.stringify({
                    'goods_id':item_id,
                    'name':arr[arr.length-1]
                });
                $.ajax({
                    type: "POST",
                    url: that.path + "goods/deleteGoods",
                    data:data,
                    cache: false,
                    dataType: "json",
                    contentType: "application/json",
                    success: function (msg) {
                        let data = [];
                        that.subcategorys.forEach((item,index)=>{
                            if(item.id != item_id){
                                data.push(item);
                            }
                        });
                        that.subcategorys = data;
                    }
                });
            }
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
            if(children.title == "" || children.stock == "" || children.icon == "" || children.unit == ""){
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
                        that.seletedParentTitle = parent_items[0].title;
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
                            unit:msg.goods[i].unit,
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
// 设置灰色屏幕尺寸
function setGrayBackSize(){
    let win_size = tools.getViewportOffset();
    let gray_back = document.getElementsByClassName("gray_back")[0];
    if(gray_back){
        gray_back.style.width = win_size.w + "px";
        gray_back.style.height = win_size.h + "px";
    }
}
/*
* 初始化数据
* */
function initData(){
    /*
    * 设置灰色屏幕尺寸
    * */
    setGrayBackSize();
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