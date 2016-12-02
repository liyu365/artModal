!(function () {

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
        _this.opts.element.style.display = "block";
        _this.opts.element.scrollTop = 0;
        setTimeout(function () {
            addClass(_this.opts.element, 'in');
        }, 0);
        addClass(document.body, 'artModal-open');
        if (_this.check_backdrop() === 0) {
            var backdrop = document.createElement('div');
            addClass(backdrop, 'artModal-backdrop');
            if (hasClass(_this.opts.element, 'fade')) {
                addClass(backdrop, 'fade');
            }
            document.body.appendChild(backdrop);
            setTimeout(function () {
                addClass(backdrop, 'in');
            }, 0);
        }
        if (_this.check_bodyNeedPaddingRight()) {
            document.body.style.paddingRight = "17px";
        }
    };
    Dialog.prototype.close = function () {
        var _this = this;
        removeClass(_this.opts.element, 'in');
        if (_this.check_artModal() === 1) {
            var artModal_backdrop_elements = getElementsByAttribute('class', 'artModal-backdrop');
            for (var i = 0, len = artModal_backdrop_elements.length; i < len; i++) {
                removeClass(artModal_backdrop_elements[i], 'in');
            }
        }
        var time = hasClass(_this.opts.element, 'fade') ? 150 : 0;
        setTimeout(function () {
            _this.opts.element.style.display = "none";
            if (_this.check_artModal() === 0) {
                removeClass(document.body, 'artModal-open');
                document.body.style.paddingRight = "0";
                var artModal_backdrop_elements = getElementsByAttribute('class', 'artModal-backdrop');
                for (var i = 0, len = artModal_backdrop_elements.length; i < len; i++) {
                    artModal_backdrop_elements[i].parentNode.removeChild(artModal_backdrop_elements[i]);
                }
            }
        }, time);
    };
    Dialog.prototype.check_backdrop = function () {
        var backdrop_elements = getElementsByAttribute('class', 'artModal-backdrop');
        return backdrop_elements.length;
    };
    Dialog.prototype.check_artModal = function () {
        var artModal_elements = getElementsByAttribute('class', 'artModal');
        var opened_artModal_elements = [];
        for (var i = 0, len = artModal_elements.length; i < len; i++) {
            if (artModal_elements[i].style.display == 'block') {
                opened_artModal_elements.push(artModal_elements[i]);
            }
        }
        return opened_artModal_elements.length;
    };
    Dialog.prototype.check_bodyNeedPaddingRight = function () {
        var _this = this;
        return getViewportSize().w > 992 && _this.opts.element.scrollHeight > getViewportSize().h;
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

    //返回视口尺寸（window.innerWidth 包括页面的滚动条，其让方式获得视口宽度都不包括滚动条，媒体查询的尺寸侦听是包括滚动条的）
    function getViewportSize(w) {
        w = w || window;
        //除了IE8和更早的版本以外
        if (w.innerWidth != null) {
            return {w: w.innerWidth, h: w.innerHeight};
        } else {
            var d = w.document;
            //对标准模式下的IE（或其他浏览器）
            if (document.compatMode == "CSS1Compat") {
                return {w: d.documentElement.clientWidth, h: d.documentElement.clientHeight};
            } else {
                //对怪异模式下的浏览器
                return {w: d.body.clientWidth, h: d.body.clientHeight};
            }
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