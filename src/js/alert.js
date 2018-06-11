/*alert弹出层*/
(function() {
	$.extend({
		myAlert: function(options) {//参数格式{title:'Title',message:'message',callback:function(){alert('callback')}}or"需要提示的话"
			var option={title:"提示",message:"提示",callback:function(){}}
			if(typeof(options)=="string"){
				option.message=options
			}else{
				option=$.extend(option,options);
			}
			var top=$(window).height()*0.3;
			$('body').append('<div class="myModa"><div class="myAlertBox" style="margin-top:'+top+'px"><p style="padding-top:20px;">'+option.message+'</p><div class="btn sure">确定</div></div></div>');
			$('.btn.sure').click(function(){
				$('.myModa').remove();
				option.callback();
			})
		},
		myConfirm: function(options) {//参数格式{title:'Title',message:'message',callback:function(){alert('callback')}}or"需要提示的话"$.myConfrim()
			var option={title:"提示",message:"提示",callback:function(){}}
			if(typeof(options)=="string"){
				option.message=options
			}else{
				option=$.extend(option,options);
			}
			var top=$(window).height()*0.3;
			$('body').append('<div class="myModa"><div class="myAlertBox" style="margin-top:'+top+'px"><h6>'+option.title+'</h6><p>'+option.message+'</p><div class="col2"><div class="col"><div class="btn exit" style="box-shadow: 1px 0 0 #eee;">取消</div></div><div class="col"><div class="btn sure">确定</div></div></div></div></div>');
			$('.btn.exit').click(function(){
				$('.myModa').remove();
			})
			$('.btn.sure').click(function(){
				$('.myModa').remove();
				option.callback();
			})
		},
		myConfirmZ: function(options) {//参数格式{title:'Title',message:'message',trueBtn:"确定",falseBtn:"取消",callback:function(){alert('callback')}}or"需要提示的话"$.myConfrim()
			var option={title:"提示",message:"提示",trueBtn:"确定",falseBtn:"取消",callback:function(){}}
			if(typeof(options)=="string"){
				option.message=options
			}else{
				option=$.extend(option,options);
			}
			var top=$(window).height()*0.3;
			$('body').append('<div class="myModa"><div class="myAlertBox" style="margin-top:'+top+'px"><h6>'+option.title+'</h6><p>'+option.message+'</p><div class="col2"><div class="col"><div class="btn sure" style="box-shadow: 1px 0 0 #eee;">'+option.trueBtn+'</div></div><div class="col"><div class="btn exit" style="color:#50B4EA;">'+option.falseBtn+'</div></div></div></div></div>');
			$('.btn.exit').click(function(){
				$('.myModa').remove();
			})
			$('.btn.sure').click(function(){
				$('.myModa').remove();
				option.callback();
			})
		}
	});
})($)