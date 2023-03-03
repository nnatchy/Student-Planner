import {showItemsSchedule} from "./schedule.js"
import {showItemsExam} from "./exam.js"
import {showItemsHomework} from "./homework.js"
import {showItemDropdown, showItemsSubject, showStart} from "./subjectTable.js"

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpbU4Q9iHAemvvBXvuzSlYQAueDow00wE",
  authDomain: "planner-9f1f0.firebaseapp.com",
  projectId: "planner-9f1f0",
  storageBucket: "planner-9f1f0.appspot.com",
  messagingSenderId: "134142317881",
  appId: "1:134142317881:web:2cf9ce6ad2bd5236db84e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
  query,
  orderBy,
} from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js';

const db = getFirestore();
const UserRef = collection(db, 'User');

async function IsLogin() {
    let user = document.getElementById("login-username").value;
    let pass = document.getElementById("login-password").value;
    let canlog = false;
    let wrongPass = false;
    let wrongUser = false;
    const collection = await getDocs(UserRef)
    collection.docs.map((item) => {
      if (item.data().username == user && item.data().password == pass) {
        console.log("FOUND")
        canlog = true;
      } 
      if (item.data().username == user && item.data().password != pass) {
        wrongPass = true;
      } else {
        wrongUser = true;
      }
    })
    if (canlog) {
      showItemsSchedule();
      showItemsExam();
      showItemsHomework();
      showItemDropdown().then(() => {
        showStart();
        showItemsSubject();
      });
      document.querySelector("#content").style.display = "block";
      document.querySelector("#login-content").style.display = "none";
      alert("Log in successfully")
    } else {
      if (wrongPass) {
        document.querySelector('#Login-form').reset();
        alert("Your password isn't matched with username");
      } else if (wrongUser) {
        document.querySelector('#Login-form').reset();
        alert("This username is not registered");
      }
    }   
}

function validateLength(min, max) {
  const password = document.getElementById("register-password").value;
  if (password.length < min || password.length > max) {
    alert(
      `Your password length must be between ${min} and ${max}`
    );
    return false;
  }
  return true;
}

async function IsRegister() {
  let user = document.getElementById("register-username").value;
  let pass = document.getElementById("register-password").value;
  let duplicate = false;
  if (validateLength(8,20)) {
    const collection = await getDocs(UserRef);
    collection.docs.map((item) => {
      if (item.data().username == user) {
        console.log("FOUND")
        duplicate = true;
      }});
    if (duplicate) {
      alert("This username has already been used")
    } else if (user && pass) {
      addDoc(UserRef, {
        username :user,
        password :pass,
      }).then(() => {
        alert("Register Successfully")
      });
      } else {
      alert("Please fill all!!")
      }
      document.querySelector('#Register-form').reset()
  } else {
    document.getElementById("register-password").value = "";
  }
}  



function logout() {
  document.querySelector("#content").style.display = "none";
  document.querySelector("#login-content").style.display = "block";
  document.querySelector('#Login-form').reset()
  alert("Log out successfully");
}


var login = document.querySelector("#Login");
login.onclick = (e) => {
    e.preventDefault();
    IsLogin();
}

var regis = document.querySelector("#Register");
regis.onclick = (e) => {
  e.preventDefault();
  IsRegister();
}

var logOut = document.querySelector("#log-out");
logOut.onclick = (e) => {
  e.preventDefault();
  logout();
}