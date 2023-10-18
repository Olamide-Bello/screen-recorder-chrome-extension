function getRandomChars() {
    var chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var randomChars = "anon";
    for (var i = 0; i < 10; i++) {
        var randomIndex = Math.floor(Math.random() * chars.length);
        randomChars += chars.charAt(randomIndex);
    }
    return randomChars;
}
// function getRandomToken() {
//     // Generate random 6 characters

//     var now = new Date();
//     var year = now.getFullYear();
//     var month = String(now.getMonth() + 1).padStart(2, "0"); // Month is zero-based
//     var date = String(now.getDate()).padStart(2, "0");
//     var hours = String(now.getHours()).padStart(2, "0");
//     var minutes = String(now.getMinutes()).padStart(2, "0");
//     var seconds = String(now.getSeconds()).padStart(2, "0");

//     // Generate random pool
//     var randomPool = new Uint8Array(64);
//     crypto.getRandomValues(randomPool);
//     var hex = "";
//     for (var i = 0; i < randomPool.length; ++i) {
//         hex = hex + randomPool[i].toString(16);
//     }

//     var randomChars = getRandomChars();
//     console.log(randomChars)
//     console.log(hex)

//     // Construct the token in the desired format
//     var token = `${year}-${month}-${date}-${hours}-${minutes}-${seconds}-${randomChars}`;
//     return token;
// }


// chrome.storage.sync.get("userid", function (items) {
//     var userid = items.userid;
//     if (userid) {
//         return;
//     } else {
//         userid = getRandomChars();
//         chrome.storage.sync.set({ userid: userid });
//     }
// });

chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    if (message.action === "FROM_PAGE") {
        var loggedUser = message.username
        console.log(message)
        if (loggedUser) {
            chrome.storage.local.set({ userid: loggedUser });
            console.log("logged in: " + loggedUser)
            return;
        } else {
            chrome.storage.local.get("chromeid", function (items) {
                if (items.chromeid) {
                    chrome.storage.local.set({ userid: items.chromeid });
                    console.log("logged out: " + items.chromeid)
                    return;
                } else {
                    chromeid = getRandomChars();
                    chrome.storage.local.set({ chromeid: chromeid });
                    chrome.storage.local.set({ userid: chromeid });
                    console.log("first time: " + chromeid)
                }
            })
        }
    }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId },
            files: ['./content.js']
        }).then(() => {
            console.log("injected")
        }).catch(error => console.log(error, "error in background script"))
    }
})