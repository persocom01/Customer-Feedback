// intialize variables
var userId = null;
let lexruntime = null;
let kdHost = null;
var processing = false;
var childWindow = ""; // Child window that is opened
var nric;
var azureSTT = false;

// Variables for Recorder.js
//webkitURL is deprecated but nevertheless 
URL = window.URL || window.webkitURL;
var gumStream;
//stream from getUserMedia() 
var rec;
//Recorder.js object 
var input;
//MediaStreamAudioSourceNode we'll be recording 
// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var constraints = {
    audio: true,
    video: false
  }

// var rasa_server = "127.0.0.1" 
// var rasa_api_port = 5005

// uuid generator
function generateUniqSerial() {

    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, function (c) {
        var r = Math.floor(Math.random() * 16);
        return r.toString(16);
    });
}

kdHost = new KDSumerianHost({
    host: {
        name: "cristine",
        voice: "Salli",
        voiceEngine: "neural",
    },
    awsConfig: {
        region: "ap-southeast-1",
        identityPoolId: identityPoolId, // From crendential.js
    },
    container: document.getElementById("myhost"),
});

document.addEventListener("kdhost-ready", (e) => {
    lexruntime = new AWS.LexRuntime();
    kdHost.disableTalkKey(); // disable spacebar key for microphone input
    kdHost.camera.position.set(-0.05, 1.6, -1);
    window.innerWidth < 450 ? kdHost.camera.setFocalLength(60) : kdHost.camera.setFocalLength(15.5);
    initSpeechEngine(); // use Microsoft azure A Speech Recognition SDK by default

    // get user ip address for unique rasa userId
    // $.getJSON("https://jsonip.com?callback=?").then( data => {

    //     userId = data.ip;
    // })

    // generate uuid for every chatbot session
    // userId = generateUniqSerial();
    userId = 'weifengTest'
    console.log(userId)

});

document.addEventListener("kdhost-hostloaded", (e) => {
    $(".primaryButton")
        .css({ "pointer-events": "auto" })
        .empty().append(`Let's Begin! <div class="primaryButtonArrow"/>`)
});

var $chathistory = $(".tr-container");
var $submitter = $(".submit");

// Send message to RASA
async function chat_Rasa(msg, metadata = null, current_user = userId) {
    return $.ajax({
        type: "POST",
        url: rasaUrl, // From config.js 
        // url: `https://rasa-test.dxciclp.com/webhooks/rest/webhook`,
        dataType: "json",
        //crossDomain: true,
        data: JSON.stringify({ "sender": current_user, "message": msg, "metadata": metadata }),
        contentType: "application/json; charset=utf-8",
        //headers: { "Access-Control-Allow-Origin": "*" }, // rasa_server
        success: function (response) { console.log("AJAX success:", response); },
        error: function (error) { console.log("AJAX failed:", error); }
    });
}

function initSpeechEngine() {


    var typebar = document.getElementById("typebar");

    // send text to chatbot when enter is pressed
    $(".typebar").on("keyup input", (e) => {
        e.preventDefault();
        if (e.keyCode === 13) {
            if (typebar.value.length >= 1) {
                processUserInput(typebar.value);
                typebar.value = null;
                $submitter.empty().append('<i class="fa fa-microphone fa-2x"></i>');
            }
        }
    });

    $submitter.on("mousedown touchstart", (e) => {
        e.preventDefault();

        if (typebar.value.length > 1) {
            processUserInput(typebar.value);
            typebar.value = null;
            $submitter.empty().append('<i class="fa fa-microphone fa-2x"></i>');
        }
        else if ($submitter.children().hasClass("fa-microphone")) {
            kdHost.stopSpeaking("cristine");
            appendChat($(`<div class ="ch-container-listening"><div class ="ch-user ch-listening">listening...</div></div>`));
            if (azureSTT == false) {
                startRecording()
            } else {
                // using MS Cognitive Services Speech SDK 
                let speechConfig = SpeechSDK.SpeechConfig.fromSubscription(azureKey, "southeastasia"); 
                speechConfig.speechRecognitionLanguage = "en-US";
                var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
                recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
                recognizer.recognizeOnceAsync((result, err) => {
                    if (result) processUserInput(result.privText);  //console.log(result.privText);
                    $chathistory.find(".ch-container-listening").remove();
                    recognizer.close();
                    recognizer = undefined;
                });
            }
        }
    });

    $submitter.on("mouseup touchend", (e) => {
        if (azureSTT == false) {
            stopRecording()
            $chathistory.find(".ch-container-listening").remove();
            appendChat($(`<div class ="ch-container-listening"><div class ="ch-user ch-listening">Transcribing... Please wait</div></div>`));
        }
        
    })

    if (window.SpeechSDK) SpeechSDK = window.SpeechSDK;
}

