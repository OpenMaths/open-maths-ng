function checkKeys(requiredKeys, keys) {
	var returnVal = true;

	_.every(requiredKeys, function (k) {
		var contains = _.contains(keys, k);

		// A way to break from the loop
		if (!contains) {
			returnVal = false;
			return returnVal;
		}
		return returnVal;
	});

	return returnVal;
}

_.mixin({
	"checkKeys": checkKeys
});