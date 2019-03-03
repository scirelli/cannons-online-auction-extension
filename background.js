// Called when the url of a tab changes.
// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(function checkForValidUrl(tabId, changeInfo, tab) {
    if(tab.url.indexOf('bid.cannonsauctions.com/cgi-bin/mmlist.cgi') > -1) {
        chrome.pageAction.setPopup({
            tabId: tabId,
            popup: 'itemDetails/popup.html'
        });
        chrome.pageAction.show(tabId);
    } else if(tab.url.indexOf('bid.cannonsauctions.com/cgi-bin/mmcal') > -1) {
        chrome.pageAction.setPopup({
            tabId: tabId,
            popup: 'calendar/popup.html'
        });
        chrome.pageAction.show(tabId);
    } else if (tab.url.indexOf('bid.cannonsauctions.com/cgi-bin/mmlist') > -1) {
        chrome.pageAction.setPopup({
            tabId: tabId,
            popup: 'searchResults/popup.html'
        });
        chrome.pageAction.show(tabId);
    }
});

chrome.runtime.onMessage.addListener(function(oResponse, sender, sendResponse) {
    console.log(oResponse);

    return true;
});

/*
chrome.cookies.onChanged.addListener(function(info) {
  console.log("onChanged" + JSON.stringify(info));
});
*/