// handle raw response that bot passes back
// use skipChat if you dont want anything printed in the transcript

function processUserInput(data, skipChat) {

    // if text is sent
    if (typeof data === "string") {
        if (!skipChat) appendChat($(`<div class ="ch-container-user"><div class ="ch-user">${data}</div></div>`));

        chat_Rasa(data)  //callLex(data)
            .then((res) => {

                res.forEach((obj) => {
                    renderResponse(obj);
                })

                processing = false;
                $submitter.css({ "pointer-events": "auto" });
            })
            .catch((e) => {
                console.log('processUserInput failed')
            });
    }

}

// render response handler
function renderResponse(res) {
    try {

        if (res.text) {
            let answer = res.text.replaceAll('\\n', '<br />')
            console.log(answer);
            //let answerString = answer.join(" ");
            answerString_ = answer.replace(new RegExp("<br>", "g"), " "); //replaceAll(answerString, "<br>", " ");
            kdHost.speak(answerString_);
            appendChat($(`<div class ="ch-container-avatar"><div class ="ch-avatar">${answer}</div></div>`))
        }

        if (res.custom) {
            console.log(res.custom)
            renderContent(res.custom)
        }
    } catch {

    }

}

// function to render custom content on the frontend
function renderContent(responseContent) {

    let $content = $('<div class="button-options"></div>');

    let payload = responseContent.payload

    switch (payload) {

        case "singpass":
            responseContent.options.forEach((opt) => { $content.append(`<button class="button-options-select-new" id="singpass">Retrieve MyInfo!</button>`); });
            appendChat($content);
            break;

        case "images":
            // nric = responseContent.options.NRIC;
            // console.log(nric)
            $content.append(`<button class="button-options-select-new" id="captureImage">Click for photo taking</button>`);
            // responseContent.options.forEach((opt) => {});
            appendChat($content);
            break;

        case "coordinates":
            let message = `/myCoordinates{"lon": "${longitude}","lat": "${latitude}"}`
            processUserInput(message, true);
            break;

        case "select":
            responseContent.options.forEach((opt) => { $content.append(`<div class="button-options-select">${opt}</div>`); });
            appendChat($content);
            break;

        case "link":
            $content.append(`<a class="button-link-select" href = ${responseContent.data.url} target="_blank">${responseContent.data.title}</a>`)
            appendChat($content);
            break;

        case "payment_button":
            let $content_payment = $('<div id="paypal-button-container" class="payment-button"></div>')
            appendChat($content_payment)
            paypal.Buttons({
                style: {
                    shape: 'pill',
                    height: 40,
                    width: 50
                },

                // sets up the details of the transaction, including the amount and line item details.
                createOrder: function (data, actions) {

                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: '100' // value  
                            }
                        }]
                    });
                },

                // Captures the funds from the transaction.
                onApprove: function (data, actions) {

                    return actions.order.capture().then(function (details) {
                        // This function shows a transaction success message to your buyer.
                        alert('Transaction completed by ' + details.payer.name.given_name);
                    });
                }
            }).render('#paypal-button-container') //  .render('#paypal-button-container');
            break;

        case "call_person_form":
            let $form = $(
                `<div class="form"> 
                    <form name="personal_particulars" onsubmit=submitForm(event) action="" class="partculars-form">
                        <label for="name:">Name:</label>
                        <input type="text" value="" placeholder="name">
                        <br>
                        <label for="phone:" value="" ">Phone number:</label>
                        <input type="text" placeholder="number>
                        <br>
                        <label for="email" value="">Email address:</label>
                        <input type="text" placeholder="email address">
                        <br>
                        <button type="submit">Submit</button>
                    </form>
                </div>`)

            appendChat($form)
            break;
    }

}

