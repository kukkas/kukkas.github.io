var app = new Vue({
  el: '#app',
  data: {
    greeting: 'Welcome to your Vue.js app!',
    docsURL: 'http://vuejs.org/guide/',
    gitterURL: 'https://gitter.im/vuejs/vue',
    forumURL: 'http://forum.vuejs.org/',
    links: [{
      text: 'info@kukkas.fi',
      href: 'mailto:info@kukkas.fi',
      icon: './assets/icons/mail.png'
    },{
      text: '#kukkas',
      href: 'https://www.instagram.com/kukkas.fi/',
      icon: './assets/icons/instagram.png'
    },{
      text: 'kukkas.fi',
      href: 'https://www.facebook.com/kukkas.fi/',
      icon: './assets/icons/facebook.png'
    },{
      text: '@kukkas_fi',
      href: 'https://twitter.com/kukkas_fi',
      icon: './assets/icons/twitter.png'
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
    },
    formatSalesDate: function (event) {
      if (event) {
        // Multiple days?
        if (event.duration.days > 1) {
          return salesSpan(event)
        } else {
          return salesDate(event)
        }
      }
    },
    salesTime: function (event) {
      if (event && event.duration.days === 0) {
        var t = event.start;
        var e = event.end;
        return [
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
  return new Date(Date.UTC(t.year, t.month - 1, (t.hour === 0 ? t.day - 1 : t.day), t.hour, t.minute));
}

function getCalendarData() {
  var retVal = [];

  // Previous provider
  // 'http://cors-anywhere.herokuapp.com/https://calendar.zoho.com/ical/ffde202689b20c9dfcafdf4d6ab6710bf8f24d7aff3a1d7a6c69b66f6f196b992ce960a86a96676fee5ae0c4ec0683b7'

  app.$http.get('http://cors-proxy.htmldriven.com/?url=https://calendar.zoho.com/ical/ffde202689b20c9dfcafdf4d6ab6710bf8f24d7aff3a1d7a6c69b66f6f196b992ce960a86a96676fee5ae0c4ec0683b7').then(function(response) {
    var jcalData = ICAL.parse(response.body.body);
    var vcalendar = new ICAL.Component(jcalData);
    var events = vcalendar.getAllSubcomponents('vevent');

    for (var i in events) {
      var ev = new ICAL.Event(events[i]);
      var t = ev.startDate;
      var endDate = parseTime(ev.endDate)
      if (endDate > new Date()) {
        retVal.push({
          summary: ev.summary,
          duration: ev.duration,
          start: new Date(ev.startDate),
          end: endDate,
          location: ev.location
        });
      }

    }

    retVal.sort(function(a, b) {
      return a.start - b.start;
    });

    app.calendarData = retVal;

    if (retVal.length > 0) {
      setSalesMarker(retVal[0]);
    }

  }, function(response) {
    console.error('Did not get ical data', arguments)
    app.calendarData = [];
  });
}

function salesSpan (event) {
  var s, e;
  if (event && event.start.getMonth() === event.end.getMonth()) {
    s = event.start
    e = event.end
    return [
      s.getDate(),
      '-',
      e.getDate(),
      '.',
      s.getMonth() + 1,
      '.'
    ].join('')
  } else {
    // Spans across two months
    s = event.start
    e = event.end
    return [
      s.getDate(),
      '.',
      s.getMonth() + 1,
      '-',
      e.getDate(),
      '.',
      e.getMonth() + 1,
      '.'
    ].join('')
  }
}

function salesDate (event) {
  if (event) {
    var t = event.start;
    return [
      t.getDate(),
      '.',
      t.getMonth() + 1,
      '.'
    ].join('')
  }
}

getCalendarData();
