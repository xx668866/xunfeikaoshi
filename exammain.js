//var intDiff = parseInt(1800);//倒计时初始时间
var winHeight=0,winWidth=0,writHeight=0;//自适应
//var aswTrLength=$(".exam_right-writ-answer2").children("table").children("tbody").children("tr").length,aswTrHeight=0,aswHeight=$(".exam_right-writ-answer").height();
console.log('exammain success')
//自适应高度
winWidth = $(window).width();
winHeight = $(window).height();
if(winHeight<520){
    winHeight=520;
}
if(winWidth<1024){
    winWidth=1024;
}
function winSize(){
    //宽度改变
    if($(".exam_right-suo").hasClass("active")){
	    $("#examContent").width(document.body.clientWidth);
    }
    else{
	    $("#examContent").width(document.body.clientWidth-234);
    }
    if($(".exam_right").children("iframe").contents().find("body").find(".exam_right-writ-answer").length > 0){
    	$(".exam_right").children("iframe")[0].contentWindow.winSize2("suo");
    }
}

//提醒考生并强制交卷 
var dlog ={};
var submitDlog ={};
var focusSubmitDlog = {};
function completeExam() {
	try 
	{
		var nodejsExit = require("child_process");
		shutdownshieldhk();		//解锁快捷键
	} 
	catch (e) 
	{ 
	} 
	if(!submitDlog.open && !focusSubmitDlog.open){
		submitDlog =dialog({
		    title: '提示',
		    content: '考试时间已到，系统已自动提交试卷，请点击“确定”返回测试系统首页。考试成绩查询时间请等待学校通知。',
	    	okValue: '确定',
	        ok: function () {
	        	top.location.href=baseURL;
	        },
	        cancel: function(){top.location.href=baseURL;return false;},
	        cancelDisplay: false
		}).showModal();
		time1 = "999";
	}
}
function topAlert(title,content,okValue,okfunc) {
	if(!dlog.open){
		dlog =dialog({
		    title: title,
		    content: content,
	    	okValue: okValue,
	        ok: okfunc,
	    	cancel: false
		}).showModal();
	}
}
function topAlertEndExam(title,content,okValue,okfunc) {
	if(!submitDlog.open && !focusSubmitDlog.open){
		submitDlog =dialog({
		    title: title,
		    content: content,
	    	okValue: okValue,
	        ok: okfunc,
	        cancel: function(){top.location.href=baseURL;return false;},
	        cancelDisplay: false
		}).showModal();
		time1 = "999";
	}
}
function sysAlert(content){
	if(!dlog.open){
		dlog =dialog({
		    title: "提示",
		    content: content,
	    	okValue: "确定",
	        ok: function(){return;},
	    	cancel: false
		}).showModal();
	}
}
function topAlert2Close(title,content,okValue,okfunc) {
	if(!dlog.open){
		dlog = dialog({
		    title: title,
		    content: content,
	    	okValue: okValue,
	        ok: okfunc,
	        cancelValue: '取消',
		    cancel: function () {}
		}).showModal();
	}
}
function topAlertClose(title,content,okValue,okfunc) {
	if(!submitDlog.open && !focusSubmitDlog.open){
		submitDlog = dialog({
		    title: title,
		    content: content,
	    	okValue: okValue,
	        ok: okfunc,
	        cancel: false
		});
		submitDlog.showModal();
		setTimeout(function () {
			okfunc();
			submitDlog.close().remove();
		}, 10000);
		time1 = "999";
	}
}

