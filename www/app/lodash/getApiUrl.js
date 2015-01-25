function getApiUrl() {
	return document.location.hostname == "om.dev" ? "http://api.om.dev/" : "https://api.openmaths.io/";
}

_.mixin({
	"getApiUrl": getApiUrl
});