(function(window){
	window.incident={
		userInfo:function(garageId,supplierId,AppBtn){
			if (garageId&&supplierId) {
				var info2={
					'garageId':garageId,//修理厂用户
					'supplierId':supplierId//经销商id
				}
				var api=actCommon.appApiP();
				var url=api+"/api/platform/supplierhome/findsupplier_v1"
				var that=this;
				var chatTel=function(data){
					szad.init();
					packaging.loadingRemove();//移除加载上传浮层
					var data=actCommon.transformJson(data);
				    if (data.success) {
				    	var userinfo=JSON.stringify(data.info);
				    	var AppBtn=AppBtn||{};
						var toAppBtn={
							chitchatBtn:AppBtn.chitchatBtn?AppBtn.chitchatBtn:'to_chat_btn',
							phoneBtn:AppBtn.phoneBtn?AppBtn.phoneBtn:'to_tel_btn',
							baguetteBtn:AppBtn.baguetteBtn?AppBtn.baguetteBtn:'to_baguette_btn'
						}

						var allChitchatBtn=document.getElementsByClassName(toAppBtn.chitchatBtn);
						var allPhoneBtn=document.getElementsByClassName(toAppBtn.phoneBtn);
						var allBaguetteBtn=document.getElementsByClassName(toAppBtn.baguetteBtn);
						for (var i = 0; i < allChitchatBtn.length; i++) {//去聊天
							allChitchatBtn[i].setAttribute('href', 'javascript:;');
							allChitchatBtn[i].onclick=function(){
								window.szad.jumpDealerFromJs(userinfo,1);
							}
						};
						for (var i = 0; i < allPhoneBtn.length; i++) {//拨打电话
							allPhoneBtn[i].setAttribute('href', 'javascript:;');
							allPhoneBtn[i].onclick=function(){
								window.szad.jumpDealerFromJs(userinfo,2);
							}
						};
						for (var i = 0; i < allBaguetteBtn.length; i++) {
							allBaguetteBtn[i].setAttribute('href', 'javascript:;');
							allBaguetteBtn[i].onclick=function(){
								window.szad.jumpDealerFromJs(userinfo,3);
							}
						};
				    }else{
				    	document.getElementById('chitchat').setAttribute('onclick', 'alert("'+data.message+'")')
						document.getElementById('phone').setAttribute('onclick', 'alert("'+data.message+'")')
						document.getElementById('baguette').setAttribute('onclick', 'alert("'+data.message+'")')
				    	// packaging.fubottom(data.message);
				    };
				}
				szad.requestNetworkData(url,info2,chatTel)
			};
			
		}
	}
})(window)