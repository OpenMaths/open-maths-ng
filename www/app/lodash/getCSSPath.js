function getCSSPath() {
	return document.location.hostname == "om.dev" ? "/assets/css/screen.css" : "/assets/css/screen.min.css";
}

_.mixin({
	"getCSSPath": getCSSPath
});