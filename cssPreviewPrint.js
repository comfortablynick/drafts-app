/* Pick CSS Draft and Preview/Print */
(() => {
   // Add tag(s) that identify your CSS files
	const tags = ['css'];
	const draftsFound = Draft.query("", "all", tags);
	const draftAry = [];

	// Sort CSS drafts by modified date
	draftsFound.sort((a, b) => {
		return a.modifiedAt < b.modifiedAt;
	});

	// Create array with draft names and UUID
	for (let d of draftsFound) {
		draftAry.push([d.title.replace(/[*\/]/g, '').trim(), d.uuid]);
	}
	// Load array in to a Map
	const draftMap = new Map(draftAry);

	const p = Prompt.create();
	p.title = "Choose CSS";
	p.message = "Pick CSS file to render document"

	draftMap.forEach((v, k) => {
		p.addButton(k);
	});

	const response = p.show();

	if (response) {
		const pickedDraft = draftMap.get(p.buttonPressed);
		// Get draft CSS contents and load into template
		if (pickedDraft == draft.uuid) {
			context.fail("Cannot apply CSS file to itself!");
		} else {
			const css = Draft.find(pickedDraft).content;
			draft.setTemplateTag("css", css);
		}
	} else {
		context.cancel();
	};
})();