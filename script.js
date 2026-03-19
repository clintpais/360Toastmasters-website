// ===== YEAR =====
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function formatDay(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long"
  });
}


// ===== FETCH MEETINGS =====

fetch("meetings.json")
.then(res => {
  if (!res.ok) throw new Error("Failed to load meetings");
  return res.json();
})
.then(data => {

  const meetingList = document.getElementById("meetingList");
  const now = new Date();

  const upcomingMeetings = data
    .filter(meeting => {
  const meetingDate = new Date(meeting.date);
  meetingDate.setHours(23, 59, 59, 999);
  return meetingDate >= now;
})
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // ===== NEXT MEETING =====
  const next = upcomingMeetings[0];

  if (next) {
    const meetingDate = new Date(next.date);

    setText("nextMeetingNumber", next.number || "");
    setText("nextMeetingDate", formatDate(next.date));
    setText("nextMeetingDay", formatDay(next.date));
    setText("nextMeetingTime", next.time);

   const meetingStart = new Date(next.date);
if (next.time && next.time.includes("PM")) {
  meetingStart.setHours(18, 0, 0, 0); // fallback (safe for now)
}

    const meetingEnd = new Date(next.date);
    meetingEnd.setHours(20, 0, 0, 0);

    let statusText = "";

    if (now >= meetingStart && now <= meetingEnd) {
      statusText = "Happening Now";
    } else {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const diffTime = meetingDate - startOfToday;
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (daysLeft > 1) statusText = daysLeft + " days";
      else if (daysLeft === 1) statusText = "1 day";
      else if (daysLeft === 0) statusText = "Today";
    }

    setText("daysLeft", statusText);
  }

  // ===== NEXT 4 MEETINGS =====
  const nextFour = upcomingMeetings.slice(0, 4);

  if (meetingList) {
    meetingList.innerHTML = "";

    nextFour.forEach(meeting => {
      const li = document.createElement("li");

      li.innerHTML = `
        <div class="meeting-left">
          <div class="meeting-date">${formatDate(meeting.date)}</div>
          <div class="meeting-day">${formatDay(meeting.date)}</div>
        </div>
        <div class="meeting-center">
          ${meeting.time}
        </div>
        <div class="meeting-right">
          <a href="${meeting.rsvp || '#'}" class="btn btn--small">RSVP</a>
        </div>
      `;

      meetingList.appendChild(li);
    });
  }

})
.catch(() => {
  const meetingList = document.getElementById("meetingList");
  if (meetingList) {
    meetingList.innerHTML = "Unable to load meetings.";
  }
});


// ===== FADE IN =====
if ("IntersectionObserver" in window) {

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  });

  document.querySelectorAll(".fade-in").forEach(el => {
    observer.observe(el);
  });

} else {
  // Fallback for older browsers
  document.querySelectorAll(".fade-in").forEach(el => {
    el.classList.add("visible");
  });
}


// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href").replace("#","") === current) {
      link.classList.add("active");
    }
  });
});


// ===== MOBILE MENU =====
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const overlay = document.getElementById("overlay");

function openMenu() {
  navMenu.classList.add("active");
  overlay.classList.add("active");
  document.body.classList.add("menu-open");
}

function closeMenu() {
  navMenu.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("menu-open");
}

if (menuToggle && navMenu && overlay) {

  menuToggle.addEventListener("click", () => {
    if (navMenu.classList.contains("active")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener("click", closeMenu);

  document.querySelectorAll("#navMenu a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });
}




