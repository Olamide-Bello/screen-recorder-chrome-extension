document.addEventListener("DOMContentLoaded", () => {
    const startRec = document.getElementById("start")
    const exitBtn = document.getElementById("exit")
    const settingBtn = document.getElementById("setting")
    const tabBtn = document.getElementById("tabBtn")
    const monitorBtn = document.getElementById("monitorBtn")
    const showCam = document.getElementById("webcam")
    const showMic = document.getElementById("mic")

    exitBtn.addEventListener("click", () => {
        window.close()
    })

    settingBtn.addEventListener("click", () => {
        const camOpt = document.getElementById("camera")
        const audOpt = document.getElementById("audio")
        if (camOpt.classList.contains("options")) {
            camOpt.classList.remove("options")
            audOpt.classList.remove("options")
            camOpt.classList.add("removed")
            audOpt.classList.add("removed")
        } else if (camOpt.classList.contains("removed")) {
            camOpt.classList.add("options")
            audOpt.classList.add("options")
            camOpt.classList.remove("removed")
            audOpt.classList.remove("removed")
        }
    })

    let showTab = false

    monitorBtn.addEventListener("click", () => {
        const tabBt = document.getElementById("tabBtn")
        tabBt.classList.remove("selected")
        tabBt.classList.add("not-selected")
        monitorBtn.classList.add("selected")
        monitorBtn.classList.remove("not-selected")
        showTab= false

    })

    tabBtn.addEventListener("click", () => {
        const monitor = document.getElementById("monitorBtn")
        monitor.classList.remove("selected")
        monitor.classList.add("not-selected")
        tabBtn.classList.add("selected")
        tabBtn.classList.remove("not-selected")
        showTab= true
    })


    startRec.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

            chrome.storage.local.get("userid", function (d) {
                chrome.tabs.sendMessage(tabs[0].id,
                    {
                        action: "start",
                        chromeId: d.userid,
                        currentTab: showTab,
                    }, (response) => {
                        if (!chrome.runtime.lastError) {
                            console.log(response)
                        } else {
                            console.log(chrome.runtime.lastError, "error in line 68")
                        }
                    })
            })

        })
    })


    showCam.addEventListener("click", () => {
        if(showCam.classList.contains("opt-btn")) {
            showCam.classList.add("chosen")
            showCam.classList.remove("opt-btn")

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "start_camera" }, (response) => {
                    if (!chrome.runtime.lastError) {
                        console.log(response)
                    } else {
                        console.log(chrome.runtime.lastError, "error in line 85")
                    }
                })
            })
        } else if(showCam.classList.contains("opt-btn") === false) {
            showCam.classList.add("opt-btn")
            showCam.classList.remove("chosen")

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "stop_camera" }, (response) => {
                    if (!chrome.runtime.lastError) {
                        console.log(response)
                    } else {
                        console.log(chrome.runtime.lastError, "error in line 98")
                    }
                })
            })
        }
    })

    showMic.addEventListener("click", () => {
        if(showMic.classList.contains("opt-btn")) {
            showMic.classList.add("chosen")
            showMic.classList.remove("opt-btn")

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "start_mic" }, (response) => {
                    if (!chrome.runtime.lastError) {
                        console.log(response)
                    } else {
                        console.log(chrome.runtime.lastError, "error in line 85")
                    }
                })
            })
        } else if(showMic.classList.contains("opt-btn") === false) {
            showMic.classList.add("opt-btn")
            showMic.classList.remove("chosen")

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: "stop_mic" }, (response) => {
                    if (!chrome.runtime.lastError) {
                        console.log(response)
                    } else {
                        console.log(chrome.runtime.lastError, "error in line 98")
                    }
                })
            })
        }
    })
    
})
