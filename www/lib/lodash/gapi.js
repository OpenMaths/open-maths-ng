function gapiShadow() {
	console.log(gapi.auth.signOut());
//	return gapi;
}

_.mixin({
	"gapi": gapiShadow
});


