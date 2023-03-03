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
const ExamRef = collection(db, 'Exam');
const UserRef = collection(db, 'User');
const examForm = document.querySelector('#exam-form');

export async function showItemsExam() {
    const exam_body = document.getElementById('exam-body');
    exam_body.innerHTML = "";
    var dateToday = new Date();   
    var ucollection = await getDocs(UserRef);
    const user = document.getElementById("login-username").value;
    const pass = document.getElementById("login-password").value;
    ucollection.docs.map(async (item) => {
        if (item.data().username == user && item.data().password == pass) {
            const collection = await getDocs(query(ExamRef, orderBy("DateTime"), where("uid", "==" ,item.id)));
            collection.docs.map((item) => {
                var date1 = new Date(item.data().DateTime);
                var diffday = parseInt((date1 - dateToday) / (1000 * 60 * 60 * 24), 10); 
                if (document.getElementById('exam-range').value == "today" && diffday == 0) {
                    var canshow = true;
                } else if (document.getElementById('exam-range').value == "7days" && 0 <= diffday && diffday <= 7) {
                    var canshow = true;
                } else if (document.getElementById('exam-range').value == "all"){
                    var canshow = true
                }
                var daytime = item.data().DateTime
                if (canshow) {
                    exam_body.innerHTML += `
                <div class="content-item" id = "${item.id}" onclick = ExamEditpopup("${item.id}")>
                    <h6>${item.data().Subject}</h6>
                    <h3>${item.data().Title}</h3>
                    <h5>${daytime.slice(0,10) + " " + daytime.slice(11)}</h5>
                </div>`
                }
            })         
        }
        
    });
}

document.addEventListener("DOMContentLoaded", function(event) {
    //event.preventDefault();
    console.log('showing exam items from database')
    showItemsExam();
});

async function addExam() {
    console.log('addExam');
    const user = document.getElementById("login-username").value;
    const pass = document.getElementById("login-password").value;  
    const Subject = examForm['subject-to-add'].value;
    const Title =  examForm['title-to-add'].value;
    const DateTime = examForm['datetime-to-add'].value;
    let uid;
    var ucollection = await getDocs(UserRef)
    ucollection.docs.map((item) => {
        if (item.data().username == user && item.data().password == pass) {
            uid = item.id;
        }
    });  
    if (Subject && Title && DateTime && uid) {
        addDoc(ExamRef, {
            Subject,
            Title,
            DateTime,
            uid
        });
    }
}

var closebutton = document.querySelector("#close-exam");
closebutton.onclick = (e) => {
    e.preventDefault();
    close(document.getElementById('modal-exam'));
    // reset form to initial state
    examForm.reset();
}

var openbutton = document.querySelector("#open-exam");
openbutton.onclick = (e) => {
    e.preventDefault();
    // show only save and close button
    document.querySelector("#save-exam").style.display = "block";
    document.querySelector("#editsave-exam").style.display = "none";
    document.querySelector("#delete-exam").style.display = "none";
    open(document.getElementById('modal-exam'));
}


var savebutton = document.querySelector("#save-exam");
savebutton.onclick = async (e) => {
    e.preventDefault();
    addExam().then(() => {
        console.log("Yeah");
        close(document.getElementById('modal-exam'));
        examForm.reset();
        showItemsExam();
    })
}

async function ExamEditpopup(docId) {
    //e.preventDefault();
    const examRef = await doc(db, `Exam/${docId}`);
    let examInstance = await getDoc(examRef);
    examInstance = examInstance.data();
    
    var editsavebutton = document.querySelector("#editsave-exam");
    var deletebutton = document.querySelector("#delete-exam");
    //vanish the save button and show only editsave(same like savebutton but it is another button), closebutton and deletebutton
    editsavebutton.style.display = "block";
    deletebutton.style.display = "block";
    document.querySelector("#save-exam").style.display = "none";
    
    // set this form to show the old value first
    examForm['subject-to-add'].value = examInstance.Subject;
    examForm['title-to-add'].value = examInstance.Title;
    examForm['datetime-to-add'].value = examInstance.DateTime;
    open(document.getElementById('modal-exam'));
    
    editsavebutton.onclick = (e) => {
        e.preventDefault();
        update(examRef,examInstance)
    }
    deletebutton.onclick = (e) => {
        e.preventDefault();
        deleteItem(docId)
        examForm.reset();
        close(document.getElementById('modal-exam'));
        showItemsExam();
    }

}

function update(examRef,examInstance) {
    const Subject = examForm['subject-to-add'].value;
    const Title =  examForm['title-to-add'].value;
    const DateTime = examForm['datetime-to-add'].value;

    const examData = {
        Subject: Subject ? Subject : examInstance.Subject,
        Title: Title ? Title : examInstance.Title,
        DateTime: DateTime ? DateTime : examInstance.DateTime,
    };

    updateDoc(examRef, examData)
        .then(function () {
            console.log('success');
            close(document.getElementById('modal-exam'));
            examForm.reset();
            close(document.getElementById('modal-exam'));
            showItemsExam();
        })
        .catch(function (error) {
            console.log('failed', error);
        });
    
}

function examchange() {
    showItemsExam();
}

async function deleteItem(docId) {
    const docRef = doc(db, `Exam/${docId}`);
    await deleteDoc(docRef);
    console.log('exam done');
}

// close open function
function close(container) {
    container.classList.remove('show');
}

function open(container) {
    container.classList.add('show');
}
////////


window.ExamEditpopup = ExamEditpopup;
window.examchange = examchange;