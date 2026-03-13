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
    if(cols.length < 3) return;

    const date = cols[0].trim();
    const day = cols[1].trim();
    const time = cols[2].trim();

    // Update next meeting card
    if(index === 0){
      document.getElementById("nextMeetingDate").textContent = date;
      document.getElementById("nextMeetingTime").textContent = time;
    }

    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${date} (${day})</strong> – ${time}
      <a class="btn btn--small" target="_blank"
      href="https://wa.me/919538710383?text=Hello! I would like to attend the ${date} meeting of 360° Toastmasters Club Bengaluru.">
      RSVP
      </a>
    `;

    meetingList.appendChild(li);

  });

});
