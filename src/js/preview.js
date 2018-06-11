	var app = new Vue({
		el: '#temBox',
		data: {
			goods:{
				name:"",
				content:{
					describe:"",
					list:[]
				},
				createTime:"",
				company:"",
				viewPv:0
			},
			edit:{
				showRedPacket:false,
				redPacketNum:false,
				companyName:"",
				haveRedPacket:false,
				NoRedPacket:false,
				overRedPacket:false,
				chatTel:false,
				isDisable:false,
			}
		},
		created: function () {
			szad.init();
			var id=packaging.GetQueryString('id');
			if(id){
				this.show(id);
				if (packaging.GetQueryString('garageId')) {
					this.edit.chatTel=true;
					this.statistics(id);
					this.redPacket(id);
				};
			}else{
				var storage = window.sessionStorage;
				if (!!storage.goodList) {
					var that=this;
					szad.getUserInfo(function(userInfo){
		            	var userInfo=actCommon.transformJson(userInfo);

			            that.goods=JSON.parse(storage.goodList)
						that.goods['viewPv']=0;
						that.goods['createTime']="刚刚";
		            	that.goods.company=userInfo.company;
		            })
				};
			}
		},
		methods:{
			show:function (id) {// 获取活动信息
				packaging.loading('加载中...');
	        	var selectJson={
	                "advertiseId":parseInt(id),
	            }
	            
	            var api=actCommon.appApi();
	            var url=api+"/api/app/advertise/garage/ad/detail"
	            var that=this;
	            var gainGoods=function(data){
	    			packaging.loadingRemove();
					var data=actCommon.transformJson(data);
				    if (data.success) {
				    	that.goods.viewPv=data.info.pv;//浏览量
				    	that.goods.name=data.info.advertiseName;
				    	that.goods.company=data.info.company;
				    	that.goods.content=JSON.parse(data.info.content);
				    	that.goods.createTime=that.timeCycle(data.info.startTime,data.info.endTime);
				    	// consoleLog(that.goods);
				    	// 调取聊天
				    	if (packaging.GetQueryString('garageId')) {
							incident.userInfo(id,data.info.userId);
						}
				    }else{
				    	packaging.fubottom(data.message);
				    };
				}
	            szad.requestNetworkData(url,selectJson,gainGoods)
	        },
	        statistics:function(id){//添加访问量
	        	var selectJson={
	                "account":packaging.GetQueryString('account'),
	                "advertiseId":parseInt(id)
	            }
	            var api=actCommon.appApiN();
	            var url=api+"/api/app/advertise/garage/ad/browse/count"
	            var that=this;
	            var gainGoods=function(data){
					var data=actCommon.transformJson(data);
	            	// consoleLog(data)
				    if (data.success) {
				    }else{
				    	packaging.fubottom(data.message);
				    };
				}
	            szad.requestNetworkData(url,selectJson,gainGoods)
	        },
			redPacket:function(id){//查看是否有红包
				var selectJson={
	                "account":packaging.GetQueryString('account'),
	                "advertiseId":parseInt(id)
	            }
	            var api=actCommon.appApiG();
	            var url=api+"/api/app/advertise/garage/check/red/envelope"
	            var that=this;
	            var gainGoods=function(data){
					var data=actCommon.transformJson(data);
					// consoleLog(data)
				    if (data.success) {
				    	that.edit.showRedPacket=true;
						window.actCommon.downHint();
				    }else{

				    };
				}
	            szad.requestNetworkData(url,selectJson,gainGoods)
			},
			getRedPacket:function(){//领取红包
				this.edit.isDisable = true;
		        setTimeout(function(){
		          that.edit.isDisable = false
		        }, 2000);
				var that=this;
				// 动画效果
				var lingqu=document.getElementById('lingqu');
				lingqu.classList.add("shake-chunk");

				var selectJson={
	                "account":packaging.GetQueryString('account'),
	                "advertiseId":parseInt(packaging.GetQueryString('id')),
	                "userId":packaging.GetQueryString('garageId')
	            }

	            var api=actCommon.appApiG();
	            var url=api+"/api/app/advertise/garage/open/red/envelope"

	            var gainGoods=function(data){
					var data=actCommon.transformJson(data);
					// consoleLog(data)
				    if (data.success) {
				    	// 领取红包页面隐藏
						that.edit.showRedPacket=false;
						if (parseInt(data.info.result)==9) {
							// 红包领取成功显示
				    		that.edit.haveRedPacket=true;
				    		that.edit.redPacketNum=data.info.noteNum;
				    		that.edit.companyName=data.info.company;

						}else if(parseInt(data.info.result)==0){
							that.edit.NoRedPacket=true;
						}else if(parseInt(data.info.result)==1){
							that.edit.overRedPacket=true;
						}else{
							that.edit.NoRedPacket=true;
						}

				    	/*if (parseInt(data.info.noteNum)>0) {
				    		// 红包领取成功显示
				    		that.edit.haveRedPacket=true;
				    		that.edit.redPacketNum=data.info.noteNum;
				    		that.edit.companyName=data.info.company;
				    	}else{
				    		// 红包领取失败显示
				    		that.edit.NoRedPacket=true;
				    	};*/
				    }else{
				    	packaging.fubottom(data.message);
				    };
				}
	            szad.requestNetworkData(url,selectJson,gainGoods)
			},
	        timeCycle:function(stardTime,endTime){//时间转换
	        	// 开始时间
	        	var stardTime=parseInt(stardTime);

				// 当前时间
				var currentTime = new Date();

				currentTime=parseInt(currentTime/1000)
			    // 创建过去时间戳(后台返回的时间 一般是13位数字)
			    stardTime = parseInt(stardTime/1000);
			    // 时间差
			    var time = currentTime - stardTime;

	        	// 活动未开始
			    if (currentTime<stardTime) {
	        		return "活动未开始"
	        	};
			    // 活动已结束
			    if (currentTime>endTime) {
	        		return "活动已结束"
	        	};

			    
			    // 秒转分钟
			    var min = parseInt(time/60);
			    if (min<60) {
			        return min+"分钟前";
			    }
			    
			    // 秒转小时
			    var hours = parseInt(time/3600);
			    if (hours<24) {
			        return hours+"小时前";
			    }
			    //秒转天数
			    var days = parseInt(time/3600/24);
			    if (days < 30) {
			        return days+"天前";
			    }
			    //秒转月
			    var months = parseInt(time/3600/24/30);
			    if (months < 12) {
			        return months+"月前";
			    }
			    //秒转年
			    var years = parseInt(time/3600/24/30/12);
			    return years+"年前";
	        },
			huanhang:function(value){//描述换行
				if(!value)return "";
				var value=value.toString();
				var strArr=value.split("\n");
				var str="";
				for (var i = 0; i < strArr.length; i++) {
					str+='<p>'+strArr[i]+'</p>';
				};
				return str;
			},
			iKnowClose:function(){//关闭红包
				if(this.edit.haveRedPacket){
					this.edit.haveRedPacket=false;
					return false;
				}
				if(this.edit.showRedPacket){
					this.edit.showRedPacket=false;
					return false;
				}
				if(this.edit.NoRedPacket){
					this.edit.NoRedPacket=false;
					return false;
				}
				if(this.edit.overRedPacket){
					this.edit.overRedPacket=false;
					return false;
				}
			},
	        addspan:function (text) {
	        	var price=parseFloat(text).toFixed(2).split('.');
	        	return '<b style="font-weight:normal">'+price[0]+'</b>.'+price[1];
	        	
	        }

		}
	})
