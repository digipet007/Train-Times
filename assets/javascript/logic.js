//INITIALIZE fIREBASE==========================================
var config = {
    apiKey: "AIzaSyBkWK0SgbNpG2BO1OKMT1UtUHLUsrpbAQU",
    authDomain: "unique-name-ead61.firebaseapp.com",
    databaseURL: "https://unique-name-ead61.firebaseio.com",
    projectId: "unique-name-ead61",
    storageBucket: "unique-name-ead61.appspot.com",
    messagingSenderId: "485517227405",
    appId: "1:485517227405:web:0a1cc0b35b56900d"
};

firebase.initializeApp(config);

var dataRef = firebase.database();

// SET UP VARIABLES ========================================================= 
var routeName = "";
var destination = "";
var firstTrainConverted = "";
var frequency = 0;
var convertedNextArrival = ""; 
var minutesToTrain = 0; 
var currTime = "";
var firstTrain = "";

// MAIN FUNCTIONS ==============================================================
//on submit click, grab form input, and push it to the database
$(document).on("click", ".btn", function(){
    event.preventDefault();
    getTableInput();
    dealWithEdgeCases();
    //Push to database
    dataRef.ref().push({
        "route": routeName,
        "destination": destination,
        "frequency": frequency,
        "lastArrival": firstTrain,
        "dateAdded": firebase.database.ServerValue.TIMESTAMP
      });
    clearFields();
});

function getTableInput(){
//take in info from table and calculate nextArrival and minutesAway
routeName = $("#route-name-input").val().trim();
destination = $("#destination-input").val().trim();
frequency = $("#train-frequency-input").val().trim();
firstTrain = $("#first-train-time-input").val().trim();
//make route and destination uppercase
routeName = routeName.charAt(0).toUpperCase() + routeName.substring(1);
destination = destination.charAt(0).toUpperCase() + destination.substring(1);
};

function dealWithEdgeCases(){
    //Edge Case 1: If user does not fill out each input
    if(routeName.length == 0 || destination.length == 0 || firstTrain.length == 0 || frequency.length == 0){
        alert("Please complete all fields");
        return false;
    }
    //Edge Case 2: If user adds comma in minutes
    var commaIndex = frequency.indexOf(",");
    if (frequency.includes(",")){
        //  frequency = frequency.slice(commaIndex, 1);
        frequency = frequency.slice(0, commaIndex) + frequency.slice(commaIndex + 1, frequency.length);
    }
    //Edge Case 3: If user enters units in frequency
    if(frequency.includes("m")){
        var indx = frequency.indexOf("m");
        frequency = frequency.slice(0, indx);
        frequency = frequency.trim();
    }
    //Edge Case 4: If there is a typo in the frequency input and no number was inputted
    if(isNaN(frequency) && frequency !=="m"){
        alert("Please enter a number.");
        return false;
    }
    //Edge Case 5: If first train is not entered in military time format (cannot decipher issues with times between 10:00 and 12:59)
    //Edge Case 6: If last train time entered exceeds 23:59
    var indexOfcolon = firstTrain.indexOf(":");
    var firstTwoDigits = firstTrain.slice(0, 2);
    var lastTwoDigits = firstTrain.slice(3, 5);
    if(indexOfcolon !== 2 || firstTrain.length != 5 || firstTwoDigits > 23 || lastTwoDigits > 59){
        alert("Enter in military time HH:MM");
        return false;
    }
    //Edge Case 7: If frequency is < 1min.
    if(frequency < 1){
        alert("Train frequency must be one minute or greater");
        return false;
    }
};

//firebase watcher and initial loader
//once firebase has a new child, render the database child to the table
dataRef.ref().on("child_added", function(childSnapshot){
    //math==========================================================================
    //subtract one year from the first train time in case last train is ahead of current time 
    firstTrainConverted = moment(childSnapshot.val().lastArrival, "HH:mm").subtract(1, "years");
    currTime = moment();
    var diffTime = moment().diff(firstTrainConverted, "minutes");
    frequency = childSnapshot.val().frequency;
    var remainder = diffTime % frequency;
    minutesToTrain = frequency - remainder;
    var nextArrival = moment().add(minutesToTrain, "minutes");
    convertedNextArrival = nextArrival.format("LT");
    //add data to table
    var newTr = $("<tr>");
    var nameTd = $("<td>").text(childSnapshot.val().route);
    var destinTd = $("<td>").text(childSnapshot.val().destination);
    var freqTd = $("<td>").text(frequency);
    var nextTd = $("<td>").text(convertedNextArrival);
    var minAwayTd = $("<td>").text(minutesToTrain);
    newTr.append(nameTd).append(destinTd).append(freqTd).append(nextTd).append(minAwayTd);
    $("#table-body").append(newTr);
//handles the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

//reload timetable every two minutes for current information
setTimeout(function(){
    location.reload();
},1.2e5);

function clearFields(){
    $("#route-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#train-frequency-input").val("");
};