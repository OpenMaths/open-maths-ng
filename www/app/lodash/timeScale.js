function timeScale(content) {
	// Wikipedia suggests a proofreading speed on screen of 180 wpm,
	// but since we present a bit more complicated content,
	// we will go for 125 wpm (avg)
	var avgWPM = 125;
	var words = content.match(/(\w+)/g);

	if (_.isNull(words)) {
		return "30 sec";
	}

	var wordCount = words.length;

	if (wordCount < 60) {
		return "30 sec";
	} else if (wordCount < 120) {
		return "1 min";
	} else if (wordCount < 240) {
		return "2 min";
	} else if (wordCount < 360) {
		return "3 min";
	} else if (wordCount < 480) {
		return "4 min";
	} else if (wordCount < 600) {
		return "5 min";
	} else {
		return Math.floor(wordCount / avgWPM) + " min";
	}
}

_.mixin({
	"timeScale": timeScale
});