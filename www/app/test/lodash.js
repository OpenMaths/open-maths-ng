"use strict";

describe("Capitalise", function () {
	it("should capitalise strings", function () {
		var a = _.capitalise("foo");
		var b = _.capitalise("foo bar");

		expect(a).toEqual("Foo");
		expect(b).toEqual("Foo bar");
	});
});

describe("Cleanse CSV", function () {
	it("should get rid of unnecessary spaces between comma-separated values in a string", function () {
		var a = _.cleanseCSV("foo, bar   , foobar ,   barfoo");

		expect(a).toEqual(["foo", "bar", "foobar", "barfoo"]);
	});
});

describe("Return Layout", function () {
	it("should return the path to a layout.html file within a particular section", function () {
		var a = _.returnLayout("dive");

		expect(a).toEqual("app/sections/section.dive/layout.html");
	});
});

describe("Time Scale", function () {
	it("should return an approximate time to read a particular block of text based on a number of words", function () {
		var shortString = "Stumptown put a bird on it selfies leggings. Squid blog keffiyeh, authentic polaroid crucifix freegan Pinterest butcher jean shorts occupy Wes Anderson leggings distillery four dollar toast.";
		var longString = "Stumptown put a bird on it selfies leggings. Squid blog keffiyeh, authentic polaroid crucifix freegan Pinterest butcher jean shorts occupy Wes Anderson leggings distillery four dollar toast. Cliche whatever post-ironic actually Echo Park, Intelligentsia freegan quinoa keffiyeh church-key art party. Health goth lumbersexual typewriter yr. Forage sustainable cliche, dreamcatcher gluten-free small batch brunch pork belly try-hard taxidermy. IPhone YOLO synth trust fund. Plaid polaroid semiotics sustainable next level.";
		var longerString = "Stumptown put a bird on it selfies leggings. Squid blog keffiyeh, authentic polaroid crucifix freegan Pinterest butcher jean shorts occupy Wes Anderson leggings distillery four dollar toast. Cliche whatever post-ironic actually Echo Park, Intelligentsia freegan quinoa keffiyeh church-key art party. Health goth lumbersexual typewriter yr. Forage sustainable cliche, dreamcatcher gluten-free small batch brunch pork belly try-hard taxidermy. IPhone YOLO synth trust fund. Plaid polaroid semiotics sustainable next level. Fap cornhole Etsy, typewriter master cleanse put a bird on it meh taxidermy XOXO bespoke disrupt food truck authentic Pitchfork. Farm-to-table gentrify wayfarers, Godard ennui cred bespoke synth vegan pickled sriracha you probably haven't heard of them quinoa. Biodiesel wayfarers DIY, banh mi gluten-free Schlitz church-key authentic tote bag 90's viral asymmetrical brunch kitsch. Pug chia tousled, Shoreditch shabby chic XOXO food truck messenger bag tofu polaroid distillery. Banh mi taxidermy bicycle rights banjo Shoreditch, cred 90's disrupt pop-up shabby chic seitan lumbersexual.";

		var shortTime = _.timeScale(shortString);
		var longTime = _.timeScale(longString);
		var longerTime = _.timeScale(longerString);

		expect(shortTime).toEqual("30 sec");
		expect(longTime).toEqual("1 min");
		expect(longerTime).toEqual("2 min");
	});
});