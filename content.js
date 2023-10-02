console.log('I dey here o')

var recorder;
function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function(c) {
        var r= Math.random() * 16 | 0,
        v=c== 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16)
    })
}

function onAccessApproved(stream) {
    recorder = new MediaRecorder(stream)
    recorder.start()
    console.log("here")


    if (recorder) {
        const host = document.createElement("div")
        const shadow = host.attachShadow({ mode: "open" })
        shadow.innerHTML = `
        <style>
            :host {
                width: 490px;
                height: 60px;
            },

        </style>
        `
        const utils = document.createElement("div")
        const record = document.createElement("img")
        record.style.width = "10px"
        record.style.height= "10px"
        const pause = document.createElement("img")
        pause.style.width = "35px"
        pause.style.height = "35px"
        const play = document.createElement("img")
        play.style.width = "35px"
        play.style.height = "35px"
        play.style.borderRadius = "35px"
        play.style.backgroundColor= "#fff"
        const stop = document.createElement("img")
        stop.style.width = "35px"
        stop.style.height = "35px"
        const camera = document.createElement("img")
        camera.style.width = "35px"
        const audio = document.createElement("img")
        audio.style.width = "35px"
        const trash = document.createElement("img")
        const pauseText = document.createElement("span")
        pauseText.style.lineHeight= "1.7"
        pauseText.style.fontSize= "14px"
        const playText = document.createElement("span")
        playText.style.lineHeight= "1.7"
        playText.style.fontSize= "14px"
        const stopText = document.createElement("span")
        stopText.style.fontSize= "14px"
        stopText.style.lineHeight= "1.7"
        const cameraText = document.createElement("span")
        cameraText.style.fontSize= "14px"
        const audioText = document.createElement("span")
        audioText.style.fontSize= "14px"
        pauseText.textContent = "Pause"
        playText.textContent = "Record"
        stopText.textContent = "Stop"
        cameraText.textContent = "Camera"
        audioText.textContent = "Mic"
        pause.src = "https://res.cloudinary.com/dzsomaq4z/image/upload/v1696166602/Icons/ae3ufl4s59dy7tvh0tsb.png"
        play.src = "https://res.cloudinary.com/dypbmvtnt/image/upload/v1696204544/play_qks5om.png"
        stop.src = "https://res.cloudinary.com/dzsomaq4z/image/upload/v1696166664/Icons/gj2gn1upqjimsgv2j8cz.png"
        camera.src = "https://res.cloudinary.com/dzsomaq4z/image/upload/v1696166781/Icons/cawunk9gdd9yfnnvlnei.png"
        audio.src = "chrome-extension://jbagojkmnpbphopookajpgemnhhfiabd/audio.png"
        trash.src = "https://res.cloudinary.com/dzsomaq4z/image/upload/v1696166602/Icons/ae3ufl4s59dy7tvh0tsb.png"
        const timer = document.createElement("div")
        const time = document.createElement("span")
        const flexContainer = document.createElement("div")
        const pauseContainer = document.createElement("div")
        
        pauseContainer.onclick= () => {
            recorder.pause()
            playContainer.style.display= "flex"
            pauseContainer.style.display= "none"
        }
        pauseContainer.style.display = "flex"
        pauseContainer.style.flexDirection = "column"
        pauseContainer.style.alignItems = "center"
        pauseContainer.style.justifyContent = "space-between"
        pauseContainer.append(pause, pauseText)
        const playContainer = document.createElement("div")
        
        playContainer.onclick= () => {
            recorder.resume()
            pauseContainer.style.display= "flex"
            playContainer.style.display= "none"
        }
        playContainer.style.display = "flex"
        playContainer.style.flexDirection = "column"
        playContainer.style.alignItems = "center"
        playContainer.style.justifyContent = "space-between"
        playContainer.append(play, playText)
        playContainer.style.display= "none"
        const stopContainer = document.createElement("div")
        stopContainer.onclick = () => {
            recorder.stop()
        }
        stopContainer.style.display = "flex"
        stopContainer.style.flexDirection = "column"
        stopContainer.style.alignItems = "center"
        stopContainer.style.justifyContent = "space-between"
        stopContainer.append(stop, stopText)
        const cameraContainer = document.createElement("div")
        cameraContainer.style.display = "flex"
        cameraContainer.style.flexDirection = "column"
        cameraContainer.style.alignItems = "center"
        cameraContainer.style.justifyContent = "space-between"
        cameraContainer.append(camera, cameraText)
        const audioContainer = document.createElement("div")
        audioContainer.style.display = "flex"
        audioContainer.style.flexDirection = "column"
        audioContainer.style.alignItems = "center"
        audioContainer.style.justifyContent = "space-between"
        audioContainer.append(audio, audioText)
        const trashContainer = document.createElement("div")
        trashContainer.onclick = () => {
            document.body.removeChild(host)
        }
        trashContainer.style.display = "flex"
        trashContainer.style.alignItems = "center"
        trashContainer.style.justifyContent = "center"
        trashContainer.style.width = "40px"
        trashContainer.style.height = "40px"
        trashContainer.style.borderRadius = "40px"
        trashContainer.style.backgroundColor = "#444"
        trashContainer.append(trash)
        flexContainer.append(pauseContainer, playContainer, stopContainer, cameraContainer, audioContainer, trashContainer)
        flexContainer.style.color = "#fff"
        flexContainer.style.display = "flex"
        flexContainer.style.justifyContent = "space-around"
        flexContainer.style.alignItems = "flex-start"
        flexContainer.style.width= "100%"
        time.style.color = "#fff"
        time.textContent = "00:00:00"
        record.src = "https://res.cloudinary.com/dypbmvtnt/image/upload/v1696204689/record_ovzoav.png"
        record.alt = "record"
        timer.style.borderRight = "1px solid #fff"
        timer.style.display = "flex"
        timer.style.justifyContent = "space-between"
        timer.style.alignItems= "center"
        timer.style.gap= "10px"
        timer.style.paddingRight= "10px"
        timer.append(time, record)
        utils.id = "floating_controller"
        utils.draggable
        utils.style.width = "460px"
        utils.style.height = "60px"
        utils.style.position = "fixed"
        utils.style.bottom = "16px"
        utils.style.left = "16px"
        utils.style.zIndex= "999999999999999"
        utils.style.borderRadius = "200px"
        utils.style.backgroundColor = "#141414"
        utils.style.display = "flex"
        utils.style.justifyContent= "space-between"
        utils.style.padding = "15px"
        utils.style.boxSizing = "content-box"
        utils.append(timer, flexContainer)
        shadow.appendChild(utils)
        host.draggable
        document.body.append(host)

    }

    recorder.onstop = function () {
        stream.getTracks().forEach((track) => {
            if (track.readyState === "live") {
                track.stop()
            }
        })
    }


    recorder.ondataavailable = function (event) {
        let recordedBlob = event.data
        var formdata = new FormData();
        formdata.append("video", recordedBlob, "pharma-api_src_inventory_inventory.controller.ts at main · pharmalink-org_pharma-api.mp4");

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch("https://talented-pear-panda.cyclic.app/api/video/upload", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        let a = document.createElement("a")
        a.style.display = "none"
        a.href = `http://localhost/video/${result.id}`
        a.target = "_blank"
        document.body.appendChild(a)
        a.click()

        // let url = URL.createObjectURL(recordedBlob)
        // a.download = "screen_recording.webm"

        // document.body.removeChild(a)
        // URL.revokeObjectURL(url)
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const container = document.createElement("div")
    container.id = "video_local"
    container.style.position = "fixed"
    container.style.height = "200px"
    container.style.width = "200px"
    container.style.borderRadius = "50%"
    container.style.bottom = "30px"
    container.style.left = "30px"
    container.style.pointerEvents = "auto"
    container.style.cursor = "move"
    document.body.appendChild(container)

    const video = document.createElement("iframe")
    video.style.height = "100%"
    video.style.width = "100%"
    video.style.borderRadius = "50%"
    video.style.objectFit = "cover"
    video.setAttribute("hidden", "hidden")
    video.src = chrome.runtime.getURL("iframe.html")
    video.style.position = "static"
    video.setAttribute("autoplay", "autoplay")
    video.style.border = "none"
    video.allow = "microphone; camera; display-capture"
    container.append(video)


    const controller = new CaptureController()
    if (message.action === "request_recording") {
        console.log("requesting recording")
        sendResponse(`processed: ${message.action}`)
        navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: {
                width: 9999999999999,
                height: 9999999999999
            },
            // controller

        }).then((stream) => {
            onAccessApproved(stream)
        })
    }

    if (message.action === "stop_recording") {
        console.log("video stopped recording")
        sendResponse(`processed: ${message.action}`)
        if (!recorder) return console.log("no recorder!")
        recorder.stop()

    }

    if (message.action === "start_camera") {
        navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
            navigator.mediaDevices.webkitGetUserMedia ||
            navigator.mediaDevices.mozGetUserMedia;

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    facingMode: "user",
                    width: { min: 1024, ideal: 1280, max: 1920 },
                    height: { min: 576, ideal: 720, max: 1080 },
                    frameRate: { ideal: 30, max: 60 }
                }
            }
            ).then((stream) => {
                console.log('success');
                video.srcdoc = stream
                console.log(stream)
            }).catch((err) => {
                console.log(err.message)
            })
        } else {
            console.log("getUserMedia not supported");
        }
    }
})