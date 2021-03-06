$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyA0gOjc14-1vESXbVqOtCzwcjEqnsNO_hk",
    authDomain: "pos-transaction-records.firebaseapp.com",
    databaseURL: "https://pos-transaction-records.firebaseio.com",
    projectId: "pos-transaction-records",
    storageBucket: "pos-transaction-records.appspot.com",
    messagingSenderId: "910784172802"
  };
  
  firebase.initializeApp(config);

  //create firebase references
  var Auth = firebase.auth(); 
  var dbRef = firebase.database();
  var transactionRef = dbRef.ref('transactions')
  var usersRef = dbRef.ref('users')
  var auth = null;

  //Register
  $('#registerForm').on('submit', function (e) {
    e.preventDefault();
    $('#registerModal').modal('hide');
    $('#messageModalLabel').html(spanText('<i class="fa fa-cog fa-spin"></i>', ['center', 'info']));
    $('#messageModal').modal('show');
    var data = {
      email: $('#registerEmail').val(), //get the email from Form
      firstName: $('#registerFirstName').val(), // get firstName
      lastName: $('#registerLastName').val(), // get lastName
    };
    var passwords = {
      password : $('#registerPassword').val(), //get the pass from Form
      cPassword : $('#registerConfirmPassword').val(), //get the confirmPass from Form
    }
    if( data.email != '' && passwords.password != ''  && passwords.cPassword != '' ){
      if( passwords.password == passwords.cPassword ){
        //create the user
        
        firebase.auth()
          .createUserWithEmailAndPassword(data.email, passwords.password)
          .then(function(auth){
            //now user is needed to be logged in to save data
            user = auth;
            user.updateProfile({
              displayName: data.firstName + ' ' + data.lastName
            })
            //now saving the profile data
            usersRef.child(user.uid).set(data)
              .then(function(){
                console.log("User Information Saved:", user.uid);
              })
            $('#messageModalLabel').html(spanText('Success!', ['center', 'success']))
            
            $('#messageModal').modal('hide');
          })
          .catch(function(error){
            console.log("Error creating user:", error);
            $('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
          });
      } else {
        //password and confirm password didn't match
        $('#messageModalLabel').html(spanText("ERROR: Passwords didn't match", ['danger']))
      }
    }  
  });

  //Login
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();
    $('#loginModal').modal('hide');
    $('#messageModalLabel').html(spanText('<i class="fa fa-cog fa-spin"></i>', ['center', 'info']));
    $('#messageModal').modal('show');

    if( $('#loginEmail').val() != '' && $('#loginPassword').val() != '' ){
      //login the user
      var data = {
        email: $('#loginEmail').val(),
        password: $('#loginPassword').val()
      };
      firebase.auth().signInWithEmailAndPassword(data.email, data.password)
        .then(function(authData) {
          auth = authData;
          $('#messageModalLabel').html(spanText('Success!', ['center', 'success']))
          $('#messageModal').modal('hide');
        })
        .catch(function(error) {
          console.log("Login Failed!", error);
          $('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
        });
    }
  });

  $('#logout').on('click', function(e) {
    e.preventDefault();
    $('.user-info').append('<span class="user-name">'+''+'</span>');
    firebase.auth().signOut()
  });

  //save transaction
  $('#transactionForm').on('submit', function( event ) {  
    event.preventDefault();
    if( auth != null ){
      if( $('#marskedpan').val() != '' || $('#bank').val() != ''){
        transactionRef.child(auth.uid)
          .set({
            pan: $('#marskedpan').val(),
            bank: $('#bank').val(),
            customer: $('#customername').val(),
            type: $('#type').val(),
            phone: $('#phone').val(),
            error: $('#error').val(),
            status: $('#status').val(),
            amount: $('#amount').val(),
            fee: $('#fee').val(),
            feetype: $('#feetype').val()
            
          })
          .catch(function(error){
            console.log("Error Saving Data:", error);
            $('#messageModalLabel').html(spanText('ERROR: '+error.code, ['danger']))
          });
          //document.TransactionForm.reset();
          
      } else {
        alert('Please fill at-lease name or email!');
      }
    } else {
      //inform user to login
    }
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      auth = user;
      $('body').removeClass('auth-false').addClass('auth-true');
      usersRef.child(user.uid).once('value').then(function (data) {
        var info = data.val();
        if(user.photoUrl) {
          $('.user-info img').show();
          $('.user-info img').attr('src', user.photoUrl);
          $('.user-info .user-name').hide();
        } else if(user.displayName) {
          $('.user-info img').hide();
          $('.user-info').append('<span class="user-name">'+user.displayName+'</span>');
        } else if(info.firstName) {
          $('.user-info img').hide();
          $('.user-info').append('<span class="user-name">'+info.firstName+'</span>');
        }
      });
      transactionRef.child(user.uid).on('child_added', onChildAdd);
    } else {
      // No user is signed in.
      $('body').removeClass('auth-true').addClass('auth-false');
      auth && transactionRef.child(auth.uid).off('child_added', onChildAdd);
      $('#transaction').html('');
      auth = null;
    }
  });
});

function onChildAdd (snap) {
  $('#transactions').append(contactHtmlFromObject(snap.key, snap.val()));
}
 
//prepare transaction object's HTML
function contactHtmlFromObject(key, transaction){
  return '<div class="card transaction" style="width: 18rem;" id="'+key+'">'
    + '<div class="card-body">'
      + '<h5 class="card-title">'+transaction.pan+'</h5>'
      + '<h6 class="card-subtitle mb-2 text-muted">'+transaction.customer+'</h6>'
      + '<h6 class="card-subtitle mb-2 text-muted">'+transaction.bank+'</h6>'
      + '<h6 class="card-subtitle mb-2 text-muted">'+transaction.amount+'</h6>'
      // + '<a href="#" class="card-link">Card link</a>'
      // + '<a href="#" class="card-link">Another link</a>'
    + '</div>'
  + '</div>';
}

function spanText(textStr, textClasses) {
  var classNames = textClasses.map(c => 'text-'+c).join(' ');
  return '<span class="'+classNames+'">'+ textStr + '</span>';
}

