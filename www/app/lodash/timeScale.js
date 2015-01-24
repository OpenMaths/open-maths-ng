// Wikipedia suggests a proofreading speed on screen of 180 wpm,
// but we have more complicated content, so we will go for 125 wpm (average)
var avgWPM = 125;

function timeScale(content) {
	var wordCount = content.match(/(\w+)/g).length;

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