function getDebug() {
	var host = document.location.hostname;
	var localHosts = [
		"localhost",
		"om.dev",
		"app.openmaths.io"
	];

	return (_.contains(localHosts, host)) ? true : false;
}

_.mixin({
	"getDebug": getDebug
});