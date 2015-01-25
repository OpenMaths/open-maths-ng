function cleanseCSV(str) {
	var vals = str.split(",");

	return _.map(vals, function(val) { return val.trim(); });
};

_.mixin({
	"cleanseCSV": cleanseCSV
});