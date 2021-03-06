//该文件是js与本地服务交互时的接口文档
//文件使用说明：
//  1.web端引用该文件后，需要首先调用init方法进行初始化，才可调用其他方法

/*
szad.init();
var ss=function(value){
    console.log(value);
}
szad.getRegistrationID(ss)*/


//<***
var szad = szad || {};

//获取推送用户标识接口(这只是一个示例方法)
//参数：
//  callback: function (registrationID) {
//     registrationID 推送用户标识
// }
//平台说明：
//	1.安卓：其中jpush是需要注册到context中的方法名
//	2.iOS：szjpush是注入到context的模块儿名称，szjpush.getRegistrationID是调用的模块儿下提供的对应方法
szad.getRegistrationID = function getRegistrationID(callback) {
    if (this.clientType === "android") {
        window.WebViewJavascriptBridge.callHandler('jpush', {}, function(responseData) {
            if (responseData.code == 0) {
                callback(responseData.registId);
                return;
            }
            callback("");
        });
    } else if (this.clientType === "ios") {
        return szjpush.getRegistrationID(callback);
    }
}
//***>

//<=== 文档初始化相关

//<jsbridge: https://github.com/lzyzsd/JsBridge
szad.connectWebViewJavascriptBridge = function connectWebViewJavascriptBridge(callback) {
    console.info("connectWebViewJavascriptBridge 方法执行");
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady',
            function() {
                callback(WebViewJavascriptBridge)
            },
            false
        );
    }
}

szad.connectWebViewJavascriptBridge(function(bridge) {
    bridge.init(function(message, responseCallback) {
        console.log('JS got a message', message);
        var data = {
            'Javascript Responds': '测试中文!'
        };
        console.log('JS responding with', data);
        responseCallback(data);
    });

    bridge.registerHandler("logOnHtml", function(data, responseCallback) {
        bridgeLog("data from Java: = " + data);
        var responseData = "Javascript Says Right back aka!";
        responseCallback(responseData);
    });
})
//jsbridge>

szad.initFlag = false;
szad.init = function() {

    if (this.initFlag) {
        return;
    }
    this.initFlag = true;

    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf('android') != -1 || agent.indexOf('linux') != -1) {
        this.clientType = "android";
    } else if (agent.indexOf("iphone") != -1) {
        this.clientType = "ios";
    }
    console.info("设置平台为：" + szad.clientType);

    if (window.WebViewJavascriptBridge) {
        return;
    }

    var messagingIframe;
    var sendMessageQueue = [];
    var receiveMessageQueue = [];
    var messageHandlers = {};

    var CUSTOM_PROTOCOL_SCHEME = 'yy';
    var QUEUE_HAS_MESSAGE = '__QUEUE_MESSAGE__/';

    var responseCallbacks = {};
    var uniqueId = 1;

    function _createQueueReadyIframe(doc) {
        messagingIframe = doc.createElement('iframe');
        messagingIframe.style.display = 'none';
        doc.documentElement.appendChild(messagingIframe);
    }

    //set default messageHandler
    function init(messageHandler) {
        if (WebViewJavascriptBridge._messageHandler) {
            throw new Error('WebViewJavascriptBridge.init called twice');
        }
        WebViewJavascriptBridge._messageHandler = messageHandler;
        var receivedMessages = receiveMessageQueue;
        receiveMessageQueue = null;
        for (var i = 0; i < receivedMessages.length; i++) {
            _dispatchMessageFromNative(receivedMessages[i]);
        }
    }

    function send(data, responseCallback) {
        _doSend({
            data: data
        }, responseCallback);
    }

    function registerHandler(handlerName, handler) {
        messageHandlers[handlerName] = handler;
    }

    function callHandler(handlerName, data, responseCallback) {
        _doSend({
            handlerName: handlerName,
            data: data
        }, responseCallback);
    }

    //sendMessage add message, 触发native处理 sendMessage
    function _doSend(message, responseCallback) {
        if (responseCallback) {
            var callbackId = 'cb_' + (uniqueId++) + '_' + new Date().getTime();
            responseCallbacks[callbackId] = responseCallback;
            message.callbackId = callbackId;
        }

        sendMessageQueue.push(message);
        messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
    }

    // 提供给native调用,该函数作用:获取sendMessageQueue返回给native,由于android不能直接获取返回的内容,所以使用url shouldOverrideUrlLoading 的方式返回内容
    function _fetchQueue() {
        var messageQueueString = JSON.stringify(sendMessageQueue);
        sendMessageQueue = [];
        //android can't read directly the return data, so we can reload iframe src to communicate with java
        messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://return/_fetchQueue/' + encodeURIComponent(messageQueueString);
    }

    //提供给native使用,  处理一次java对js的调用
    function _dispatchMessageFromNative(messageJSON) {
        setTimeout(function() {
            var message = JSON.parse(messageJSON);
            var responseCallback;
            //如果存在responseId表示是js调用java方法成功后回调js的方法
            if (message.responseId) {
                responseCallback = responseCallbacks[message.responseId];
                if (!responseCallback) {
                    return;
                }
                responseCallback(JSON.parse(message.responseData));
                delete responseCallbacks[message.responseId];
            } else {
                //java调用js方法
                if (message.callbackId) {
                    var callbackResponseId = message.callbackId;
                    responseCallback = function(responseData) {
                        _doSend({
                            responseId: callbackResponseId,
                            responseData: responseData
                        });
                    };
                }

                var handler = WebViewJavascriptBridge._messageHandler;
                if (message.handlerName) {
                    handler = messageHandlers[message.handlerName];
                }
                //查找指定handler
                try {
                    handler(message.data, responseCallback);
                } catch (exception) {
                    if (typeof console != 'undefined') {
                        console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception);
                    }
                }
            }
        });
    }

    /*
        提供给native调用,receiveMessageQueue 在会在页面加载完后赋值为null,所以
    */
    function _handleMessageFromNative(messageJSON) {
        console.log(messageJSON);
        if (receiveMessageQueue && receiveMessageQueue.length > 0) {
            receiveMessageQueue.push(messageJSON);
        } else {
            _dispatchMessageFromNative(messageJSON);
        }
    }

    var WebViewJavascriptBridge = window.WebViewJavascriptBridge = {
        init: init,
        send: send,
        registerHandler: registerHandler,
        callHandler: callHandler,
        _fetchQueue: _fetchQueue,
        _handleMessageFromNative: _handleMessageFromNative
    };

    var doc = document;
    _createQueueReadyIframe(doc);
    var readyEvent = doc.createEvent('Events');
    readyEvent.initEvent('WebViewJavascriptBridgeReady');
    readyEvent.bridge = WebViewJavascriptBridge;
    doc.dispatchEvent(readyEvent);
}
//===>
