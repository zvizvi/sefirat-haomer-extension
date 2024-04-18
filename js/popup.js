/* global chrome */

document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

document.querySelector('.options').addEventListener('click', function (e) {
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
  document.querySelector('.week-day').textContent = weekDay;
  document.querySelector('.hebrew-date').textContent = todayHebrew;

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
  document.querySelector('.day').textContent = day + suffix;
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
  document.querySelector('.week').textContent = week + suffix;
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
  document.querySelector('.sefira').textContent = todaySefira;
}

function toggleNoOmer () {
  const omerElement = document.querySelector('.omer');
  const noOmerElement = document.querySelector('.no-omer');
  const websiteLinkElement = document.querySelector('.website-link');

  if (!todayOmer) {
    omerElement.classList.add('hide');
    noOmerElement.classList.remove('hide');
  } else {
    omerElement.classList.remove('hide');
    noOmerElement.classList.add('hide');
    websiteLinkElement.classList.remove('hide');
  }
}

function lagBaomer () {
  if (todayOmer === 33) {
    const template = document.createElement('template');
    template.innerHTML = '<span class="lag-baomer"><span class="fire">🔥</span> ל"ג בעומר</span>';
    const headerElement = document.querySelector('.header');
    headerElement.insertBefore(template.content, headerElement.firstChild);
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

    const websiteLinkElement = document.querySelector('.website-link a');
    const href = websiteLinkElement.getAttribute('href');
    websiteLinkElement.setAttribute('href', href + options.nusach);
  });
