/*
* @Author: szyg
* @Date:   2018-03-09 13:18:19
* @Last Modified by:   szyg
* @Last Modified time: 2018-06-04 13:58:34
*/
(function(){
	window.actCommon={
		downHint:function(){
			setTimeout(function(){
				var guide_hint_w=document.getElementsByClassName('guide_hint_w')[0];
				if (guide_hint_w) {
					guide_hint_w.style.height=0;
					guide_hint_w.style.display='block';
					var hei=0;
					setInterval(function(){
						if(hei<30){
							hei++;
							guide_hint_w.style.height=hei+"px";
						}else{
							guide_hint_w.style.height='auto';
							return;
						}
					}, 1)
					document.getElementsByClassName('guide_hint_close')[0].onclick=function(){
						guide_hint_w.style.display="none";
					}
				};
				
			}, 500)
		},
		addStep:function(step,localStorageA){
			var showStep=localStorageA;
            try{
                if (!showStep) {
                    window.actCommon.downHint();
                    try{
                        localStorage.setItem(step, true);
                    }catch(err){
                        
                    }
                    return true;
                }else{
                	return false;
                }
            }catch(err){
                window.actCommon.downHint();
                try{
                    localStorage.setItem(step, true);
                }catch(err){

                }
                return true;
            }
		},
		upHint:function(){
			$('.guide_hint_w').slideUp('400');
		},
		footerFixed:function(){
			setTimeout(function(){
				if (document.getElementById('goods_footer')) {
					var wdHei=window.innerHeight;
					var GoodsFooter=document.getElementById('goods_footer');
			    	var herTop=wdHei-60;
			    	GoodsFooter.style.position="fixed";
			   		GoodsFooter.style.top=herTop+"px";
				};
			}, 300)
		},
		transformJson:function(data){
			if (typeof data == 'string') {
		        try {
		            var data=JSON.parse(data);
		            if (typeof data == 'string') {
		        		data=JSON.parse(data);
		        	};
		        } catch(e) {
		        	
		        }
		    }
		    return data;
		},
        isSpecific:function(text){
			var pattern = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\~\`\!\@\#\%\^\&\*\(\)\_\{\}\|\\\:\；\"\<\>\?\！\$\¥\＄\￥\…\（\）\—\+\{\}\|\：\“\”\‘\’\《\》\？\/\,\.\、\，\。\;\'\[\]\=\-\【\】\·\｛\｝\～\s+]/g;
			return pattern.test(text);
		},
		apiImgShow:function(){//图片域名
			return "https://3zxgimg.oss-cn-beijing.aliyuncs.com/"
		},
		// 生产
		/*appApi:function(){
			return "http://advertise.3zqp.com"
		},
		appApiW:function(){
			return "http://saleapi.3zqp.com"
		},
		appApiP:function(){
			return "http://appapi.3zqp.com"
		},
		appApiN:function(){
			return "http://eventapi.3zqp.com"
		},
		appApiG:function(){
			return "http://redapi.3zqp.com"
		},*/
		// 测试环境
		appApi:function(){
			return "http://tadvertise.3zqp.com"
		},
		appApiW:function(){
			return "http://tsaleapi.3zqp.com"
		},
		appApiP:function(){
			return "http://tappapi.3zqp.com"
		},
		appApiN:function(){
			return "http://teventapi.3zqp.com"
		},
		appApiG:function(){
			return "http://tredapi.3zqp.com"
		},
		// 准生产
		/*appApi:function(){
			return "http://padvertise.3zqp.com"
		},
		appApiW:function(){
			return "http://psaleapi.3zqp.com"
		},
		appApiP:function(){
			return "http://pappapi.3zqp.com"
		},
		appApiN:function(){
			return "http://peventapi.3zqp.com"
		},
		appApiG:function(){
			return "http://predapi.3zqp.com"
		},*/
		// 本地
		/*appApi:function(){
			return "http://192.168.0.237:8031"
		},
		appApiW:function(){
			return "http://192.168.0.31:7172"
			// return "http://192.168.0.177:8084"
		},
		appApiP:function(){
			return "http://pappapi.3zqp.com"
		},
		appApiN:function(){
			return "http://192.168.0.237:8032"
		},
		appApiG:function(){
			return "http://192.168.0.237:8034"
		},*/
	}
	
	// 公共
	window.packaging={
		loading:function(text){
			var loader=document.createElement('div');
		    loader.id="loadingZhuan",
		    loader.setAttribute('style', "position: fixed;left:0;top: 0;top: 0;bottom: 0;right: 0;background: rgba(0,0,0,0.1);z-index: 100;")
		    loader.setAttribute("class","loadingZhuan")
		    loader.innerHTML='<div class="loadingZ" style="position: fixed;height:0.7rem;width:1rem;background: rgba(0,0,0,0.7);left:50%;margin-left:-0.5rem;top:50%;margin-top:-0.5rem;border-radius:3px;padding:0.15rem 0;"><img style="width:0.4rem;display:block;margin:0 auto;" src="http://activityweb.3zqp.com/common/images/zhuan.gif"><p style="text-align: center;color:#fff;line-height: 0.3rem;font-size:0.14rem;">'+text+'</p></div>';
		    document.body.appendChild(loader);
		},
		loadingRemove:function(){
		    var loadingZhuan=document.getElementById('loadingZhuan')||null;
		    if(loadingZhuan){
		        loadingZhuan.parentNode.removeChild(loadingZhuan)
		    }
		},
		requestTokenId:function(num){
			var len =num||32;
			var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
			var maxPos = $chars.length;
			var pwd = '';
			for (var i = 0; i < len; i++) {
				pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return 'wx_tms_'+pwd;
		},
		requestTokenInput:function(){
			var html='<input name="requestTokenId" type="hidden" value="'+requestTokenId()+'">';
			$('form').append(html);
		},
		GetQueryString:function (name){
		     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		     var r = window.location.search.substr(1).match(reg);
		     if(r!=null)return  unescape(r[2]); return null;
		},
		timerBottom:"",
		fubottom:function(text) {
			clearTimeout(this.timerBottom);
			if (document.body.contains(document.getElementById('fubottom'))) {
				var fubottomDom=document.getElementById('fubottom');
				fubottomDom.parentNode.removeChild(fubottomDom);
			}
			var fubot=document.createElement('div');
			fubot.id="fubottom";
			fubot.class="fubottom";
			fubot.innerHTML="<div style='max-width:400px;padding:0 0.1rem;background:rgba(0,0,0,0.7);color:#fff;border-radius:3px;'>"+text+"</div>"
			fubot.setAttribute("style", "position:fixed;height:36px;z-index:9999;line-height:36px;text-align:center;font-size: 0.14rem;bottom:1rem;display:flex;justify-content:center;align-content:center;width:100%;");
			document.body.appendChild(fubot)
			this.timerBottom=setTimeout(function(){
				var fubottomDom=document.getElementById('fubottom');
				fubottomDom.parentNode.removeChild(fubottomDom);
			}, 2000);
		},
		isverify:function (verify) {//验证金额
			var pattern = /^\d{1,5}(\.\d{1,2})?$/;
		 	return pattern.test(verify);
		},
		getClientHeight:function(){//窗口的高度
		  var clientHeight=0;
		  if(document.body.clientHeight&&document.documentElement.clientHeight)
		  {
		  var clientHeight = (document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
		  }
		  else
		  {
		  var clientHeight = (document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
		  }
		  return clientHeight;
		},
		getScrollHeight:function (){
		　　var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
		　　if(document.body){
		　　　　bodyScrollHeight = document.body.scrollHeight;
		　　}
		　　if(document.documentElement){
		　　　　documentScrollHeight = document.documentElement.scrollHeight;
		　　}
		　　scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
		　　return scrollHeight;
		},
		noResult:function(boxDot,height,text){
			boxDot.innerHTML=('<div class="noResult_flex" style="height:'+height+'px"><div class="noResult_flex"><div class="noResult_c"><span><img src="./images/no_find.png" alt=""></span><p>'+text+'</p></div></div>');
		},
		noResultErr:function (boxDot,height,text,func){
			boxDot.innerHTML='<div class="noResult" onclick="'+func+'" style="display:flex;justify-content:center;align-items:center;height:'+height+'px"><div class="noResult_c"><span><img style="width:1rem;height:auto;display:block;margin:0 auto;" src="./images/no_find.png" alt=""></span><p style="text-align:center;line-height:0.3rem;">'+text+'</p></div>';
		}
	}
	

	window.Date.prototype.format=function(format){var date={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),"S+":this.getMilliseconds()};for(var k in/(y+)/i.test(format)&&(format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))),date)new RegExp("("+k+")").test(format)&&(format=format.replace(RegExp.$1,1==RegExp.$1.length?date[k]:("00"+date[k]).substr((""+date[k]).length)));return format};
	// 在页面打印数据	
})();
// 弹框时禁止滚动
window.ModalHelper = (function(bodyCls) {
	var scrollTop;
	return {
		afterOpen: function() {
			scrollTop = document.scrollingElement.scrollTop;
			document.body.classList.add(bodyCls);
			document.body.style.top = -scrollTop + 'px';
		},
		beforeClose: function() {
			document.body.classList.remove(bodyCls);
			document.scrollingElement.scrollTop = scrollTop;
		}
	};
})('modal-open');
// 输出
function consoleLog(text){
    var consoleLog=document.createElement('pre');
    consoleLog.setAttribute('style', "word-break:break-all;outline: 1px solid #ccc; padding: 5px; margin: 5px 5px 50px;overflow-y: auto;");
    consoleLog.innerHTML=syntaxHighlight(text);
    var bodyD=document.body.getElementsByTagName('section')[0];
    // document.body.insertBefore(consoleLog,bodyD)
    document.body.appendChild(consoleLog)
}
// 输出json
function syntaxHighlight(json) {
    if (typeof json != 'string') {
    	json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}


