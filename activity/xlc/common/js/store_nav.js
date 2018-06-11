(function(window){
	window.incident={
		GetQueryString:function(name){//获取参数
		    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		    var r = window.location.search.substr(1).match(reg);
		    if(r!=null)return  unescape(r[2]); return null;
		},
		requestTokenId:function(num){//随机数
			len =num||32;
			var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
			var maxPos = $chars.length;
			var pwd = '';
			for (i = 0; i < len; i++) {
			　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return 'wx_tms_'+pwd;
		},
		userInfo:function(id,AppBtn){
			var AppBtn=AppBtn||{};
			var toAppBtn={
				chitchatBtn:AppBtn.chitchatBtn?AppBtn.chitchatBtn:'to_chat_btn',
				phoneBtn:AppBtn.phoneBtn?AppBtn.phoneBtn:'to_tel_btn',
				baguetteBtn:AppBtn.baguetteBtn?AppBtn.baguetteBtn:'to_baguette_btn'
			}
			ajax({
				method: 'POST',
				url: 'http://weixinapi.3zqp.com/api/wx/login/findSupplier',
				data: {
				    id:id,
				    garageId:incident.GetQueryString('garageId'),
				    requestTokenId:incident.requestTokenId()
				},
				success: function (response) {
					var data=(typeof response == "string")?JSON.parse(response):response;
					console.log(data)
					if (data.returnCode==200) {
						var userinfo=JSON.stringify(data.info);
						var allChitchatBtn=document.getElementsByClassName(toAppBtn.chitchatBtn);
						var allPhoneBtn=document.getElementsByClassName(toAppBtn.phoneBtn);
						var allBaguetteBtn=document.getElementsByClassName(toAppBtn.baguetteBtn);
						for (var i = 0; i < allChitchatBtn.length; i++) {
							allChitchatBtn[i].setAttribute('href', 'javascript:;');
							allChitchatBtn[i].onclick=function(){
								window.depot.jumpDealerFromJs(userinfo,1);
							}
						};
						for (var i = 0; i < allPhoneBtn.length; i++) {
							allPhoneBtn[i].setAttribute('href', 'javascript:;');
							allPhoneBtn[i].onclick=function(){
								window.depot.jumpDealerFromJs(userinfo,2);
							}
						};
						for (var i = 0; i < allBaguetteBtn.length; i++) {
							allBaguetteBtn[i].setAttribute('href', 'javascript:;');
							allBaguetteBtn[i].onclick=function(){
								window.depot.jumpDealerFromJs(userinfo,3);
							}
						};
					}else{
						document.getElementById('chitchat').setAttribute('onclick', 'alert("'+data.message+'")')
						document.getElementById('phone').setAttribute('onclick', 'alert("'+data.message+'")')
						document.getElementById('baguette').setAttribute('onclick', 'alert("'+data.message+'")')
					};
					
				}
			 });
		},
	}

	function ajax(opt) {
		opt = opt || {};
		opt.method = opt.method.toUpperCase() || 'POST';
		opt.url = opt.url || '';
		opt.async = opt.async || true;
		opt.data = opt.data || null;
		opt.success = opt.success || function () {};
		opt.error = opt.error || function () {};
		var xmlHttp = null;
		if (XMLHttpRequest) {
		    xmlHttp = new XMLHttpRequest();
		}
		else {
		    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
		}var params = [];
		for (var key in opt.data){
		    params.push(key + '=' + opt.data[key]);
		}
		var postData = params.join('&');
		if (opt.method.toUpperCase() === 'POST') {
		    xmlHttp.open(opt.method, opt.url, opt.async);
		    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		    xmlHttp.send(postData);
		}
		else if (opt.method.toUpperCase() === 'GET') {
		    xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
		    xmlHttp.send(null);
		} 
		xmlHttp.onreadystatechange = function () {
		    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
		        opt.success(xmlHttp.responseText);
		    }
		};
	}
})(window)