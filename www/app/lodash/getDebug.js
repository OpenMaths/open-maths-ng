function getDebug() {
	var host = document.location.hostname;
	return host == "om.dev" || host == "development.open-maths.divshot.io" ? true : false;
}

_.mixin({
	"getDebug": getDebug
});