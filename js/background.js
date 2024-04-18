/* globals chrome importScripts dayjs hebcal */
importScripts('../assets/dayjs/dayjs.min.js');
importScripts('../assets/@hebcal/core/dist/bundle.min.js');

const { GeoLocation, Zmanim, HebrewCalendar } = hebcal;

let sunset;

function setup () {
  const now = dayjs();
  let today = now.startOf('day');
  const gloc = new GeoLocation('Jerusalem', 31.783, 35.233, 0, 'Asia/Jerusalem');
  const zmanim = new Zmanim(gloc, now.toDate());
  sunset = zmanim.sunset();
  const isAfterSunset = now.isAfter(sunset);
  if (isAfterSunset) {
    today = today.add(1, 'days');
  }
  const omer = HebrewCalendar.calendar({
    start: today.toDate(),
    end: today.toDate(),
    omer: true
  })
    .find((event) => event.omer)
    ?.omer;

  chrome.action.setBadgeText({ text: omer ? omer.toString() : '' });
  chrome.action.setBadgeBackgroundColor({ color: '#666' });
  setTimeout(setup, 43200000); // 12 hours.
}
setup();

function setCron () {
  setTimeout(function () {
    setup();
    setCron();
  }, sunset - new Date());
}
setCron();
