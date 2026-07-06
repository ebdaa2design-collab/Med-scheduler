/* ==========================================
   Scheduler Engine
   حساب مواعيد الجرعات تلقائيًا
========================================== */

const Scheduler = {

    medicines: [
        {
            name: "Tavanic 500 mg",
            intervalHours: 24,
            durationDays: 10,
            afterMeal: true,
            timesPerDay: 1
        },

        {
            name: "Flomax 0.4 mg",
            intervalHours: 24,
            durationDays: 10,
            beforeSleep: true,
            timesPerDay: 1
        },

        {
            name: "Divido 75 mg",
            intervalHours: 8,
            durationDays: 7,
            afterMeal: true,
            timesPerDay: 3
        }
    ],



    // توليد جدول الجرعات الكامل
    generateSchedule(startTimes) {

        let schedule = [];

        this.medicines.forEach(med => {

            const startTime = new Date(startTimes[med.name]);

            const totalDoses = (med.durationDays * 24) / med.intervalHours;

            for (let i = 0; i < totalDoses; i++) {

                const doseTime = new Date(startTime.getTime() + (i * med.intervalHours * 60 * 60 * 1000));

                schedule.push({

                    medicine: med.name,

                    time: doseTime,

                    taken: false,

                    note: this.getNote(med)

                });

            }

        });

        // ترتيب حسب الوقت
        schedule.sort((a, b) => new Date(a.time) - new Date(b.time));

        return schedule;
    },



    // ملاحظات الدواء
    getNote(med) {

        if (med.name.includes("Tavanic")) {
            return "بعد الأكل";
        }

        if (med.name.includes("Flomax")) {
            return "قبل النوم";
        }

        if (med.name.includes("Divido")) {
            return "بعد الوجبات";
        }

        return "";
    },



    // حساب الجرعة القادمة
    getNextDose(schedule) {

        const now = new Date();

        return schedule.find(item =>
            !item.taken && new Date(item.time) > now
        );

    },



    // حساب نسبة الإنجاز
    calculateProgress(schedule) {

        const total = schedule.length;

        const done = schedule.filter(s => s.taken).length;

        return {
            total,
            done,
            percent: total === 0 ? 0 : Math.round((done / total) * 100)
        };

    }

};