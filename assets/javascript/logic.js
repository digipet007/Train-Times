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
  var currTime;
  var firstTrain;

// MAIN FUNCTIONS ==============================================================
function getTableInput(){
//take in info from table and calculate nextArrival and minutesAway
routeName = $("#route-name-input").val().trim();
destination = $("#destination-input").val().trim();
frequency = $("#train-frequency-input").val().trim();
firstTrain = $("#first-train-time-input").val().trim();
//deal with edge cases
//edge cases: 
//if user enters "min"
//if not a number entered
//if not entered with military time
//not filling out each input
//make route and destination uppercase
//commas in minutes
};

//on submit click, grab form input, and push it to the database
$(document).on("click", ".btn", function(){
    event.preventDefault();
    getTableInput();
    // Code for the push to database
    dataRef.ref().push({
        "route": routeName,
        "destination": destination,
        "frequency": frequency,
        "lastArrival": firstTrain,
        // "nextArrival": convertedNextArrival,
        // "minutesAway": minutesToTrain,
        "dateAdded": firebase.database.ServerValue.TIMESTAMP
      });
    //clear the values in the form input fields
    $("#route-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#train-frequency-input").val("");  
});

//firebase watcher and initial loader
//once firebase has a new child, render the database child to the table
dataRef.ref().on("child_added", function(childSnapshot){
    //math==========================================================================
    //subtract one year from the first train time 
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
    var nameTd = $("<td>");
    nameTd.text(childSnapshot.val().route);
    var destinTd = $("<td>");
    destinTd.text(childSnapshot.val().destination);
    var freqTd = $("<td>");
    freqTd.text(frequency);
    var nextTd = $("<td>");
    nextTd.text(convertedNextArrival);
    var minAwayTd = $("<td>");
    minAwayTd.text(minutesToTrain);
    newTr.append(nameTd).append(destinTd).append(freqTd).append(nextTd).append(minAwayTd);
    $("#table-body").append(newTr)
// //handles the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});