// append message into the container
function appendChat(message) {
    //append message directly if its a string
    $chathistory.append((typeof message == "string") ? `<div class="button-options">${message}</div>` : message).scrollTop(999999);
}

$(".typebar").on("keyup input", () => {
    $submitter.empty().append(`<i class="fa ${$(".typebar")[0].value ? "fa-arrow-right" : "fa-microphone"} fa-2x"></i>`);
});

$('.arrow-container').click(() => {
    $('.slide-container').toggleClass('fullview');
    $('.arrow').attr('src', `styles/pictures/arrow${$('.slide-container').css('padding-top') === "200px" ? "Down" : "Up"}.png`);
})

$(".greeting-page").show();

$(".getStarted").click(function () {
    if ($(".getStarted").text() == "Let's Begin! ") {
        $(".greeting-page").hide();
        $(".main").show();

        checkRetrieveChat();

        // setTimeout(() => {
        //     processUserInput("hello", true);    // simulate a user intent to trigger bot greeting
        // }, 3000);  



    }
});

function checkRetrieveChat() {
    // This function checks if there is existing session with the user and retrieves the chat history
    chat_Rasa('/check_conversation').then((res) => {
        console.log(res);

        let showChat = res[0].text;
        console.log(showChat);
        // New conversation will have history of length 1 (which is '/check_conversation)
        if (showChat == "false") {
            // setTimeout(() => {
            //     processUserInput("hello", true);    // simulate a user intent to trigger bot greeting
            // }, 3000);   
            // Restart conversation
            chat_Rasa('/restart').then((res) => {
                setTimeout(() => {
                    processUserInput("hello", true);    // simulate a user intent to trigger bot greeting
                }, 3000);
            })
        } else {
            let retrieveConversation = confirm('Do you want to continue previous conversation? Press "Okay" to retrieve, or "Cancel" to start a new conversation');
            if (retrieveConversation) {
                // Retrieve conversation
                chat_Rasa('/retrieve_conversation').then((res) => {
                    // Replace all single quotes to double quotes and replace all \n to <br />
                    // let processed_text = res[0].text.replaceAll('\'', '\"').replaceAll('\n', '<br />')
                    let processed_text = res[0].text.replaceAll('\n', '<br>');
                    renderChatHistory(JSON.parse(processed_text));
                });
            } else {
                // Restart conversation
                chat_Rasa('/restart').then((res) => {
                    setTimeout(() => {
                        processUserInput("hello", true);    // simulate a user intent to trigger bot greeting
                    }, 3000);
                })

            }

        }

        if (res.length > 1) {
            // Remove first element and render the rest
            res.slice(1).forEach((obj) => {
                renderResponse(obj);
            })
        }

    })
}

function renderChatHistory(history_res) {
    // This function displays previous conversations as chat boxes
    // history_res is an array containing array of past history.
    // The inner array is in the form of [event, text]
    console.log(history_res);
    history_res.forEach(res => {
        if (res[0] == 'user') {
            // If event is "user", this means user typed the message
            // Print chat box on the right
            appendChat($(`<div class ="ch-container-user"><div class ="ch-user">${res[1]}</div></div>`));
        } else if (res[0] == 'bot') {
            // If event is "bot", this means the message is returned by the bot
            // Print chat box on the left
            appendChat($(`<div class ="ch-container-avatar"><div class ="ch-avatar">${res[1]}</div></div>`))
        }
    })
}

$chathistory.on("touchstart mousedown", ".button-options-select", (e) => {
    e.preventDefault();
    processUserInput(e.target.textContent);
});

$(document).on('click', '#captureImage', () => {
    childWindow = "camera";
    var childWin = window.open('https://localhost:3000/captureImage.html')
})

