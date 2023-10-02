document.addEventListener("DOMContentLoaded", () => {
    const startRec = document.getElementById("start")
    const cameraOption = document.getElementById("camera")

    startRec.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "request_recording" }, (response) => {
                if (!chrome.runtime.lastError) {
                    console.log(response)
                } else {
                    console.log(chrome.runtime.lastError, "error in line 11")
                }
            })
        })
    })

    cameraOption.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "start_camera" }, (response) => {
                if (!chrome.runtime.lastError) {
                    console.log(response)
                } else {
                    console.log(chrome.runtime.lastError, "error in line 23")
                }
            })
        })
    })


    // stopRec.addEventListener("click", ()=> {
    //     chrome.tabs.query({active: true, currentWindow: true}, (tabs)=> {
    //         chrome.tabs.sendMessage(tabs[0].id, {action: "stop_recording"}, (response) => {
    //             if (!chrome.runtime.lastError) {
    //                 console.log(response)
    //             } else {
    //                 console.log(chrome.runtime.lastError, "error in line 23")
    //             }
    //         })
    //     })
    // })
})