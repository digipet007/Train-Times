// SET UP VARIABLES AND INITIALIZE fIREBASE==========================================
// var config = {
    // apiKey: "AIzaSyCs3K5zwuOuS0odq89IpPLC7HnXTOcDqgI",
    // authDomain: "recent-user-with-all-use-e8e76.firebaseapp.com",
    // databaseURL: "https://recent-user-with-all-use-e8e76.firebaseio.com",
    // projectId: "recent-user-with-all-use-e8e76",
    // storageBucket: ""
    //add a timestamp!!!!!!!
//   };

//   firebase.initializeApp(config);

//   var dataRef = firebase.database();

  // Initial Values
  var routeName = "";
  var destination = "";
  var firstTrainConverted = "";
  var frequency = 0;
  var convertedNextArrival = ""; //calculate
  var minutesToTrain = 0; //calculate

//Initial Function fills in table on page load
$(function(){
    //initially load from the database and display in the table
    //function displayDataToTable
    //
});

// MAIN FUNCTIONS ==============================================================
function getTableInput(){
//take in info from table and calculate nextArrival and minutesAway
routeName = $("#route-name-input").val().trim();
destination = $("#destination-input").val().trim();
frequency = $("#train-frequency-input").val().trim();
var firstTrain = $("#first-train-time-input").val().trim();

firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
// console.log("first train converted: " + firstTrainConverted);

var currTime = moment();
console.log("current time: " + moment(currTime).format("hh:mm"));

var diffTime = moment().diff(firstTrainConverted, "minutes");
console.log("difftime, now-last train :" + diffTime.toString()); 

console.log("frequency: " + frequency)

var remainder = diffTime % frequency;
console.log("remainder, diff % frequency: " + remainder);

minutesToTrain = frequency - remainder;
console.log("minutes to train, frequency - remainder: " + minutesToTrain);
var nextArrival = moment().add(minutesToTrain, "minutes");
convertedNextArrival = nextArrival.format("LT");
console.log("next train at: " + convertedNextArrival);
};

//function getFirebaseData(){}

function displayDataToTable(){
    var nameTr = $("<tr>");
    var destinTr = $("<tr>");
    var freqTr = $("<tr>");
    var nextTr = $("<tr>");
    var minAwayTr = $("<tr>");
    var nameTd = $("<td>");
    nameTd.html(routeName);
    var destinTd = $("<td>");
    destinTd.html(destination);
    var freqTd = $("<td>");
    freqTd.html(frequency);
    var nextTd = $("<td>");
    nextTd.html(convertedNextArrival);
    var minAwayTd = $("<td>");
    minAwayTd.html(minutesToTrain)

    nameTr.append(nameTd);
    destinTr.append(destinTd);
    freqTr.append(freqTd);
    nextTr.append(nextTd);
    minAwayTr.append(minAwayTd);

    $("#table-body").append(nameTr)
    $("#table-body").append(destinTr)
    $("#table-body").append(freqTr)
    $("#table-body").append(nextTr)
    $("#table-body").append(minAwayTr);
}
 
//name -tr-td
//dest tr-td
//freq tr-td
//next tr-td
//minAway tr-td

// all appended to tbody
// tbody to "#thead"


$(document).on("click", ".btn", function(){
    event.preventDefault();
    console.log("hello");
    getTableInput();
    // routeName = $("#route-name-input").val().trim();
    // destination = $("#destination-input").val().trim();
    // firstTrain = $("#first-train-time-input").val().trim();
    // frequency = $("#train-frequency-input").val().trim();
    // console.log(routeName);
    // console.log(destination);
    // console.log(firstTrain);
    // console.log(frequency);
    // console.log(nextArrival);
    $("#route-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-time-input").val("");
    $("#train-frequency-input").val("");

    //displayDataToTable()
    //render function takes in getInput values
    //renders to the table
    //pushes to database
})


//edge cases: if user enters "min"
//if not a number entered
//if not entered with military time
//not filling out each input
//make route and destination uppercase