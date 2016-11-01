$(document).ready( function() {

    $("#signup-btn").click( function(event) {
        alert("You clicked the button using JQuery innit");
    });    
});

var password = document.getElementById("password")
var confirm_password = document.getElementById("confirm_password");

function validatePasswordMatch(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

password.onchange = validatePasswordMatch;
confirm_password.onkeyup = validatePasswordMatch;