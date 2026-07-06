/* ==========================================
   Timer Engine
   العد التنازلي للجرعة القادمة
========================================== */

const Timer = {

    interval: null,

    currentDose: null,



    // تشغيل العداد
    start(schedule) {

        this.stop();

        this.update(schedule);

        this.interval = setInterval(() => {

            this.update(schedule);

        }, 1000);

    },



    // إيقاف العداد
    stop() {

        if (this.interval) {

            clearInterval(this.interval);

            this.interval = null;

        }

    },



    // تحديث العداد
    update(schedule) {

        const nextDose = Scheduler.getNextDose(schedule);

        const countdownEl = document.getElementById("countdown");
        const nextMedicineEl = document.getElementById("nextMedicine");
        const nextInstructionEl = document.getElementById("nextInstruction");
        const nextStatusEl = document.getElementById("nextDoseStatus");

        if (!nextDose) {

            countdownEl.innerText = "00:00:00";
            nextMedicineEl.innerText = "انتهى العلاج";
            nextInstructionEl.innerText = "لا توجد جرعات متبقية";
            nextStatusEl.innerText = "مكتمل";

            return;

        }

        const now = new Date();
        const doseTime = new Date(nextDose.time);

        const diff = doseTime - now;

        if (diff <= 0) {

            countdownEl.innerText = "حان الوقت!";
            nextMedicineEl.innerText = nextDose.medicine;
            nextInstructionEl.innerText = nextDose.note;
            nextStatusEl.innerText = "الآن";

            return;

        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownEl.innerText =
            String(hours).padStart(2, "0") + ":" +
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");

        nextMedicineEl.innerText = nextDose.medicine;
        nextInstructionEl.innerText = nextDose.note;
        nextStatusEl.innerText = "قادم قريباً";

    }

};