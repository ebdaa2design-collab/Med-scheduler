/* ==========================================
   Storage Manager
   حفظ واسترجاع البيانات (LocalStorage)
========================================== */

const Storage = {

    keys: {
        patient: "med_patient",
        medicines: "med_medicines",
        schedule: "med_schedule",
        settings: "med_settings",
        progress: "med_progress"
    },



    // حفظ بيانات عامة
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },



    // قراءة بيانات
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },



    // حذف بيانات
    remove(key) {
        localStorage.removeItem(key);
    },



    // مسح كل بيانات التطبيق
    clearAll() {
        Object.values(this.keys).forEach(k => {
            localStorage.removeItem(k);
        });
    },



    // حفظ بيانات المريض
    savePatient(patient) {
        this.save(this.keys.patient, patient);
    },



    getPatient() {
        return this.get(this.keys.patient);
    },



    // حفظ الأدوية
    saveMedicines(medicines) {
        this.save(this.keys.medicines, medicines);
    },



    getMedicines() {
        return this.get(this.keys.medicines) || [];
    },



    // حفظ الجدول
    saveSchedule(schedule) {
        this.save(this.keys.schedule, schedule);
    },



    getSchedule() {
        return this.get(this.keys.schedule) || [];
    },



    // حفظ التقدم
    saveProgress(progress) {
        this.save(this.keys.progress, progress);
    },



    getProgress() {
        return this.get(this.keys.progress) || {
            completed: 0,
            total: 0
        };
    },



    // حفظ الإعدادات
    saveSettings(settings) {
        this.save(this.keys.settings, settings);
    },



    getSettings() {
        return this.get(this.keys.settings) || {
            darkMode: false,
            sound: true,
            notification: true,
            vibration: true
        };
    }

};