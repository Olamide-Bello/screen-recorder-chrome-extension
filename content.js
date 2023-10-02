console.log('I dey here o')

var recorder;
// function generateId() {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
//     function(c) {
//         var r= Math.random() * 16 | 0,
//         v=c== 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16)
//     })
// }

function onAccessApproved(stream, streamId) {
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
    pause.style.width = "20px"
    pause.style.height = "20px"
    const play = document.createElement("img")
    play.style.width = "20px"
    play.style.height = "20px"
    play.style.borderRadius = "20px"
    play.style.backgroundColor= "#fff"
    const stop = document.createElement("img")
    stop.style.width = "20px"
    stop.style.height = "20px"
    const camera = document.createElement("img")
    camera.style.width = "20px"
    const audio = document.createElement("img")
    audio.style.width = "20px"
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
    audio.src = "https://res.cloudinary.com/dypbmvtnt/image/upload/v1696204641/Audio_ybxj9f.png"
    trash.src = "https://res.cloudinary.com/dypbmvtnt/image/upload/v1696204617/trash_kan91g.png"
    const timer = document.createElement("div")
    const time = document.createElement("span")
    const flexContainer = document.createElement("div")
    const pauseWrapper = document.createElement("div")
    pauseWrapper.style.display = "flex"
    pauseWrapper.style.alignItems = "center"
    pauseWrapper.style.justifyContent = "center"
    pauseWrapper.style.width = "40px"
    pauseWrapper.style.height = "40px"
    pauseWrapper.style.borderRadius = "40px"
    pauseWrapper.style.backgroundColor = "#fff"
    pauseWrapper.append(pause)

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
    pauseContainer.append(pauseWrapper, pauseText)
    const playContainer = document.createElement("div")
    const playWrapper = document.createElement("div")
    playWrapper.append(play)
    playWrapper.style.display = "flex"
    playWrapper.style.alignItems = "center"
    playWrapper.style.justifyContent = "center"
    playWrapper.style.width = "40px"
    playWrapper.style.height = "40px"
    playWrapper.style.borderRadius = "40px"
    playWrapper.style.backgroundColor = "#fff"
    
    playContainer.onclick= () => {
        recorder.resume()
        pauseContainer.style.display= "flex"
        playContainer.style.display= "none"
    }
    playContainer.style.display = "flex"
    playContainer.style.flexDirection = "column"
    playContainer.style.alignItems = "center"
    playContainer.style.justifyContent = "space-between"
    playContainer.append(playWrapper, playText)
    playContainer.style.display= "none"
    const stopContainer = document.createElement("div")
    const stopWrapper = document.createElement("div")
    stopWrapper.append(stop)
    stopWrapper.style.display = "flex"
    stopWrapper.style.alignItems = "center"
    stopWrapper.style.justifyContent = "center"
    stopWrapper.style.width = "40px"
    stopWrapper.style.height = "40px"
    stopWrapper.style.borderRadius = "40px"
    stopWrapper.style.backgroundColor = "#fff"
    stopContainer.onclick = () => {
        recorder.stop()
    }
    stopContainer.style.display = "flex"
    stopContainer.style.flexDirection = "column"
    stopContainer.style.alignItems = "center"
    stopContainer.style.justifyContent = "space-between"
    stopContainer.append(stopWrapper, stopText)
    const cameraContainer = document.createElement("div")
    const cameraWrapper = document.createElement("div")
    cameraWrapper.append(camera)
    cameraWrapper.style.display = "flex"
    cameraWrapper.style.alignItems = "center"
    cameraWrapper.style.justifyContent = "center"
    cameraWrapper.style.width = "40px"
    cameraWrapper.style.height = "40px"
    cameraWrapper.style.borderRadius = "40px"
    cameraWrapper.style.backgroundColor = "#fff"
    cameraContainer.style.display = "flex"
    cameraContainer.style.flexDirection = "column"
    cameraContainer.style.alignItems = "center"
    cameraContainer.style.justifyContent = "space-between"
    cameraContainer.append(cameraWrapper, cameraText)
    const audioContainer = document.createElement("div")
    const audioWrapper = document.createElement("div")
    audioWrapper.append(audio)
    audioWrapper.style.display = "flex"
    audioWrapper.style.alignItems = "center"
    audioWrapper.style.justifyContent = "center"
    audioWrapper.style.width = "40px"
    audioWrapper.style.height = "40px"
    audioWrapper.style.borderRadius = "40px"
    audioWrapper.style.backgroundColor = "#fff"
    audioContainer.style.display = "flex"
    audioContainer.style.flexDirection = "column"
    audioContainer.style.alignItems = "center"
    audioContainer.style.justifyContent = "space-between"
    audioContainer.append(audioWrapper, audioText)
    const trashContainer = document.createElement("div")
    trashContainer.onclick = () => {
        document.body.removeChild(host)
        recorder.stop()
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
    recorder = new MediaRecorder(stream)
    recorder.start()
    console.log("here")


    if (recorder) {
        document.body.append(host)

    }

    recorder.onstop = function () {
        stream.getTracks().forEach((track) => {
            if (track.readyState === "live") {
                track.stop()
                document.body.removeChild(host)
            }
        })
    }


    recorder.ondataavailable = function (event) {

        const submit = async() => {
            try {
                let recordedBlob = event.data
                var formdata = new FormData();
                formdata.append("file", recordedBlob);
                // formdata.append('isLastChunk', true);
                console.log(formdata)
        
                var requestOptions = {
                    method: 'POST',
                    body: formdata,
                    redirect: 'follow'
                };
    
                const response = await fetch('https://mediaupload-uk0g.onrender.com/video/upload', requestOptions)
                if (response.ok) {
                    console.log(response)
                    const result = await response.json()
                    let a = document.createElement("a")
                    console.log(result)
                    a.style.display = "none"
                    a.href = `http://localhost/video/${result.id}`
                    a.target = "_blank"
                    document.body.appendChild(a)
                    a.click()
                }
            } catch (error) {
                console.log(error)
            }
        }
        submit()
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
            // const streamId = generateId()
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