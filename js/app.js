var app = new Vue({
  el: '#app',
  data: {
    greeting: 'Welcome to your Vue.js app!',
    docsURL: 'http://vuejs.org/guide/',
    gitterURL: 'https://gitter.im/vuejs/vue',
    forumURL: 'http://forum.vuejs.org/',
    links: [{
      text: 'info@kukkas.fi',
      href: 'mailto:info@kukkas.fi'
    },{
      text: '#kukkas',
      href: 'https://www.instagram.com/kukkas.fi/',
      icon: './assets/icons/insta.svg'
    },{
      text: 'kukkas.fi',
      href: 'https://www.facebook.com/kukkas.fi/',
      icon: './assets/icons/fb.svg'
    },{
      text: '@kukkas_fi',
      href: 'https://twitter.com/kukkas_fi',
      icon: './assets/icons/tw.svg'
    }],
    calendarData: []
  },
  methods: {
    // setSalesMarker: function (address) {
    //   https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
    // }
  },
  filters: {
    salesWindow: function(event) {
      if (event) {
        var t = event.start;
        var e = event.end;
        return [
          t.getDate(),
          '.',
          t.getMonth() + 1,
          '. klo ',
          t.getHours(),
          ':',
          ('00' + t.getMinutes().toString()).substring(t.getMinutes().toString().length),
          ' - ',
          e.getHours(),
          ':',
          ('00' + e.getMinutes().toString()).substring(e.getMinutes().toString().length),
        ].join('')
      }
    }
  }
});

function parseTime(t) {
  return new Date(Date.UTC(t.year, t.month - 1, t.day, t.hour, t.minute));
}

function getCalendarData() {
  var retVal = [];
  app.$http.get('http://cors-anywhere.herokuapp.com/https://calendar.zoho.com/ical/ffde202689b20c9dfcafdf4d6ab6710bf8f24d7aff3a1d7a6c69b66f6f196b992ce960a86a96676fee5ae0c4ec0683b7').then(response => {
    var jcalData = ICAL.parse(response.body);
    var vcalendar = new ICAL.Component(jcalData);
    var events = vcalendar.getAllSubcomponents('vevent');

    for (var i in events) {
      var ev = new ICAL.Event(events[i]);
      var t = ev.startDate;
      var endDate = parseTime(ev.endDate)

      if (endDate > new Date()) {
        retVal.push({
          summary: ev.summary,
          start: parseTime(ev.startDate),
          end: endDate,
          location: ev.location
        });
      }

    }

    retVal.sort((a, b) => {
      return a.date - b.date;
    });

    app.calendarData = retVal;

    if (retVal.length > 0) {
      setSalesMarker(retVal[0]);
    }

  }, response => {
    console.error('Did not get ical data', arguments)
    app.calendarData = events;
  });
}

getCalendarData();
