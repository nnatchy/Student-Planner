function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    if (h < 10){
      document.getElementById('time').innerHTML ="0" + h + ":" + m + ":" + s;
    }
    else {
      document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
    }
    setTimeout(startTime, 1000);
  }
  
  function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
  }

function startDate(){
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    document.getElementById("date").innerHTML = month + "/" + day + "/" + year;
}