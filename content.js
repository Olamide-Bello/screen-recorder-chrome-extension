var host2 = document.createElement("div")
host2.id = "shadow"
const shadow2 = host2.attachShadow({ mode: "open" })
shadow2.innerHTML = `
<style>
:host {
    width: 400px;
    height: 400px;
},
</style>
`

const audioPlayer = document.createElement("div")
audioPlayer.id = 'audio-player'
audioPlayer.style.position = "fixed"
audioPlayer.style.height = "200px"
audioPlayer.style.width = "200px"
audioPlayer.style.bottom = "30px"
audioPlayer.style.right = "30px"
audioPlayer.style.zIndex = "999999999999999"
const micplayer = document.createElement("video")
micplayer.style.height = "200px"
micplayer.style.width = "200px"
micplayer.style.objectFit = "cover"
micplayer.style.borderRadius = "200px"
micplayer.autoplay = true
audioPlayer.append(micplayer)
const container = document.createElement("div")
container.id = "video_local"
container.style.position = "fixed"
container.style.height = "200px"
container.style.width = "200px"
container.style.borderRadius = "50%"
container.style.bottom = "30px"
container.style.right = "30px"
container.style.zIndex = "999999999999999"
const video = document.createElement("video")
video.style.height = "200px"
video.style.width = "200px"
video.style.objectFit = "cover"
video.style.borderRadius = "200px"
video.autoplay = true
container.append(video)
document.body.append(host2)

const playStream = (stream) => {
    if (stream.getVideoTracks().length > 0) {
        video.srcObject = stream
        shadow2.appendChild(container)
        dragElement(container)
    } else {
        micplayer.srcObject = stream
        shadow2.appendChild(audioPlayer)
    }
}

const muteCamera = () => {
    const constraints = {
        video: true
    }
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            const videoTrack = stream.getVideoTracks()[0]
            videoTrack.enabled = false
            playStream(stream)
            document.body.removeChild(host2)
        })
        .catch(error => {
            console.log(error)
        })
}
const playCamera = () => {
    const constraints = {
        video: true
    }
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            const videoTrack = stream.getVideoTracks()[0]
            videoTrack.enabled = true
            playStream(stream)
            document.body.append(host2)
        })
        .catch(error => {
            console.log(error)
        })
}

function stopWebCam() {
    navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
        navigator.mediaDevices.webkitGetUserMedia ||
        navigator.mediaDevices.mozGetUserMedia;

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }
        ).then((stream) => {
            stream.getTracks().forEach(track => track.stop())
            video.srcObject = null
            stream = null
            document.body.removeChild(host2)
            window.location.reload()
        }).catch((err) => {
            console.log(err.message)
        })
    }
}

const pauseMic = () => {
    const constraints = {
        audio: true
    }
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            const audioTrack = stream.getAudioTracks()[0]
            audioTrack.enabled = false
            playStream(stream)
            document.body.append(host2)
        })
        .catch(error => {
            console.log(error)
        })
}
const resumeMic = () => {
    const constraints = {
        audio: true
    }
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            const audioTrack = stream.getAudioTracks()[0]
            audioTrack.enabled = true
            playStream(stream)
            document.body.append(host2)
        })
        .catch(error => {
            console.log(error)
        })
}

function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(blob);
    });
}

async function helpMeOutstartRecorder(audio, currentTab) {
    const mediaConstraints = {
        preferCurrentTab: currentTab,
        video: { mediaSource: "screen" },
        audio: audio,
    };

    const stream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
    return stream;
}

async function helpMeOutOnAccessApproved(stream, chromeId) {
    let videoId = "";
    let blobIndex = 0;
    var recorder = null;

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm;codecs=vp8";

    recorder = new MediaRecorder(stream, { mimeType });

    recorder.start(5000);

    recorder.onstart = async () => {
        const createUser = await fetch(
            `https://www.cofucan.tech/srce/api/start-recording/?username=${chromeId}`,
            {
                method: "POST",
                body: {},
            }
        );
        const response = await createUser.json();
        videoId = response.video_id;
    };
    recorder.ondataavailable = async (e) => {
        blobIndex++;
        console.log(blobIndex)
        const blob = new Blob([e.data]);
        sendChunkToServer(blobIndex, blob, chromeId, videoId, false);
    };

    recorder.onstop = async (e) => {
        const blob = new Blob([e.data]);
        console.log(blobIndex +1)
        console.log(blobIndex)
        await sendChunkToServer(blobIndex + 1, blob, chromeId, videoId, true);
        stream.getTracks().forEach(async (track) => {
            if (track.readyState === "live") {
                track.stop();
            }
        });
        window.open(
            `https://helpmeout-dev.vercel.app/RecordingReadyPage?videoID=${videoId}`,
            "_blank"
        );
    };
    return recorder;
}

