/* Send templates with w3w location */
(() => {
  'use strict';
  // main() :: Body of script and local functions 
  const main = () => {
    const getWords = () => {
      // Create API credential
      const credential = Credential.create("what3words API", "Key to access what3words REST API");
      credential.addTextField("Api_Key", "API Key");
      credential.authorize();
      const cLon = draft.createdLongitude,
        cLat = draft.createdLatitude,
        coords = `${cLat},${cLon}`,
        apiKey = credential.getValue("Api_Key"),
        http = HTTP.create(),
        base_url = "https://api.what3words.com/v2/reverse?",
        params = {
          "coords": coords,
          "key": apiKey,
          "lang": "en",
          "format": "json",
          "display": "full"
        };
      let strs = [];
      for (let k of Object.keys(params)) {
        strs.push(`${k}=${encodeURIComponent(params[k])}`);
      }
      const url = base_url + strs.join('&'),
        response = http.request({
          "url": url,
          "method": "GET"
        });
      if (response.success) {
        const text = response.responseText;
        return JSON.parse(text);
      } else {
        console.log(response.statusCode);
        console.log(response.error);
      }
    }
    const data = getWords(),
      words = data.words,
      mapLink = data.map;
    if (words) {
      // Create prompt
      const p = Object.assign(Prompt.create(), {
          title: "Location",
          message: "Share Location",
          isCancellable: true
        }),
        // Build 2d array of buttons/actions
        buttons = [
          ['Copy to Clipboard', () => app.setClipboard(words)],
          ['Open in what3words', () => app.openURL(mapLink)],
          ['Create Template with Loc', () => createTemplateDraft(mapLink)],
          ['Create Draft Copy with Loc', () => createDraftCopyWithLoc(mapLink)]
        ],
        bMap = new Map(buttons);
      bMap.forEach((v, k) => p.addButton(k))
      const picked = p.show();
      if (picked) {
        bMap.get(p.buttonPressed)();
      } else {
        context.cancel();
      }
    }
  }
  // MAIN --------------------------------
  // createTemplateDraft :: w3w link -> Template msg
  const createTemplateDraft = locLink => {
    const msg = `I am waiting here. Give me a call if any issues.\n\n${locLink}`,
      d = Draft.create();
    d.content = msg;
    d.update();
    editor.load(d);
  };
  // createDraftCopyWithLoc :: w3w link -> Copy with loc link and msg
  const createDraftCopyWithLoc = locLink => {
    const createTime = draft.createdAt.toString("F"),
    origText = draft.content,
    newText = `As discussed, here are the notes I made:\n\n${origText}\n\n${createTime}\n\n${locLink}`,
    d = Draft.create();
    d.content = newText;
    d.update();
    editor.load(d);
  };
  return main();
})();