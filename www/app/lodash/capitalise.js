function capitalise(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

_.mixin({
	"capitalise": capitalise
});