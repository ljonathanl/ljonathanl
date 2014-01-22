var DomUtil;
(function (DomUtil) {
    function before(element, insert) {
        if (element.parentNode) {
            element.parentNode.insertBefore(insert, element);
        }
    }
    DomUtil.before = before;

    function after(element, insert) {
        if (element.parentNode) {
            element.parentNode.insertBefore(insert, element.nextSibling);
        }
    }
    DomUtil.after = after;

    function index(element) {
        for (var k = 0, e = element; e = e.previousElementSibling; ++k)
            ;
        return k;
    }
    DomUtil.index = index;
})(DomUtil || (DomUtil = {}));
