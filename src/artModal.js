(function () {

    var Dialog = function (options) {
        var _this = this;
        var def_options = {};
        _this.opts = extend(def_options, options);

        //阻止.artModal-dialog元素的click事件冒泡
        var artModal_dialog = getElementsByAttribute('class', 'artModal-dialog', _this.opts.element)[0];
        if (artModal_dialog !== null) {
            artModal_dialog.onclick = function (event) {
                var e = event || window.event;
                unPropagation(e);
            };
        }

        //.artModal元素click后关闭该模态框
        _this.opts.element.onclick = function () {
            _this.close();
        };

        //.artModal元素中所有[data-dismiss='artModal']的元素click后关闭该模态框
        var dismissElements = getElementsByAttribute('data-dismiss', 'artModal', _this.opts.element);
        for (var i = 0, len = dismissElements.length; i < len; i++) {
            (function (i) {
                dismissElements[i].onclick = function () {
                    _this.close();
                }
            })(i);
        }
    };
    Dialog.prototype.open = function () {
        var _this = this;
        addClass(document.body, 'artModal-open');
        _this.opts.element.style.display = "block";
        _this.opts.element.scrollTop = 0;
        var backdrop = document.createElement('div');
        addClass(backdrop, 'artModal-backdrop');
        document.body.appendChild(backdrop);
    };
    Dialog.prototype.close = function () {
        var _this = this;
        _this.opts.element.style.display = "none";
        removeClass(document.body, 'artModal-open');
        var artModal_backdrop_elements = getElementsByAttribute('class', 'artModal-backdrop');
        for (var i = 0, len = artModal_backdrop_elements.length; i < len; i++) {
            artModal_backdrop_elements[i].parentNode.removeChild(artModal_backdrop_elements[i]);
        }
    };

    var artModal = function (options) {
        return new Dialog(options);
    };

    function bindEvent(event) {
        var e = event || window.event;
        var trigger = e.target || e.srcElement;
        while (trigger !== document.body && trim(trigger.getAttribute('data-toggle')) !== 'artModal') {
            trigger = trigger.parentNode;
            if (trigger === document.body) {
                trigger = null;
                break;
            }
        }
        if (trigger !== null && trim(trigger.getAttribute('data-target')) !== '') {
            var targetElement = document.getElementById(trigger.getAttribute('data-target'));
            var dialog = artModal({
                element: targetElement
            });
            dialog.open();
        }
    }
    attachEventListener(document.body, 'click', bindEvent);
    var artModal_dialog_elements = getElementsByAttribute('class', 'artModal-dialog');
    for (var i = 0, len = artModal_dialog_elements.length; i < len; i++) {
        (function (i) {
            attachEventListener(artModal_dialog_elements[i], 'click', bindEvent);
        })(i);
    }


    /**
     * utils----------------------------------------------------------------------------------
     */

    //根据属性名获取元素集合
    function getElementsByAttribute(attribute, attributeValue, queryElement) {
        var elementArray = [];
        var matchedArray = [];
        var qElement = document;
        if (typeof queryElement !== 'undefined') {
            qElement = queryElement;
        }
        if (qElement.all) {
            elementArray = qElement.all;
        } else {
            elementArray = qElement.getElementsByTagName("*");
        }
        for (var i = 0, len = elementArray.length; i < len; i++) {
            if (attribute == "class") {
                var pattern = new RegExp("(\\s|^)" + attributeValue + "(\\s|$)");
                if (pattern.test(elementArray[i].className)) {
                    matchedArray[matchedArray.length] = elementArray[i];
                }
            } else if (attribute == "for") {
                if (elementArray[i].getAttribute("htmlFor") || elementArray[i].getAttribute("for")) {
                    if (elementArray[i].htmlFor == attributeValue) {
                        matchedArray[matchedArray.length] = elementArray[i];
                    }
                }
            } else if (elementArray[i].getAttribute(attribute) == attributeValue) {
                matchedArray[matchedArray.length] = elementArray[i];
            }
        }

        return matchedArray;
    }

    //事件监听
    function attachEventListener(target, eventType, handler) {
        if (typeof target.addEventListener != "undefined") {
            target.addEventListener(eventType, handler, false);
        } else if (typeof target.attachEvent != "undefined") {
            target.attachEvent("on" + eventType, handler);
        } else {
            target["on" + eventType] = handler;
        }
    }

    function detachEventListener(target, eventType, handler) {
        if (typeof target.removeEventListener != "undefined") {
            target.removeEventListener(eventType, handler, false);
        } else if (typeof target.detachEvent != "undefined") {
            target.detachEvent("on" + eventType, handler);
        } else {
            target["on" + eventType] = null;
        }
    }

    //去掉字符串首尾空格
    var trim = function (str) {
        if (typeof str !== 'string') {
            return '';
        }
        return str.replace(/^\s*|\s*$/g, '');
    };

    //操作class
    function hasClass(elements, cName) {
        return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
    }

    function addClass(elements, cName) {
        if (!hasClass(elements, cName)) {
            elements.className += " " + cName;
        }
    }

    function removeClass(elements, cName) {
        if (hasClass(elements, cName)) {
            elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
        }
    }

    //对象属性继承
    function extend(obj1, obj2) {
        for (var k in obj2) {
            obj1[k] = obj2[k];
        }
        return obj1;
    }

    //阻止默认事件
    function stopDefaultAction(event) {
        if (event.preventDefault) {
            event.preventDefault();  //标准
        } else {
            event.returnValue = false;  //IE6,7,8
        }
    }

    //防止事件冒泡
    function unPropagation(event) {  //这里的event已经确定是事件对象，不为空了
        if (event.stopPropagation) {
            event.stopPropagation();  //标准
        } else {
            //event.cancelBubble不能作为判定这个属性有无的表达式，因为event.cancelBubble的默认值就是false
            event.cancelBubble = true;  //IE6,7,8
        }
    }

    if (typeof define === 'function') {
        define(function () {
            return artModal;
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = artModal;
    } else {
        this.artModal = artModal;
    }
})();