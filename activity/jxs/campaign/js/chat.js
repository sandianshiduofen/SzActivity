!function(window){window.incident={userInfo:function(garageId,supplierId,AppBtn){if(garageId&&supplierId){var info2={garageId:garageId,supplierId:supplierId},url=actCommon.appApiP()+"/api/platform/supplierhome/findsupplier_v1";szad.requestNetworkData(url,info2,function(data){if(szad.init(),packaging.loadingRemove(),(data=actCommon.transformJson(data)).success){for(var userinfo=JSON.stringify(data.info),AppBtn=AppBtn||{},toAppBtn={chitchatBtn:AppBtn.chitchatBtn?AppBtn.chitchatBtn:"to_chat_btn",phoneBtn:AppBtn.phoneBtn?AppBtn.phoneBtn:"to_tel_btn",baguetteBtn:AppBtn.baguetteBtn?AppBtn.baguetteBtn:"to_baguette_btn"},allChitchatBtn=document.getElementsByClassName(toAppBtn.chitchatBtn),allPhoneBtn=document.getElementsByClassName(toAppBtn.phoneBtn),allBaguetteBtn=document.getElementsByClassName(toAppBtn.baguetteBtn),i=0;i<allChitchatBtn.length;i++)allChitchatBtn[i].setAttribute("href","javascript:;"),allChitchatBtn[i].onclick=function(){window.szad.jumpDealerFromJs(userinfo,1)};for(i=0;i<allPhoneBtn.length;i++)allPhoneBtn[i].setAttribute("href","javascript:;"),allPhoneBtn[i].onclick=function(){window.szad.jumpDealerFromJs(userinfo,2)};for(i=0;i<allBaguetteBtn.length;i++)allBaguetteBtn[i].setAttribute("href","javascript:;"),allBaguetteBtn[i].onclick=function(){window.szad.jumpDealerFromJs(userinfo,3)}}else document.getElementById("chitchat").setAttribute("onclick",'alert("'+data.message+'")'),document.getElementById("phone").setAttribute("onclick",'alert("'+data.message+'")'),document.getElementById("baguette").setAttribute("onclick",'alert("'+data.message+'")')})}}}}(window);