$(function(){
	$("#exam_right-shadow").height(winHeight);
	$("#examleft").height(winHeight-10);
	$("#examContent").height(winHeight-10);
	$("#examContent").width(document.body.clientWidth-234);
	
	$(".exam_right-suo").click(function(){
        var obj=$(this);
        if(obj.hasClass("active")){
            obj.removeClass("active");
            	obj.next().animate({"left":"232px"},200).css({"left":"232px"}).children("iframe").contents().find("body").find(".exam_right-wrap").removeClass("active");
            obj.next().children("iframe").contents().find("body").find(".exam_right-wrap").each(function(){
            	$(this).attr("class" , ($(this).attr("class").replace(/ active/g,"")) );
            	//$(this).addClass("active");
            });
            	//交卷按钮居中
            	obj.next().children("iframe").contents().find("body").find(".reading").animate({"margin-left":"330"},200);
            	obj.next().children("iframe").contents().find(".answerOptionDiv").width("605px");//改错题左侧宽度-20160311
        }
        else{
            obj.addClass("active");
       		$(".exam_right-wrap",window.examContent).addClass("active");
       	
            obj.next().animate({"left":"0"},200).css({"left":"0"}).children("iframe").contents().find("body").find(".exam_right-wrap").addClass("active");
			//var obj_ = obj.next().animate({"left":"0"},200).css({"left":"0"}).children("iframe").contents().find("body").find(".exam_right-wrap");
            obj.next().children("iframe").contents().find("body").find(".exam_right-wrap").each(function(){
            	$(this).attr("class" , ($(this).attr("class")+" active") );
            	//$(this).addClass("active");
            });
            	//交卷按钮居中
            	obj.next().children("iframe").contents().find("body").find(".reading").animate({"margin-left":"450"},200);
            	obj.next().children("iframe").contents().find(".answerOptionDiv").width("849px");//改错题左侧宽度-20160311
        }
        winSize();
      window.examContent.edittipAutoHeight();
    });
	downLoadMedia();
	//获取多点登录状态
	getAbnormal();
})

/**
 * 获取多点登录状态
 */
function getAbnormal(){
	$.post(baseURL+"/conLog/getAbnormal.json", {
		"batchId" : batchId
	}, function(data) {
		if(data.abnormal == "yes"){
			setTimeout(function(){
				top.window.location.href = iplatURL;
			},10000);
			
			topAlert("提示", "检测到有另一名学生正在其他地点登录，您将被登出", "确定", function(){
				window.location.href = iplatURL;
			}); 
		}else if(data.ttl > 0){
			setTimeout(function(){
				window.location.href = iplatURL;
			},10000);
			window.location.href = iplatURL;
			topAlert("提示", "您已被监考教师禁止考试"+data.ttl+"分钟，您将被登出", "确定", function(){
				window.location.href = "${thisIplatURL!iplatURL}"
			}); 
		}else{
			setTimeout(function(){
				getAbnormal();
			},30000);
		}
	});
}

function forbidBackSpace(e) {
	var ev = e || window.event; // 获取event对象
	var obj = ev.target || ev.srcElement; // 获取事件源
	var t = obj.type || obj.getAttribute('type'); // 获取事件源类型
	// 获取作为判断条件的事件类型
	var vReadOnly = obj.readOnly;
	var vDisabled = obj.disabled;
	// 处理undefined值情况
	vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
	vDisabled = (vDisabled == undefined) ? true : vDisabled;
	// 当敲Backspace键时，事件源类型为密码或单行、多行文本的，
	// 并且readOnly属性为true或disabled属性为true的，则退格键失效
	var flag1 = ev.keyCode == 8
			&& (t == "password" || t == "text" || t == "textarea")
			&& (vReadOnly == true || vDisabled == true);
	// 当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
	var flag2 = ev.keyCode == 8 && t != "password" && t != "text"
			&& t != "textarea";
	// 判断
	if (flag2 || flag1)
		return false;
	if((ev.ctrlKey)&&(ev.keyCode>48||ev.keyCode<58)){
		return false;
	}
}
try {
// 禁止后退键 作用于Firefox、Opera
document.onkeypress = forbidBackSpace;
// 禁止后退键 作用于IE、Chrome
document.onkeydown = forbidBackSpace;
} catch (e) {}

var focusDlog = {} ,focusFlag = false , focusEnable = true;
var focusMap = {"main":true,"content":true,"left":true};
function focusAlert(title,content,okValue,okfunc) {
	//解除绑定父页面beforeunload事件
	$(window).unbind('beforeunload');
	if(!focusDlog.open && !focusSubmitDlog.open && !submitDlog.open){
		focusDlog = dialog({
		    title: title,
		    content: content,
	    	okValue: okValue,
	        ok: okfunc,
	        cancel: false
		}).showModal();
	}
}

function focusSubmitAlert(title,content,okValue,okfunc) {
	//解除绑定父页面beforeunload事件
	$(window).unbind('beforeunload');
	if(!focusSubmitDlog.open && !submitDlog.open){
		focusSubmitDlog = dialog({
		    title: title,
		    content: content,
	    	okValue: okValue,
	        ok: okfunc,
	        cancel: false
		}).showModal();
	}
	setTimeout(function () {
		okfunc();
		focusSubmitDlog.close().remove();
	}, 30000);
}

