/* ==========================================
   Main App Controller
   تشغيل التطبيق وربط كل الأجزاء
========================================== */

let scheduleData = [];

let startTimes = {};



/* ==========================================
   تحميل البيانات عند فتح الصفحة
========================================== */

window.addEventListener("load", () => {

    loadSavedData();

    updateClock();

    setInterval(updateClock, 1000);

});



/* ==========================================
   زر بدء العلاج
========================================== */

document.getElementById("startTreatment").addEventListener("click", () => {

    startTreatment();

});



/* ==========================================
   زر إعادة ضبط
========================================== */

document.getElementById("resetData").addEventListener("click", () => {

    if (confirm("هل تريد حذف كل البيانات؟")) {

        Storage.clearAll();

        location.reload();

    }

});



/* ==========================================
   بدء العلاج
========================================== */

function startTreatment() {

    const patient = {

        name: document.getElementById("patientName").value,

        age: document.getElementById("patientAge").value,

        notes: document.getElementById("patientNotes").value

    };



    startTimes = {

        "Tavanic 500 mg": document.getElementById("tavanicStart").value,

        "Flomax 0.4 mg": document.getElementById("flomaxStart").value,

        "Divido 75 mg": document.getElementById("dividoStart").value

    };



    if (!startTimes["Tavanic 500 mg"] ||
        !startTimes["Flomax 0.4 mg"] ||
        !startTimes["Divido 75 mg"]) {

        alert("من فضلك أدخل جميع مواعيد الجرعات");

        return;

    }



    Storage.savePatient(patient);



    scheduleData = Scheduler.generateSchedule(startTimes);



    Storage.saveSchedule(scheduleData);



    Storage.saveProgress(Scheduler.calculateProgress(scheduleData));



    renderSchedule();

    startSystem();

}



/* ==========================================
   تشغيل النظام
========================================== */

function startSystem() {

    Timer.start(scheduleData);

    Notifications.init();

    setInterval(() => {

        Notifications.check(scheduleData);

        updateProgress();

    }, 10000);

}



/* ==========================================
   عرض الجدول
========================================== */

function renderSchedule() {

    const container = document.getElementById("scheduleContainer");

    container.innerHTML = "";



    const grouped = groupByDay(scheduleData);



    Object.keys(grouped).forEach(day => {

        const dayCard = document.createElement("div");

        dayCard.className = "dayCard";



        let html = `<div class="dayTitle">${day}</div>`;



        grouped[day].forEach(item => {

            html += `

            <div class="doseItem ${item.taken ? "done" : ""}">

                <div class="doseLeft">

                    <i class="fa-solid fa-pills"></i>

                    <div>

                        <div class="doseTime">

                            ${formatTime(item.time)}

                        </div>

                        <div class="doseMedicine">

                            ${item.medicine}

                        </div>

                    </div>

                </div>

                <div>

                    <button class="completeDose" onclick="markTaken('${item.time}')">

                        ${item.taken ? "✔ تم" : "تم التناول"}

                    </button>

                </div>

            </div>

            `;

        });



        dayCard.innerHTML = html;

        container.appendChild(dayCard);

    });

}



/* ==========================================
   تحديد الجرعة كمأخوذة
========================================== */

function markTaken(time) {

    scheduleData = scheduleData.map(item => {

        if (item.time === time) {

            item.taken = true;

        }

        return item;

    });



    Storage.saveSchedule(scheduleData);

    updateProgress();

    renderSchedule();

}



/* ==========================================
   تحديث التقدم
========================================== */

function updateProgress() {

    const progress = Scheduler.calculateProgress(scheduleData);



    document.getElementById("progressPercent").innerText = progress.percent + "%";

    document.getElementById("progressFill").style.width = progress.percent + "%";

    document.getElementById("completedDoses").innerText = progress.done + " جرعة";

    document.getElementById("remainingDoses").innerText = (progress.total - progress.done) + " متبقية";



    document.getElementById("doneCounter").innerText = progress.done;

    document.getElementById("waitingCounter").innerText = progress.total - progress.done;

}



/* ==========================================
   تحميل البيانات المحفوظة
========================================== */

function loadSavedData() {

const savedSchedule = Storage.getSchedule();

if (savedSchedule && savedSchedule.length > 0) {

scheduleData = savedSchedule;

renderSchedule();

startSystem();

} else {

showEmptyState();

}


    const patient = Storage.getPatient();

    if (patient) {

        document.getElementById("patientName").value = patient.name || "";

        document.getElementById("patientAge").value = patient.age || "";

        document.getElementById("patientNotes").value = patient.notes || "";

    }

}



/* ==========================================
   الساعة
========================================== */

function updateClock() {

    const now = new Date();

    document.getElementById("liveClock").innerText =
        now.toLocaleTimeString();

    document.getElementById("todayDate").innerText =
        now.toLocaleDateString("ar");

}



/* ==========================================
   تجميع حسب اليوم
========================================== */

function groupByDay(schedule) {

    const groups = {};

    schedule.forEach(item => {

        const day = new Date(item.time).toDateString();

        if (!groups[day]) groups[day] = [];

        groups[day].push(item);

    });

    return groups;

}



/* ==========================================
   تنسيق الوقت
========================================== */

function formatTime(date) {

    return new Date(date).toLocaleTimeString([], {

        hour: '2-digit',

        minute: '2-digit'

    });

}
if ("serviceWorker" in navigator) {

  navigator.serviceWorker.register("/service-worker.js");

}
