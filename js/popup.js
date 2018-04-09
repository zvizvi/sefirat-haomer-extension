// popup.js
$(document).ready(function () {
  var moment = window.moment;
  var Hebcal = window.Hebcal;

  var today, todayHebrewObj, todayHebrew, todayOmer;

  var numberLetterList = {
    '1': 'אֶחָד',
    '2': 'שְׁנֵי',
    '2a': 'שְׁנַיִם',
    '3': 'שְׁלֹשָׁה',
    '4': 'אַרְבָּעָה',
    '5': 'חַמִשָׁה',
    '6': 'שִׁשָׁה',
    '7': 'שִׁבְעָה',
    '8': 'שְׁמוֹנָה',
    '9': 'תִּשְׁעָה',
    '10': 'עָשָׂר',
    '11': 'אַחַד עָשָׂר',
    '12': 'שְׁנֵים עָשָׂר',
    '20': 'עֶשְׂרִים',
    '30': 'שְׁלֹשִׁים',
    '40': 'אַרְבָּעִים'
  };
  var sefiraList = ['חסד', 'גבורה', 'תפארת', 'נצח', 'הוד', 'יסוד', 'מלכות'];

  moment.locale('he');

  function setupDate () {
    today = moment().add(0, 'days').toISOString();
    todayHebrewObj = Hebcal.HDate(new Date(today));
    todayHebrew = todayHebrewObj.toString('h');
    todayOmer = todayHebrewObj.omer();

    $('.week-day').text('יום ' + moment().format('dddd'));
    $('.hebrew-date').text(todayHebrew);
  }

  function getDays () {
    // console.log(today);
    // console.log(todayHebrewObj);
    // console.log(todayHebrew);
    // console.log(todayOmer);
    var day;

    if (todayOmer === 1) {
      day = 'יוֹם אֶחָד';
    } else if (todayOmer < 10) {
      day = numberLetterList[todayOmer] + ' יָמִים';
    } else if (todayOmer === 10) {
      day = 'עַשָׂרָה יָמִים';
    } else {
      if ([11, 12, 20, 30, 40].indexOf(todayOmer) >= 0) {
        day = numberLetterList[todayOmer];
      } else {
        var stringNumber = todayOmer.toString();
        day = (numberLetterList[stringNumber[1] + 'a'] || numberLetterList[stringNumber[1]]);
        day += ' ';
        day += (stringNumber[0] === '3') ? 'וּ' : (todayOmer > 20) ? 'וְ' : '';
        day += numberLetterList[stringNumber[0] + '0'];
      }
      day += ' יוֹם';
    }
    $('.day').text(day);
  }

  function getWeeks () {
    if (todayOmer < 7) {
      return;
    }
    var week = 'שֶׁהֵם שָׁבוּעַ אֶחָד וּשְׁנֵי יָמִים';
    $('.week').text(week);
  }

  function getSefira () {
    console.log(Math.floor(todayOmer % 7));
    var todaySefira = (sefiraList[(todayOmer % 7) - 1] || sefiraList[6]);
    todaySefira += ' שב';
    if (todayOmer % 7) {
      todaySefira += sefiraList[Math.floor(todayOmer / 7)];
    } else {
      todaySefira += sefiraList[Math.floor(todayOmer / 7) - 1];
    }
    $('.sefira').text(todaySefira);
  }

  setupDate();
  if (!todayOmer) {
    return;
  }

  getDays();
  getWeeks();
  getSefira();
});
