// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBHXeva4FzXOJrp4VXeTAgQnrk-taoYHl0",
    authDomain: "train-project-69f09.firebaseapp.com",
    databaseURL: "https://train-project-69f09.firebaseio.com",
    projectId: "train-project-69f09",
    storageBucket: "",
    messagingSenderId: "831645516944",
    appId: "1:831645516944:web:5c46c9f6e92dd2d4"
};
  
firebase.initializeApp(firebaseConfig);
  
var database = firebase.database();
  
// 2. Button for adding Employees
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var traiDestination = $("#destination-input").val().trim();
    var trainFrequency = moment($("#frequency-input").val().trim(), "mm").format("mm");
    var trainFirstTime = moment($("#first-time-input").val().trim(), "HH:mm").format("HH:mm");

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        name: trainName,
        destination: traiDestination,
        frequency: trainFrequency,
        firstTime: trainFirstTime
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#frequency-input").val("");
    $("#first-time-input").val("");
});
  
// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var traiDestination = childSnapshot.val().destination;
    var trainFrequency = childSnapshot.val().frequency;
    var trainFrequencyInSecs = parseInt(childSnapshot.val().frequency)*60;
    var trainFirstTime = moment(childSnapshot.val().firstTime, "HH:mm").unix();
    var now = moment().unix();

    while(trainFirstTime <= now){
        trainFirstTime += trainFrequencyInSecs;
    };

    var fromNow = moment(trainFirstTime - now, "X").format("mm:ss");

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(traiDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(moment(trainFirstTime, "X").format("HH:mm")),
        $("<td>").text(fromNow),
    );

    // Append the new row to the table
    $("#trainTableBody").append(newRow);
});