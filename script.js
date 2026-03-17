document.getElementById("year").textContent = new Date().getFullYear();

const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTh1PHKAJYc1goIkh0R3-xBMW7dWUFKcGzRdhcfGsnWs8k51s7GOGLmb4qQUNZdJHHsVR1ay7T5sk9-/pub?gid=0&single=true&output=csv";

fetch(sheetURL)
.then(res => res.text())
.then(data => {

  const rows = data.split("\n").slice(1);
  const meetingList = document.getElementById("meetingList");

  meetingList.innerHTML = "";

  rows.forEach((row, index) => {

    const cols = row.split(",");
    if(cols.length < 4) return;

    const meeting = cols[0].trim();
    const date = cols[1].trim();
    const day = cols[2].trim();
    const time = cols[3].trim();

    // Update next meeting card
    if(index === 0){

      document.getElementById("nextMeetingNumber").textContent = "Meeting #" + meeting;
      document.getElementById("nextMeetingDate").textContent = date;
      document.getElementById("nextMeetingDay").textContent = day;
      document.getElementById("nextMeetingTime").textContent = time;

      // Accurate Days Left calculation
      const meetingDate = new Date(date);
      const today = new Date();

      meetingDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);

      const diffTime = meetingDate - today;
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let daysText = "";

      if(daysLeft > 1){
        daysText = daysLeft + " days";
      }
      else if(daysLeft === 1){
        daysText = "1 day";
      }
      else if(daysLeft === 0){
        daysText = "Today";
      }
      else{
        daysText = "Completed";
      }

      document.getElementById("daysLeft").textContent = daysText;

    }

    const li = document.createElement("li");

    li.innerHTML = `
  <div class="meeting-left">
    <div class="meeting-date">${date}</div>
    <div class="meeting-day">${day}</div>
  </div>

  <div class="meeting-center">
    ${time}
  </div>

  <div class="meeting-right">
    <a class="btn btn--small" target="_blank"
    href="https://wa.me/919538710383?text=Hello! I would like to attend the ${date} meeting of 360° Toastmasters Club Bengaluru.">
    RSVP
    </a>
  </div>
`;

    meetingList.appendChild(li);

  });

});
