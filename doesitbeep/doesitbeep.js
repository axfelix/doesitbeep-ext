// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if( request.message === "clicked_page_action" ) {
            var matched = false;
            a = FuzzySet();
            $.getJSON('https://doesitbeep.com/api/beep.json', function(data) {
                var jsonld = document.querySelectorAll('script[type="application/ld+json"]');
                for (var i = 0; i < jsonld.length; i++) {
                    var jsondata = JSON.parse(jsonld[i].innerText);
                    if (jsondata["@type"] === "ItemList") {
                        var itemName = jsondata["itemListElement"][0]["item"]["name"];
                        a.add(itemName);
                        for (var product in data) {
                            var match = a.get(decodeURIComponent(data[product]["title"]));
                            if (match !== null) {
                                chrome.runtime.sendMessage({"message": "open_new_tab", "url": "https://doesitbeep.com/".concat(data[product]["url"])});
                                matched = true;
                                break;
                            }
                        }
                        if (matched === false) {
                            var url = "https://github.com/axfelix/doesitbeep/issues/new?assignees=axfelix&labels=BEEPS&template=new-thing-that-beeps.md&title=".concat(encodeURIComponent(itemName)); 
                            chrome.runtime.sendMessage({"message": "open_new_tab", "url": url});
                        }
                    }
                }
            });
        }
    }
);