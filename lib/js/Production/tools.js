let tools = (function () {
    /*
    * 深度复制(适用于复杂度高的对象或者数组)
    * */
    function deepCopy(Origin, Target) {
        let [target, toStr, arrStr] = [Target || {}, Object.prototype.toString, `[object Array]`];
        for (let prop in Origin) {
            // 判断当前属性是否是当前的对象的属性
            if (Origin.hasOwnProperty(prop)) {
                // 判断当前属性不为null并且类型为object
                if (Origin[prop] !== `null` && typeof(Origin[prop]) == `object`) {
                    // 判断当前属性是对象还是数组
                    target[prop] = (toStr.call(Origin[prop]) == arrStr ? [] : {});
                    deepCopy(Origin[prop], target[prop]);
                } else {
                    target[prop] = Origin[prop];
                }
            }
        }
        return target;
    }

    /**
     * 数组去重(修改数组原型上的去重方法)
     * */
    Array.prototype.unique = function () {
        // 对象/当前的数组长度/需要返回的新数组
        let [temp, len, newArr] = [{}, this.length, []];
        for (let i = 0; i < len; i++) {
            // 当当前对象不存在这个属性时
            if (!temp[this[i]]) {
                temp[this[i]] = `arr${i}`;
                newArr.push(this[i]);
            }
        }
        return newArr;
    }
    /*
    * 区分元素节点和非元素节点(返回元素节点)
    * */
    Element.prototype.MyElements = function () {
        let [elements, len, elementArr] = [this.childNodes, this.childNodes.length, []];
        for (let i = 0; i < len; i++) {
            if (elements[i].nodeType == 1) {
                elementArr.push(elements[i]);
            }
        }
        return elementArr;
    }
    /**
     * insertAfter:在元素指定的子元素后方添加新的元素节点(insertBefore)
     * */
    Element.prototype.insertAfter = function (targetNode, afterNode) {
        let nextElement = afterNode.nextElementSibling;
        if (nextElement == null) {
            this.appendChild(targetNode);
        } else {
            this.insertBefore(targetNode, nextElement);
        }
    }

    /*
    * 返回数据类型
    * */
    function type(target) {
        let [ret, template] = [typeof target, {
            "[object Number]": "number-object",
            "[object Boolean]": "boolean-object",
            "[object String]": "string-object",
            "[object Object]": "object",
            "[object Array]": "array"
        }];
        if (ret === null) {
            return `null`;
        } else if (ret === `object`) {
            let attr = Object.prototype.toString.call(target);
            return template[attr];
        } else {
            return ret;
        }
    }

    /*
    * 圣杯模式(继承)
    * */
    let inherit_grail = (function () {
        function F() {
        }

        return function (origin, target) {
            F.prototype = origin.prototype;
            target.prototype = new F();
            target.prototype.constructor = target;
            target.prototype.uber = origin.prototype;
        }
    }());

    /*
    * 窗口滚动条:
    * IE8以及IE8以下不兼容
    * window.pageXOffset  横向滚动条滚动距离
    * window.pageYOffset  竖向滚动条滚动距离
    * 可兼容的有:
    * document.body.scrollLeft
    * document.body.scrollTop
    * document.documentElement.scrollLeft
    * document.documentElement.scrollTop
    *  兼容浏览器的滚动距离函数(获取当前xy轴滚动多少距离)
    * */
    function getScrollOffset() {
        if (window.pageXOffset) {
            return {
                x: window.pageXOffset,
                y: window.pageYOffset
            };
        } else {
            return {
                x: document.body.scrollLeft + document.documentElement.scrollLeft,
                y: document.body.scrollTop + document.documentElement.scrollTop
            };
        }
    }

    /**
     * 获取浏览器可视区窗口的尺寸(宽高)
     * window.innerWidth/innerHeight
     * 上方 IE8以及IE8以下不兼容
     * document.documentElement.clientWidth/clientHeight
     * 标准模式下，任意浏览器都兼容(有<!DOCTYPE html>标签为标准模式)
     * document.body.clientWidth/clientHeight
     * 适用于怪异模式下的浏览器(无<!DOCTYPE html>标签为怪异模式)
     * 封装兼容性方法，返回浏览器视口尺寸getViewportOffset()
     * */
    function getViewportOffset() {
        if (window.innerWidth) {
            return {
                w: window.innerWidth,
                h: window.innerHeight
            };
        } else {
            if (document.compatMode == "BackCompat") {
                return {
                    w: document.body.clientWidth,
                    h: document.body.clientHeight
                };
            } else {
                return {
                    w: document.documentElement.clientWidth,
                    h: document.documentElement.clientHeight
                };
            }
        }
    }

    /*
    * 获取元素距离浏览器窗口的左上距离
    * offsetWidth 元素的宽度
    * offsetHeight 元素的高度
    * offsetTop 元素距离有定位父元素的顶部距离
    * offsetLeft 元素距离有定位父元素的左侧距离
    * offsetParent 元素的有定位最近的一个父级元素
    * 获取当前元素距离浏览器顶部或者左侧的距离
    * getScreenLeftAndTop
    * */
    Element.prototype.getScreenLeftAndTop = function () {
        let targetNodeParent = this.offsetParent,
            screenTop = this.offsetTop,
            screenLeft = this.offsetLeft;
        for (; ;) {
            console.log(targetNodeParent);
            if (targetNodeParent != null) {
                screenLeft += targetNodeParent.offsetLeft;
                screenTop += targetNodeParent.offsetTop;
                targetNodeParent = targetNodeParent.offsetParent;
            } else {
                break;
            }
        }
        return {
            screenLeft: screenLeft,
            screenTop: screenTop
        };
    }
    /*
    * 获取兼容css样式
    * getComputedStyle第二个参数 null为 正常元素  可以设置伪元素字符串获取伪元素样式表
    * */
    function getStyle(elem, prop) {
        if(window.getComputedStyle){
            return window.getComputedStyle(elem,null)[prop];
        }else{
            return elem.currentStyle[prop];
        }
    }
    /*
    * 封装兼容性的addEvent(设置元素事件)
    * */
    function addEvent(elem,type,handle){
         if(elem.addEventListener){
             elem.addEventListener(type,handle,false);
         }else if(elem.attachEvent){
             elem.attachEvent('on' + type,function () {
                 handle.call(elem);
             });
         }else{
             elem["on" + type] = handle;
         }
    }
    /*
    * 兼容IE=>阻止事件冒泡
    * */
    function stopBubble(event) {
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    }
    /*
    * (兼容)取消一些元素的默认事件
    * */
    function cancelHandler(event){
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue = false;
        }
    }
    /*
    * js异步加载并执行初始化的代码(页面加载完毕时执行)
    * 资源加载完毕之后执行
    * */
    function loadScript(url,callback){
           let script = document.createElement("script");
           script.type = "text/javascript";
           if(script.readyState){
              script.onreadystatechange = function () {
                  if(script.readyState == "complete" || script.readyState == "loaded"){
                        if(typeof(callback) == "string"){
                            eval(callback);
                        }else if(typeof(callback) == "function"){
                            callback();
                        }
                  }
              }
           }else{
               script.onload = function () {
                   if(typeof(callback) == "string"){
                       eval(callback);
                   }else if(typeof(callback) == "function"){
                       callback();
                   }
               }
           }
           script.src = url;
           document.head.appendChild(script);
    }
    /*
   *  document 解析完毕时执行
   * */
    function domReady(fn){
        if(document.addEventListener){
            document.addEventListener('DOMContentLoaded',function(){
                fn();
            },false);
        }else{
            /*监控资源情况，ie8及以下不支持addEventListener*/
            document.onreadystatechange=function(){
                /*dom加载完成的时候*/
                if(document.readyState=='complete'){
                    fn();
                }
            };
        }
    }
    /*
    创建 XMLHttpRequest 对象 兼容版(原生ajax)
    */
    function createXMLHttpRequest(){
        let xhr = null;
        if(window.XMLHttpRequest)
        {
            xhr = new XMLHttpRequest();
        }
        else
        {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xhr;
    }
    /*
    * 添加悬停事件并设置样式
    * */
    function setStyleByElements(elements,overHandler,outHandler) {
        for (let i = 0;i < elements.length;i++){
            (function (i) {
                elements[i].onmouseover = function () {
                    overHandler();
                }
                elements[i].onmouseout = function () {
                    this.style.backgroundColor = "transparent";
                    // 设置图片隐藏

                }
            }(i));
        }
    }
    /*
    * 将接口暴露
    * */
    return {
        deepCopy: deepCopy,
        type: type,
        inherit_grail: inherit_grail,
        getScrollOffset: getScrollOffset,
        getViewportOffset: getViewportOffset,
        getStyle:getStyle,
        addEvent:addEvent,
        stopBubble:stopBubble,
        cancelHandler:cancelHandler,
        loadScript:loadScript,
        domReady:domReady,
        createXMLHttpRequest:createXMLHttpRequest,
        setStyleByElements:setStyleByElements
    }
}());
