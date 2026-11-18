/* Landing-page helpers: translate JS chrome on source-language pages,
   and keep canonical / og:url in line with the active ?lang= version. */
(function () {
  "use strict";
  var lang = (document.documentElement.getAttribute("lang") || "en").slice(0, 2);
  var packs = {
    de: {
      "Open menu": "Menü öffnen",
      "Close menu": "Menü schließen",
      "Please enter your business name.": "Bitte geben Sie den Namen Ihres Unternehmens ein.",
      "Please enter a valid email address.": "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      "Please enter a full web address, starting with https://": "Bitte geben Sie eine vollständige Webadresse ein, beginnend mit https://",
      "Add a business name and an email so the note can be sent.": "Bitte Firmennamen und E-Mail angeben, damit die Nachricht gesendet werden kann.",
      "Business:": "Firma:",
      "Email:": "E-Mail:",
      "Current website:": "Aktuelle Website:",
      "none yet": "noch keine",
      "Scope:": "Umfang:",
      "Website for": "Website für",
      "New website": "Neue Website",
      "Redesign": "Redesign",
      "Online store": "Online-Shop"
    },
    he: {
      "Open menu": "פתיחת תפריט",
      "Close menu": "סגירת תפריט",
      "Please enter your business name.": "נא להזין את שם העסק.",
      "Please enter a valid email address.": "נא להזין כתובת אימייל תקינה.",
      "Please enter a full web address, starting with https://": "נא להזין כתובת אתר מלאה שמתחילה ב-https://",
      "Add a business name and an email so the note can be sent.": "הוסיפו שם עסק ואימייל כדי שאפשר יהיה לשלוח את ההודעה.",
      "Business:": "עסק:",
      "Email:": "אימייל:",
      "Current website:": "אתר קיים:",
      "none yet": "עדיין אין",
      "Scope:": "היקף:",
      "Website for": "אתר עבור",
      "New website": "אתר חדש",
      "Redesign": "עיצוב מחדש",
      "Online store": "חנות מקוונת"
    },
    ru: {
      "Open menu": "Открыть меню",
      "Close menu": "Закрыть меню",
      "Please enter your business name.": "Пожалуйста, укажите название компании.",
      "Please enter a valid email address.": "Пожалуйста, укажите действительный адрес электронной почты.",
      "Please enter a full web address, starting with https://": "Пожалуйста, укажите полный адрес сайта, начиная с https://",
      "Add a business name and an email so the note can be sent.": "Укажите название компании и электронную почту, чтобы можно было отправить сообщение.",
      "Business:": "Компания:",
      "Email:": "Эл. почта:",
      "Current website:": "Текущий сайт:",
      "none yet": "пока нет",
      "Scope:": "Объём:",
      "Website for": "Сайт для",
      "New website": "Новый сайт",
      "Redesign": "Редизайн",
      "Online store": "Интернет-магазин"
    }
  };
  var pack = packs[lang] || {};
  var orig = window.__t || function (s) { return s; };
  window.__t = function (s) {
    var v = orig(s);
    if (v !== s) return v;
    return Object.prototype.hasOwnProperty.call(pack, s) ? pack[s] : s;
  };

  try {
    var src = (window.I18N && window.I18N.src) || "en";
    var canon = document.querySelector('link[rel="canonical"]');
    var ogUrl = document.querySelector('meta[property="og:url"]');
    var base = canon ? canon.getAttribute("href") : (location.origin + location.pathname);
    if (lang && lang !== src) {
      var alt = new URL(base, location.href);
      alt.searchParams.set("lang", lang);
      if (canon) canon.setAttribute("href", alt.toString());
      if (ogUrl) ogUrl.setAttribute("content", alt.toString());
    }
  } catch (err) {}
})();
