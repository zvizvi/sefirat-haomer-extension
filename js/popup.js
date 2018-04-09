// popup.js
$(document).ready(function () {
  var moment = window.moment;
  var Hebcal = window.Hebcal;

  var today, todayHebrewObj, todayHebrew, todayOmer;

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
  }

  function getSefira (todayOmer) {
    var list = ['חסד', 'גבורה', 'תפארת', 'נצח', 'הוד', 'יסוד', 'מלכות'];
    var todaySefira = list[(todayOmer % 7) - 1] + ' שב' + list[Math.floor(todayOmer / 7)];
    $('.sefira').text(todaySefira);
  }

  setupDate();
  getDays();
  getSefira(todayOmer);
});
