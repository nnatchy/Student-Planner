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
const ScheduleRef = collection(db, 'Schedule');
const UserRef = collection(db, 'User');
const scheduleForm = document.querySelector('#schedule-form');


export async function showItemsSchedule() {
    const schedule_body = document.getElementById('schedule-body');
    schedule_body.innerHTML = "";
    var dateToday = new Date();
    var ucollection = await getDocs(UserRef);
    const user = document.getElementById("login-username").value;
    const pass = document.getElementById("login-password").value;
    ucollection.docs.map(async (item) => {
        if (item.data().username == user && item.data().password == pass) {
            const collection = await getDocs(query(ScheduleRef, orderBy("DateTime"), where("uid", "==" ,item.id)));
            collection.docs.map( (item) => {
                var date1 = new Date(item.data().DateTime);
                var diffday = parseInt((date1 - dateToday) / (1000 * 60 * 60 * 24), 10); 
                if (document.getElementById('schedule-status').value == "all") {
                    var equalStatus = true;
                } else {
                    var equalStatus = item.data().Status == document.getElementById('schedule-status').value;
                }
                if (document.getElementById('schedule-range').value == "today" && diffday == 0) {
                    var canshow = true;
                } else if (document.getElementById('schedule-range').value == "7days" && 0 <= diffday && diffday <= 7) {
                    var canshow = true;
                } else if (document.getElementById('schedule-range').value == "all"){
                    var canshow = true
                }
                var daytime = item.data().DateTime
                if (item.data().Status == "Done" && canshow && equalStatus) {
                    schedule_body.innerHTML += `
                <div class="content-item" id = "${item.id}" onclick = ScheduleEditpopup("${item.id}")>
                    <h6>${item.data().Subject}</h6>
                    <h3>${item.data().Title}</h3>
                    <h5>${daytime.slice(0,10) + " " + daytime.slice(11)}</h5>
                    <p class="status done" >${item.data().Status}</p>
                </div>`
                } else if (item.data().Status == "In progress" && canshow && equalStatus) {
                    schedule_body.innerHTML += `
                <div class="content-item" id = "${item.id}" onclick = ScheduleEditpopup("${item.id}")>
                    <h6>${item.data().Subject}</h6>
                    <h3>${item.data().Title}</h3>
                    <h5>${daytime.slice(0,10) + " " + daytime.slice(11)}</h5>
                    <p class="status inprogress" >${item.data().Status}</p>
                </div>`
                } else if (item.data().Status == "Not Started" && canshow && equalStatus) {
                    schedule_body.innerHTML += `
                <div class="content-item" id = "${item.id}" onclick = ScheduleEditpopup("${item.id}")>
                    <h6>${item.data().Subject}</h6>
                    <h3>${item.data().Title}</h3>
                    <h5>${daytime.slice(0,10) + " " + daytime.slice(11)}</h5>
                    <p class="status notstarted" >${item.data().Status}</p>
                </div>`
                }
            })
            
        }
        })
    
}

document.addEventListener("DOMContentLoaded", function(event) {
    //event.preventDefault();
    console.log('showing schedule items from database')
    showItemsSchedule();
});

async function addSchedule() {
    console.log('addSchedule'); 
    const user = document.getElementById("login-username").value;
    const pass = document.getElementById("login-password").value;  
    const Subject = scheduleForm['subject-to-add'].value;
    const Title =  scheduleForm['title-to-add'].value;
    const DateTime = scheduleForm['datetime-to-add'].value;
    const Status =  scheduleForm['status-to-add'].value;
    let uid;
    var ucollection = await getDocs(UserRef)
    ucollection.docs.map((item) => {
        if (item.data().username == user && item.data().password == pass) {
            uid = item.id;
        }
    });
    if (Subject && Title && DateTime && uid) {
        addDoc(ScheduleRef, {
            Subject,
            Title,
            DateTime,   
            Status,
            uid,
        });
    }
}

// add close open button popup

var closebutton = document.querySelector("#close-schedule");
closebutton.onclick = (e) => {
    e.preventDefault();
    close(document.getElementById('modal-schedule'));
    // reset form to initial state
    scheduleForm.reset();
}

//aka add item button

var openbutton = document.querySelector("#open-schedule");
openbutton.onclick = (e) => {
    e.preventDefault();
    // show only save and close button
    document.querySelector("#save-schedule").style.display = "block";
    document.querySelector("#editsave-schedule").style.display = "none";
    document.querySelector("#delete-schedule").style.display = "none";
    open(document.getElementById('modal-schedule'));
}


var savebutton = document.querySelector("#save-schedule");
savebutton.onclick = async (e) => {
    e.preventDefault();
    addSchedule().then(() => {
        console.log("Yeah");
        close(document.getElementById('modal-schedule'));
        scheduleForm.reset();
        showItemsSchedule();
    })
}

//edit popup button จะใส่อยู่ในonclick htmlเลย

async function ScheduleEditpopup(docId) {
    //e.preventDefault();
    const scheduleRef = await doc(db, `Schedule/${docId}`);
    let scheduleInstance = await getDoc(scheduleRef);
    scheduleInstance = scheduleInstance.data();
    
    var editsavebutton = document.querySelector("#editsave-schedule");
    var deletebutton = document.querySelector("#delete-schedule");
    //vanish the save button and show only editsave(same like savebutton but it is another button), closebutton and deletebutton
    editsavebutton.style.display = "block";
    deletebutton.style.display = "block";
    document.querySelector("#save-schedule").style.display = "none";
    
    // set this form to show the old value first
    scheduleForm['subject-to-add'].value = scheduleInstance.Subject;
    scheduleForm['title-to-add'].value = scheduleInstance.Title;
    scheduleForm['datetime-to-add'].value = scheduleInstance.DateTime;
    scheduleForm['status-to-add'].value = scheduleInstance.Status;
    open(document.getElementById('modal-schedule'));
    
    editsavebutton.onclick = (e) => {
        e.preventDefault();
        update(scheduleRef,scheduleInstance)
    }
    deletebutton.onclick = (e) => {
        e.preventDefault();
        deleteItem(docId)
        scheduleForm.reset();
        close(document.getElementById('modal-schedule'));
        showItemsSchedule();
    }

}

function update(scheduleRef,scheduleInstance) {
    const Subject = scheduleForm['subject-to-add'].value;
    const Title =  scheduleForm['title-to-add'].value;
    const DateTime = scheduleForm['datetime-to-add'].value;
    const Status =  scheduleForm['status-to-add'].value;

    const scheduleData = {
        Subject: Subject ? Subject : scheduleInstance.Subject,
        Title: Title ? Title : scheduleInstance.Title,
        DateTime: DateTime ? DateTime : scheduleInstance.DateTime,
        Status: Status ? Status : scheduleInstance.Status,
    };

    updateDoc(scheduleRef, scheduleData)
        .then(function () {
            console.log('success');
            close(document.getElementById('modal-schedule'));
            scheduleForm.reset();
            close(document.getElementById('modal-schedule'));
            showItemsSchedule();
        })
        .catch(function (error) {
            console.log('failed', error);
        });
    
}

function schedulechange() {
    showItemsSchedule();
}

async function deleteItem(docId) {
    const docRef = doc(db, `Schedule/${docId}`);
    await deleteDoc(docRef);
    console.log('schedule done');
}

// close open function
function close(container) {
    container.classList.remove('show');
}

function open(container) {
    container.classList.add('show');
}
////////


window.ScheduleEditpopup = ScheduleEditpopup;
window.schedulechange = schedulechange;