/*************************************
/* jQuery Document Ready
/*************************************/
$(function () {


});
/*************************************
/* Global Var
/*************************************/


/*************************************
/* Functions
/*************************************/


/*************************************
/* Functions Common
/*************************************/

// is number even
function isEven(n) {
   return parseInt(n) && (n % 2 == 0);
}
// is number odd
function isOdd(n) {
   return parseInt(n) && (Math.abs(n) % 2 == 1);
}
// is object empty
function isEmpty(obj) {
	for (var prop in obj) {
		if (obj.hasOwnProperty(prop))
			return false;
	}
	return true;
}
// decode HTML markup in string
function decodeHTML(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
// get URL parameter
function gup(name) {
	return decodeURIComponent((new RegExp('[?|&&amp;]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}