/* global chrome */

$(document).ready(function () {
  $(document).on('contextmenu', function (e) {
    e.preventDefault();
  });

  $('.options').on('click', function (e) {
    chrome.runtime.openOptionsPage();
  });

  var moment = window.moment;
  var Hebcal = window.Hebcal;
  var options, today, todayHebrewObj, isAfterSunset, todayHebrew, todayOmer;
  var defaultOptions = {
    nusach: 'sf'
  };

  var numberLetterList = {
    '1': 'אֶחָד',
    '2': 'שְׁנֵי',
    '2a': 'שְׁנַיִם',
    '3': 'שְׁלֹשָׁה',
    '4': 'אַרְבָּעָה',
    '5': 'חֲמִשָּׁה',
    '6': 'שִׁשָּׁה',
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
    today = moment();
    // today = moment().add(0, 'days');
    todayHebrewObj = Hebcal.HDate(new Date(today.toISOString()));
    todayHebrewObj.setLocation(31.783, 35.233); // Jerusalem

    isAfterSunset = today.isAfter(todayHebrewObj.sunset());
    if (isAfterSunset) {
      today = today.add(1, 'days');
      todayHebrewObj = Hebcal.HDate(new Date(today.toISOString()));
      todayHebrewObj.setLocation(31.783, 35.233); // Jerusalem
    }

    todayHebrew = todayHebrewObj.toString('h');
    todayOmer = todayHebrewObj.omer();

    var weekDay = isAfterSunset || today.hour() < 5 ? 'אור ל' : '';
    weekDay += 'יום ' + today.format('dddd');
    $('.week-day').text(weekDay);
    $('.hebrew-date').text(todayHebrew);

    chrome.browserAction.setBadgeText({ text: todayOmer ? todayOmer.toString() : '' });
  }

  function getDays (number) {
    var day;

    if (number === 1) {
      day = 'יוֹם אֶחָד';
    } else if (number < 10) {
      day = numberLetterList[number] + ' יָמִים';
    } else if (number === 10) {
      day = 'עַשָׂרָה יָמִים';
    } else {
      if ([11, 12, 20, 30, 40].indexOf(number) >= 0) {
        day = numberLetterList[number];
      } else {
        var stringNumber = number.toString();
        day = (numberLetterList[stringNumber[1] + 'a'] || numberLetterList[stringNumber[1]]);
        day += ' ';
        day += (stringNumber[0] === '3') ? 'וּ' : (number > 20) ? 'וְ' : '';
        day += numberLetterList[stringNumber[0] + '0'];
      }
      day += ' יוֹם';
    }
    return day;
  }

  function setupDays () {
    var day = getDays(todayOmer);
    var suffix = (options.nusach === 'em' ? ' לָעוֹמֶר' : '');
    $('.day').text(day + suffix);
  }

  function getWeeks () {
    if (todayOmer < 7) {
      return;
    }
    var weeks = Math.floor(todayOmer / 7);
    var leftDays = (todayOmer % 7);
    var week = 'שֶׁהֵם ';

    if (weeks === 1) {
      week += 'שָׁבוּעַ אֶחָד ';
    } else {
      week += numberLetterList[weeks];
      week += ' שָׁבוּעוֹת';
    }

    if (leftDays) {
      week += ' ';
      if (leftDays === 5) {
        week += 'וַ';
      } else if ([2, 3].indexOf(leftDays) >= 0) {
        week += 'וּ';
      } else {
        week += 'וְ';
      }
      week += getDays(leftDays);
    }

    var suffix = (options.nusach === 'sf' ? ' לָעוֹמֶר' : options.nusach === 'as' ? ' בָּעוֹמֶר' : '');
    $('.week').text(week + suffix);
  }

  function getSefira () {
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
    $('.omer').addClass('hide');
    $('.no-omer').removeClass('hide');
    return;
  } else {
    $('.omer').removeClass('hide');
    $('.no-omer').addClass('hide');
  }

  chrome.storage.sync.get('options', function (storage) {
    options = storage.options || defaultOptions;

    setupDays();
    getWeeks();
    getSefira();
  });
});