/**
* Handle a message that was sent from some window.
*
* @param {MessageEvent} event The MessageEvent object holding the message/data.
*/
function handleMessage(event) {
    console.log("Received a message from " + event.origin + ".");
    // When one window sends a message, or data, to another window via
    // `parent.postMessage()`, the message (the first argument) in the
    // `parent.postMessage()` call is accessible via `event.data` here.
    if (childWindow == "singpass") {
        // If child window is Singpass page
        var person = event.data;
        nric = person.uinfin.value; // Global variable declared at the beginning of this script
        let fullName = person.name.value;
        let email = person.email.value;
        // "+" + "65" + "1234567"
        let mobileNumber = person.mobileno.prefix.value + person.mobileno.areacode.value + person.mobileno.nbr.value;
        let gender = person.sex.desc;
        let race = person.race.desc;
        let nationality = person.nationality.desc;
        let dob = person.dob.value;
        let regAdd = 'Block ' + parseInt(person.regadd.block.value) + ' ' + person.regadd.street.value + ' #' + person.regadd.floor.value + '-' + person.regadd.unit.value + ' Singapore ' + person.regadd.postal.value;

        let message = `/myInfoResponse{"name": "${fullName}","nric": "${nric}","email": "${email}","mobileNumber": "${mobileNumber}","gender": "${gender}","race": "${race}","nationality": "${nationality}","dob": "${dob}", "regAdd": "${regAdd}"}`
        console.log(`To RASA: ${message}`)
        $('#singpass').attr('disabled', true);
        processUserInput(message, true);

    } else if (childWindow == "camera") {
        // If child window is camera page
        let imageURL = event.data;
        let filePathObj = {front:'', back:'', left:'', right:''};
        let viewList = ['front', 'back', 'left', 'right'];
        let view = "front";
        let mapper = {
            front: 'Front view',
            back: 'Back view',
            left: 'Left view',
            right: 'Right view'
        }
        // Get from RASA response
        // let fullname = "Wei Feng";
        // let nric = 'S1234567A';
        // Upload for each image
        viewList.forEach(view => {
            let cameraView = mapper[view];
            if (imageURL[view]) {
                // If an image is taken
                let filePath = `inp-digital-human-chatbot-product-tuning/vehicle_damage_images/${nric}/${cameraView}.jpg`
                filePathObj[view] = filePath;
                console.log(filePath);
                uploadS3(filePath, imageURL[view], true);
            }

        })
        let message = `/myImages{"s3PathFront": "${filePathObj.front}", "s3PathBack": "${filePathObj.back}", "s3PathLeft": "${filePathObj.left}", "s3PathRight": "${filePathObj.right}"}`
        processUserInput(message, true);
    }

    childWindow = ''; // Reset childWindow


    // Do something with the data.
    console.log(event.data);
}
if (window.addEventListener) {
    window.addEventListener("message", handleMessage, true);
} else {
    window.attachEvent("onmessage", handleMessage);
}


// Handle recording events
function startRecording() {
    var audioContext = new AudioContext;
    console.log("recordButton clicked");
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
      /* assign to gumStream for later use */
      gumStream = stream;
      /* use the stream */
      input = audioContext.createMediaStreamSource(stream);
      /* Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size */
      rec = new Recorder(input, {
        numChannels: 1
      })
      //start the recording process 
      rec.record()
      console.log("Recording started");
    })
  }
  function stopRecording() {
    rec.stop(); //stop microphone access 
    gumStream.getAudioTracks()[0].stop();
    //create the wav blob and pass it on to createDownloadLink 
    rec.exportWAV(createDownloadLink);
  }
  
  function createDownloadLink(blob) {
  
    let data = new FormData();
    data.append('file', blob);
  
    start_time = Date.now()
    fetch('https://13.212.137.174:5006/audiorecog', {
        method: 'POST',
        body: data
      }
  
    ).then(res => {
      res.json().then(res_json => {
        transcribed_audio = res_json.transcribed_audio;
        console.log(res_json.transcribed_audio);

        processUserInput(transcribed_audio, true);

        $chathistory.find(".ch-container-listening").remove();
        appendChat($(`<div class ="ch-container-user"><div class ="ch-user">${transcribed_audio}</div></div>`));
        
        end_time = Date.now()
        time_taken = end_time - start_time
        console.log(`The FastAPI server took ${Math.floor(time_taken/1000)} seconds to return a response`)
      })
      
    }).catch (e => {
      console.log(e)
    });
  
  }