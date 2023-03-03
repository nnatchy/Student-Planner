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
  where,
} from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js';

// Import the functions you need from the SDKs you need
const db = getFirestore();
const subjects_ref = collection(db, "Subject");
const UserRef = collection(db, 'User');
const subjectsDd_ref = collection(db, "SubjectDropdown");

// TODO Get subjectDD

// function getSubjectsDd(){
//   getDocs(query(subjectsDd_ref, orderBy("subject")))
//     .then((data) => {
//       let subjects = [];
//       data.docs.forEach((subject) => {
//         subjects.push( { ...subject.data(),id: subject.id} )
//       })
//     })
//     .catch(e => {
//       console.log(e.message);
//     })
// }

// getSubjectsDd();

// TODO showSubjectIndropdown + Add

export async function showItemDropdown() {
  let addDropdown = document.getElementById("dropdown-subject");
  addDropdown.innerHTML = "";
  var ucollection = await getDocs(UserRef);
  const user = document.getElementById("login-username").value;
  const pass = document.getElementById("login-password").value;
  ucollection.docs.map(async (item) => {
    if (item.data().username == user && item.data().password == pass) {
        const collection = await getDocs(query(subjectsDd_ref, orderBy("subject"), where("uid", "==" ,item.id)));
        collection.docs.map((item) => {
          var option = document.createElement("option");
          option.textContent = item.data().subject;
          option.value = item.data().subject;
          addDropdown.appendChild(option);
        })
      }        
    });
}

var addDropdownButton = document.getElementById("add-subject-button");
addDropdownButton.onclick = async (e) => {
  e.preventDefault();
  console.log('addExam');
  const user = document.getElementById("login-username").value;
  const pass = document.getElementById("login-password").value;   
  const subject = document.getElementById("add-subject-input").value;
  let uid;
  var ucollection = await getDocs(UserRef)
  ucollection.docs.map((item) => {
      if (item.data().username == user && item.data().password == pass) {
          uid = item.id;
      }
  });
  if (subject) {
    addDoc(subjectsDd_ref, {
      subject,
      uid,
    }).then(() => {
      console.log("Dropdown Add");
      document.getElementById("add-subject-input").value = "";
      showItemDropdown().then(() => {
        showStart()
        showItemsSubject();
      });
    })
  }
}

// TODO Removing subject from drop down

const removesubject = document.getElementById("remove-subject-button");
removesubject.onclick = async (e) => {
  const x = document.getElementById("dropdown-subject");
  let index = x.selectedIndex;
  const valueSubject = x[index].value;
  const collectionDropdown = await getDocs(query(subjectsDd_ref, orderBy("subject")));
  const collection = await getDocs(query(subjects_ref, orderBy("subject")));
  collection.docs.map((item) => {
    if (item.data().subject == valueSubject) {
      deleteItemwithoutshow(item.id);    
    }
  })
  const selected = []
  collectionDropdown.docs.map((item) => {
    if (item.data().subject == valueSubject) {
      selected.push(item.id)
    }
  })
  const select = selected[0];
  const docRef = doc(db, `SubjectDropdown/${select}`);

  deleteDoc(docRef);
  console.log("delete subject in dropdown");
  x.remove(index);

  showItemsSubject();
};

// TODO add subject to table

export async function showItemsSubject() {
    const subject_body = document.getElementById('subject-body');
    subject_body.innerHTML = "";
    let watch = document.getElementById("dropdown-subject").value;
    var ucollection = await getDocs(UserRef);
    const user = document.getElementById("login-username").value;
    const pass = document.getElementById("login-password").value;
    ucollection.docs.map(async (item) => {
      if (item.data().username == user && item.data().password == pass) {
          const collection = await getDocs(query(subjects_ref,orderBy("title"), where("uid", "==" ,item.id)));
          collection.docs.map((item) => {
            if (watch == item.data().subject) {
              if (isValidUrl(item.data().info)) {
                subject_body.innerHTML +=`
            <tr>
            <td class="title">${item.data().title}</td>
            <td class="info isurl" onclick="window.open('${item.data().info}', '_blank')">${item.data().info}</td>
            <td class="remove">
              <button
                class="remove-row-button"
                onclick="deleteItem('${item.id}')">
                Remove
              </button>
            </td>
            </tr>`
              }
              else {
                subject_body.innerHTML +=`
            <tr>
            <td class="title">${item.data().title}</td>
            <td class="info">${item.data().info}</td>
            <td class="remove">
              <button
                class="remove-row-button"
                onclick="deleteItem('${item.id}')">
                Remove
              </button>
            </td>
            </tr>`
              }
            }     
          })
        }
      });
}

export async function showStart() {
  const x = []
  var ucollection = await getDocs(UserRef);
  const user = document.getElementById("login-username").value;
  const pass = document.getElementById("login-password").value;
  ucollection.docs.map(async (item) => {
    if (item.data().username == user && item.data().password == pass) {
        const collection = await getDocs(query(subjectsDd_ref, orderBy("subject"), where("uid", "==" ,item.id)));
        collection.docs.map((item) => {
          x.push(item.data().subject)
        })
    }
  });
  document.getElementById("dropdown-subject").value = x[0];
}

async function addSubjectsInTable() {
    const user = document.getElementById("login-username").value;
    const pass = document.getElementById("login-password").value;  
    let title = document.getElementById("subject-title-input").value;
    let info = document.getElementById("subject-info-input").value;
    let subject = document.getElementById("dropdown-subject").value;
    let uid;
    var ucollection = await getDocs(UserRef)
    ucollection.docs.map((item) => {
        if (item.data().username == user && item.data().password == pass) {
            uid = item.id;
        }
    });
    if (title && info) {
      const item = await addDoc(subjects_ref, {
        title,
        info,
        subject,
        uid,
    }).then(() => {
      console.log("Adding subject");
      document.getElementById("subject-title-input").value = "";
      let info = document.getElementById("subject-info-input").value = "";
      showItemsSubject();
    });
    }
}

async function deleteItem(docId) {
  const docRef = doc(db, `Subject/${docId}`);
  await deleteDoc(docRef).then(() => {
    showItemsSubject();
    console.log('subject done');})
  
}

async function deleteItemwithoutshow(docId) {
  const docRef = doc(db, `Subject/${docId}`);
  await deleteDoc(docRef).then(() => {
    console.log('subject done');})
  
}

function subjectchange() {
  showItemsSubject();
}

function isValidUrl(_string) {
  let url_string; 
  try {
    url_string = new URL(_string);
  } catch (_) {
    return false;  
  }
  return url_string.protocol === "http:" || url_string.protocol === "https:" ;
}

// TODO Run script

document.addEventListener("DOMContentLoaded", function (event) {
    console.log("Show subjects :)");
    showItemDropdown().then(() => {
      /* const x = document.getElementById("dropdown-subject");
      document.getElementById("dropdown-subject").value = x[0].value; */
      showItemsSubject();
    });


});



window.addSubjectsInTable = addSubjectsInTable;
window.deleteItem = deleteItem;
window.subjectchange = subjectchange;
