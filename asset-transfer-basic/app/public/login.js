/*
		Designed by: SELECTO
		Original image: https://dribbble.com/shots/5311359-Diprella-Login
*/

function validateForm() {
    const username = document.forms["a-form"]["username"].value;
    const email = document.forms["a-form"]["email"].value;
    const password = document.forms["a-form"]["password"].value;

    // Clear previous errors
    document.getElementById("nameError").innerHTML = "";
    document.getElementById("emailError").innerHTML = "";
    document.getElementById("passwordError").innerHTML = "";

    // Validate username
    if (username === "") {
      document.getElementById("nameError").innerHTML = "Username is required";
      return false;
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9_.+-]+@gmail.com$/;
    if (!emailRegex.test(email)) {
      document.getElementById("emailError").innerHTML = "Please enter a valid Gmail address";
      return false;
    }

    // Validate password length
    if (password.length < 8) {
      document.getElementById("passwordError").innerHTML = "Password must be at least 8 characters long";
      return false;
    }

    return true;
  }

let switchCtn = document.querySelector("#switch-cnt");
let switchC1 = document.querySelector("#switch-c1");
let switchC2 = document.querySelector("#switch-c2");
let switchCircle = document.querySelectorAll(".switch__circle");
let switchBtn = document.querySelectorAll(".switch-btn");
let aContainer = document.querySelector("#a-container");
let bContainer = document.querySelector("#b-container");
let allButtons = document.querySelectorAll(".submit");

let getButtons = (e) => e.preventDefault()

let changeForm = (e) => {

    switchCtn.classList.add("is-gx");
    setTimeout(function(){
        switchCtn.classList.remove("is-gx");
    }, 1500)

    switchCtn.classList.toggle("is-txr");
    switchCircle[0].classList.toggle("is-txr");
    switchCircle[1].classList.toggle("is-txr");

    switchC1.classList.toggle("is-hidden");
    switchC2.classList.toggle("is-hidden");
    aContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-z200");
}

let mainF = (e) => {
    // for (var i = 0; i < allButtons.length; i++)
    //     allButtons[i].addEventListener("click", getButtons );
    for (var i = 0; i < switchBtn.length; i++)
        switchBtn[i].addEventListener("click", changeForm)
}

window.addEventListener("load", mainF);
