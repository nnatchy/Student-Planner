  // Import the functions you need from the SDKs you need
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

const db = getFirestore();
const HomeworkRef = collection(db, 'Homework');
const UserRef = collection(db, 'User');
const homeworkForm = document.querySelector('#homework-form');

export async function showItemsHomework() {
    const homework_body = document.getElementById('homework-body');
    homework_body.innerHTML = "";
    var dateToday = new Date();
    var ucollection = await getDocs(UserRef);
    const user = document.getElementById("login-username").value;
    const pass = document.getElementById("login-password").value;
    
    ucollection.docs.map(async (item) => {
        if (item.data().username == user && item.data().password == pass) {
            const collection = await getDocs(query(HomeworkRef, orderBy("DateTime"), where("uid", "==" ,item.id)));
            collection.docs.map((item) => {
                var date1 = new Date(item.data().DateTime);
                var diffday = parseInt((date1 - dateToday) / (1000 * 60 * 60 * 24), 10); 
                if (document.getElementById('homework-status').value == "all") {
                    var equalStatus = true;
                } else {
                    var equalStatus = item.data().Status == document.getElementById('homework-status').value;
                }
                if (document.getElementById('homework-range').value == "today" && diffday == 0) {
                    var canshow = true;
                } else if (document.getElementById('homework-range').value == "7days" && 0 <= diffday && diffday <= 7) {
                    var canshow = true;
                } else if (document.getElementById('homework-range').value == "all"){
                    var canshow = true
                }
                var daytime = item.data().DateTime
                if (item.data().Status == "Done" && canshow && equalStatus) {
                    homework_body.innerHTML += `
                <div class="content-item" id = "${item.id}" onclick = HomeworkEditpopup("${item.id}")>
                    <h6>${item.data().Subject}</h6>
                    <h3>${item.data().Title}</h3>
                    <h5>${daytime.slice(0,10) + " " + daytime.slice(11)}</h5>
                    <p class="status done">${item.data().Status}</p>
                </div>`
                } else if (item.data().Status == "In progress" && canshow && equalStatus) {
                    homework_body.innerHTML += `
                <div class="content-item" id = "${item.id}" onclick = HomeworkEditpopup("${item.id}")>
                    <h6>${item.data().Subject}</h6>
                    <h3>${item.data().Title}</h3>
                    <h5>${daytime.slice(0,10) + " " + daytime.slice(11)}</h5>
                    <p class="status inprogress">${item.data().Status}</p>
                </div>`
                } else if (item.data().Status == "Not Started" && canshow && equalStatus) {
                    homework_body.innerHTML += `
                <div class="content-item" id = "${item.id}" onclick = HomeworkEditpopup("${item.id}")>
                    <h6>${item.data().Subject}</h6>
                    <h3>${item.data().Title}</h3>
                    <h5>${daytime.slice(0,10) + " " + daytime.slice(11)}</h5>
                    <p class="status notstarted">${item.data().Status}</p>
                </div>`
                }
            })
        }
    });
}

async function addHomework() {
    console.log('addHomework'); 
    const user = document.getElementById("login-username").value;
    const pass = document.getElementById("login-password").value;  
    const Subject = homeworkForm['subject-to-add'].value;
    const Title =  homeworkForm['title-to-add'].value;
    const DateTime = homeworkForm['datetime-to-add'].value;
    const Status =  homeworkForm['status-to-add'].value;
    let uid;
    var ucollection = await getDocs(UserRef)
    ucollection.docs.map((item) => {
        if (item.data().username == user && item.data().password == pass) {
            uid = item.id;
        }
    });
    
    if (Subject && Title && DateTime && uid) {
        addDoc(HomeworkRef, {
            Subject,
            Title,
            DateTime,   
            Status,
            uid,
        });
    }
}

//edit popup button จะใส่อยู่ในonclick htmlเลย

async function HomeworkEditpopup(docId) {
    //e.preventDefault();
    const homeworkRef = await doc(db, `Homework/${docId}`);
    let homeworkInstance = await getDoc(homeworkRef);
    homeworkInstance = homeworkInstance.data();
    
    var editsavebutton = document.querySelector("#editsave-homework");
    var deletebutton = document.querySelector("#delete-homework");
    //vanish the save button and show only editsave(same like savebutton but it is another button), closebutton and deletebutton
    editsavebutton.style.display = "block";
    deletebutton.style.display = "block";
    document.querySelector("#save-homework").style.display = "none";
    
    // set this form to show the old value first
    homeworkForm['subject-to-add'].value = homeworkInstance.Subject;
    homeworkForm['title-to-add'].value = homeworkInstance.Title;
    homeworkForm['datetime-to-add'].value = homeworkInstance.DateTime;
    homeworkForm['status-to-add'].value = homeworkInstance.Status;
    open(document.getElementById('modal-homework'));
    
    editsavebutton.onclick = (e) => {
        e.preventDefault();
        update(homeworkRef,homeworkInstance); 
    }
    deletebutton.onclick = (e) => {
        e.preventDefault();
        deleteItem(docId)
        homeworkForm.reset();
        close(document.getElementById('modal-homework'));
        showItemsHomework();
    }

}

function update(homeworkRef,homeworkInstance) {
    const Subject = homeworkForm['subject-to-add'].value;
    const Title =  homeworkForm['title-to-add'].value;
    const DateTime = homeworkForm['datetime-to-add'].value;
    const Status =  homeworkForm['status-to-add'].value;

    const homeworkData = {
        Subject: Subject ? Subject : homeworkInstance.Subject,
        Title: Title ? Title : homeworkInstance.Title,
        DateTime: DateTime ? DateTime : homeworkInstance.DateTime,
        Status: Status ? Status : homeworkInstance.Status,
    };

    updateDoc(homeworkRef, homeworkData)
        .then(function () {
            console.log('success');
            close(document.getElementById('modal-homework'));
            homeworkForm.reset();
            close(document.getElementById('modal-homework'));
            showItemsHomework();
        })
        .catch(function (error) {
            console.log('failed', error);
        });
    
}

document.addEventListener("DOMContentLoaded", function(event) {
    //event.preventDefault();
    console.log('showing homework items from database')
    showItemsHomework();
});

// add close open button popup

var closebutton = document.querySelector("#close-homework");
closebutton.onclick = (e) => {
    e.preventDefault();
    close(document.getElementById('modal-homework'));
    // reset form to initial state
    homeworkForm.reset();
}

//aka add item button


var openbutton = document.querySelector("#open-homework");
openbutton.onclick = (e) => {
    e.preventDefault();
    // show only save and close button
    document.querySelector("#save-homework").style.display = "block";
    document.querySelector("#editsave-homework").style.display = "none";
    document.querySelector("#delete-homework").style.display = "none";
    open(document.getElementById('modal-homework'));
}


var savebutton = document.querySelector("#save-homework");
savebutton.onclick = async (e) => {
    e.preventDefault();
    addHomework().then(() => {
        console.log("Yeah");
        close(document.getElementById('modal-homework'));
        homeworkForm.reset();
        showItemsHomework();
    })
}

function homeworkchange() {
    showItemsHomework();
}

async function deleteItem(docId) {
    const docRef = doc(db, `Homework/${docId}`);
    await deleteDoc(docRef);
    console.log('homework done');
}

// close open function
function close(container) {
    container.classList.remove('show');
}

function open(container) {
    container.classList.add('show');
}
////////


window.HomeworkEditpopup = HomeworkEditpopup;
window.homeworkchange = homeworkchange;