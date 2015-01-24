function returnLayout(section) {
	return "app/sections/section." + section + "/layout.html";
}

_.mixin({
	"returnLayout": returnLayout
});
