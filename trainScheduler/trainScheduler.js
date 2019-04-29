(function() {
    'use strict';
    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      var validation = Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
            
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
           }
           form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();
          //Initialize Firebase
          var config = {
          apiKey: "AIzaSyDTrtsCZROIwG0k7mWE-sdrKUx6Poi4iQs",
          authDomain: "train-scheduler-3cbbb.firebaseapp.com",
          databaseURL: "https://train-scheduler-3cbbb.firebaseio.com",
          projectId: "train-scheduler-3cbbb",
          storageBucket: "train-scheduler-3cbbb.appspot.com",
          messagingSenderId: "584219649770"
          };
          firebase.initializeApp(config);
  
          var database = firebase.database();
  
  
          $("#submit-button").on("click", function(event) {
              event.preventDefault();
  
              //Grabs user Input
              var input = $("input");
              var tName = $("#train-name").val().trim();
              var tDestination = $("#train-destination").val().trim();
              var tFirstTime = moment($("#train-first-time").val().trim(), "HH:mm");
              var tFrequency = parseInt($("#train-frequency").val().trim());

                if (tName.length === 0) {
                tName = "";
                $("#train-name").val("");
                $("#train-name").attr("class", "form-control is-invalid");
                $("#invalid-name").text("Please enter a Train name")
                }
                else {
                    $("#train-name").attr("class", "form-control");
                    $("#invalid-name").text("");
                }

                if (tDestination.length === 0) {
                    tDestination = "";
                    $("#train-destination").val("");
                    $("#train-destination").attr("class", "form-control is-invalid");
                    $("#invalid-destination").text("Please enter a destination");
                    
                }
                else {
                    $("#train-destination").attr("class", "form-control");
                    $("#invalid-destination").text("");
                }

                if (Number.isInteger(tFrequency) === false) {
                    $("#train-frequency").val("");
                    $("#train-frequency").attr("class", "form-control is-invalid");
                    $("#invalid-frequency").text("Please enter a valid frequency");
                }
                else {
                    $("#train-frequency").attr("class", "form-control");
                    $("#invalid-frequency").text("");
                }
            
              if (moment(tFirstTime).isValid() === false) {
                tFirstTime = "";
                $("#train-first-time").val("");
                $("#train-first-time").attr("class", "form-control is-invalid");
                $("#invalid-time").text("Please enter a valid time");

                return    
            }
            
            $("#train-first-time").attr("class", "form-control");
            $("#invalid-time").text("");
  
              //Creates local object for holding train data
              var newTrain = {
                  name: tName,
                  destination: tDestination,
                  firstTime: tFirstTime.format("HH:mm"),
                  frequency: tFrequency
              };
              $("#train-first-Time").attr("class", "form-group");
              
              $("#helpBlock").text("");
  
  
              //Code for pushing train data to Firebase
              database.ref().push(newTrain);
  
              console.log(newTrain.name);
              console.log(newTrain.destination);
              console.log(newTrain.firstTime);
              console.log(newTrain.frequency);
  
              //Clear all of text-boxes
              $("#train-name").val("");
              $("#train-destination").val("");
              $("#train-first-time").val("");
              $("#train-frequency").val("");
  
          });
  
          //Firebase watcher + initial loader
          database.ref().on("child_added", function(childSnapshot) {
  
              var tName = (childSnapshot.val().name);
              var tDestination = (childSnapshot.val().destination);
              var tFirstTime = (childSnapshot.val().firstTime)
              var tFrequency = (childSnapshot.val().frequency);
              
  
              var convertedTime = moment(tFirstTime, "HH:mm").subtract(1, "years");
              console.log(convertedTime);
  
              //Current Time
              var currentTime = moment();
  
              //Difference between the times
              var diffTime = moment().diff(moment(convertedTime), "minutes");
              console.log("Differennce in time: " + diffTime);
  
              //Time apart
              var tRemainder = diffTime % tFrequency;
              console.log(tRemainder);
  
              //Minutes Until Train
              var minutesAway = tFrequency - tRemainder;
              console.log("Minutes until train: " + minutesAway);
  
              //Next Train
              var nextArrival = moment().add(minutesAway, "minutes");
              console.log("Arrival time: " + moment(nextArrival).format("HH:mm"));
  
  
              //Create the new row
              var newRow = $("<tr>").append(
                  $("<td>").text(tName),
                  $("<td>").text(tDestination),
                  $("<td>").text(tFrequency),
                  $("<td>").text(nextArrival.format("HH:mm")),
                  $("<td>").text(minutesAway)
              );
  
              //Append the new row to the table
              $("#full-table").append(newRow);
          })
  