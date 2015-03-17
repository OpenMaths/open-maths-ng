function getDebug() {
	var host = document.location.hostname;
	var localHosts = [
		"localhost",
		"om.dev"
	];

	return (_.contains(localHosts, host)) ? true : false;
}

_.mixin({
	"getDebug": getDebug
});