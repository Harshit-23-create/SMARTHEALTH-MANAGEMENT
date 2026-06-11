import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "nav": {
        "dashboard": "Dashboard",
        "beds": "Beds",
        "patients": "Patients",
        "emergency": "Emergency",
        "analytics": "Analytics",
        "appointments": "Appointments",
        "bloodBank": "Blood Bank",
        "pharmacy": "Pharmacy",
        "ambulance": "Ambulance",
        "hospitalFinder": "Hospital Finder",
        "settings": "Settings",
        "collapse": "Collapse",
        "logout": "Logout"
      },
      "common": {
        "search": "Search...",
        "hospitalManagement": "Hospital Management"
      },
      "dashboard": {
        "title": "Dashboard Overview",
        "subtitle": "Real-time hospital metrics and patient statistics",
        "totalPatients": "Total Patients",
        "availableBeds": "Available Beds",
        "criticalCases": "Critical Cases",
        "activeStaff": "Active Staff",
        "recentAdmissions": "Recent Admissions",
        "viewAll": "View All",
        "patientFlow": "Patient Flow Analytics",
        "departmentOccupancy": "Department Occupancy",
        "staffOnDuty": "Staff On Duty",
        "upcomingSurgeries": "Upcoming Surgeries",
        "viewFullSchedule": "View Full Schedule"
      }
    }
  },
  hi: {
    translation: {
      "nav": {
        "dashboard": "डैशबोर्ड",
        "beds": "बिस्तर",
        "patients": "मरीज़",
        "emergency": "आपातकालीन",
        "analytics": "एनालिटिक्स",
        "appointments": "नियुक्तियाँ",
        "bloodBank": "रक्त बैंक",
        "pharmacy": "फार्मेसी",
        "ambulance": "एम्बुलेंस",
        "hospitalFinder": "अस्पताल खोजक",
        "settings": "सेटिंग्स",
        "collapse": "छोटा करें",
        "logout": "लॉग आउट"
      },
      "common": {
        "search": "खोजें...",
        "hospitalManagement": "अस्पताल प्रबंधन"
      },
      "dashboard": {
        "title": "डैशबोर्ड अवलोकन",
        "subtitle": "रीयल-टाइम अस्पताल मेट्रिक्स और रोगी आँकड़े",
        "totalPatients": "कुल मरीज़",
        "availableBeds": "उपलब्ध बिस्तर",
        "criticalCases": "गंभीर मामले",
        "activeStaff": "सक्रिय कर्मचारी",
        "recentAdmissions": "हाल ही में भर्ती",
        "viewAll": "सभी देखें",
        "patientFlow": "रोगी प्रवाह एनालिटिक्स",
        "departmentOccupancy": "विभाग अधिभोग",
        "staffOnDuty": "ड्यूटी पर कर्मचारी",
        "upcomingSurgeries": "आगामी सर्जरी",
        "viewFullSchedule": "पूरा कार्यक्रम देखें"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
