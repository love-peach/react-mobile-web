/**
 *
 *

 <script type="text/javascript">
     (function () {
            var ma = document.createElement('script');
            ma.type = 'text/javascript';
            ma.async = true;
            ma.src = "http://localhost:8080/js/sxf-bp-ev.js";
            ma.setAttribute("bpointConf","100_stageloan-page");
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ma, s);
        })();
 </script>


 *
 *
 *
 */

(function () {

  // window. _SXFBP = {push:function(){}};//new _sxfbp();
  // window.SXFBP = _SXFBP;
  // window.clearOldVal = function () {
  //   oldVal = '';
  // };
  // var oldVal, type;
  var _eventDealConf = {
    oldVal: '',
    type: '',
    inputFocusEVent: function (oc, v, dom) {
      var infoObj;
      if ( oc == 20 || oc == 22){
        let gid = dom.dataset.groupid;
        infoObj = {
          oc: oc, //业务编码 opeCode
          ac: 3, //行为编码 actionCode 获得焦点
          v: { v: v, gid }, //行为结果 value 例如 输入框产生的值
          ed: {}  //扩展信息 json
        };
      } else if (oc == 24 || oc == 25){
        infoObj = {
          oc: oc,
          ac: 3,
          v: '',
          ed: {}
        };
      } else {
        infoObj = {
          oc: oc,
          ac: 3,
          v: v,
          ed: {}
        };
      }
      SXFBP.push(infoObj);
    },
    inputBlurEVent: function (oc, v, dom) {
      var infoObj;
      if ( oc == 20 || oc == 22){
        let gid = dom.dataset.groupid;
        infoObj = {
          oc: oc,
          ac: 4,
          v: { v: v, gid },
          ed: {},
        };
      } else if (oc == 24 || oc == 25){
        infoObj = {
          oc: oc,
          ac: 4,
          v: '',
          ed: {}
        };
      } else {
        infoObj = {
          oc: oc, //业务编码 opeCode
          ac: 4, //行为编码 actionCode 获得焦点
          v: v, //行为结果 value 例如 输入框产生的值
          ed: {} //扩展信息 json
        };
      }
      SXFBP.push(infoObj);
    },
    inputFocus: function (obj) {
      obj.dom.addEventListener("focus", function () {
        _eventDealConf.oldVal = '';
        SXFBP.EventDeal.inputFocusEVent(obj.oc, this.value, obj.dom);
      });
    },
    inputBlur: function (obj) {
      obj.dom.addEventListener("blur", function () {
        _eventDealConf.oldVal = '';
        SXFBP.EventDeal.inputBlurEVent(obj.oc, this.value, obj.dom);
      });
    },
    // 输入框事件
    inputEvent: function (obj) {
      var newVal = obj.dom.value;
      var ac;
      if (_eventDealConf.oldVal === undefined) {
        _eventDealConf.oldVal = '';
      } else if (_eventDealConf.type != obj.oc) {
        _eventDealConf.oldVal = newVal;
      }
      // 判断是手写还是粘贴
      if ((newVal.length - _eventDealConf.oldVal.length) < 11) {
        ac = 5;
      } else if ((newVal.length - _eventDealConf.oldVal.length) >= 11) {
        ac = 6;
      };
      // 保存上一个值
      _eventDealConf.oldVal = obj.dom.value;
      // 对比是不是一个输入框
      _eventDealConf.type = obj.oc;
      var infoObj = {};
      // if (newVal.length === 11) {
      if(obj.oc == 20 || obj.oc == 22) {
        let gid = obj.dom.dataset.groupid;
        console.log(gid);
        infoObj = {
          oc: obj.oc,
          ac: ac,
          v: {v: newVal, gid: gid},
          ed: {}
        };
      } else if (obj.oc == 24 || obj.oc == 25){
        infoObj = {
          oc: obj.oc,
          ac: ac,
          v: '',
          ed: {}
        };
      } else {
        infoObj = {
          oc: obj.oc,
          ac: ac,
          v: newVal,
          ed: {}
        };
      };
      SXFBP.push(infoObj);
    },
    // mobileFocus: function (dom) {
    //   if (dom._BP_MobileFocus) {
    //     return;
    //   }
    //   dom._BP_MobileFocus = true;
    //   dom.addEventListener("focus", function () {
    //     console.log("mobile focus");
    //     SXFBP.EventDeal.mobileEventDeal(3, this.value);
    //   });
    // },

    // 绑定输入框事件
    addInputEvent: function (obj) {
      if (obj.dom._BP_InputValue) {
        return;
      };
      obj.dom._BP_InputValue = true;
      this.inputEventBind =  _eventDealConf.inputEvent.bind(this, obj);
      obj.dom.addEventListener('input', this.inputEventBind, false);
    },
    // 解绑输入框事件
    removeInputEvent: function (obj) {
      obj.dom.removeEventListener('input', this.inputEventBind, false);
    },
    // 公共埋点方法，只传入oc、ac
    publicEvent: function (obj) {
      var infoObj = {
        oc: obj.oc,//业务编码 opeCode
        ac: obj.ac,//行为编码 actionCode
        v: obj.value,//行为结果 value 例如 输入框产生的值
        ed: {}//扩展信息 json
      };
      SXFBP.push(infoObj);
    }
  };


  window._SXF_BP_EV = function () {
    SXFBP.addEventDeal(_eventDealConf);

    SXFBP.addLoadFN(function () {

      //页面窗口获得焦点
      window.addEventListener("focus", function () {
        var infoObj = {
          oc: 1,//业务编码 opeCode
          ac: 3,//行为编码 actionCode
          v: "",//行为结果 value 例如 输入框产生的值
          ed: {}//扩展信息 json
        };

        _SXFBP.push(infoObj);
      });

      //页面窗口失去焦点
      window.addEventListener("blur", function () {
        var infoObj = {
          oc: 1,//业务编码 opeCode
          ac: 4,//行为编码 actionCode
          v: "",//行为结果 value 例如 输入框产生的值
          ed: {}//扩展信息 json
        };

        _SXFBP.push(infoObj);
      });

      //页面窗口关闭
      window.addEventListener("beforeunload", function () {
        var pi = _SXFBP.getPageInfo();
        var infoObj = {
          oc: 2,//业务编码 opeCode
          ac: 2,//行为编码 actionCode
          v: "",//行为结果 value 例如 输入框产生的值
          ed: { pi: pi }//扩展信息 json
        };

        _SXFBP.push(infoObj);
        _SXFBP.stack2queue();
        _SXFBP.send();
        console.log("数据已经发生完")
      });

      //错误 error
      window.addEventListener("error", function (e) {
        var infoObj = {
          oc: 1,//业务编码 opeCode
          ac: 0,//行为编码 actionCode
          v: "",//行为结果 value 例如 输入框产生的值
          ed: { error: e.error }//扩展信息 json
        };

        _SXFBP.push(infoObj);
      });


    });

    SXFBP.addLoadFN(function () {
      var doms = document.querySelectorAll("[_SXFBP_EV]");
      doms.forEach(function (el, num, parent) {
        var attr = el.getAttribute("_SXFBP_EV");
        if (attr != null) {
          SXFBP.bind(el, attr);
        }
      })
    });
  };

  if (window.SXFBP == null) {
    var _sxfmt = _sxfmt || [];

    (function () {
      var s = document.querySelector("script[bpointConf]");
      var bpointConf = s.getAttribute("bpointConf");
      var ma = document.createElement('script');
      ma.type = 'text/javascript';
      ma.async = false;
      ma.src = "js/sxf-bpoint.js";

      ma.addEventListener("load", function () {
        _SXF_BP_EV();
      });

      s.parentNode.insertBefore(ma, s);
    })();
  } else {
    _SXF_BP_EV();
  }



})();
