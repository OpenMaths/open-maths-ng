function getApiUrl() {
	return _.getDebug() ? "http://api.om.dev/" : "https://api.openmaths.io/";
}

_.mixin({
	"getApiUrl": getApiUrl
});