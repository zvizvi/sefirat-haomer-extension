/* global chrome */

$(document).ready(function () {
  $(document).on('contextmenu', function (e) {
    e.preventDefault();
  });

  $('.options').on('click', function (e) {
    chrome.runtime.openOptionsPage();
  });

  const moment = window.moment;
  const Hebcal = window.Hebcal;
  let options, today, todayHebrewObj, isAfterSunset, todayHebrew, todayOmer;
  const defaultOptions = {
    nusach: 'sf'
  };

  const numberLetterList = {
    1: 'אֶחָד',
    2: 'שְׁנֵי',
    '2a': 'שְׁנַיִם',
    3: 'שְׁלֹשָׁה',
    4: 'אַרְבָּעָה',
    5: 'חֲמִשָּׁה',
    6: 'שִׁשָּׁה',
    7: 'שִׁבְעָה',
    8: 'שְׁמוֹנָה',
    9: 'תִּשְׁעָה',
    10: 'עָשָׂר',
    11: 'אַחַד עָשָׂר',
    12: 'שְׁנֵים עָשָׂר',
    20: 'עֶשְׂרִים',
    30: 'שְׁלֹשִׁים',
    40: 'אַרְבָּעִים'
  };
  const sefiraList = ['חסד', 'גבורה', 'תפארת', 'נצח', 'הוד', 'יסוד', 'מלכות'];

  moment.locale('he');

  function setupHebrewDate () {
    todayHebrewObj = Hebcal.HDate(new Date(today.toISOString()));
    todayHebrewObj.setLocation(31.783, 35.233); // Jerusalem
  }

  function setupDate () {
    today = moment();
    setupHebrewDate();

    isAfterSunset = today.isAfter(todayHebrewObj.sunset());
    if (isAfterSunset) {
      today = today.add(1, 'days');
      setupHebrewDate();
    }

    todayHebrew = todayHebrewObj.toString('h');
    todayOmer = todayHebrewObj.omer();

    let weekDay = isAfterSunset || today.hour() < 5 ? 'אור ל' : '';
    weekDay += 'יום ' + today.format('dddd');
    $('.week-day').text(weekDay);
    $('.hebrew-date').text(todayHebrew);

    chrome.action.setBadgeText({ text: todayOmer ? todayOmer.toString() : '' });
  }

  function getDays (number) {
    let day;

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
        const stringNumber = number.toString();
        day = (numberLetterList[stringNumber[1] + 'a'] || numberLetterList[stringNumber[1]]);
        day += ' ';
        day += (stringNumber[0] === '3') ? 'וּ' : (number > 20) ? 'וְ' : '';
        day += numberLetterList[stringNumber[0] + '0'];
      }
      day += ' יוֹם';
    }
    return day;
  }

  function writeDays () {
    const day = getDays(todayOmer);
    let suffix = '';
    if (todayOmer && todayOmer < 7) {
      suffix = options.nusach === 'sf' ? ' לָעוֹמֶר' : options.nusach === 'as' ? ' בָּעוֹמֶר' : '';
    }
    if (options.nusach === 'em') {
      suffix = ' לָעוֹמֶר';
    }
    $('.day').text(day + suffix);
  }

  function writeWeeks () {
    if (todayOmer < 7) {
      return;
    }
    const weeks = Math.floor(todayOmer / 7);
    const leftDays = (todayOmer % 7);
    let week = 'שֶׁהֵם ';

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

    const suffix = (options.nusach === 'sf' ? ' לָעוֹמֶר' : options.nusach === 'as' ? ' בָּעוֹמֶר' : '');
    $('.week').text(week + suffix);
  }

  function getSefira () {
    if (!todayOmer) {
      return;
    }
    let todaySefira = (sefiraList[(todayOmer % 7) - 1] || sefiraList[6]);
    todaySefira += ' שב';
    if (todayOmer % 7) {
      todaySefira += sefiraList[Math.floor(todayOmer / 7)];
    } else {
      todaySefira += sefiraList[Math.floor(todayOmer / 7) - 1];
    }
    $('.sefira').text(todaySefira);
  }

  function toggleNoOmer () {
    if (!todayOmer) {
      $('.omer').addClass('hide');
      $('.no-omer').removeClass('hide');
    } else {
      $('.omer').removeClass('hide');
      $('.no-omer').addClass('hide');
      $('.website-link').removeClass('hide');
    }
  }

  function lagBaomer () {
    if (todayOmer === 33) {
      $('.header').prepend('<span class="lag-baomer"><span class="fire">🔥</span> ל"ג בעומר</span>');
    }
  }

  setupDate();
  toggleNoOmer();
  chrome.storage.sync.get('options')
    .then((storage) => {
      options = storage.options || defaultOptions;

      writeDays();
      writeWeeks();
      getSefira();
      lagBaomer();

      $('.website-link a').attr('href', $('.website-link a').attr('href') + options.nusach);
    });
});
