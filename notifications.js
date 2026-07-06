/* ==========================================
   Notifications System
   التنبيهات + الصوت + الاهتزاز
========================================== */

const Notifications = {

    settings: null,



    // تهيئة الإشعارات
    init() {

        this.settings = Storage.getSettings();

        this.requestPermission();

    },



    // طلب إذن الإشعارات
    requestPermission() {

        if ("Notification" in window) {

            if (Notification.permission === "default") {

                Notification.requestPermission();

            }

        }

    },



    // إرسال إشعار
    send(title, body) {

        if (this.settings && !this.settings.notification) return;

        if ("Notification" in window && Notification.permission === "granted") {

            new Notification(title, {

                body: body,

                icon: "assets/icons/icon.png"

            });

        }

        this.playSound();

        this.vibrate();

    },



    // صوت التنبيه
    playSound() {

        if (this.settings && !this.settings.sound) return;

        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

        audio.play();

    },



    // اهتزاز الهاتف
    vibrate() {

        if (this.settings && !this.settings.vibration) return;

        if (navigator.vibrate) {

            navigator.vibrate([300, 200, 300]);

        }

    },



    // فحص الجرعات وإطلاق التنبيه
    check(schedule) {

        const now = new Date();

        schedule.forEach(item => {

            if (item.taken) return;

            const doseTime = new Date(item.time);

            const diff = doseTime - now;

            // إذا دخل وقت الجرعة (خلال دقيقة)
            if (diff > 0 && diff < 60000) {

                this.send(
                    "💊 موعد الجرعة",
                    `حان وقت تناول ${item.medicine}`
                );

            }

        });

    }

};