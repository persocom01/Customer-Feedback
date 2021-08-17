// SETUP VARIABLES
var scrollToAppForm = false;

// Variables for API #1 - Authorise API
var authApiUrl; // URL for authorise API
var clientId; // your app_id/client_id provided to you during onboarding
var redirectUrl; //callback url for your application

var attributes; // the attributes you are retrieving for your application to fill the form
var authLevel; // the auth level, determines the flow
// the purpose of your data retrieval
var purpose = "demonstrating MyInfo APIs";

// randomly generated state
var state = "123";

window.onload = function(e) {
    // invoke AJAX call to get the clientId & redirectURL from serverside
    $.ajax({
        url: "/getEnv",
        data: {},
        type: "GET", // get from serverside
        success: function(data) {
            // successful response from serverside
            if (data.status == "OK") { // successful
                // fill up the application form
                clientId = data.clientId;
                redirectUrl = data.redirectUrl;
                authApiUrl = data.authApiUrl;
                attributes = data.attributes;
                authLevel = data.authLevel;
            } else {
                // error occured
                alert("ERROR:" + JSON.stringify(data.msg));
            }

        }
    });
}

// main function for handling form events
$(function() {

    $("#formAuthorise").on("click", function(event) {
        event.preventDefault();
        // callAuthoriseApi();
    });

    $(document).on('click', '#singpass', function(event) {
        event.preventDefault();
        childWindow = "singpass";
        window.open("http://localhost:3001")
    })

});

// Function for calling API #1 - Authorise
// function callAuthoriseApi() {
//     var authoriseUrl = authApiUrl + "?client_id=" + clientId +
//         "&attributes=" + attributes +
//         "&purpose=" + purpose +
//         "&state=" + encodeURIComponent(state)  +
//         "&redirect_uri=" + redirectUrl;
//         https://sandbox.api.myinfo.gov.sg/com/v3/authorise?client_id=STG2-MYINFO-SELF-TEST&attributes=uinfin,name,sex,race,nationality,dob,email,mobileno,regadd,housingtype,hdbtype,marital,edulevel,noa-basic,ownerprivate,cpfcontributions,cpfbalances&purpose=demonstrating MyInfo APIs&state=123&redirect_uri=http://localhost:3001/callback
//     window.location = authoriseUrl;
// }


// Function for calling server side APIs (token & person) to get the person data for prefilling form
function callServerAPIs() {
    var authCode = $.url(this.location.href).param('code');
    //alert ("authorisation code="+authCode);

    // invoke AJAX call from frontend clientside to your backend serverside
    $.ajax({
        url: "/getPersonData",
        data: {
            code: authCode,
        },
        type: "POST", // post to serverside
        success: function(data) {
            //alert ("data:"+JSON.stringify(data));
            // successful response from serverside
            if (data.status == "OK") { // successful
                // fill up the application form
                console.log("data",data.text);
                original_data = data.text;
                // ['name', 'uinfin', 'dob', 'email'].forEach(key => {
                //     $("#myinfo").append(`<p> ${key}: ${original_data[key]['value']}</p>`)
                // })
            } else {
                // error occured
                alert("ERROR:" + JSON.stringify(data.msg));
            }


        }
    });


}


// CALLBACK HANDLER
if ((this.location.href.includes("callback?") || this.location.href.includes("callback/?")) && this.location.href.includes("code=")) {
    scrollToAppForm = true;

    // call the backend server APIs
    callServerAPIs();
}
