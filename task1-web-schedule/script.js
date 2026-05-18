const appointments = [
  {
    appointmentId: "A001",
    doctorName: "Иванов И.И.",
    specialty: "Терапевт",
    date: "2026-05-18",
    startTime: "09:00",
    endTime: "09:20",
    room: "101",
    patientType: "Первичный",
    status: "Записан"
  },
  {
    appointmentId: "A002",
    doctorName: "Иванов И.И.",
    specialty: "Терапевт",
    date: "2026-05-18",
    startTime: "09:20",
    endTime: "09:40",
    room: "101",
    patientType: "Повторный",
    status: "Завершён"
  }
  {
    appointmentId: "A003",
    doctorName: "Петров О.В.",
    specialty: "нарколог",
    date: "2026-05-18",
    startTime: "10:20",
    endTime: "10:40",
    room: "102",
    patientType: "Первичный",
    status: "Отменен"
  }
  {
    appointmentId: "A004",
    doctorName: "Иванов И.И.",
    specialty: "Терапевт",
    date: "2026-05-18",
    startTime: "11:20",
    endTime: "11:40",
    room: "102",
    patientType: "Повторный",
    status: "Записан"
  }

];

const doctorFilter = document.getElementById("doctorFilter");
const dateFilter = document.getElementById("dateFilter");
const statusFilter = document.getElementById("statusFilter");
const resetFiltersButton = document.getElementById("resetFilters");
const tableBody = document.getElementById("appointmentsTableBody");

const totalCountSpan = document.getElementById("totalCount");
const completedCountSpan = document.getElementById("completedCount");
const cancelledCountSpan = document.getElementById("cancelledCount");
const noShowCountSpan = document.getElementById("noShowCount");

initFilters();
renderTable(appointments);
updateSummary(appointments);

function initFilters() {
  const doctors = [...new Set(appointments.map(a => a.doctorName))];
  doctors.forEach(doctor => {
    const option = document.createElement("option");
    option.value = doctor;
    option.textContent = doctor;
    doctorFilter.appendChild(option);
  });

  const firstDate = appointments[0]?.date;
  if (firstDate) {
    dateFilter.value = firstDate;
  }

  doctorFilter.addEventListener("change", applyFilters);
  dateFilter.addEventListener("change", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  resetFiltersButton.addEventListener("click", resetFilters);
}

function applyFilters() {
  const doctor = doctorFilter.value;
  const date = dateFilter.value;
  const status = statusFilter.value;

  let filtered = appointments;

  if (doctor) {
    filtered = filtered.filter(a => a.doctorName === doctor);
  }

  if (date) {
    filtered = filtered.filter(a => a.date === date);
  }

  if (status) {
    filtered = filtered.filter(a => a.status === status);
  }

  renderTable(filtered);
  updateSummary(filtered);
}

function resetFilters() {
  doctorFilter.value = "";
  dateFilter.value = "";
  statusFilter.value = "";
  renderTable(appointments);
  updateSummary(appointments);
}

function renderTable(data) {
  tableBody.innerHTML = "";

  data.forEach(a => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${a.date}</td>
      <td>${a.startTime}–${a.endTime}</td>
      <td>${a.doctorName}</td>
      <td>${a.specialty}</td>
      <td>${a.room}</td>
      <td>${a.patientType}</td>
      <td>${a.status}</td>
    `;

    tableBody.appendChild(tr);
  });
}

function updateSummary(data) {
  const total = data.length;
  const completed = data.filter(a => a.status === "Завершён").length;
  const cancelled = data.filter(a => a.status === "Отменён").length;
  const noShow = data.filter(a => a.status === "Неявка").length;

  totalCountSpan.textContent = total;
  completedCountSpan.textContent = completed;
  cancelledCountSpan.textContent = cancelled;
  noShowCountSpan.textContent = noShow;
}