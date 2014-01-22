module DomUtil {
	export function before(element:Element, insert:Element) {
		if (element.parentNode) {
            element.parentNode.insertBefore(insert, element);
        }
	}

	export function after(element:Element, insert:Element) {
		if (element.parentNode) {
            element.parentNode.insertBefore(insert, element.nextSibling);
        }
	}

	export function index(element:Element) {
		for (var k=0,e=element; e = e.previousElementSibling; ++k);
		return k;
	}
}