async function sendChunkToServer(blobIndex, blob, chromeId, videoId, last) {
    blobToBase64(blob).then(async (base64) => {
        const data = await fetch(`https://www.cofucan.tech/srce/api/upload-blob/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: chromeId,
                video_id: videoId,
                blob_index: blobIndex,
                blob_object: base64,
                is_last: last,
            }),
        });
        await data.json();
    });
}

function pauseRecorderHelpMeOut(recorder) {
    recorder.pause();
}

function resumeRecorderHelpMeOut(recorder) {
    recorder.resume();
}

function stopRecorderHelpMeOut(recorder) {
    recorder.stop();
    stopWebCam()

}

var pauseSvg = `<svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1.5L1 12.5" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M9 1.5L9 12.5" stroke="black" stroke-width="2" stroke-linecap="round"/>
</svg>`;

var playSvg = `<svg width="12" height="16" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" class="icon">
<path fill="" d="M240 128a15.74 15.74 0 0 1-7.6 13.51L88.32 229.65a16 16 0 0 1-16.2.3A15.86 15.86 0 0 1 64 216.13V39.87a15.86 15.86 0 0 1 8.12-13.82a16 16 0 0 1 16.2.3l144.08 88.14A15.74 15.74 0 0 1 240 128Z"/>
</svg>`;

var stopSvg = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.25 3.5C1.25 2.25736 2.25736 1.25 3.5 1.25H12.5C13.7426 1.25 14.75 2.25736 14.75 3.5V12.5C14.75 13.7426 13.7426 14.75 12.5 14.75H3.5C2.25736 14.75 1.25 13.7426 1.25 12.5V3.5Z" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

var micSvg = `<svg width="12" height="18" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 18.75C10.3137 18.75 13 16.0637 13 12.75V11.25M7 18.75C3.68629 18.75 1 16.0637 1 12.75V11.25M7 18.75V22.5M3.25 22.5H10.75M7 15.75C5.34315 15.75 4 14.4069 4 12.75V4.5C4 2.84315 5.34315 1.5 7 1.5C8.65685 1.5 10 2.84315 10 4.5V12.75C10 14.4069 8.65685 15.75 7 15.75Z" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

var videoSvg = `<svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.75 6.5L19.4697 1.78033C19.9421 1.30786 20.75 1.64248 20.75 2.31066V13.6893C20.75 14.3575 19.9421 14.6921 19.4697 14.2197L14.75 9.5M3.5 14.75H12.5C13.7426 14.75 14.75 13.7426 14.75 12.5V3.5C14.75 2.25736 13.7426 1.25 12.5 1.25H3.5C2.25736 1.25 1.25 2.25736 1.25 3.5V12.5C1.25 13.7426 2.25736 14.75 3.5 14.75Z" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

var cancelVideo = `<svg width="30px" height="30px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, -1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.048"></g><g id="SVGRepo_iconCarrier"> <path d="M5 5C3.34315 5 2 6.34315 2 8V16C2 17.6569 3.34315 19 5 19H14C15.3527 19 16.4962 18.1048 16.8705 16.8745M17 12L20.6343 8.36569C21.0627 7.93731 21.2769 7.72312 21.4608 7.70865C21.6203 7.69609 21.7763 7.76068 21.8802 7.88238C22 8.02265 22 8.32556 22 8.93137V15.0686C22 15.6744 22 15.9774 21.8802 16.1176C21.7763 16.2393 21.6203 16.3039 21.4608 16.2914C21.2769 16.2769 21.0627 16.0627 20.6343 15.6343L17 12ZM17 12V9.8C17 8.11984 17 7.27976 16.673 6.63803C16.3854 6.07354 15.9265 5.6146 15.362 5.32698C14.7202 5 13.8802 5 12.2 5H9.5M2 2L22 22" stroke="#000000" stroke-width="1.344" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`

var trashSvg = `<svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.7404 8L11.3942 17M6.60577 17L6.25962 8M16.2276 4.79057C16.5696 4.84221 16.9104 4.89747 17.25 4.95629M16.2276 4.79057L15.1598 18.6726C15.0696 19.8448 14.0921 20.75 12.9164 20.75H5.08357C3.90786 20.75 2.93037 19.8448 2.8402 18.6726L1.77235 4.79057M16.2276 4.79057C15.0812 4.61744 13.9215 4.48485 12.75 4.39432M0.75 4.95629C1.08957 4.89747 1.43037 4.84221 1.77235 4.79057M1.77235 4.79057C2.91878 4.61744 4.07849 4.48485 5.25 4.39432M12.75 4.39432V3.47819C12.75 2.29882 11.8393 1.31423 10.6606 1.27652C10.1092 1.25889 9.55565 1.25 9 1.25C8.44435 1.25 7.89078 1.25889 7.33942 1.27652C6.16065 1.31423 5.25 2.29882 5.25 3.47819V4.39432M12.75 4.39432C11.5126 4.2987 10.262 4.25 9 4.25C7.73803 4.25 6.48744 4.2987 5.25 4.39432" stroke="#BEBEBE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

var micInactive = ` <svg width="20px" height="20px" viewBox="-3.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
    
    <title>microphone-off</title>
    <desc>Created with Sketch Beta.</desc>
    <defs>

</defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
        <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-154.000000, -307.000000)" fill="#000000">
            <path d="M167,333 C165.061,333 163.236,332.362 161.716,331.318 L160.31,332.742 C161.944,333.953 163.892,334.765 166,334.955 L166,337 L165,337 C164.448,337 164,337.448 164,338 C164,338.553 164.448,339 165,339 L169,339 C169.552,339 170,338.553 170,338 C170,337.448 169.552,337 169,337 L168,337 L168,334.955 C172.938,334.51 177.117,330.799 178,326 L176,326 C175.089,330.007 171.282,333 167,333 L167,333 Z M167,329 C166.136,329 165.334,328.761 164.625,328.375 L163.168,329.85 C164.27,330.572 165.583,331 167,331 C170.866,331 174,327.866 174,324 L174,318.887 L172,320.911 L172,324 C172,326.762 169.761,329 167,329 L167,329 Z M162,314 C162,311.238 164.239,309 167,309 C169.174,309 171.005,310.396 171.694,312.334 L173.198,310.812 C172.035,308.558 169.711,307 167,307 C163.134,307 160,310.134 160,314 L160,324 C160,324.053 162,322.145 162,322.145 L162,314 L162,314 Z M177.577,310.013 L153.99,332.597 L155.418,334.005 L179.014,311.433 L177.577,310.013 L177.577,310.013 Z M158.047,326.145 C158.035,326.095 158.011,326.05 158,326 L156,326 C156.109,326.596 156.271,327.175 156.478,327.733 L158.047,326.145 L158.047,326.145 Z" id="microphone-off" sketch:type="MSShapeGroup">

</path>
        </g>
    </g>
</svg>`;

var logo = `<svg width="41" height="40" viewBox="0 0 41 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_577_957)">
<path d="M31.6401 16.8421C31.0804 14.9122 30.0621 13.1464 28.6721 11.6953C27.2821 10.2442 25.5617 9.15092 23.6577 8.50876C21.7766 7.96121 19.7993 7.82666 17.8614 8.11432C15.9234 8.40199 14.0705 9.10507 12.4296 10.1754C12.2946 10.3107 12.1252 10.4067 11.9398 10.4531C11.7544 10.4994 11.5598 10.4944 11.377 10.4386C11.0084 10.3192 10.6763 10.1079 10.4121 9.82455C10.2197 9.47744 10.1575 9.07308 10.2366 8.68419C10.2869 8.49754 10.3751 8.32327 10.4959 8.17233C10.6167 8.02138 10.7673 7.89701 10.9384 7.807C15.5875 5.0877 20.1489 4.38595 24.5349 5.78946C26.6942 6.50768 28.6656 7.69964 30.3047 9.27811C31.9439 10.8566 33.2094 12.7816 34.0085 14.9123H39.8857C38.684 10.1719 35.7871 6.0361 31.7427 3.28683C27.6983 0.537565 22.7868 -0.634627 17.9368 -0.00811872C13.0868 0.618389 8.63434 3.00017 5.42135 6.68692C2.20837 10.3737 0.457493 15.1098 0.499772 20C0.499772 20.7895 0.587491 21.4912 0.587491 22.2807H8.04363C8.32839 22.2645 8.61069 22.3414 8.84801 22.4996C9.08532 22.6578 9.26481 22.8888 9.35942 23.1579C9.93235 25.0811 10.9553 26.8402 12.3434 28.2894C13.7316 29.7385 15.445 30.8361 17.3419 31.4912C19.223 32.0388 21.2002 32.1733 23.1382 31.8856C25.0761 31.598 26.929 30.8949 28.5699 29.8245C28.705 29.6892 28.8743 29.5933 29.0597 29.5469C29.2452 29.5005 29.4398 29.5055 29.6226 29.5614C29.9911 29.6808 30.3232 29.8921 30.5875 30.1754C30.7799 30.5225 30.8421 30.9269 30.7629 31.3158C30.7127 31.5024 30.6244 31.6767 30.5036 31.8276C30.3829 31.9786 30.2323 32.103 30.0612 32.193C27.417 33.9722 24.3008 34.9192 21.1138 34.9123C19.5386 34.9004 17.9732 34.6641 16.4647 34.2105C14.2963 33.5094 12.3162 32.3235 10.6747 30.7428C9.03315 29.162 7.77338 27.2281 6.991 25.0877H1.20153C2.46964 29.7501 5.38277 33.7958 9.40243 36.477C13.4221 39.1582 18.2765 40.2935 23.0683 39.6731C27.8601 39.0527 32.2653 36.7186 35.4696 33.1022C38.674 29.4858 40.4608 24.8316 40.4998 20C40.5161 19.2679 40.4868 18.5355 40.4121 17.807H33.0436C32.7445 17.7872 32.4563 17.6872 32.2093 17.5174C31.9623 17.3476 31.7657 17.1143 31.6401 16.8421Z" fill="#100A42"/>
<path d="M20.5841 28.7496C22.311 28.733 23.9944 28.2057 25.4222 27.2342C26.8501 26.2627 27.9585 24.8904 28.6078 23.2902C29.2572 21.6899 29.4185 19.9333 29.0715 18.2416C28.7244 16.5498 27.8845 14.9986 26.6575 13.7833C25.4305 12.568 23.8713 11.7429 22.1763 11.4121C20.4813 11.0812 18.7263 11.2593 17.1324 11.924C15.5384 12.5887 14.1768 13.7102 13.219 15.1472C12.2612 16.5843 11.7501 18.2726 11.75 19.9996C11.7499 21.1558 11.979 22.3005 12.424 23.3676C12.869 24.4347 13.521 25.4031 14.3425 26.2167C15.1639 27.0303 16.1385 27.6731 17.2098 28.1078C18.2811 28.5426 19.428 28.7607 20.5841 28.7496Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_577_957">
<rect width="40" height="40" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>`

var isPlaying = false;
var timerInterval;
var startTime;
var elapsedTime = 0;
var isRunning = false;

function updateTimer(hoursDisplay, minutesDisplay, secondsDisplay) {
    const currentTime = Date.now();
    elapsedTime = Math.floor((currentTime - startTime) / 1000);

    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;

    hoursDisplay.textContent = String(hours).padStart(2, "0");
    minutesDisplay.textContent = String(minutes).padStart(2, "0");
    secondsDisplay.textContent = String(seconds).padStart(2, "0");
}

function startTimer(hoursDisplay, minutesDisplay, secondsDisplay) {
    isPlaying = true;
    if (!isRunning) {
        startTime = Date.now() - elapsedTime * 1000;
        timerInterval = setInterval(() => {
            updateTimer(hoursDisplay, minutesDisplay, secondsDisplay);
        }, 1000);
        isRunning = true;
    }
}

function pauseTimer() {
    isPlaying = false;
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
    }
}

function resumeTimer(hoursDisplay, minutesDisplay, secondsDisplay) {
    isPlaying = true;
    if (!isRunning) {
        startTime = Date.now() - elapsedTime * 1000;
        timerInterval = setInterval(() => {
            updateTimer(hoursDisplay, minutesDisplay, secondsDisplay);
        }, 1000);
        isRunning = true;
    }
}

function clearRecordingAndTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isPlaying = false;
    elapsedTime = 0;

    // Reset the displayed timer
    const hoursDisplay = document.querySelector(".hours");
    const minutesDisplay = document.querySelector(".minutes");
    const secondsDisplay = document.querySelector(".seconds");
    hoursDisplay.textContent = `00`;
    minutesDisplay.textContent = `00`;
    secondsDisplay.textContent = `00`;
}



const logoDom = document.createElement("div")
const logoShadow = logoDom.attachShadow({ mode: "open" })
logoShadow.innerHTML = `
<style>
:logoDom {
    width:30px:;
    height:30px
},
</style>
`
const icon = document.createElement("span")
icon.innerHTML = logo
icon.style.position = "fixed"
icon.style.left = "0"
icon.style.bottom = "16px"
icon.style.display = "none"
logoShadow.appendChild(icon)

const host = document.createElement("div")
const shadow = host.attachShadow({ mode: "open" })
shadow.innerHTML = `
    <style>
        :host {
            width: 520px;
            height: 70px;
        },
        
    </style>
`

const panel = document.createElement("div")
const pauseControl = document.createElement("span");
pauseControl.innerHTML = pauseSvg;
pauseControl.style.width = "40px"
pauseControl.style.height = "40px"
pauseControl.style.borderRadius = "40px"
pauseControl.style.backgroundColor = "aliceblue"
pauseControl.style.display = "grid"
pauseControl.style.placeContent = "center"

const pauseText = document.createElement("span");
pauseText.textContent = "pause"
pauseText.style.lineHeight = "1.7"
pauseText.style.fontSize = "14px"
const pauseContainer = document.createElement("div")
pauseContainer.style.display = "flex"
pauseContainer.style.flexDirection = "column"
pauseContainer.style.alignItems = "center"
pauseContainer.style.justifyContent = "center"
pauseContainer.style.gap = "10px"
pauseContainer.append(pauseControl, pauseText)
const stopControl = document.createElement("span");
stopControl.innerHTML = stopSvg;
stopControl.style.width = "40px"
stopControl.style.height = "40px"
stopControl.style.borderRadius = "40px"
stopControl.style.backgroundColor = "aliceblue"
stopControl.style.display = "grid"
stopControl.style.placeContent = "center"
const stopText = document.createElement("span")
stopText.textContent = "stop"
stopText.style.fontSize = "14px"
stopText.style.lineHeight = "1.7"
const stopContainer = document.createElement("div")
stopContainer.style.display = "flex"
stopContainer.style.flexDirection = "column"
stopContainer.style.alignItems = "center"
stopContainer.style.justifyContent = "center"
stopContainer.style.gap = "10px"
stopContainer.append(stopControl, stopText)
const trashControl = document.createElement("span");
trashControl.innerHTML = trashSvg;
const trashContainer = document.createElement("div")
trashContainer.style.backgroundColor = "gray"
trashContainer.style.display = "grid"
trashContainer.style.placeContent = "center"
trashContainer.style.height = "40px"
trashContainer.style.width = "40px"
trashContainer.style.borderRadius = "40px"
trashContainer.append(trashControl)
const videoControl = document.createElement("span");
videoControl.innerHTML = videoSvg;
videoControl.style.width = "40px"
videoControl.style.height = "40px"
videoControl.style.borderRadius = "40px"
videoControl.style.backgroundColor = "aliceblue"
videoControl.style.display = "grid"
videoControl.style.placeContent = "center"
const videoCancel = document.createElement("span");
const videoText = document.createElement("span")
videoText.style.fontSize = "14px"
videoText.textContent = "Camera"
const videoContainer = document.createElement("div")
videoContainer.style.display = "flex"
videoContainer.style.flexDirection = "column"
videoContainer.style.alignItems = "center"
videoContainer.style.justifyContent = "center"
videoContainer.style.gap = "10px"
videoCancel.innerHTML = cancelVideo
videoCancel.style.display = "none"
videoCancel.style.width = "40px"
videoCancel.style.height = "40px"
videoCancel.style.borderRadius = "40px"
videoCancel.style.backgroundColor = "aliceblue"
videoCancel.style.placeContent = "center"
videoContainer.append(videoControl, videoCancel, videoText)
const micControl = document.createElement("span");
micControl.innerHTML = micSvg
micControl.style.width = "40px"
micControl.style.height = "40px"
micControl.style.borderRadius = "40px"
micControl.style.backgroundColor = "aliceblue"
micControl.style.display = "grid"
micControl.style.placeContent = "center"
const micText = document.createElement("span")
micText.textContent = "Mic"
micText.style.fontSize = "14px"
const micContainer = document.createElement("div")
micContainer.style.display = "flex"
micContainer.style.flexDirection = "column"
micContainer.style.alignItems = "center"
micContainer.style.justifyContent = "center"
micContainer.style.gap = "10px"
const micCancel = document.createElement("span")
micCancel.innerHTML = micInactive
micCancel.style.width = "40px"
micCancel.style.height = "40px"
micCancel.style.borderRadius = "40px"
micCancel.style.backgroundColor = "aliceblue"
micCancel.style.display = "grid"
micCancel.style.placeContent = "center"
micCancel.style.display = "none"
micContainer.append(micControl, micCancel, micText)
const time = document.createElement("div")
const hoursDisplay = document.createElement("span");
const dot1 = document.createElement("span");
dot1.textContent = " : "
const dot12 = document.createElement("span");
dot12.textContent = " : "
const minutesDisplay = document.createElement("span");
const secondsDisplay = document.createElement("span");
const timer = document.createElement("div");
time.append(hoursDisplay, dot1, minutesDisplay, dot12, secondsDisplay)
time.style.display = "flex"
const redDot = document.createElement("span");
redDot.style.backgroundColor = "red"
redDot.style.width = "8px"
redDot.style.height = "8px"
redDot.style.boxShadow = "0 0 5px 3px rgb(149, 8, 8)"
redDot.style.borderRadius = "8px"
redDot.style.marginLeft = "10px"
redDot.style.marginRight = "5px"
redDot.style.alignSelf = "center"
timer.append(time, redDot)
timer.style.display = "flex"
timer.style.setProperty("flex-wrap", "wrap", "important")
timer.style.alignContent = "center"
timer.style.justifyContent = "center"
timer.style.fontWeight = "500"
timer.style.width = "115px"
timer.style.gap = "5px"
const hide = document.createElement("div");
const hideText = document.createElement("p")
hideText.textContent = "Hide"
hide.style.fontSize = "16px"
hide.style.fontWeight = "500"
hide.append(hideText)
hide.style.display = "flex"
hide.style.placeContent = "center"
const flexContainer = document.createElement("div")
flexContainer.append(pauseContainer, stopContainer, videoContainer, micContainer, trashContainer, hide)
flexContainer.style.color = "#fff"
flexContainer.style.display = "flex"
flexContainer.style.justifyContent = "space-around"
flexContainer.style.alignItems = "flex-start"
flexContainer.style.width = "100%"
flexContainer.style.borderLeft = "1px solid #fff"

panel.style.width = "520px"
panel.style.height = "70px"
panel.style.position = "fixed"
panel.style.bottom = "16px"
panel.style.left = "16px"
panel.style.zIndex = "999999999999999"
panel.style.borderRadius = "200px"
panel.style.backgroundColor = "rgb(30, 29, 29)"
panel.style.color = "#fff"
panel.style.display = "flex"
panel.style.justifyContent = "space-between"
panel.style.alignItems = "center"
panel.style.padding = "15px"
panel.style.boxSizing = "content-box"
panel.style.cursor = "pointer"
panel.style.boxShadow = "0 0 5px 3px rgb(165, 150, 150)"
panel.append(timer, flexContainer)
shadow.appendChild(panel)


async function control(audio, currentTab, chromeId) {
    console.log(chromeId)
    try {
        const stream = await helpMeOutstartRecorder(audio, currentTab);
        const recorder = await helpMeOutOnAccessApproved(stream, chromeId);
        document.body.append(logoDom)

        document.body.append(host)
        dragElement(panel);


        startTimer(hoursDisplay, minutesDisplay, secondsDisplay);

        hide.onclick = () => {
            panel.style.visibility = "hidden"
            icon.style.display = "block"
        }

        icon.onclick = () => {
            panel.style.visibility = "visible"
            icon.style.display = "none"
        }

        pauseControl.addEventListener("click", () => {
            if (isPlaying) {
                pauseControl.innerHTML = playSvg;
                pauseText.textContent = "Resume";
                pauseRecorderHelpMeOut(recorder);
                pauseTimer(hoursDisplay, minutesDisplay, secondsDisplay);
            } else {
                pauseControl.innerHTML = pauseSvg;
                pauseText.textContent = "Pause";
                resumeRecorderHelpMeOut(recorder);
                resumeTimer(hoursDisplay, minutesDisplay, secondsDisplay);
            }
        });
        videoControl.onclick = () => {
            muteCamera()
            videoControl.style.display = "none"
            videoCancel.style.display = "grid"
        }

        videoCancel.onclick = () => {
            playCamera()
            videoControl.style.display = "grid"
            videoCancel.style.display = "none"
        }
        stopControl.addEventListener("click", () => {
            stopRecorderHelpMeOut(recorder);
            clearRecordingAndTimer();
            document.body.removeChild(timer);
        });

        console.log(chromeId)
        micControl.onclick = () => {
            pauseMic()
            micCancel.style.display = "grid"
            micControl.style.display = "none"
        }

        micCancel.onclick = () => {
            resumeMic()
            micControl.style.display = "grid"
            micCancel.style.display = "none"
        }

        trashControl.addEventListener("click", () => {
            clearRecordingAndTimer();
            document.body.removeChild(timer);
            window.location.reload();
        });
        return true;
    } catch (error) {
        return error;
    }
}

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

    if (document.getElementById(elmnt.id + "header")) {
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "start") {
        console.log(message.chromeId)
        const audio = message.audio;
        const currentTab = message.currentTab;
        const chromeId = message.chromeId;
        await control(audio, currentTab, chromeId);
    }

    if (message.action === "stop_recording") {
        console.log("video stopped recording")
        sendResponse(`processed: ${message.action}`)
        if (!recorder) return console.log("no recorder!")
        recorder.stop()

    }

    if (message.action === "start_camera") {
        console.log(message)
        navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
            navigator.mediaDevices.webkitGetUserMedia ||
            navigator.mediaDevices.mozGetUserMedia;

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: { min: 1024, ideal: 1280, max: 1920 },
                    height: { min: 576, ideal: 720, max: 1080 },
                    frameRate: { ideal: 30, max: 60 }
                }
            }
            ).then((stream) => {
                playStream(stream)
            }).catch((err) => {
                console.log(err.message)
            })
        } else {
            console.log("getUserMedia not supported");
        }
    }

    if (message.action === "stop_camera") {
        navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
            navigator.mediaDevices.webkitGetUserMedia ||
            navigator.mediaDevices.mozGetUserMedia;

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "user",
                    width: { min: 1024, ideal: 1280, max: 1920 },
                    height: { min: 576, ideal: 720, max: 1080 },
                    frameRate: { ideal: 30, max: 60 }
                }
            }
            ).then((stream) => {
                const videoTrack = stream.getVideoTracks()[0]
                videoTrack.enabled = false
                playStream(stream)
                document.body.removeChild(host2)
            }).catch((err) => {
                console.log(err.message)
            })
        } else {
            console.log("getUserMedia not supported");
        }
    }


    if (message.action === "start_mic") {
        console.log(message)
        navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
            navigator.mediaDevices.webkitGetUserMedia ||
            navigator.mediaDevices.mozGetUserMedia;

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                audio: true
            }
            ).then((stream) => {
                playStream(stream)
            }).catch((err) => {
                console.log(err.message)
            })
        } else {
            console.log("getUserMedia not supported");
        }
    }


    if (message.action === "stop_mic") {
        console.log(message)
        navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
            navigator.mediaDevices.webkitGetUserMedia ||
            navigator.mediaDevices.mozGetUserMedia;

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                audio: true
            }
            ).then((stream) => {
                const audioTrack = stream.getAudioTracks()[0]
                audioTrack.enabled = false
                playStream(stream)
                document.body.append(host2)
            }).catch((err) => {
                console.log(err.message)
            })
        } else {
            console.log("getUserMedia not supported");
        }
    }
})