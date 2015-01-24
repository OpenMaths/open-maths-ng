function getApiUrl() {
	return document.location.hostname == "om.dev" ? "http://api.om.dev/" : "https://146.148.119.150/";
}

_.mixin({
	"getApiUrl": getApiUrl
});