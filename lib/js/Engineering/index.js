let index = new Vue({
    el:"#index",
    data:{
        /*
        * 当前选择的左侧列表项
        * */
        selected_work:'1001',
        /*
        * 页面元素
        * */
        iframe_win:null,
        /*
        * 左侧列表(个人工作台)
        * */
        work_lists:[
            {
                 id:'1001',
                 title:'项目查看',
                 url:'assemblys/project_view.html'
            },
            {
                id:'1002',
                title:'项目进度',
                url:'assemblys/project_progress.html'
            },
            {
                id:'1003',
                title:'付款及报险',
                url:'assemblys/project_Insurance.html'
            },
            {
                id:'1004',
                title:'资信文件',
                url:'assemblys/project_credit.html'
            },
            {
                id:'1005',
                title:'优秀项目',
                url:'assemblys/project_excellent.html'
            },
            {
                id:'1006',
                title:'报销',
                url:'assemblys/project_reimbursement.html'
            }
        ]
    },
    methods:{
        // 左侧列表项点击事件
        click_list_item:function (item_id,index) {
            let that = this;
            that.selected_work = item_id;
            that.update_url_page(index);
        },
        // 左侧列表悬停事件
        over_list_item:function (item_id,index) {
            let that = this;
            if(item_id != that.selected_work){
                let over_item = $(".blm_main_item")[parseInt(index)];
                over_item.style.backgroundColor = "#fff";
                over_item.style.color = "#5584EA";
            }
        },
        // 左侧列表离开事件
        out_list_item:function (item_id,index) {
            let that = this;
            if(item_id != that.selected_work){
                let over_item = $(".blm_main_item")[parseInt(index)];
                over_item.style.backgroundColor = "#F8F8F8";
                over_item.style.color = "#5B5B5B";
            }
        },
        // 修改引入页面地址
        update_url_page:function (index) {
            let that = this;
            if(!that.iframe_win){
                that.iframe_win = document.getElementsByClassName("iframe_win")[0];
            }
            that.iframe_win.src = that.work_lists[index].url;
        }
    }
});