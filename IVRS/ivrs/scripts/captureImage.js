// Set global variable
view = "Front view";
imageURL = {front:'', back:'', left:'', right:''};
// This function sets up the webcam
async function setup() {
    // Capture the video element to be fed into the webcam
    var video = document.getElementById("webcam");
    console.log(navigator.getUserMedia);
    if (navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        video.srcObject = stream;

        return new Promise(resolve => {
            video.onloadedmetadata = () => {
                resolve(video);
            };
        });
    }
}

async function loadVideo() {
    const video = await setup();
    video.play();

    return video;
}

window.onload = () => {
    loadVideo().then((video) => {
        $('#imagesThumbnail').on('click', (event) => {
            // Remove 'selected-view' class from all thumbnails
            $('#imagesThumbnail').children().removeClass('selected-view')
            console.log(event.target.attributes['data-view'].value)
            view = event.target.attributes['data-view'].value;
            let mapper = {
                front: 'Front view',
                back: 'Back view',
                left: 'Left view',
                right: 'Right view'
            }
            // Update the camera header to the selected view
            $('#cameraHeader').text(mapper[view])
            // Add 'selected-view' class to selected thumbnails
            $(`#${view}ViewContainer`).addClass('selected-view')
        })

        $('#captureImage').on('click', () => {
            
            const outputImageCanvas = document.getElementById('displayImage');
            var video = document.getElementById("webcam");
            outputImageCanvas.width = video.videoWidth;
            outputImageCanvas.height = video.videoHeight;
            const ctx = outputImageCanvas.getContext('2d');

            ctx.drawImage(video, 0, 0, outputImageCanvas.width, outputImageCanvas.height);
            // Save file
            const fileURL = outputImageCanvas.toDataURL("image/jpeg");
            // console.log(fileURL);
            if (view == "Front view") {
                imageURL.front = fileURL;
                $(`[data-view="front"]`).attr("src",fileURL)
            } else {
                imageURL[view] = fileURL;
                $(`[data-view=${view}] > img`).attr("src",fileURL)
            }
        })

        $('#submitImage').on('click', () => {
            opener.postMessage(imageURL, "*")
            self.close();
        })
        
    })
}

