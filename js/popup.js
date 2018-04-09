// popup.js
$(document).ready(function () {
  var moment = window.moment;
  var Hebcal = window.Hebcal;

  var today, todayHebrewObj, todayHebrew, todayOmer;

  var numberLetterList = {
    '1': 'אֶחָד',
    '1a': 'אחד',
    '2': 'שנים',
    '2a': 'שְׁנֵי',
    '3': 'שלשה',
    '4': 'ארבעה',
    '5': 'חמשה',
    '6': 'ששה',
    '7': 'שבעה',
    '8': 'שמונה',
    '9': 'תִּשְׁעָה',
    '10': 'עשרה'
  };
  var sefiraList = ['חסד', 'גבורה', 'תפארת', 'נצח', 'הוד', 'יסוד', 'מלכות'];

  moment.locale('he');

  function setupDate () {
    today = moment().format();
    todayHebrewObj = Hebcal.HDate(new Date());
    todayHebrew = todayHebrewObj.toString('h');
    todayOmer = todayHebrewObj.omer();

    $('.week-day').text('יום ' + moment().format('dddd'));
    $('.hebrew-date').text(todayHebrew);
  }

  function getDays () {
    console.log(today);
    console.log(todayHebrewObj);
    console.log(todayHebrew);
    console.log(todayOmer);
    var day = numberLetterList[todayOmer];
    if (todayOmer <= 10) {
      day += ' יָמִים';
    } else {
      day += ' יום';
    }
    $('.day').text(day);
  }

  function getSefira () {
    var todaySefira = sefiraList[(todayOmer % 7) - 1] + ' שב' + sefiraList[Math.floor(todayOmer / 7)];
    $('.sefira').text(todaySefira);
  }

  setupDate();
  getDays();
  getSefira();
});
