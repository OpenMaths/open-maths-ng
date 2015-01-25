function getDebug() {
	return document.location.hostname == "om.dev" ? true : false;
}

_.mixin({
	"getDebug": getDebug
});