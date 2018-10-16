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
  
  // Initialize your Firebase app
firebase.initializeApp(config);

// Reference to the recommendations object in your Firebase database
var recommendations = firebase.database().ref("recommendations");

// Save a new recommendation to the database, using the input in the form
var submitRecommendation = function () {

  // Get input values from each of the form elements
  var title = $("#talkTitle").val();
  var presenter = $("#talkPresenter").val();
  var version = $("#talkVersion").val();
  var link = $("#talkLink").val();

  // Push a new recommendation to the database using those values
  recommendations.push({
    "title": title,
    "presenter": presenter,
    "version": version,
    "link": link
  });
};


const myTableBody = document.getElementById("MyTableBody");
// Get the single most recent recommendation from the database and
// update the table with its values. This is called every time the child_added
// event is triggered on the recommendations Firebase reference, which means
// that this will update EVEN IF you don't refresh the page. Magic.
recommendations.limitToLast(5).on('child_added', function(childSnapshot) {
    //loop over childSnapshot
    // childSnapshot.forEach(function(child) {
        
        
    // });
        var tr = document.createElement('TR');
        var td1 = document.createElement('TD');
        var td2 = document.createElement('TD');
        var td3 = document.createElement('TD');
        var td4 = document.createElement('TD');

        td1.appendChild(document.createTextNode(childSnapshot.val().title));
        td2.appendChild(document.createTextNode(childSnapshot.val().presenter));
        td3.appendChild(document.createTextNode(childSnapshot.val().version));
        td4.appendChild(document.createTextNode(childSnapshot.val().link));

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);

        //myTableBody.appendChild(tr);
    
    //console.log(childSnapshot.val().version);
    

    // childSnapshot.forEach(function(data) {
    //     // Get the recommendation data from the most recent snapshot of data
    //     // added to the recommendations list in Firebase
        
    //     for(var index in data.val()){

        // $('#myTableBody').append('<tr>'
        // +'<td>'+data[index]+'</td>'
        // +'<td>'+index.presenter+'</td>'
        // +'<td>'+index.version+'</td>'
        // +'<td>'+index.link+'</td>'+'</tr>')

    //     console.log(data.val());
    
    //     // Update the HTML to display the recommendation text
    //     // $("#title").html(recommendation.title)
    //     // $("#presenter").html(recommendation.presenter)
    //     // $("#version").html(recommendation.version)
    //     // $("#link").html(recommendation.link)
    
    //     // Make the link actually work and direct to the URL provided
    //     // $("#link").attr("href", recommendation.link)
    //     };
    // });
});
  

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