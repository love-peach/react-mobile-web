/**
 *


 <script type="text/javascript">
 var _sxfmt = _sxfmt || [];
 (function () {
            var ma = document.createElement('script');
            ma.bpointConf="100_stageloan-page";
            ma.type = 'text/javascript';
            ma.async = true;
            ma.src = "http://localhost:8080/js/sxf-bpoint.js";
            ma.setAttribute("bpointConf","100_stageloan-page");
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ma, s);
        })();
 </script>


 *
 *
 */

// is who come
(function () {
  var _sxfbp = function () {

    var w = window, d = document, s = 'script';

    this.BP_EventName ="_SXFBP_EVENT_DEAL";

    this._option = {
      stackSize: 10,//信息存储栈大小 栈满 则打包 转存到待发送队列
      stackTime: 3,//信息存储栈时间（单位 秒） 定时扫描，栈有数据就发

      queueSize: 20,//待发送队列大小
      queueTime: 5,//待发送队列 自动扫描发送时间



      sxfua : "sxf",//随行付自定义的ua

      uid : -1,//登录用户的所在系统的给出的用户id 不设置为-1 表示未登录系统

      isDebug : true, //是否开启日志输出 true 开启日志 false 关闭日志

      debugLevel : 3 //日志输出级别 0 无输出 1 error 2 warn 3 info 4 debug

    };

    this._url = null;
    this._bpUrl = "http://bpoint.vbillbank.com/bp/d.gif";//"http://172.16.154.77:8080/bp/d.gif",//"http://localhost:8080/bp/d.gif"bpoint-rc.vbillbank.com,//数据发送地址
    this._testUrl = "http://bpoint-rc.vbillbank.com/bp/d.gif";
    this._domainFilter = ["test","rc","172","192","localhost","127"];
    this._infoStack = [];//信息存储栈 收集的信息将暂存到这里 等待打包移动到待发送队列

    this._waitSendQueue = [];//待发送队列，存储多个信息存储栈帧 等待被发送给后台

    this._queueSending = false;//是否在队列递归发送栈帧

    this._infoConf = { ver:"0.1.1"};//环境信息

    this._scanStackIntervalId = null;//stack 扫描定时器的id

    this._scanWaitSendQqueueIntervalId = null;//WaitSendQqueue 扫描定时器的id

    this._loadFN = [];//用于存储调用者需要在插件load时的执行的fn


    /**
     * 指定key 获取配置参数
     * sxfbp.setOption(key);
     *
     * 不指定key，获取配置参数对象，由组件配置参数对象复制出来的副本
     * 这里返回复制出来的副本，是为了避免直接返回参数对象，参数对象被调用方 增删等修改参数对象
     * sxfbp.setOption(key,value);
     */

    this.getOption = function (key) {
      if (key != null) {
        return this._option["_" + key];
      } else {
        var dop = this._option;
        var op = {};
        for (var k in dop) {
          op[k] = dop[k]
        }
        return op;
      }

    };
    /**
     * 对象形式设置参数
     * sxfbp.setOption({option});
     *
     * key-value形式设置参数
     * sxfbp.setOption(key,value);
     */
    this.setOption = function () {
      if (arguments.length == 2) {

        var key = arguments[0];
        var value = arguments[1];
        if (this._option[key] !== undefined) {
          this._option[key] = value;
        }



      } else if (arguments.length == 1) {
        /**
         * 使用调用方给出的参数 替换默认参数
         * @type {{stackSize: number, stackTime: number, queueSize: number, queueTime: number}|*}
         */
        var dop = this._option;
        var op = arguments[0];
        for (var k in op) {
          if(op[k]){
            dop[k] = op[k];
          }
        }

      }

      _setUID(this._option.uid);

    };

    /**
     * 设置存在埋点信息的栈的大小
     * 调用此方法，如果栈的数据量>stackSize，则触发栈帧入待发送队列
     * @param stackSize 栈的大小 大于0的整数 如果是小数或者字符串，将先使用parseInt处理
     */
    this.setStackSize = function (stackSize) {
      stackSize = parseInt(stackSize)
      if(stackSize<1){
        return;
      }
      this._option.stackSize = stackSize;

      if (this._infoStack.length >= stackSize) {
        // 如果已经满了 则送入待发送队列
        this.stack2queue();
      }
    };


    /**
     * 设置对埋点信息栈扫描的定时时间，
     * 调用此方法，会对栈扫描的定时器进行重置
     * 栈扫描的定时处理：定时扫描埋点信息栈，栈里有数据，则进行强制清栈操作
     * @param stackTime 栈扫描的定时时间（单位 秒） 大于等于1秒，参数值小于1 则为无效调用
     */
    this.setStackTime = function (stackTime) {
      this._option.stackTime = stackTime;

      _scanStack(stackTime);


    };

    this.setQueueSize = function (queueSize) {
      this._option.queueSize = queueSize;
    };

    this.setQueueTime = function (queueTime) {
      this._option.queueTime = queueTime;
      _scanWaitSendQqueue(queueTime);
    };


    this._stackSave = function (infoObj) {
      this._infoStack.push(infoObj);
      //检查信息栈是否已经满了
      if (this._infoStack.length >= this._option.stackSize) {
        // 如果已经满了 则送入待发送队列
        this.stack2queue();
      }
    };

    this._queueSave = function (is) {
      this._waitSendQueue.push(is);

      if(localStorage){
        localStorage.setItem("_bp_wqueue", JSON.stringify(this._waitSendQueue));
      }
    };

    /**
     * 收集的信息入栈
     * @param infoObj
     *
     *  {
         *      oc : //业务编码 opeCode
         *      ac ：//行为编码 actionCode
         *      v ：//行为结果 value 例如 输入框产生的值
         *      ed:  //扩展信息 json
         *  }
     *
     */
    this.push = function (infoObj) {
      if(infoObj){
        infoObj.dateTime = new Date().getTime();
        _log("push success",3)
        _log(infoObj)
        this._stackSave(infoObj)
      }

    };



    /**
     * 栈帧入队列  等待被发送
     */
    this.stack2queue = function () {
      var is = this._infoStack;

      if(_sxfmt && _sxfmt.length>0){
        _log("_sxfmt.length="+_sxfmt.length);
        _log(_sxfmt);
        is = is.concat(_sxfmt);
        window._sxfmt = [];
      }

      _log("infoStack length="+is.length);
      if (is.length > 0) {
        _log(is);

        this._queueSave(is);
        this._infoStack = [];
      }


    };

    /**
     * 发送队列里最老的栈帧
     */
    this.sendOldestStack = function () {

      var stack = this._waitSendQueue.pop();
      if(localStorage){
        localStorage.setItem("_bp_wqueue", JSON.stringify(this._waitSendQueue));
      }

      _log("send stack(queue pop):");
      _log(stack);

      var sendData = {};
      sendData.ic = this._infoConf;
      sendData.il = stack;

      //数据发送
      //发送栈帧+环境配置信息
      _sendByImg({data:sendData});
    };

    this.send = function () {
      if(this._waitSendQueue.length == 0 || this._queueSending){
        return;
      }

      this._send();
    }

    /**
     * 将队列的栈帧都间隔递归发送出去
     */
    this._send = function () {
      _log("start send")
      _log("waitSendQueue length="+this._waitSendQueue.length)
      if(this._waitSendQueue.length == 0){

        this._queueSending = false;
        return;
      }

      this._queueSending = true;
      setTimeout(function () {
        _SXFBP.sendOldestStack();
        _SXFBP._send();
      },500);
    };




    /**
     * 封装系统日志输出，便于控制日志输出的开启关闭
     * @param mes 日志内容
     * @param level 日志级别
     * @private
     */
    var _log = function (mes,level) {
      var isDebug = _SXFBP._option.isDebug;
      var debugLevel = _SXFBP._option.debugLevel;
      level = level || 4;
      if(isDebug && level<=debugLevel){
        console.log(mes);
      }
    }

    this.log = function (mes,level) {
      _log(mes,level);
    }

    /**
     * 扫描信息栈中是否有数据 有数据 则将数据栈移入队列
     * @param t
     * @private
     */
    var _scanStack = function (t) {
      if(_SXFBP && (t!=null && t>=1)){
        var id = _SXFBP._scanStackIntervalId;
        if(id!=null){//如果已经存在定时器 需要先删除此定时，再创建新的定时器，防止出现重复定时器创建，最终导致内存泄露
          clearInterval(id);
        }
        id = setInterval(function () {
          if(_SXFBP){
            _log("scanStack",4);
            _SXFBP.stack2queue();
          }
        },t*1000);
        _SXFBP._scanStackIntervalId = id;
      }else{
        _log("埋点内置对象丢失,栈扫描器创建失败",1);
        throw new ReferenceError("埋点内置对象丢失,栈扫描器创建失败");
      }
    };

    var _scanWaitSendQqueue = function (t) {
      if(_SXFBP && (t!=null && t>=1)){
        var id = _SXFBP._scanWaitSendQqueueIntervalId;
        if(id!=null){//如果已经存在定时器 需要先删除此定时，再创建新的定时器，防止出现重复定时器创建，最终导致内存泄露
          clearInterval(id);
        }
        id = setInterval(function () {
          if(_SXFBP){
            _log("scanWaitSendQqueue",4);
            _SXFBP.send();
          }
        },t*1000);
      }else{
        _log("埋点内置对象丢失,队列扫描器创建失败",1);
        throw new ReferenceError("埋点内置对象丢失,队列扫描器创建失败");
      }

    }




    this.getPageInfo = function () {
      var params = {};
      //Document对象数据
      if (document) {
        params.domain = document.domain || ''; //获取域名
        params.url = document.URL || '';       //当前Url地址
        params.referrer = document.referrer || '';       //当前页面的来源Url地址
        params.title = document.title || '';

      }
      //Window对象数据
      if (window && window.screen) {
        params.sh = window.screen.height || 0;    //获取显示屏信息
        params.sw = window.screen.width || 0;
        params.cd = window.screen.colorDepth || 0;
      }
      //navigator对象数据
      if (navigator) {
        params.lang = navigator.language || '';    //获取所用语言种类
      }

      var memory = performance.memory || {};
      params.memory = {jsHeapSizeLimit:memory.jsHeapSizeLimit,totalJSHeapSize:memory.totalJSHeapSize,usedJSHeapSize:memory.usedJSHeapSize};
      params.timing = performance.timing;
      params.navigation = performance.navigation;

      var d = params.domain;
      this._url=this._bpUrl;
      if(d){
        d = d.split(".");
        d = d[0];
        d = d.toUpperCase();
        var list = this._domainFilter;
        for(var i=0,s,l=list.length;i<l;i++){
          s = list[i];
          if(d.indexOf(s.toUpperCase())>-1){
            this._url=this._testUrl;
            break;
          }
        }
      }

      return params;
    };

    /**
     * 上一个页面的历史数据提交
     * @private
     */
    var _oldDataCheck = function () {
      if(localStorage){
        var oldData = localStorage.getItem("_bp_wqueue");
        if(oldData!=null && oldData!=""){
          try{
            oldData = eval('(' + oldData + ')');
            if(oldData instanceof Array && oldData.length>0){

              var sendData = {};
              sendData.ic = localStorage.getItem("_bp_infoConf");
              sendData.ic = eval('(' + sendData.ic + ')');

              for(;oldData.length>0;){
                sendData.il = oldData.pop();
                //数据发送
                //发送栈帧+环境配置信息
                _sendByImg({data:sendData});
              }

            }
          }catch (e) {

          }

          localStorage.removeItem("_bp_wqueue");

        }
      }
    };

    //打开页面的时间
    this._pageStart = function (){

      _log(window.performance);
      _log(window);
      var time = window.performance.timing;
      _log(time.domComplete-time.navigationStart);

      var pi = this.getPageInfo();

      var infoObj = {
        oc : 2,// 页面业务
        ac : 1,// 打开页面
        v : "",
        ed : {pi:pi}//扩展信息 这里存页面对象的一些信息
      }
      this.push(infoObj);

    };

    //获取随行付自定义的页面ua
    var _getSXFUA = function () {
      return _SXFBP.getOption("sxfua");
    };

    //获取前端sessionId
    var _getSessionId = function () {
      var sid = sessionStorage.getItem("_SXFBP_SESSION_ID");
      var l = _SXFBP.guid.split("-");
      if(sid==null){
        sid = l[0];
        sessionStorage.setItem("_SXFBP_SESSION_ID",sid);
      }else{
        l[0] = sid;
        _SXFBP.guid = l.join("-");
      }

      return sid;
    };

    var _guid = function () {
      function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }

      var guid = [];
      guid.push(S4()+S4());
      guid.push(S4());
      guid.push(S4());
      guid.push(S4());
      guid.push(S4()+S4()+S4());

      return guid;
    }

    var _getBPUID = function () {
      var bpuid = sessionStorage.getItem("_SXFBP_UID");

      if(bpuid==null){
        bpuid = _guid().join("-");
        sessionStorage.setItem("_SXFBP_UID",bpuid);
      }
      return bpuid;
    };

    var _getURL = function () {
      return _SXFBP._url;
    }


    var _getUID = function () {
      var uid = _SXFBP._option.uid;
      if(uid!=null && uid!=-1){
        sessionStorage.setItem("_SXF_UID",uid);
      }else{
        uid =sessionStorage.getItem("_SXF_UID");
        if(uid!=null && uid!=-1){
          _SXFBP._option.uid = uid;
        }else{
          uid = -1;
        }
      }


      return uid;
    };

    var _setUID = function (uid) {
      sessionStorage.setItem("_SXF_UID",uid);
      _SXFBP._option.uid = uid;
      _SXFBP._infoConf.uid = uid;
      _SXFBP.saveInfoConf();
    }

    //获取页面id
    var _getPageId = function () {

    };

    /**
     * 初始化环境信息
     *
     * 渠道信息
     * 产品信息
     * H5 原生 版本信息
     * UA 定制化UA 信息
     *
     * 会话ID
     * 用户标识
     * 页面标识
     *
     *
     * <script src="js/sxf-bpoint.js" bpointConf="{渠道}_{产品}_{页面id}"></script>
     */

    this._dataConfInit = function () {
      var sd = d.getElementsByTagName(s);
      var confStr;
      var attrName = "bpointConf";
      var pageId = "pageId";
      for (var i=0,o,len=sd.length;i<len;i++){
        o = sd[i];
        if(o.hasAttribute(attrName)){
          confStr = o.getAttribute(attrName);
          pageId = o.getAttribute(pageId);
          break;
        }
      }

      if(pageId==null || pageId=="pageId"){
        pageId = d.getElementsByTagName("title")[0].innerHTML;
      }

      var guid = _guid();
      this.guid = guid.join("-");

      var infoConf = this._infoConf;

      if(confStr){
        confStr = confStr.split("_");
        infoConf.cid = confStr[0];//渠道id channelId
        infoConf.pid = confStr[1];//产品id productId
      }

      infoConf.SXF_UA = _getSXFUA();//UA 含ua 客户端版本等

      infoConf.sid = _getSessionId();//会话id sessionId
      infoConf.bpuid = _getBPUID();//用户id

      infoConf.uid = _getUID();

      infoConf.pgid =  pageId;//页面id pageId
      infoConf.qid = _guid().join("-");//页面此次请求的id



      this.saveInfoConf();

      //页面执行后

    };


    this.saveInfoConf = function () {
      if(localStorage){
        localStorage.setItem("_bp_infoConf",JSON.stringify(this._infoConf));
      }
    }





    /**
     * 通过图片的方式发送数据
     * @param pjson
     * @private
     */
    var _sendByImg = function (pjson) {
      if(_SXFBP.img==null){
        _SXFBP.img = new Image(1, 1);
      }

      var url = _SXFBP._url;
      var dataJson = JSON.stringify(pjson.data);


      _log("sendByImg:",3);
      _log(dataJson);
      //return;
      _SXFBP.img.src =  url+"?args=" + encodeURIComponent(dataJson);


    };

    this.trigger = function (dom,eventName) {
      // 手动触发事件
      if (dom.fireEvent){
        dom.fireEvent(eventName);
      }
      else{
        ev = document.createEvent("HTMLEvents");
        ev.initEvent(eventName, false, true);
        dom.dispatchEvent(ev);
      }
    };

    this.EventDeal = {};


    this.addEventDeal = function (eventDealConf) {
      if(eventDealConf){
        for (var k in eventDealConf) {
          this.EventDeal[k] = eventDealConf[k];
        }
      }
    };


    this.addLoadFN = function (fn) {
      if (typeof fn == "function"){
        this._loadFN.push(fn);
      }
    }


    this.bind  = function (dom,key) {
      if(dom==null || key==null){
        return;
      }

      if(typeof dom == "string"){
        dom = d.querySelector(dom);
      }

      /* dom.removeEventListener(this.BP_EventName);
       dom.addEventListener(this.BP_EventName,function () {
           _log("_SXFBP_mobile_focus");

           var infoObjList = this._bp_infoObj_list;

           if(infoObjList!=null && infoObjList.length>0){
               for(;infoObjList.length>0;){
                   SXFBP.push(infoObjList.pop());
               }
           }
       });*/

      var fn = this.EventDeal[key];
      if(fn){
        fn(dom)
      }

    };




    this._loadinit = function () {

      this._dataConfInit();
      this._pageStart();
      _oldDataCheck();
      _scanStack(this._option.stackTime);
      _scanWaitSendQqueue(this._option.queueTime);

      var fnlist = this._loadFN
      for(var i=0,fn,len=fnlist.length;i<len;i++){
        fn = fnlist[i];
        fn.call(this);
      }
    };

    this._init = function () {

      w.addEventListener('load',function(e){
        _log(" _SXFBP._loadinit()",3);
        _SXFBP._loadinit();
      });

    };

    this._init();

    /**
     * 重新初始化
     * 考虑到react就是一个页面多个帧
     * 需要在react多帧切换时 主动调取吃方法
     */
    this.reInit = function () {
      _SXFBP._loadinit();
    }

  };

  window._sxfmt = window._sxfmt || [];

  window. _SXFBP = new _sxfbp();
  window.SXFBP = _SXFBP;
  /*try{
      export default SXFBP;
  }catch(e){

  }*/
  //window.SXFBP = window._SXFBP;






})()




