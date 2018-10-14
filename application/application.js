// TODO: Replace with your project's config object. You can find this
// by navigating to your project's console overview page
// (https://console.firebase.google.com/project/your-project-id/overview)
// and clicking "Add Firebase to your web app"

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCxWD71QcSjSfytAgCB3BrskmeXm4X2BdI",
    authDomain: "talks-you-should-watch-154bf.firebaseapp.com",
    databaseURL: "https://talks-you-should-watch-154bf.firebaseio.com",
    projectId: "talks-you-should-watch-154bf",
    storageBucket: "talks-you-should-watch-154bf.appspot.com",
    messagingSenderId: "114823341254"
  };
  firebase.initializeApp(config);

  
  // Initialize your Firebase app
  firebase.initializeApp(config);
  
  // Reference to the recommendations object in your Firebase database
  var recommendations = firebase.database().ref("recommendations");
  
  // Save a new recommendation to the database, using the input in the form
  var submitRecommendation = function () {
  
    // Get input values from each of the form elements
    var title = $("#talkTitle").val();
    var presenter = $("#talkPresenter").val();
    var link = $("#talkLink").val();
  
    // Push a new recommendation to the database using those values
    recommendations.push({
      "title": title,
      "presenter": presenter,
      "link": link
    });
  };
  
  // When the window is fully loaded, call this function.
  // Note: because we are attaching an event listener to a particular HTML element
  // in this function, we can't do that until the HTML element in question has
  // been loaded. Otherwise, we're attaching our listener to nothing, and no code
  // will run when the submit button is clicked.
  $(window).load(function () {
  
    // Find the HTML element with the id recommendationForm, and when the submit
    // event is triggered on that element, call submitRecommendation.
    $("#recommendationForm").submit(submitRecommendation);
  
  });