function getCSSPath() {
	return _.getDebug() ? "/assets/css/screen.css" : "/assets/css/screen.min.css";
}

_.mixin({
	"getCSSPath": getCSSPath
});