function topOnFocus(param,param2){
	focusMap[param] = false;
	//console.log(param2+"--"+focusMap[param]+"---"+JSON.stringify(focusMap)+"---"+new Date().getTime());
	
}

var setTimeFlag = false;//在setTimeOut執行期間内不再執行
function topOnBlur(param,param2){
	focusMap[param] = true;
	if(!focusEnable){//是否启用弹窗
		return;
	}
	if(setTimeFlag || submitDlog.open){
		return;
	}
	setTimeFlag = true;
	setTimeout(function(){
		focusFlag = true;
		for(var key in focusMap){
			if(!focusMap[key]){
				focusFlag = true;
			}
		}
		if(!focusFlag){//如果窗口没焦点则弹窗警告
			var title = "提示" ,  content = "考试中禁止切出考试界面\n\r否则将被强制交卷！" , okValue = "我知道了";
			if("1" == switchPageNum){
				content = "多次切出考试界面，你已被强制交卷。\n\r如有疑问，请联系监考教师。"
					time1 = "999";
			}
		
			if("-1" != switchPageNum){
				if("1" != switchPageNum){
					switchPageNum--;
					var param = {};
					param.switchPageNum = switchPageNum;
					param.examPaperId = examPaperId;
					param.resultId = studentExamResultId;
					param.batchId = batchId;
					param.studentId = studentId;
					//$.ajax({
					//	type : "POST",
					//	url : baseURL+"/examPaper/updateSwitchPageNum",
					//	data : param,
					//	success: function(msg){
					//	}
					//});
					focusAlert( title , content , okValue ,function(){});
				}else{
					if( focusDlog != null && focusDlog.open){
						focusDlog.close().remove();
					}
					//强制交卷
					//$.post(
					//	baseURL+"/examPaper/saveStudentAnswer.json",
   		  			//	{studentResultId :studentExamResultId, examPaperId : examPaperId, batchId : batchId, studentId : studentId ,isTrain:isTrain},
   		  			//	function rendResponds(data) {
   		  			//		var data1=data;
   					//		if (data1.done == "failed") {
   					//			dialog({content: data1.info,okValue: '确定'}).show();
   					//			return;
   					//		} else {
   					//			//强制交卷状态更新
   					//			var param = {};
					//				param.batchId = batchId;
					//				param.studentId = studentId;
					//				param.examState = 1;
					//				param.studentExamResultId = studentExamResultId;
    		  		//			$.ajax({
    				//				type : "POST",
    				//				url : baseURL+"/faceStudentPic/updateExamState",
    				//				data : param,
    				//				success: function(msg){
    				//					if(msg.result == "1"){
    				//						switchPageNum = '-1';
    				//						focusSubmitAlert( title , content , okValue ,function(){
    				//							top.location.href=baseURL;
    				//							//location.reload();
    				//						});
    				//					}
    				//				}
    				//			});
   					//		}
  		  			//		}
 		  			//	);
				}
			}else{
			//	focusAlert( title , content , okValue ,function(){});
			}
			
		}
		setTimeFlag = false;
	} , 200);
}
window.onfocus=function(){
	topOnFocus("main","来自主窗口的焦点获取");
};
window.onblur=function(){
	topOnBlur("main","来自主窗口的焦点失去");
};

