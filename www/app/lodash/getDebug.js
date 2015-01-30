function getDebug() {
	var host = document.location.hostname;
	var localHosts = [
		"localhost",
		"om.dev",
		"development.open-maths.divshot.io"
	];

	return (_.indexOf(localHosts, host) == -1) ? false : true;
}

_.mixin({
	"getDebug": getDebug
});