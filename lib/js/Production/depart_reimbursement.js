let reimbursement = new Vue({
    el:"#reimbursement",
    data:{
        /*
        * 搜索项
        * */
        searchVal:'',
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
        /*
        * 接口地址
        * */
        path:'http://www.youguangchina.cn/YuHang/',
    },
    methods:{
        /*搜索关键字*/
        searchVal_input:function () {
            console.log(reimbursement.searchVal);
        },
        /*上传报销文件*/
        upload_reimburse:function () {
            let that = this;
            let flag = confirm("确认上传报销申请吗???");
            if(flag){
                let ps = document.getElementsByClassName("simditor-body")[0].textContent;
                that.reimbursements_obj.description = ps;
                if(that.reimbursements_obj.title != '' && that.reimbursements_obj.name != '' && that.reimbursements_obj.upload_icon.length > 0  && that.reimbursements_obj.explanation != '' ){
                    $.ajax({
                        type: "POST",
                        url: that.path + "reimb/addReimb",
                        data:JSON.stringify({
                            "project_id":``,
                            "title":`${that.reimbursements_obj.title}`,
                            "name":`${that.reimbursements_obj.name}`,
                            "pic":that.reimbursements_obj.upload_icon,
                            "explanation":`${that.reimbursements_obj.description}`
                        }),
                        cache: false,
                        dataType: "json",
                        contentType: "application/json",
                        success: function (msg) {
                            console.log(msg);
                            alert("报销信息上传成功!");
                        }
                    });
                }else{
                    alert("请检查报销内容是否完整!!!");
                }
            }

        }
        ,
        /*
        * 取消
        * */
        cancel_reimburse:function(){
            let that = this;
            that.reimbursements_obj = {
                title:'',
                name:'',
                upload_icon:[],
                description:''
            };
            $(".simditor-body").html("")
        },
        /*图片文件上传*/
        changeIconFile:function (e) {
            let that = this;
            let files = e.target.files;
            if(typeof FileReader != 'undefined') {
                for(let i = 0;i < files.length;i++){
                    let reader = new FileReader();
                    let imgFile;
                    reader.readAsDataURL(files[i]);
                    reader.onload = function (res) {
                        imgFile = res.target.result;
                        that.reimbursements_obj.upload_icon.push(imgFile);
                    }
                }
            }else {
                let URL = window.URL || window.webkitURL;
                for(let i = 0;i < files.length;i++){
                    let imageURL = URL.createObjectURL(files[i]);
                    that.reimbursements_obj.upload_icon.push(imageURL);
                }

            }
            e.target.value = '';
            console.log(that.reimbursements_obj);
        },
        /*
        * hover icon
        * */
        overIcon:function (event) {
            let that = this;
            let target_val = event.target.parentElement.getAttribute("data-val");
            that.hover_icon = target_val;
        },
        /*
        * out icon
        * */
        outIcon:function (event) {
            let that = this;
            that.hover_icon = "-1";
        },
        /*
        * 删除图片
        * */
        clickClose:function (index1,event) {
            let that = this;
            let arrs = [];
            that.reimbursements_obj.upload_icon.forEach((item,index,arr) => {
                if(index != index1){
                    arrs.push(item);
                }
            });
            that.reimbursements_obj.upload_icon = arrs;
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
function initReimbursement() {
    // 文本域脚本初始化
    let editor = new Simditor({   textarea: $('#editor') });

    window.onresize = function(){
        reimbursement.setHeight();
    }
    reimbursement.setHeight();


}
tools.domReady(initReimbursement);
