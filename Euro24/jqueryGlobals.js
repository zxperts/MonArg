// WidgetKey can be obtained from your account
var widgetKey = 'be0543a19ea83661300999e97855a109b34831aa82986f611d5eea693cecec72';
// Store widgetKey in sessionStorage
sessionStorage.setItem('widgetKey', widgetKey);

// Function that prevent click to acces link href
function windowPreventOpening() {
    $(this).click(function(event) {
        event.preventDefault();
    });
}

// Function that open new window for Match Details
function windowOpenMatch(event_key, leagueLogo, fixturesDate, countryName, leagueName, homeTeam, awayTeam) {

    sessionStorage.setItem('matchDetailsKey', event_key);

    if (leagueLogo != '') {
        sessionStorage.setItem('leagueLogo', leagueLogo);
    }

    var generatedLink = countryName+'/'+leagueName+'/'+homeTeam+'-vs-'+awayTeam+'/'+fixturesDate+'/'+event_key;
    var newGeneratedLink = generatedLink.replace(/\s/g,'-');

    sessionStorage.setItem('fixturesDate', fixturesDate);
    var winLoc = $(location).attr("href");
    winLoc = winLoc.replace('index.html', '');
    winLoc = winLoc.replace('widgetLeagueInfo.html', '');
    var WindowNW = window.open(
        winLoc + 'widgetMatchResults.html?'+newGeneratedLink+'',
        "_blank",
        "width=870, height=650");

}

// Function that comapare times
function naturalCompare(a, b) {
    var ax = [],
        bx = [];

    if (a && b) {
    a['time'].replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
        ax.push([$1 || Infinity, $2 || ""])
    });
    b['time'].replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
        bx.push([$1 || Infinity, $2 || ""])
    });
    }

    while (ax.length && bx.length) {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if (nn) return nn;
    }

    return ax.length - bx.length;
}

// Function that sort ascendent by league round
function groupSortingAsc(a, b) {
    var ax = [],
        bx = [];

    a['league_round'].replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
        ax.push([$1 || Infinity, $2 || ""])
    });
    b['league_round'].replace(/(\d+)|(\D+)/g, function(_, $1, $2) {
        bx.push([$1 || Infinity, $2 || ""])
    });

    while (ax.length && bx.length) {
        var an = ax.shift();
        var bn = bx.shift();
        var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if (nn) return nn;
    }

    return ax.length - bx.length;
}

// Function that group by
var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

// Function that sort by key descendent
function sortByKeyDesc(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}

// Function that sort by key ascendent
function sortByKeyAsc(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

// Function that sort by key
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

// Function that get server time
var timeForFixtures = '';

var fiTFF = setInterval(function() {

    if (typeof getTimeZone() != 'undefined') {
        $.ajax({
            url: 'https://apiv2.allsportsapi.com/football/',
            cache: false,
            data: {
                met: 'Date',
                widgetKey: widgetKey,
                timezone: getTimeZone()
            },
            dataType: 'json'
        }).done(function(res) {

            var formattedDate = new Date(res.result.datetime  + "T00:00");
            var d = formattedDate.getDate();
            var m = formattedDate.getMonth() + 1;
            var y = formattedDate.getFullYear();
            timeForFixtures = y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);

        }).fail(function(error) {

        });
        clearInterval(fiTFF);
    }
}, 10);

// Function that get local time
function getTimeZone() {
    var offset = new Date().getTimezoneOffset(),
        o = Math.abs(offset);
    return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
}

function whatToPush(where, bookmaker, one, two) {
    return where.push({
        bookmaker: bookmaker,
        one: ((typeof one != 'undefined') ? one : '' ),
        two: ((typeof two != 'undefined') ? two : '' )
    });
}