//打开考试页面的左右两侧
function openExam(){
	document.getElementById("examleft").src = baseURL+"/examPaper/toExamLeft?batchId="+batchId+"&examPaperId="+examPaperId+"&studentId="+studentId;
	document.getElementById("examContent").src = baseURL+"/examPaper/toExamContent?batchId="+batchId+"&examPaperId="+examPaperId+"&partNum="+partNum;
	editCookie("videoPlayStatus_"+studentExamResultId, "1", 60*60*12);
}
var focusEnable_ = focusEnable;
var downLoadSwitch = true;//预加载系统开关，默认为true：开启，false:关闭
function downLoadMedia(){
	/* staticURL = "http://117.121.9.117/static/itest/";
	editCookie("videoPlayStatus_"+studentExamResultId, "0", 60*60*12); */
	var downLoadMediaFlag = getCookieValue("videoPlayStatus_"+studentExamResultId);
	//手机端关闭预加载
	downLoadMediaFlag = IsPC()?downLoadMediaFlag:"1";
	if(!downLoadSwitch)downLoadMediaFlag=1;//如果系统关闭了预下载则跳过预下载
	if(undefined!=downLoadMediaFlag && null!=downLoadMediaFlag && "1"==downLoadMediaFlag){
		openExam();
		return;
	}
	var imediaArr = new Array();
	for(var key in examVideoPlayInfoMap){
		if(undefined!=examVideoPlayInfoMap[key].videoPlayStr && examVideoPlayInfoMap[key].videoPlayStr.length>3){
			var arr = examVideoPlayInfoMap[key].videoPlayStr.split(",");
			for(var i = 0 ; i < arr.length ; i++){
				if((arr[i].toLowerCase().indexOf(".mp3")!=-1)||(arr[i].toLowerCase().indexOf(".mp4")!=-1)||
						(arr[i].toLowerCase().indexOf(".flv")!=-1)||(arr[i].toLowerCase().indexOf(".wmv")!=-1)){
					imediaArr.push(staticURL+"upload/media/"+arr[i]);
				}
			}
		}
	}
	
	if(imediaArr.length>0){
		focusEnable_ = focusEnable;
		focusEnable = false;//关闭防作弊提示框
		$("#loadingWrapper").show();
		$("#loadingWrapper").attr("style" , "position: absolute;top:"+($(".exam_right").eq(0).height()/2-100)+"px;left:"+($(".exam_right").eq(0).width()/2-250 -114)+"px;");
		var swfObj = null;
		var flashvars = {};
		var params = { swliveconnect:'true', allowScriptAccess:'always', quality:'high',wmode:"opaque"};
		var attributes = { id:'fiftestFlash', name:'fiftestFlash' };
		swfobject.embedSWF(staticURL+'libs/thirdparty/loadingz/loadingz.swf', 'loadingDiv', '500', '200', '9.0.0', 'expressInstall.swf', flashvars, params, attributes, function(){
			var settimeout = setInterval(function(){
				swfObj = swfobject.getObjectById('fiftestFlash');
				if(swfObj){
					clearInterval(settimeout);
					try {
						swfObj.startLoading(imediaArr);
					} catch (e) {
						window.location.reload();
					}
				}
			},500);			
		});
		//开启了预下载--先把考试状态置为为开始
		$.ajax({
			type : "POST",
			data : {examPaperId : examPaperId, batchId : batchId, studentId : studentId ,status:0},
			url : baseURL+"/prExamStudent/doUpdet/"+studentExamResultId,
			success: function(msg){}
		});
	}else{
		openExam();
	}
}

function endLoading(data){
	//console.log(JSON.stringify(data));
	if(data.success){
		if(focusEnable_)focusEnable = true;//启用防作弊提示框
		//alert(JSON.stringify(data));
		var extendTime = Math.round(data.duringTime/1000/60);
		/*if(extendTime>0){
			//下载音频后把下载消耗的时间给学生加回来
			$.ajax({
				type : "POST",
				url : baseURL+"/examBatchResult/endLoadingSetDelaytime?batchId="+batchId+"&studentId="+studentId+"&examPaperId="+examPaperId+"&delaytime="+extendTime,
				success: function(msg){
				}
			});
		}*/
		//开启了预下载--下载成功后把考试状态重置为已开始
		$.ajax({
			type : "POST",
			data : {examPaperId : examPaperId, batchId : batchId, studentId : studentId ,status:1},
			url : baseURL+"/prExamStudent/doUpdet/"+studentExamResultId,
			success: function(msg){}
		});
		setTimeout(function(){openExam();$("#loadingWrapper").remove();},100);
	}
}

function editCookie(name, value, expiresHours) {
    var cookieString = name + "=" + escape(value);
    if (expiresHours > 0) {
        var date = new Date();
        date.setTime(date.getTime() + expiresHours * 1000); //单位是毫秒
        cookieString = cookieString + ";expires=" + date.toGMTString();
    }
    document.cookie = cookieString;
}

function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = [ "Android", "iPhone",
	"SymbianOS", "Windows Phone",
	"iPad", "iPod" ];
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}

function getCookieValue(name) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] == name) {
            return unescape(arr[1]);
            break;
        } else {
            continue;
        };
    };
    return "1";
}