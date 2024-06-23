// ---------------------------------
// ---------- widgetMatchResults ----------
// ---------------------------------
// Widget for MatchResults Display
// ------------------------
;
(function($, window, document, undefined) {

    var widgetMatchResults = 'widgetMatchResults';

    function Plugin(element, options) {
        this.element = element;
        this._name = widgetMatchResults;
        this._defaults = $.fn.widgetMatchResults.defaults;
        this.options = $.extend({}, this._defaults, options);

        this.init();
    }

    $.extend(Plugin.prototype, {

        // Initialization logic
        init: function() {
            this.buildCache();
            this.bindEvents();
            this.initialContent(this.options.matchResultsDetailsAjaxURL, this.options.matchId, this.options.method, this.options.widgetKey, this.options.leagueLogo);
            socketsLive(this.options.matchId, this.options.widgetKey);
        },

        // Remove plugin instance completely
        destroy: function() {
            this.unbindEvents();
            this.$element.removeData();
        },

        // Cache DOM nodes for performance
        buildCache: function() {
            this.$element = $(this.element);
        },

        // Bind events that trigger methods
        bindEvents: function() {
            var plugin = this;
        },

        // Unbind events that trigger methods
        unbindEvents: function() {
            this.$element.off('.' + this._name);
        },

        initialContent: function(matchResultsDetailsAjaxURL, matchId, method, widgetKey, leagueLogo) {

            // Get widget location
            var matchResultsLocation = $(this.element);

             // Adding the "widgetMatchResults" class for styling and easyer targeting
            matchResultsLocation.addClass('widgetMatchResults');

            // If backgroundColor setting is set, here we activate the color
            if (this.options.backgroundColor) {
                matchResultsLocation.css('background-color', this.options.backgroundColor);
            }

            // If widgetWidth setting is set, here we set the width of the list
            if (this.options.widgetWidth) {
                matchResultsLocation.css('width', this.options.widgetWidth);
            }

            // We send a request to server for Match infos
            $.ajax({
                url: matchResultsDetailsAjaxURL,
                cache: false,
                data: {
                    met: method,
                    widgetKey: widgetKey,
                    matchId: matchId,
                    timezone: getTimeZone()
                },
                dataType: 'json'
            }).done(function(res) {
                // If server send results we populate HTML with sended information
                if (res.result) {
                    // Check if we get the time
                    var seeWhatMatchDetailsToShow = setInterval(function() {
                        if (timeForFixtures.length > 0) {
                            // If date is in local storage or event status dose not exist we show predefined HTML
                            if ((sessionStorage.getItem('fixturesDate') > timeForFixtures) || (res.result[0].event_status == null) || (res.result[0].event_status == '')) {
                                // Hide loading screen
                                $('.loading').hide();
                                // Details for match
                                var otherMatchDetails = '<div class="otherMatchDetails">';
                                otherMatchDetails += '<div class="otherMatchDetailsInfos">';
                                otherMatchDetails += '<div class="leagueImg" style="background-image: url(\'' + (((leagueLogo == '') || (leagueLogo == 'null') || (leagueLogo == null) || (leagueLogo == 'https://apiv2.allsportsapi.com/logo/logo_leagues/-1')) ? 'img/no-img.png' : leagueLogo) + '\');"></div>';
                                otherMatchDetails += '<div>' + res.result[0].country_name + ': ' + res.result[0].league_name + '</div>';
                                otherMatchDetails += '</div>';
                                var formattedDate = new Date(res.result[0].event_date + "T00:00");
                                var d = formattedDate.getDate();
                                var m = formattedDate.getMonth() + 1;
                                var y = formattedDate.getFullYear();
                                otherMatchDetails += '<div>' + (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + '.' + y + ' ' + res.result[0].event_time + '</div>';
                                otherMatchDetails += '</div>';
                                $(matchResultsLocation).prepend(otherMatchDetails);

                                // Add hook in HTML for Match Results Tab content infos
                                $(matchResultsLocation).append('<section id="matchResultsContentTable"></section>');
                                var htmlConstructor = '<div id="matchResultsDates">';
                                htmlConstructor += '<div id="matchResultsDatesTitle">';
                                if (res.result) {
                                    htmlConstructor += '<div class="event_home_team">';
                                    htmlConstructor += '<div class="event_home_team_part">';
                                    htmlConstructor += '<div class="event_home_team_part_img">';
                                    htmlConstructor += '<div class="image-style-for-flag" style="background-image: url(\'' + ((!res.result[0].home_team_logo) ? 'img/no-img.png' : ((res.result[0].home_team_logo == '') ? 'img/no-img.png' : res.result[0].home_team_logo)) + '\');"></div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="event_home_team_part_name">';
                                    htmlConstructor += '<div>' + res.result[0].event_home_team + '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="event_info">';
                                    htmlConstructor += '<div class="event_info_score">';
                                    htmlConstructor += '<div>-</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="event_info_status">';
                                    htmlConstructor += '<div>' + ((res.result[0].event_status) ? res.result[0].event_status : '') + '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="event_away_team_part">';
                                    htmlConstructor += '<div class="event_away_team_part_img">';
                                    htmlConstructor += '<div class="image-style-for-flag" style="background-image: url(\'' + ((!res.result[0].away_team_logo) ? 'img/no-img.png' : ((res.result[0].away_team_logo == '') ? 'img/no-img.png' : res.result[0].away_team_logo)) + '\');"></div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="event_away_team_part_name">';
                                    htmlConstructor += '<div>' + res.result[0].event_away_team + '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                }
                                htmlConstructor += '</div>';
                                htmlConstructor += '<div class="nav-tab-wrapper-all">';
                                htmlConstructor += '<ul class="nav-tab-wrapper-all-container">';
                                htmlConstructor += '<li><span><a href="#matchSummary" class="matchResults-h2 nav-tab nav-tab-active">Match Summary</a></span></li>';
                                 htmlConstructor += '<li><span><a href="#matchh2h" class="matchResults-h2 nav-tab">H2H</a></span></li>';
                                // If league_round: contains "finals" then hide Standings Tab
                                htmlConstructor += ((res.result[0].league_round.indexOf('finals') != -1) ? '' : '<li><span><a href="#matchStandings" class="matchResults-h2 nav-tab">Standings</a></span></li>');
                                htmlConstructor += '<li><span><a href="#matchTopScorers" class="matchResults-h2 nav-tab">Top Scorers</a></span></li>';
                                htmlConstructor += '<li><span><a href="#matchOdds" class="matchResults-h2 nav-tab d-none-tab-odds">Odds</a></span></li>';
                                htmlConstructor += '<li><span><a href="#matchPredictions" class="matchResults-h2 nav-tab d-none-tab-prediction">Predictions</a></span></li>';
                                htmlConstructor += '</ul>';
                                htmlConstructor += '</div>';
                                htmlConstructor += '<section id="matchSummary" class="tab-content active">';
                                htmlConstructor += '<div class="tab-container futureMatch">';
                                htmlConstructor += '<p>No live score information available now.</p>';
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                htmlConstructor += '<section id="matchh2h" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';
                                var htmlInsideTabsConstructorh2h = '';
                                // Send server request for H2H
                                $.ajax({
                                    url: matchResultsDetailsAjaxURL,
                                    cache: false,
                                    data: {
                                        met: 'H2H',
                                        widgetKey: widgetKey,
                                        firstTeamId: res.result[0].home_team_key,
                                        secondTeamId: res.result[0].away_team_key
                                    },
                                    dataType: 'json'
                                }).done(function(res2) {
                                    // If server send results we populate HTML with sended information
                                    if(!res2.error){
                                        htmlInsideTabsConstructorh2h += '<div class="flex-table header">';
                                        htmlInsideTabsConstructorh2h += '<div title="hh22hh" class="flex-row matchh2hHeader fix-width" role="columnheader">Last matches: ' + res.result[0].event_home_team + '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorh2h += '<div class="table__body">';
                                        $.each(res2.result.firstTeamResults, function(key, value) {
                                            var event_final_result_class_var = value.event_final_result;
                                            var event_final_result_class = event_final_result_class_var.replace(/:/g, '-');
                                            var event_final_result_class_away = $.trim(event_final_result_class.substr(event_final_result_class.indexOf("-") + 1));
                                            var event_final_result_class_home = $.trim(event_final_result_class.substr(0, event_final_result_class.indexOf('-')));
                                            var formattedDate = new Date(value.event_date + "T00:00");
                                            var d = formattedDate.getDate();
                                            var m = formattedDate.getMonth() + 1;
                                            var y = formattedDate.getFullYear().toString().substr(-2);
                                            var value_country_name = value.country_name.toString().toLowerCase();
                                            htmlInsideTabsConstructorh2h += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hDate" role="cell">' + (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + '.' + y + '</div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hFlags" role="cell"><div class="matchh2hFlag" style="background-image: url(\'' + (((leagueLogo == '') || (leagueLogo == 'null') || (leagueLogo == null) || (leagueLogo == 'https://apiv2.allsportsapi.com/logo/logo_leagues/-1')) ? 'img/no-img.png' : leagueLogo) + '\');"></div></div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row countryNameStyle" role="cell">' + value_country_name + '</div>';
                                            if (event_final_result_class_home > event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerHome flex-row fix-width ' + (((res.result[0].event_home_team == value.event_home_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width ' + (((res.result[0].event_home_team == value.event_away_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_away_team + '</div>';
                                            } else if (event_final_result_class_home < event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width ' + (((res.result[0].event_home_team == value.event_home_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerAway flex-row fix-width ' + (((res.result[0].event_home_team == value.event_away_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_away_team + '</div>';
                                            } else if (event_final_result_class_home == event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width ' + (((res.result[0].event_home_team == value.event_home_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width ' + (((res.result[0].event_home_team == value.event_away_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_away_team + '</div>';
                                            }
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hEventFinalResult" role="cell">' + event_final_result_class + '</div>';
                                            htmlInsideTabsConstructorh2h += '</div>';
                                        });
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="flex-table header">';
                                        htmlInsideTabsConstructorh2h += '<div title="hh22hh" class="flex-row matchh2hHeader fix-width" role="columnheader">Last matches: ' + res.result[0].event_away_team + '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorh2h += '<div class="table__body">';
                                        $.each(res2.result.secondTeamResults, function(key, value) {
                                            var event_final_result_class_var = value.event_final_result;
                                            var event_final_result_class = event_final_result_class_var.replace(/:/g, '-');
                                            var event_final_result_class_away = $.trim(event_final_result_class.substr(event_final_result_class.indexOf("-") + 1));
                                            var event_final_result_class_home = $.trim(event_final_result_class.substr(0, event_final_result_class.indexOf('-')));
                                            var formattedDate = new Date(value.event_date + "T00:00");
                                            var d = formattedDate.getDate();
                                            var m = formattedDate.getMonth() + 1;
                                            var y = formattedDate.getFullYear().toString().substr(-2);
                                            var value_country_name = value.country_name.toString().toLowerCase();
                                            htmlInsideTabsConstructorh2h += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hDate" role="cell">' + (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + '.' + y + '</div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hFlags" role="cell"><div class="matchh2hFlag" style="background-image: url(\'' + (((leagueLogo == '') || (leagueLogo == 'null') || (leagueLogo == null) || (leagueLogo == 'https://apiv2.allsportsapi.com/logo/logo_leagues/-1')) ? 'img/no-img.png' : leagueLogo) + '\');"></div></div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row countryNameStyle" role="cell">' + value_country_name + '</div>';
                                            if (event_final_result_class_home > event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerHome flex-row fix-width ' + (((res.result[0].event_away_team == value.event_home_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width ' + (((res.result[0].event_away_team == value.event_away_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_away_team + '</div>';
                                            } else if (event_final_result_class_home < event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width ' + (((res.result[0].event_away_team == value.event_home_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerAway flex-row fix-width ' + (((res.result[0].event_away_team == value.event_away_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_away_team + '</div>';
                                            } else if (event_final_result_class_home == event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width ' + (((res.result[0].event_away_team == value.event_home_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width ' + (((res.result[0].event_away_team == value.event_away_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_away_team + '</div>';
                                            }
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hEventFinalResult" role="cell">' + event_final_result_class + '</div>';
                                            htmlInsideTabsConstructorh2h += '</div>';
                                        });
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="flex-table header">';
                                        htmlInsideTabsConstructorh2h += '<div title="hh22hh" class="flex-row matchh2hHeader fix-width" role="columnheader">Head-to-head matches: ' + res.result[0].event_home_team + ' - ' + res.result[0].event_away_team + '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorh2h += '<div class="table__body">';
                                        $.each(res2.result.H2H, function(key, value) {
                                            var event_final_result_class_var = value.event_final_result;
                                            var event_final_result_class = event_final_result_class_var.replace(/:/g, '-');
                                            var event_final_result_class_away = $.trim(event_final_result_class.substr(event_final_result_class.indexOf("-") + 1));
                                            var event_final_result_class_home = $.trim(event_final_result_class.substr(0, event_final_result_class.indexOf('-')));
                                            var formattedDate = new Date(value.event_date + "T00:00");
                                            var d = formattedDate.getDate();
                                            var m = formattedDate.getMonth() + 1;
                                            var y = formattedDate.getFullYear().toString().substr(-2);
                                            var value_country_name = value.country_name.toString().toLowerCase();
                                            htmlInsideTabsConstructorh2h += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hDate" role="cell">' + (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + '.' + y + '</div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hFlags" role="cell"><div class="matchh2hFlag" style="background-image: url(\'' + (((leagueLogo == '') || (leagueLogo == 'null') || (leagueLogo == null) || (leagueLogo == 'https://apiv2.allsportsapi.com/logo/logo_leagues/-1')) ? 'img/no-img.png' : leagueLogo) + '\');"></div></div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row countryNameStyle" role="cell">' + value_country_name + '</div>';
                                            if (event_final_result_class_home > event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerHome flex-row fix-width" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width" role="cell">' + value.event_away_team + '</div>';
                                            } else if (event_final_result_class_home < event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerAway flex-row fix-width" role="cell">' + value.event_away_team + '</div>';
                                            } else if (event_final_result_class_home == event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width" role="cell">' + value.event_away_team + '</div>';
                                            }
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hEventFinalResult" role="cell">' + event_final_result_class + '</div>';
                                            htmlInsideTabsConstructorh2h += '</div>';
                                        });
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        $('#matchh2h .tab-container').append(htmlInsideTabsConstructorh2h);
                                    } else {
                                        htmlInsideTabsConstructorh2h += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>';
                                        $('#matchh2h .tab-container').append(htmlInsideTabsConstructorh2h);
                                    }
                                });
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match Top Scorers section
                                htmlConstructor += '<section id="matchTopScorers" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';
                                var htmlInsideTabsConstructorTS = '';
                                // Send server request for Topscorers
                                $.ajax({
                                    url: matchResultsDetailsAjaxURL,
                                    cache: false,
                                    data: {
                                        met: 'Topscorers',
                                        widgetKey: widgetKey,
                                        leagueId: res.result[0].league_key
                                    },
                                    dataType: 'json'
                                }).done(function(res) {
                                    // If server send results we populate HTML with sended information
                                    if (res.result) {
                                        htmlInsideTabsConstructorTS += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorTS += '<div class="flex-table header">';
                                        htmlInsideTabsConstructorTS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                        htmlInsideTabsConstructorTS += '<div title="Player" class="flex-row players" role="columnheader">Player</div>';
                                        htmlInsideTabsConstructorTS += '<div title="Team" class="flex-row playerTeam fix-width" role="columnheader">Team</div>';
                                        htmlInsideTabsConstructorTS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                        htmlInsideTabsConstructorTS += '</div>';
                                        htmlInsideTabsConstructorTS += '<div class="table__body">';
                                        $.each(res.result, function(key, value) {
                                            htmlInsideTabsConstructorTS += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorTS += '<div class="flex-row first fix-width" role="cell">' + value.player_place + '.</div>';
                                            htmlInsideTabsConstructorTS += '<div class="flex-row players" role="cell"><a href="#">' + value.player_name + '</a></div>';
                                            htmlInsideTabsConstructorTS += '<div class="flex-row playerTeam" role="cell"><a href="#">' + value.team_name + '</a></div>';
                                            htmlInsideTabsConstructorTS += '<div class="flex-row goals fix-width" role="cell">' + value.goals + '</div>';
                                            htmlInsideTabsConstructorTS += '</div>';
                                        });
                                        htmlInsideTabsConstructorTS += '</div>';
                                        htmlInsideTabsConstructorTS += '</div>';
                                    } else {
                                        htmlInsideTabsConstructorTS += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>';
                                    }
                                    $('#matchTopScorers .tab-container').append(htmlInsideTabsConstructorTS);
                                });
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match Standings section
                                // If league_round: contains "finals" then hide Standings Tab
                                if (res.result[0].league_round.indexOf('finals') == -1) {
                                    htmlConstructor += '<section id="matchStandings" class="tab-content">';
                                    htmlConstructor += '<div class="tab-container">';
                                    // Send server request for Standings
                                    $.ajax({
                                        url: matchResultsDetailsAjaxURL,
                                        cache: false,
                                        data: {
                                            met: 'Standings',
                                            widgetKey: widgetKey,
                                            leagueId: res.result[0].league_key,
                                            stageKey: res.result[0].fk_stage_key
                                        },
                                        dataType: 'json'
                                    }).done(function (res) {
                                        // If server send results hide loading
                                        $('.loading').hide();
                                        var htmlInsideTabsConstructorS = '<div class="nav-tab-wrapper">';
                                        var firstElementInJson = 0;
                                        var htmlConstructorS = '';
                                        $.each(res.result, function (key, value) {
                                            var sorted = sortByKey(res.result[key], 'key');
                                            var sorted_array = sortByKeyAsc(sorted, "league_round");
                                            var groubedByTeam = groupBy(sorted_array, 'league_round');
                                            var leagueRoundMatchResult = '';
                                            var leagueRoundName = '';
                                            $.each(groubedByTeam, function (keyss, valuess) {
                                                $.each(valuess, function (keyssss, valuessss) {
                                                    if (valuessss.team_key == hometeamKeyMain) {
                                                        leagueRoundName = valuessss.league_round;
                                                        leagueRoundMatchResult = valuessss.league_round;
                                                    }
                                                });
                                            });
                                            var onlySelectedGroup = groubedByTeam[leagueRoundMatchResult];
                                            if (firstElementInJson == 0) {
                                                htmlConstructorS += '<a href="#' + key + '" class="standing-h2 nav-tab nav-tab-active">' + key + '</a>';
                                                htmlInsideTabsConstructorS += '<section id="' + key + '" class="tab-content active">';
                                                htmlInsideTabsConstructorS += '<div class="tablele-container">';
                                                if ($.isEmptyObject(onlySelectedGroup)) {
                                                    htmlInsideTabsConstructorS += '<div class="flex-table header" role="rowgroup">';
                                                    htmlInsideTabsConstructorS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Team" class="flex-row teams" role="columnheader">Team</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '<div class="table__body">';
                                                    htmlInsideTabsConstructorS += '<div class="flex-table-error row" role="rowgroup">';
                                                    htmlInsideTabsConstructorS += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                } else {
                                                    htmlInsideTabsConstructorS += '<div class="flex-table header">';
                                                    htmlInsideTabsConstructorS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                                    htmlInsideTabsConstructorS += '<div title="' + ((!leagueRoundName) ? "Team" : leagueRoundName) + '" class="flex-row teams" role="columnheader">' + ((!leagueRoundName) ? "Team" : leagueRoundName) + '</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '<div class="table__body">';
                                                    var colorForStanding = ['colorOne', 'colorTwo', 'colorThree', 'colorFour', 'colorFive', 'colorSix', 'colorSeven', 'colorEight', 'colorNine', 'colorTen'];
                                                    var colorStringValue = -1;
                                                    var stringToCompareStandings = '';
                                                    $.each(onlySelectedGroup, function (keys, values) {
                                                        htmlInsideTabsConstructorS += '<div class="flex-table row" role="rowgroup">';
                                                        if (values.standing_place_type) {
                                                            if (stringToCompareStandings != values.standing_place_type) {
                                                                stringToCompareStandings = values.standing_place_type;
                                                                colorStringValue++;
                                                                colorForStanding[colorStringValue];
                                                                htmlInsideTabsConstructorS += '<div class="flex-row first-sticky fix-width ' + colorForStanding[colorStringValue] + '" title="' + values.standing_place_type + '" role="cell">' + values.standing_place + '.</div>';
                                                            } else if (stringToCompareStandings == values.standing_place_type) {
                                                                colorForStanding[colorStringValue];
                                                                htmlInsideTabsConstructorS += '<div class="flex-row first-sticky fix-width ' + colorForStanding[colorStringValue] + '" title="' + values.standing_place_type + '" role="cell">' + values.standing_place + '.</div>';
                                                            }
                                                        } else if (!values.standing_place_type) {
                                                            colorStringValue = $(colorForStanding).length / 2;
                                                            htmlInsideTabsConstructorS += '<div class="flex-row first-sticky fix-width ' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + '" role="cell">' + values.standing_place + '.</div>';
                                                        }
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row teams" role="cell"><a href="#" onclick="windowPreventOpening()">' + values.standing_team + '</a></div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_P + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_W + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_D + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_L + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row goals" role="cell">' + values.standing_F + ':' + values.standing_A + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_PTS + '</div>';
                                                        htmlInsideTabsConstructorS += '</div>';
                                                    });
                                                    htmlInsideTabsConstructorS += '</div>';
                                                }
                                                htmlInsideTabsConstructorS += '</div>';
                                                htmlInsideTabsConstructorS += '</section>';
                                                firstElementInJson++
                                            } else {
                                                htmlConstructorS += '<a href="#' + key + '" class="standing-h2 nav-tab">' + key + '</a>';
                                                htmlInsideTabsConstructorS += '<section id="' + key + '" class="tab-content">';
                                                htmlInsideTabsConstructorS += '<div class="tablele-container">';
                                                if ($.isEmptyObject(onlySelectedGroup)) {
                                                    htmlInsideTabsConstructorS += '<div class="flex-table header" role="rowgroup">';
                                                    htmlInsideTabsConstructorS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Team" class="flex-row teams" role="columnheader">Team</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '<div class="table__body">';
                                                    htmlInsideTabsConstructorS += '<div class="flex-table-error row" role="rowgroup">';
                                                    htmlInsideTabsConstructorS += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                } else {
                                                    htmlInsideTabsConstructorS += '<div class="flex-table header">';
                                                    htmlInsideTabsConstructorS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                                    htmlInsideTabsConstructorS += '<div title="' + ((!leagueRoundName) ? "Team" : leagueRoundName) + '" class="flex-row teams" role="columnheader">' + ((!leagueRoundName) ? "Team" : leagueRoundName) + '</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '<div class="table__body">';
                                                    $.each(onlySelectedGroup, function (keys, values) {
                                                        htmlInsideTabsConstructorS += '<div class="flex-table row" role="rowgroup">';
                                                        htmlInsideTabsConstructorS += '<div class="flex-row first fix-width" role="cell">' + values.standing_place + '.</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row teams" role="cell"><a href="#" onclick="windowPreventOpening()">' + values.standing_team + '</a></div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_P + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_W + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_D + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_L + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row goals" role="cell">' + values.standing_F + ':' + values.standing_A + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_PTS + '</div>';
                                                        htmlInsideTabsConstructorS += '</div>';
                                                    });
                                                    htmlInsideTabsConstructorS += '</div>';
                                                }
                                                htmlInsideTabsConstructorS += '</div>';
                                                htmlInsideTabsConstructorS += '</section>';
                                            }
                                        });
                                        htmlInsideTabsConstructorS += '</div>';
                                        $('#matchStandings .tab-container').append(htmlInsideTabsConstructorS);
                                        $('#matchStandings .nav-tab-wrapper').prepend(htmlConstructorS);

                                        // Switching tabs on click
                                        $('#matchStandings .nav-tab').unbind('click').on('click', function (e) {
                                            e.preventDefault();
                                            //Toggle tab link
                                            $(this).addClass('nav-tab-active').siblings().removeClass('nav-tab-active');
                                            //Toggle target tab
                                            $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                        });
                                    });
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</section>';
                                }

                                // Populate Match Odds section
                                htmlConstructor += '<section id="matchOdds" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';

                                // Send server request for Standings
                                $.ajax({
                                    url: matchResultsDetailsAjaxURL,
                                    cache: false,
                                    data: {
                                        met: 'Odds',
                                        widgetKey: widgetKey,
                                        from: sessionStorage.getItem('fixturesDate'),
                                        to: sessionStorage.getItem('fixturesDate'),
                                        matchId: matchId
                                    },
                                    dataType: 'json'
                                }).done(function(res) {

                                    // If server send results hide loading
                                    $('.loading').hide();

                                    if(!res.error){
                                        if(res.result){

                                            $('.d-none-tab-odds').removeClass('d-none-tab-odds');

                                            var htmlInsideTabsConstructorO = '<div class="nav-tab-wrapper">';
                                            var htmlConstructorO = '<a href="#1x2" class="standing-h2 nav-tab nav-tab-active">1x2</a>';
                                            htmlConstructorO += '<a href="#ah" class="standing-h2 nav-tab">Asian Handicap</a>';
                                            htmlConstructorO += '<a href="#ou" class="standing-h2 nav-tab">O/U</a>';
                                            htmlConstructorO += '<a href="#bts" class="standing-h2 nav-tab">BTS</a>';

                                            htmlInsideTabsConstructorO += '<section id="1x2" class="tab-content active">';
                                            htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                            htmlInsideTabsConstructorO += '<div class="flex-table header" role="rowgroup">';
                                            htmlInsideTabsConstructorO += '<div title="Bookmakers" class="flex-row bookmakers" role="columnheader">Bookmakers</div>';
                                            htmlInsideTabsConstructorO += '<div title="1" class="flex-row oddWidth" role="columnheader">1</div>';
                                            htmlInsideTabsConstructorO += '<div title="X" class="flex-row oddWidth" role="columnheader">X</div>';
                                            htmlInsideTabsConstructorO += '<div title="2" class="flex-row oddWidth" role="columnheader">2</div>';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '<div class="table__body">';
                                            var onextwo = '';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '</section>';

                                            htmlInsideTabsConstructorO += '<section id="ou" class="tab-content">';
                                            htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '</section>';

                                            htmlInsideTabsConstructorO += '<section id="bts" class="tab-content">';
                                            htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                            htmlInsideTabsConstructorO += '<div class="flex-table header" role="rowgroup">';
                                            htmlInsideTabsConstructorO += '<div title="Bookmakers" class="flex-row bookmakers" role="columnheader">Bookmakers</div>';
                                            htmlInsideTabsConstructorO += '<div title="Yes" class="flex-row oddWidth" role="columnheader">Yes</div>';
                                            htmlInsideTabsConstructorO += '<div title="No" class="flex-row oddWidth" role="columnheader">No</div>';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '<div class="table__body">';
                                            var btsyesno = '';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '</section>';

                                            htmlInsideTabsConstructorO += '<section id="ah" class="tab-content">';
                                            htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '</section>';

                                            var ahminus45 = [], ahminus4 = [], ahminus35 = [], ahminus3 = [], ahminus25 = [], ahminus2 = [], ahminus15 = [], ahminus1 = [], ahminus05 = [], ah0 = [], ahplus05 = [], ahplus1 = [], ahplus15 = [], ahplus2 = [], ahplus25 = [], ahplus3 = [], ahplus35 = [], ahplus4 = [], ahplus45 = [], ou05 = [], ou1 = [], ou15 = [], ou2 = [], ou25 = [], ou3 = [], ou35 = [], ou4 = [], ou45 = [], ou5 = [], ou55 = [];

                                            var asianHandicapArray = {
                                                'ah-4.5' : ahminus45 = [],
                                                'ah-4' : ahminus4 = [],
                                                'ah-3.5' : ahminus35 = [],
                                                'ah-3' : ahminus3 = [],
                                                'ah-2.5' : ahminus25 = [],
                                                'ah-2' : ahminus2 = [],
                                                'ah-1.5' : ahminus15 = [],
                                                'ah-1' : ahminus1 = [],
                                                'ah-0.5' : ahminus05 = [],
                                                'ah-0' : ah0 = [],
                                                'ah+0.5' : ahplus05 = [],
                                                'ah+1' : ahplus1 = [],
                                                'ah+1.5' : ahplus15 = [],
                                                'ah+2' : ahplus2 = [],
                                                'ah+2.5' : ahplus25 = [],
                                                'ah+3' : ahplus3 = [],
                                                'ah+3.5' : ahplus35 = [],
                                                'ah+4' : ahplus4 = [],
                                                'ah+4.5' : ahplus45 = [],
                                            };

                                            var overUnderArray = {
                                                '0.5' : ou05 = [],
                                                '1' : ou1 = [],
                                                '1.5' : ou15 = [],
                                                '2' : ou2 = [],
                                                '2.5' : ou25 = [],
                                                '3' : ou3 = [],
                                                '3.5' : ou35 = [],
                                                '4' : ou4 = [],
                                                '4.5' : ou45 = [],
                                                '5' : ou5 = [],
                                                '5.5' : ou55 = [],
                                            };

                                            $.each(res.result[matchId], function(key, value) {

                                                if(value['odd_1'] !== null || value['odd_x'] !== null || value['odd_2'] !== null) {
                                                    onextwo += '<div class="flex-table row" role="rowgroup">';
                                                    onextwo += '<div class="flex-row bookmakers" role="cell">' + ((typeof value.odd_bookmakers != 'undefined') ? value.odd_bookmakers : '' ) + '</div>';
                                                    onextwo += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.odd_1 != 'undefined') ? value.odd_1 : '' ) + '</div>';
                                                    onextwo += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.odd_x != 'undefined') ? value.odd_x : '' ) + '</div>';
                                                    onextwo += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.odd_2 != 'undefined') ? value.odd_2 : '' ) + '</div>';
                                                    onextwo += '</div>';
                                                }

                                                if(value['bts_no'] !== null || value['bts_yes'] !== null) {
                                                    btsyesno += '<div class="flex-table row" role="rowgroup">';
                                                    btsyesno += '<div class="flex-row bookmakers" role="cell">' + ((typeof value.odd_bookmakers != 'undefined') ? value.odd_bookmakers : '' ) + '</div>';
                                                    btsyesno += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.bts_yes != 'undefined') ? value.bts_yes : '' ) + '</div>';
                                                    btsyesno += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.bts_no != 'undefined') ? value.bts_no : '' ) + '</div>';
                                                    btsyesno += '</div>';
                                                }

                                                $.each(asianHandicapArray, function(key, values) {
                                                    if((typeof value[key + '_1'] !== 'undefined' && value[key + '_1'] !== null) || (typeof value[key + '_2'] !== 'undefined' && value[key + '_2'] !== null)){
                                                        whatToPush(values, value.odd_bookmakers, value[key + '_1'], value[key + '_2']);
                                                    }
                                                });

                                                $.each(overUnderArray, function(key, values) {
                                                    if((typeof value['o+' + key] !== 'undefined' && value['o+' + key] !== null) || (typeof value['u+' + key] !== 'undefined' && value['u+' + key] !== null)){
                                                        whatToPush(values, value.odd_bookmakers, value['o+' + key], value['u+' + key]);
                                                    }
                                                });

                                            });

                                            var asianHandicapData = {
                                                "Asian handicap -4.5" : ahminus45,
                                                "Asian handicap -4" : ahminus4,
                                                "Asian handicap -3.5" : ahminus35,
                                                "Asian handicap -3" : ahminus3,
                                                "Asian handicap -2.5" : ahminus25,
                                                "Asian handicap -2" : ahminus2,
                                                "Asian handicap -1.5" : ahminus15,
                                                "Asian handicap -1" : ahminus1,
                                                "Asian handicap -0.5" : ahminus05,
                                                "Asian handicap 0" : ah0,
                                                "Asian handicap +0.5" : ahplus05,
                                                "Asian handicap +1" : ahplus1,
                                                "Asian handicap +1.5" : ahplus15,
                                                "Asian handicap +2" : ahplus2,
                                                "Asian handicap +2.5" : ahplus25,
                                                "Asian handicap +3" : ahplus3,
                                                "Asian handicap +3.5" : ahplus35,
                                                "Asian handicap +4" : ahplus4,
                                                "Asian handicap +4.5" : ahplus45
                                            };

                                            var allHandicaps = '';

                                            $.each(asianHandicapData, function(key, value) {
                                                if(value != ''){
                                                    allHandicaps += '<div class="flex-table header" role="rowgroup">';
                                                    allHandicaps += '<div title="'+key+'" class="flex-row bookmakers" role="columnheader">'+key+'</div>';
                                                    allHandicaps += '<div title="Home" class="flex-row oddWidth" role="columnheader">Home</div>';
                                                    allHandicaps += '<div title="Away" class="flex-row oddWidth" role="columnheader">Away</div>';
                                                    allHandicaps += '</div>';
                                                    allHandicaps += '<div class="table__body">';
                                                    $.each(value, function(keys, values) {
                                                        allHandicaps += '<div class="flex-table row" role="rowgroup">';
                                                        allHandicaps += '<div class="flex-row bookmakers" role="cell">' + values.bookmaker + '</div>';
                                                        allHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.one + '</div>';
                                                        allHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.two + '</div>';
                                                        allHandicaps += '</div>';
                                                    });
                                                    allHandicaps += '</div>';
                                                }
                                            });

                                            var ouData = {
                                                "Over/Under +0.5" : ou05,
                                                "Over/Under +1" : ou1,
                                                "Over/Under +1.5" : ou15,
                                                "Over/Under +2" : ou2,
                                                "Over/Under +2.5" : ou25,
                                                "Over/Under +3" : ou3,
                                                "Over/Under +3.5" : ou35,
                                                "Over/Under +4" : ou4,
                                                "Over/Under +4.5" : ou45,
                                                "Over/Under +5" : ou5,
                                                "Over/Under +5.5" : ou55
                                            };

                                            var allou = '';

                                            $.each(ouData, function(key, value) {
                                                if(value != ''){
                                                    allou += '<div class="flex-table header" role="rowgroup">';
                                                    allou += '<div title="'+key+'" class="flex-row bookmakers" role="columnheader">'+key+'</div>';
                                                    allou += '<div title="Over" class="flex-row oddWidth" role="columnheader">Over</div>';
                                                    allou += '<div title="Under" class="flex-row oddWidth" role="columnheader">Under</div>';
                                                    allou += '</div>';
                                                    allou += '<div class="table__body">';
                                                    $.each(value, function(keys, values) {
                                                        allou += '<div class="flex-table row" role="rowgroup">';
                                                        allou += '<div class="flex-row bookmakers" role="cell">' + values.bookmaker + '</div>';
                                                        allou += '<div class="flex-row oddWidth" role="cell">' + values.one + '</div>';
                                                        allou += '<div class="flex-row oddWidth" role="cell">' + values.two + '</div>';
                                                        allou += '</div>';
                                                    });
                                                    allou += '</div>';
                                                }
                                            });

                                            htmlInsideTabsConstructorO += '</div>';
                                            $('#matchOdds .tab-container').append(htmlInsideTabsConstructorO);
                                            $('#matchOdds .nav-tab-wrapper').prepend(htmlConstructorO);

                                            if(onextwo.length > 0){
                                                $('#1x2 .tablele-container .table__body').append(onextwo);
                                            } else {
                                                $('#1x2 .tablele-container .table__body').append('<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>');
                                            }

                                            if(btsyesno.length > 0){
                                                $('#bts .tablele-container .table__body').append(btsyesno);
                                            } else {
                                                $('#bts .tablele-container .table__body').append('<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>');
                                            }

                                            if(allHandicaps.length > 0){
                                                $('#ah .tablele-container').append(allHandicaps);
                                            } else {
                                                $('#ah .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Asian handicap" class="flex-row bookmakers" role="columnheader">Asian handicap</div><div title="1" class="flex-row oddWidth" role="columnheader">1</div><div title="2" class="flex-row oddWidth" role="columnheader">2</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                            }

                                            if(allou.length > 0){
                                                $('#ou .tablele-container').append(allou);
                                            } else {
                                                $('#ou .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Over/Under" class="flex-row bookmakers" role="columnheader">Over/Under</div><div title="Over" class="flex-row oddWidth" role="columnheader">Over</div><div title="Under" class="flex-row oddWidth" role="columnheader">Under</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                            }

                                            // Switching tabs on click
                                            $('#matchOdds .nav-tab').unbind('click').on('click', function(e) {
                                                e.preventDefault();
                                                //Toggle tab link
                                                $(this).addClass('nav-tab-active').siblings().removeClass('nav-tab-active');
                                                //Toggle target tab
                                                $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                            });
                                        }
                                    } else {
                                        $('#matchOdds .tab-container').addClass('lineForNoData').prepend('<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>');
                                    }
                                });
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match Prediction section
                                htmlConstructor += '<section id="matchPredictions" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';

                                // Send server request for Standings
                                $.ajax({
                                    url: matchResultsDetailsAjaxURL,
                                    cache: false,
                                    data: {
                                        met: 'Probabilities',
                                        widgetKey: widgetKey,
                                        from: sessionStorage.getItem('fixturesDate'),
                                        to: sessionStorage.getItem('fixturesDate'),
                                        matchId: matchId
                                    },
                                    dataType: 'json'
                                }).done(function(res) {

                                    console.log(res)
                                    // If server send results hide loading
                                    $('.loading').hide();

                                    if(!res.error){
                                        if(res.result) {
                                            $('.d-none-tab-prediction').removeClass('d-none-tab-prediction');

                                            var htmlInsideTabsConstructorP = '<div class="nav-tab-wrapper">';
                                            var htmlConstructorO = '<a href="#p1x2" class="standing-h2 nav-tab nav-tab-active">1x2</a>';
                                            htmlConstructorO += '<a href="#pdc" class="standing-h2 nav-tab">Double Chance</a>';
                                            htmlConstructorO += '<a href="#pah" class="standing-h2 nav-tab">Asian Handicap</a>';
                                            htmlConstructorO += '<a href="#pou" class="standing-h2 nav-tab">O/U</a>';
                                            htmlConstructorO += '<a href="#pbts" class="standing-h2 nav-tab">BTS</a>';

                                            htmlInsideTabsConstructorP += '<section id="p1x2" class="tab-content active">';
                                            htmlInsideTabsConstructorP += '<div class="tablele-container">';
                                            htmlInsideTabsConstructorP += '<div class="flex-table header" role="rowgroup">';
                                            htmlInsideTabsConstructorP += '<div title="" class="flex-row bookmakers" role="columnheader"></div>';
                                            htmlInsideTabsConstructorP += '<div title="1" class="flex-row oddWidth" role="columnheader">1</div>';
                                            htmlInsideTabsConstructorP += '<div title="X" class="flex-row oddWidth" role="columnheader">X</div>';
                                            htmlInsideTabsConstructorP += '<div title="2" class="flex-row oddWidth" role="columnheader">2</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '<div class="table__body">';
                                            if (res.result[0]['event_HW'] !== '' || res.result[0]['event_D'] !== '' || res.result[0]['event_AW'] !== '') {
                                                htmlInsideTabsConstructorP += '<div class="flex-table row" role="rowgroup">';
                                                htmlInsideTabsConstructorP += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_HW != 'undefined') ? res.result[0].event_HW : '') + '</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_D != 'undefined') ? res.result[0].event_D : '') + '</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_AW != 'undefined') ? res.result[0].event_AW : '') + '</div>';
                                                htmlInsideTabsConstructorP += '</div>';
                                            } else {
                                                htmlInsideTabsConstructorP += '<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>';
                                            }
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</section>';

                                            htmlInsideTabsConstructorP += '<section id="pdc" class="tab-content">';
                                            htmlInsideTabsConstructorP += '<div class="tablele-container">';
                                            htmlInsideTabsConstructorP += '<div class="flex-table header" role="rowgroup">';
                                            htmlInsideTabsConstructorP += '<div title="" class="flex-row bookmakers" role="columnheader"></div>';
                                            htmlInsideTabsConstructorP += '<div title="1" class="flex-row oddWidth" role="columnheader">1</div>';
                                            htmlInsideTabsConstructorP += '<div title="X" class="flex-row oddWidth" role="columnheader">X</div>';
                                            htmlInsideTabsConstructorP += '<div title="2" class="flex-row oddWidth" role="columnheader">2</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '<div class="table__body">';
                                            if (res.result[0]['event_HW_D'] !== '' || res.result[0]['event_HW_AW'] !== '' || res.result[0]['event_AW_D'] !== '') {
                                                htmlInsideTabsConstructorP += '<div class="flex-table row" role="rowgroup">';
                                                htmlInsideTabsConstructorP += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_HW_D != 'undefined') ? res.result[0].event_HW_D : '') + '</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_HW_AW != 'undefined') ? res.result[0].event_HW_AW : '') + '</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_AW_D != 'undefined') ? res.result[0].event_AW_D : '') + '</div>';
                                                htmlInsideTabsConstructorP += '</div>';
                                            } else {
                                                htmlInsideTabsConstructorP += '<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>';
                                            }
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</section>';

                                            htmlInsideTabsConstructorP += '<section id="pah" class="tab-content">';
                                            htmlInsideTabsConstructorP += '<div class="tablele-container">';

                                            var pasianHandicapData = {
                                                "Asian handicap -4.5": [{
                                                    home: res.result[0]['event_ah_h_-45'],
                                                    away: res.result[0]['event_ah_a_-45']
                                                }],
                                                "Asian handicap -3.5": [{
                                                    home: res.result[0]['event_ah_h_-35'],
                                                    away: res.result[0]['event_ah_a_-35']
                                                }],
                                                "Asian handicap -2.5": [{
                                                    home: res.result[0]['event_ah_h_-25'],
                                                    away: res.result[0]['event_ah_a_-25']
                                                }],
                                                "Asian handicap -1.5": [{
                                                    home: res.result[0]['event_ah_h_-15'],
                                                    away: res.result[0]['event_ah_a_-15']
                                                }],
                                                "Asian handicap -0.5": [{
                                                    home: res.result[0]['event_ah_h_-05'],
                                                    away: res.result[0]['event_ah_a_-05']
                                                }],
                                                "Asian handicap +0.5": [{
                                                    home: res.result[0]['event_ah_h_05'],
                                                    away: res.result[0]['event_ah_a_05']
                                                }],
                                                "Asian handicap +1.5": [{
                                                    home: res.result[0]['event_ah_h_15'],
                                                    away: res.result[0]['event_ah_a_15']
                                                }],
                                                "Asian handicap +2.5": [{
                                                    home: res.result[0]['event_ah_h_25'],
                                                    away: res.result[0]['event_ah_a_25']
                                                }],
                                                "Asian handicap +3.5": [{
                                                    home: res.result[0]['event_ah_h_35'],
                                                    away: res.result[0]['event_ah_a_35']
                                                }],
                                                "Asian handicap +4.5": [{
                                                    home: res.result[0]['event_ah_h_45'],
                                                    away: res.result[0]['event_ah_a_45']
                                                }]
                                            };

                                            var pallHandicaps = '';

                                            $.each(pasianHandicapData, function (key, value) {
                                                if (value != '') {
                                                    pallHandicaps += '<div class="flex-table header" role="rowgroup">';
                                                    pallHandicaps += '<div title="' + key + '" class="flex-row bookmakers" role="columnheader">' + key + '</div>';
                                                    pallHandicaps += '<div title="Home" class="flex-row oddWidth" role="columnheader">Home</div>';
                                                    pallHandicaps += '<div title="Away" class="flex-row oddWidth" role="columnheader">Away</div>';
                                                    pallHandicaps += '</div>';
                                                    pallHandicaps += '<div class="table__body">';
                                                    $.each(value, function (keys, values) {
                                                        pallHandicaps += '<div class="flex-table row" role="rowgroup">';
                                                        pallHandicaps += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                                        pallHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.home + '</div>';
                                                        pallHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.away + '</div>';
                                                        pallHandicaps += '</div>';
                                                    });
                                                    pallHandicaps += '</div>';
                                                }
                                            });

                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</section>';

                                            htmlInsideTabsConstructorP += '<section id="pou" class="tab-content">';
                                            htmlInsideTabsConstructorP += '<div class="tablele-container">';

                                            var pouData = {
                                                "Over/Under": [{
                                                    over: res.result[0]['event_O'],
                                                    under: res.result[0]['event_U']
                                                }],
                                                "Over/Under +1": [{
                                                    over: res.result[0]['event_O_1'],
                                                    under: res.result[0]['event_U_1']
                                                }],
                                                "Over/Under +3": [{
                                                    over: res.result[0]['event_O_3'],
                                                    under: res.result[0]['event_U_3']
                                                }]
                                            };

                                            var pallou = '';

                                            $.each(pouData, function (key, value) {
                                                if (value != '') {
                                                    pallou += '<div class="flex-table header" role="rowgroup">';
                                                    pallou += '<div title="' + key + '" class="flex-row bookmakers" role="columnheader">' + key + '</div>';
                                                    pallou += '<div title="Over" class="flex-row oddWidth" role="columnheader">Over</div>';
                                                    pallou += '<div title="Under" class="flex-row oddWidth" role="columnheader">Under</div>';
                                                    pallou += '</div>';
                                                    pallou += '<div class="table__body">';
                                                    $.each(value, function (keys, values) {
                                                        pallou += '<div class="flex-table row" role="rowgroup">';
                                                        pallou += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                                        pallou += '<div class="flex-row oddWidth" role="cell">' + values.over + '</div>';
                                                        pallou += '<div class="flex-row oddWidth" role="cell">' + values.under + '</div>';
                                                        pallou += '</div>';
                                                    });
                                                    pallou += '</div>';
                                                }
                                            });

                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</section>';

                                            htmlInsideTabsConstructorP += '<section id="pbts" class="tab-content">';
                                            htmlInsideTabsConstructorP += '<div class="tablele-container">';
                                            htmlInsideTabsConstructorP += '<div class="flex-table header" role="rowgroup">';
                                            htmlInsideTabsConstructorP += '<div title="" class="flex-row bookmakers" role="columnheader"></div>';
                                            htmlInsideTabsConstructorP += '<div title="Yes" class="flex-row oddWidth" role="columnheader">Yes</div>';
                                            htmlInsideTabsConstructorP += '<div title="No" class="flex-row oddWidth" role="columnheader">No</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '<div class="table__body">';
                                            if (res.result[0]['event_bts'] !== '' || res.result[0]['event_ots'] !== '') {
                                                htmlInsideTabsConstructorP += '<div class="flex-table row" role="rowgroup">';
                                                htmlInsideTabsConstructorP += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_bts != 'undefined') ? res.result[0].event_bts : '') + '</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_ots != 'undefined') ? res.result[0].event_ots : '') + '</div>';
                                                htmlInsideTabsConstructorP += '</div>';
                                            } else {
                                                htmlInsideTabsConstructorP += '<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>';
                                            }
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</section>';

                                            htmlInsideTabsConstructorP += '</div>';
                                            $('#matchPredictions .tab-container').append(htmlInsideTabsConstructorP);
                                            $('#matchPredictions .nav-tab-wrapper').prepend(htmlConstructorO);

                                            if (pallHandicaps.length > 0) {
                                                $('#pah .tablele-container').append(pallHandicaps);
                                            } else {
                                                $('#pah .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Asian handicap" class="flex-row bookmakers" role="columnheader">Asian handicap</div><div title="1" class="flex-row oddWidth" role="columnheader">1</div><div title="2" class="flex-row oddWidth" role="columnheader">2</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                            }

                                            if (pallou.length > 0) {
                                                $('#pou .tablele-container').append(pallou);
                                            } else {
                                                $('#pou .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Over/Under" class="flex-row bookmakers" role="columnheader">Over/Under</div><div title="Over" class="flex-row oddWidth" role="columnheader">Over</div><div title="Under" class="flex-row oddWidth" role="columnheader">Under</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                            }

                                            // Switching tabs on click
                                            $('#matchPredictions .nav-tab').unbind('click').on('click', function (e) {
                                                e.preventDefault();
                                                //Toggle tab link
                                                $(this).addClass('nav-tab-active').siblings().removeClass('nav-tab-active');
                                                //Toggle target tab
                                                $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                            });
                                        }
                                    } else {
                                        $('#matchPredictions .tab-container').addClass('lineForNoData').prepend('<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>');
                                    }
                                });
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                $('#matchResultsContentTable').append(htmlConstructor);

                                // Remove Fixture Date from local storage
                                sessionStorage.removeItem('fixturesDate');

                                // Added close button in HTML
                                $('#matchResultsContentTable').append('<p class="closeWindow">close window</p>');
                                // Added click function to close window
                                $('.closeWindow').click(function() {
                                    window.close();
                                });

                                // Switching tabs on click
                                $('.nav-tab').unbind('click').on('click', function(e) {
                                    e.preventDefault();
                                    //Toggle tab link
                                    $(this).addClass('nav-tab-active').parent().parent().siblings().find('a').removeClass('nav-tab-active');
                                    //Toggle target tab
                                    $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                });

                                // Added click function to header close window
                                $('.backButton').click(function() {
                                    window.close();
                                });

                            } else {

                                // If server send details for match we populate HTML
                                // Set key for Home Team
                                var hometeamKeyMain = res.result[0].home_team_key;
                                // Set key for Away Team
                                var awayteamKeyMain = res.result[0].away_team_key;

                                // Hide loading sreen
                                $('.loading').hide();

                                // Details for match
                                var otherMatchDetails = '<div class="otherMatchDetails">';
                                otherMatchDetails += '<div class="otherMatchDetailsInfos">';
                                otherMatchDetails += '<div class="leagueImg" style="background-image: url(\'' + (((leagueLogo == '') || (leagueLogo == 'null') || (leagueLogo == null) || (leagueLogo == 'https://apiv2.allsportsapi.com/logo/logo_leagues/-1')) ? 'img/no-img.png' : leagueLogo) + '\');"></div>';
                                otherMatchDetails += '<div>' + res.result[0].country_name + ': ' + res.result[0].league_name + '</div>';
                                otherMatchDetails += '</div>';
                                var formattedDate = new Date(res.result[0].event_date + "T00:00");
                                var d = formattedDate.getDate();
                                var m = formattedDate.getMonth() + 1;
                                var y = formattedDate.getFullYear();
                                otherMatchDetails += '<div>' + (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + '.' + y + ' ' + res.result[0].event_time + '</div>';
                                otherMatchDetails += '</div>';
                                $(matchResultsLocation).prepend(otherMatchDetails);
                                // Added click function to header close window
                                $('.backButton').click(function() {
                                    window.close();
                                });
                                // Add hook in HTML for Match Results Tab content infos
                                $(matchResultsLocation).append('<section id="matchResultsContentTable"></section>');
                                var htmlConstructor = '<div id="matchResultsDates">';
                                htmlConstructor += '<div id="matchResultsDatesTitle">';
                                if (res.result) {
                                    htmlConstructor += '<div class="event_home_team">';
                                    htmlConstructor += '<div class="event_home_team_part">';
                                    htmlConstructor += '<div class="event_home_team_part_img">';
                                    htmlConstructor += '<div class="image-style-for-flag" style="background-image: url(\'' + (((res.result[0].home_team_logo == '') || (res.result[0].home_team_logo == 'null') || (res.result[0].home_team_logo == null)) ? 'img/no-img.png' : res.result[0].home_team_logo) + '\');"></div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="event_home_team_part_name">';
                                    htmlConstructor += '<div>' + res.result[0].event_home_team + '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="event_info">';
                                    htmlConstructor += '<div class="event_info_score">';
                                    htmlConstructor += '<div>' + res.result[0].event_final_result + '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="event_info_status">';
                                    var removeNumericAdd = res.result[0].event_status.replace('+', '');
                                    htmlConstructor += '<div class="' + (($.isNumeric(removeNumericAdd) || (removeNumericAdd == 'Half Time')) ? 'matchIsLive' : '') + '"> ' + (($.isNumeric(removeNumericAdd) || (removeNumericAdd == 'Half Time')) ? res.result[0].event_status + ((removeNumericAdd == 'Half Time') ? '' : '\'') : res.result[0].event_status) + '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="event_away_team_part">';
                                    htmlConstructor += '<div class="event_away_team_part_img">';
                                    htmlConstructor += '<div class="image-style-for-flag" style="background-image: url(\'' + (((res.result[0].away_team_logo == '') || (res.result[0].away_team_logo == 'null') || (res.result[0].away_team_logo == null)) ? 'img/no-img.png' : res.result[0].away_team_logo) + '\');"></div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="event_away_team_part_name">';
                                    htmlConstructor += '<div>' + res.result[0].event_away_team + '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</div>';
                                }
                                htmlConstructor += '</div>';
                                htmlConstructor += '<div class="nav-tab-wrapper-all">';
                                htmlConstructor += '<ul class="nav-tab-wrapper-all-container">';
                                htmlConstructor += '<li><span><a href="#matchSummary" class="matchResults-h2 nav-tab nav-tab-active">Match Summary</a></span></li>';
                                htmlConstructor += '<li><span><a href="#matchStatistics" class="matchResults-h2 nav-tab">Statistics</a></span></li>';
                                htmlConstructor += '<li><span><a href="#lineups" class="matchResults-h2 nav-tab">Lineups</a></span></li>';
                                htmlConstructor += '<li><span><a href="#matchh2h" class="matchResults-h2 nav-tab">H2H</a></span></li>';
                                // If league_round: contains "finals" then hide Standings Tab
                                htmlConstructor += ((res.result[0].league_round.indexOf('finals') != -1) ? '' : '<li><span><a href="#matchStandings" class="matchResults-h2 nav-tab">Standings</a></span></li>');
                                htmlConstructor += '<li><span><a href="#matchTopScorers" class="matchResults-h2 nav-tab">Top Scorers</a></span></li>';
                                htmlConstructor += '<li><span><a href="#matchOdds" class="matchResults-h2 nav-tab d-none-tab-odds">Odds</a></span></li>';
                                htmlConstructor += '<li><span><a href="#matchPredictions" class="matchResults-h2 nav-tab d-none-tab-prediction">Predictions</a></span></li>';
                                htmlConstructor += '</ul>';
                                htmlConstructor += '</div>';

                                // Populate Match Summary section
                                htmlConstructor += '<section id="matchSummary" class="tab-content active">';
                                htmlConstructor += '<div class="tab-container">';
                                var multipleArrays = [res.result[0].goalscorers, res.result[0].substitutes, res.result[0].cards];
                                var flatArray = [].concat.apply([], multipleArrays);
                                var nrArray = flatArray;
                                nrArray.sort(naturalCompare);
                                var newArray = {};
                                $.each(nrArray, function(key, value) {
                                  if (!newArray[value['info_time']]) {
                                    newArray[value['info_time']] = [];
                                  }
                                  newArray[value['info_time']].push(value);
                                });
                                var orderedNewArray = {
                                  '1st Half': newArray['1st Half'] ? newArray['1st Half'] : false,
                                  '2nd Half': newArray['2nd Half'] ? newArray['2nd Half'] : false,
                                  'Extra Time': newArray['Extra Time'] ? newArray['Extra Time'] : false,
                                  'Penalty': newArray['Penalty'] ? newArray['Penalty'] : false
                                };
                                if (nrArray.length == 0) {
                                    htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>';
                                } else {
                                    var htmlCC = 0;
                                    var htmlCC2 = 0;
                                    var first = true;
                                    $.each(orderedNewArray, function(key, valueSub) {
                                      if (valueSub) {
                                        if (first && key != '1st Half') {
                                                htmlConstructor += '<div class="lineupsTitle">1st Half</div>';
                                          htmlConstructor += '<div class="noHalfEvent">-</div>';
                                            }
                                        first = false;
                                        htmlConstructor += '<div class="lineupsTitle">'+key+'</div>';
                                        $.each(valueSub, function(key2, value) {
                                          if ((value.home_scorer || value.away_scorer || value.score_info) && value.score !== "substitution" && value.score ) {
                                              htmlConstructor += '<div class="' + ((value.home_scorer || value.score_info == 'home') ? 'action_home' : 'action_away') + '">' + ((value.home_scorer || value.score_info == 'home' ) ? value.time + '\'<div class="imgMatchSummary" style="background-image: url(img/ball.png);"></div>' + value.home_scorer : '') + ' ' + ((value.away_scorer || value.score_info == 'away' ) ? value.time + '\'' + '<div class="imgMatchSummary" style="background-image: url(img/ball.png);"></div>' + value.away_scorer : '') + '</div>';
                                            }
                                          if ((value.home_scorer == '') && (value.away_scorer == '') && value.score_info == '') {
                                                htmlConstructor += '<div class="action_unknown">' + (value.time + '\'<div class="imgMatchSummary" style="background-image: url(img/ball.png);"></div>') + '</div>';
                                            }
                                          if ((value.home_fault || value.away_fault || value.score_info) && !value.score) {
                                              htmlConstructor += '<div class="' + ((value.home_fault || value.score_info == 'home') ? 'action_home' : 'action_away') + '">' + ((value.home_fault || value.score_info == 'home') ? value.time + '\' ' + ((value.card == 'yellow card') ? '<div class="imgMatchSummary" style="background-image: url(img/yellow_card.svg);"></div>' : '<div class="imgMatchSummary" style="background-image: url(img/red_card.svg);"></div>') + ' ' + value.home_fault : '') + ' ' + ((value.away_fault || value.score_info == 'away') ? value.time + '\'' + ' ' + ((value.card == 'yellow card') ? '<div class="imgMatchSummary" style="background-image: url(img/yellow_card.svg);"></div>' : '<div class="imgMatchSummary" style="background-image: url(img/red_card.svg);"></div>') + ' ' + value.away_fault : '') + '</div>';
                                            }
                                          if ((value.home_fault == '') && (value.away_fault == '') && value.score_info == ''  && !value.score) {
                                                htmlConstructor += '<div class="action_unknown">' + ((value.card == 'yellow card') ? '<div class="imgMatchSummary" style="background-image: url(img/yellow_card.svg);"></div>' : '<div class="imgMatchSummary" style="background-image: url(img/red_card.svg);"></div>') + '</div>';
                                            }
                                            if (value.score === "substitution") {
                                                htmlConstructor += '<div class="' + ((value.home_scorer.in) ? 'action_home' : 'action_away') + '">' + ((value.home_scorer.in) ? value.time + '\'<div class="imgMatchSummary" style="background-image: url(img/match_green.png);"></div>' + value.home_scorer.in + '<div class="imgMatchSummary" style="background-image: url(img/match_red.png);"></div>' + value.home_scorer.out : '') + ' ' + ((value.away_scorer.in) ? value.time + '\'' + '<div class="imgMatchSummary" style="background-image: url(img/match_green.png);"></div>' + value.away_scorer.in + '<div class="imgMatchSummary" style="background-image: url(img/match_red.png);"></div>' + value.away_scorer.out : '') + '</div>';
                                            }
                                        });
                                        }
                                    });
                                htmlConstructor += '</div>';
                                }
                                if ((res.result[0].event_referee != '') || (res.result[0].event_stadium != '')) {
                                    htmlConstructor += '<div>';
                                    htmlConstructor += '<div class="matchExtraInfosTitle">Match Information</div>';
                                    htmlConstructor += '<div class="matchExtraInfos">' + ((res.result[0].event_referee != '') ? 'Referee: ' + res.result[0].event_referee : '') + ' ' + ((res.result[0].event_stadium != '') ? 'Stadium: ' + res.result[0].event_stadium : '') + '</div>';
                                    htmlConstructor += '</div>';
                                }
                                htmlConstructor += '</section>';

                                // Populate Match Statistics section
                                htmlConstructor += '<section id="matchStatistics" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';
                                if (res.result[0].statistics.length == 0) {
                                    htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>';
                                } else {
                                    $.each(res.result[0].statistics, function(key, value) {
                                        if (JSON.stringify(value).indexOf('%') > -1) {
                                            htmlConstructor += '<div class="matchStatisticsRow">';
                                            htmlConstructor += '<div class="matchStatisticsRowText">';
                                            htmlConstructor += '<div class="matchStatisticsRowHome">' + value.home + '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowType">' + value.type + '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowAway">' + value.away + '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowBar">';
                                            htmlConstructor += '<div class="matchStatisticsRowBarHome">';
                                            htmlConstructor += '<div class="matchStatisticsRowBarHomeBg">';
                                            htmlConstructor += '<div class="matchStatisticsRowHomeLine" style="width:' + value.home + ';background-color:' + ((value.home > value.away) ? 'red' : '') + ';"></div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowBarAway">';
                                            htmlConstructor += '<div class="matchStatisticsRowBarAwayBg">';
                                            htmlConstructor += '<div class="matchStatisticsRowAwayLine" style="width:' + value.away + ';background-color:' + ((value.away > value.home) ? 'red' : '') + ';"></div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                        } else {
                                            var x = parseInt(value.home) + parseInt(value.away);
                                            var xx = 100 / x;
                                            var tt = xx * value.home;
                                            var vv = xx * value.away;
                                            htmlConstructor += '<div class="matchStatisticsRow">';
                                            htmlConstructor += '<div class="matchStatisticsRowText">';
                                            htmlConstructor += '<div class="matchStatisticsRowHome">' + value.home + '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowType">' + value.type + '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowAway">' + value.away + '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowBar">';
                                            htmlConstructor += '<div class="matchStatisticsRowBarHome">';
                                            htmlConstructor += '<div class="matchStatisticsRowBarHomeBg">';
                                            htmlConstructor += '<div class="matchStatisticsRowHomeLine" style="width:' + tt + '%;background-color:' + ((tt > vv) ? 'red' : '') + ';"></div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '<div class="matchStatisticsRowBarAway">';
                                            htmlConstructor += '<div class="matchStatisticsRowBarAwayBg">';
                                            htmlConstructor += '<div class="matchStatisticsRowAwayLine" style="width:' + vv + '%;background-color:' + ((vv > tt) ? 'red' : '') + ';"></div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                            htmlConstructor += '</div>';
                                        }
                                    });
                                }
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match Lineups section
                                htmlConstructor += '<section id="lineups" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';
                                htmlConstructor += '<div class="lineupsTitle">Starting Lineups</div>';
                                htmlConstructor += '<div class="lineupsContainer">';
                                if ((res.result[0].lineups.home_team.starting_lineups.length == 0) || (res.result[0].lineups.away_team.starting_lineups.length == 0)) {
                                    htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px;">Sorry, no data!</p>';
                                } else {
                                    htmlConstructor += '<div class="col-left">';
                                    $.each(res.result[0].lineups.home_team.starting_lineups, function(key, value) {
                                        htmlConstructor += '<div class="lineupsContainerHome"><div class="lineupsNb">' + ((value.player_number == '-1' ? ' ' : value.player_number)) + '</div> <div class="lineupsFlag" style="background-image: url(\'' + res.result[0].home_team_logo + '\');"></div> <div class="lineupsPlayer">' + value.player + '</div></div>';
                                    });
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="col-right">';
                                    $.each(res.result[0].lineups.away_team.starting_lineups, function(key, value) {
                                        htmlConstructor += '<div class="lineupsContainerAway"><div class="lineupsPlayer">' + value.player + '</div> <div class="lineupsFlag" style="background-image: url(\'' + res.result[0].away_team_logo + '\');"></div> <div class="lineupsNb">' + ((value.player_number == '-1' ? ' ' : value.player_number)) + '</div></div>';
                                    });
                                    htmlConstructor += '</div>';
                                }
                                htmlConstructor += '</div>';

                                // Populate Match Substitutes section
                                htmlConstructor += '<div class="lineupsTitle">Substitutes</div>';
                                htmlConstructor += '<div class="lineupsContainer">';
                                if ((res.result[0].lineups.home_team.substitutes.length == 0) || (res.result[0].lineups.away_team.substitutes.length == 0)) {
                                    htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px;">Sorry, no data!</p>';
                                } else {
                                    htmlConstructor += '<div class="col-left">';
                                    $.each(res.result[0].lineups.home_team.substitutes, function(key, value) {
                                        htmlConstructor += '<div class="lineupsContainerHome"><div class="lineupsNb">' + ((value.player_number == '-1' ? ' ' : value.player_number)) + '</div> <div class="lineupsFlag" style="background-image: url(\'' + res.result[0].home_team_logo + '\');"></div> <div class="lineupsPlayer">' + value.player + '</div></div>';
                                    });
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="col-right">';
                                    $.each(res.result[0].lineups.away_team.substitutes, function(key, value) {
                                        htmlConstructor += '<div class="lineupsContainerAway"><div class="lineupsPlayer">' + value.player + '</div> <div class="lineupsFlag" style="background-image: url(\'' + res.result[0].away_team_logo + '\');"></div> <div class="lineupsNb">' + ((value.player_number == '-1' ? ' ' : value.player_number)) + '</div></div>';
                                    });
                                    htmlConstructor += '</div>';
                                }
                                htmlConstructor += '</div>';
                                htmlConstructor += '<div class="lineupsTitle">Coaches</div>';
                                htmlConstructor += '<div class="lineupsContainer">';
                                if ((res.result[0].lineups.home_team.coaches.length == 0) || (res.result[0].lineups.away_team.coaches.length == 0)) {
                                    htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px;">Sorry, no data!</p>';
                                } else {
                                    htmlConstructor += '<div class="col-left">';
                                    $.each(res.result[0].lineups.home_team.coaches, function(key, value) {
                                        htmlConstructor += '<div class="lineupsContainerHome"><div class="lineupsNb"></div> <div class="lineupsFlag" style="background-image: url(\'' + res.result[0].home_team_logo + '\');"></div> <div class="lineupsPlayer">' + value.coache + '</div></div>';
                                    });
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '<div class="col-right">';
                                    $.each(res.result[0].lineups.away_team.coaches, function(key, value) {
                                        htmlConstructor += '<div class="lineupsContainerAway"><div class="lineupsPlayer">' + value.coache + '</div> <div class="lineupsFlag" style="background-image: url(\'' + res.result[0].away_team_logo + '\');"></div> <div class="lineupsNb"></div></div>';
                                    });
                                    htmlConstructor += '</div>';
                                }
                                htmlConstructor += '</div>';
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match H2H (Head to head) section
                                htmlConstructor += '<section id="matchh2h" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';
                                var htmlInsideTabsConstructorh2h = '';
                                // Send server request for H2H
                                $.ajax({
                                    url: matchResultsDetailsAjaxURL,
                                    cache: false,
                                    data: {
                                        met: 'H2H',
                                        widgetKey: widgetKey,
                                        firstTeamId: res.result[0].home_team_key,
                                        secondTeamId: res.result[0].away_team_key
                                    },
                                    dataType: 'json'
                                }).done(function(res2) {
                                    // If server send results we populate HTML with sended information
                                    if(!res2.error){
                                        htmlInsideTabsConstructorh2h += '<div class="flex-table header">';
                                        htmlInsideTabsConstructorh2h += '<div title="hh22hh" class="flex-row matchh2hHeader fix-width" role="columnheader">Last matches: ' + res.result[0].event_home_team + '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorh2h += '<div class="table__body">';
                                        $.each(res2.result.firstTeamResults, function(key, value) {
                                            var event_final_result_class_var = value.event_final_result;
                                            var event_final_result_class = event_final_result_class_var.replace(/:/g, '-');
                                            var event_final_result_class_away = $.trim(event_final_result_class.substr(event_final_result_class.indexOf("-") + 1));
                                            var event_final_result_class_home = $.trim(event_final_result_class.substr(0, event_final_result_class.indexOf('-')));
                                            var formattedDate = new Date(value.event_date + "T00:00");
                                            var d = formattedDate.getDate();
                                            var m = formattedDate.getMonth() + 1;
                                            var y = formattedDate.getFullYear().toString().substr(-2);
                                            var value_country_name = value.country_name.toString().toLowerCase();
                                            htmlInsideTabsConstructorh2h += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hDate" role="cell">' + (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + '.' + y + '</div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hFlags" role="cell"><div class="matchh2hFlag" style="background-image: url(\'' + (((leagueLogo == '') || (leagueLogo == 'null') || (leagueLogo == null) || (leagueLogo == 'https://apiv2.allsportsapi.com/logo/logo_leagues/-1')) ? 'img/no-img.png' : leagueLogo) + '\');"></div></div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row countryNameStyle" role="cell">' + value_country_name + '</div>';
                                            if (event_final_result_class_home > event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerHome flex-row fix-width ' + (((res.result[0].event_home_team == value.event_home_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width ' + (((res.result[0].event_home_team == value.event_away_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_away_team + '</div>';
                                            } else if (event_final_result_class_home < event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width ' + (((res.result[0].event_home_team == value.event_home_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerAway flex-row fix-width ' + (((res.result[0].event_home_team == value.event_away_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_away_team + '</div>';
                                            } else if (event_final_result_class_home == event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width ' + (((res.result[0].event_home_team == value.event_home_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width ' + (((res.result[0].event_home_team == value.event_away_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_away_team + '</div>';
                                            }
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hEventFinalResult" role="cell">' + event_final_result_class + '</div>';
                                            htmlInsideTabsConstructorh2h += '</div>';
                                        });
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="flex-table header">';
                                        htmlInsideTabsConstructorh2h += '<div title="hh22hh" class="flex-row matchh2hHeader fix-width" role="columnheader">Last matches: ' + res.result[0].event_away_team + '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorh2h += '<div class="table__body">';
                                        $.each(res2.result.secondTeamResults, function(key, value) {
                                            var event_final_result_class_var = value.event_final_result;
                                            var event_final_result_class = event_final_result_class_var.replace(/:/g, '-');
                                            var event_final_result_class_away = $.trim(event_final_result_class.substr(event_final_result_class.indexOf("-") + 1));
                                            var event_final_result_class_home = $.trim(event_final_result_class.substr(0, event_final_result_class.indexOf('-')));
                                            var formattedDate = new Date(value.event_date + "T00:00");
                                            var d = formattedDate.getDate();
                                            var m = formattedDate.getMonth() + 1;
                                            var y = formattedDate.getFullYear().toString().substr(-2);
                                            var value_country_name = value.country_name.toString().toLowerCase();
                                            htmlInsideTabsConstructorh2h += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hDate" role="cell">' + (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + '.' + y + '</div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hFlags" role="cell"><div class="matchh2hFlag" style="background-image: url(\'' + (((leagueLogo == '') || (leagueLogo == 'null') || (leagueLogo == null) || (leagueLogo == 'https://apiv2.allsportsapi.com/logo/logo_leagues/-1')) ? 'img/no-img.png' : leagueLogo) + '\');"></div></div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row countryNameStyle" role="cell">' + value_country_name + '</div>';
                                            if (event_final_result_class_home > event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerHome flex-row fix-width ' + (((res.result[0].event_away_team == value.event_home_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width ' + (((res.result[0].event_away_team == value.event_away_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_away_team + '</div>';
                                            } else if (event_final_result_class_home < event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width ' + (((res.result[0].event_away_team == value.event_home_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerAway flex-row fix-width ' + (((res.result[0].event_away_team == value.event_away_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_away_team + '</div>';
                                            } else if (event_final_result_class_home == event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width ' + (((res.result[0].event_away_team == value.event_home_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width ' + (((res.result[0].event_away_team == value.event_away_team)) ? 'selectedMatchH2H' : '') + '" role="cell">' + value.event_away_team + '</div>';
                                            }
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hEventFinalResult" role="cell">' + event_final_result_class + '</div>';
                                            htmlInsideTabsConstructorh2h += '</div>';
                                        });
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="flex-table header">';
                                        htmlInsideTabsConstructorh2h += '<div title="hh22hh" class="flex-row matchh2hHeader fix-width" role="columnheader">Head-to-head matches: ' + res.result[0].event_home_team + ' - ' + res.result[0].event_away_team + '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorh2h += '<div class="table__body">';
                                        $.each(res2.result.H2H, function(key, value) {
                                            var event_final_result_class_var = value.event_final_result;
                                            var event_final_result_class = event_final_result_class_var.replace(/:/g, '-');
                                            var event_final_result_class_away = $.trim(event_final_result_class.substr(event_final_result_class.indexOf("-") + 1));
                                            var event_final_result_class_home = $.trim(event_final_result_class.substr(0, event_final_result_class.indexOf('-')));
                                            var formattedDate = new Date(value.event_date + "T00:00");
                                            var d = formattedDate.getDate();
                                            var m = formattedDate.getMonth() + 1;
                                            var y = formattedDate.getFullYear().toString().substr(-2);
                                            var value_country_name = value.country_name.toString().toLowerCase();
                                            htmlInsideTabsConstructorh2h += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hDate" role="cell">' + (d < 10 ? '0' + d : d) + '.' + (m < 10 ? '0' + m : m) + '.' + y + '</div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hFlags" role="cell"><div class="matchh2hFlag" style="background-image: url(\'' + (((leagueLogo == '') || (leagueLogo == 'null') || (leagueLogo == null) || (leagueLogo == 'https://apiv2.allsportsapi.com/logo/logo_leagues/-1')) ? 'img/no-img.png' : leagueLogo) + '\');"></div></div>';
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row countryNameStyle" role="cell">' + value_country_name + '</div>';
                                            if (event_final_result_class_home > event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerHome flex-row fix-width" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width" role="cell">' + value.event_away_team + '</div>';
                                            } else if (event_final_result_class_home < event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="flex-row fix-width" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hWinnerAway flex-row fix-width" role="cell">' + value.event_away_team + '</div>';
                                            } else if (event_final_result_class_home == event_final_result_class_away) {
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width" role="cell">' + value.event_home_team + '</div>';
                                                htmlInsideTabsConstructorh2h += '<div class="teamClassStyleH2hEqual flex-row fix-width" role="cell">' + value.event_away_team + '</div>';
                                            }
                                            htmlInsideTabsConstructorh2h += '<div class="flex-row matchh2hEventFinalResult" role="cell">' + event_final_result_class + '</div>';
                                            htmlInsideTabsConstructorh2h += '</div>';
                                        });
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        htmlInsideTabsConstructorh2h += '</div>';
                                        $('#matchh2h .tab-container').append(htmlInsideTabsConstructorh2h);
                                    } else {
                                        htmlInsideTabsConstructorh2h += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>';
                                        $('#matchh2h .tab-container').append(htmlInsideTabsConstructorh2h);
                                    }
                                });
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match Top Scorers section
                                htmlConstructor += '<section id="matchTopScorers" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';
                                var htmlInsideTabsConstructorTS = '';
                                // Send server request for Topscorers
                                $.ajax({
                                    url: matchResultsDetailsAjaxURL,
                                    cache: false,
                                    data: {
                                        met: 'Topscorers',
                                        widgetKey: widgetKey,
                                        leagueId: res.result[0].league_key
                                    },
                                    dataType: 'json'
                                }).done(function(res) {
                                    // If server send results we populate HTML with sended information
                                    if (res.result) {
                                        htmlInsideTabsConstructorTS += '<div class="tablele-container">';
                                        htmlInsideTabsConstructorTS += '<div class="flex-table header">';
                                        htmlInsideTabsConstructorTS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                        htmlInsideTabsConstructorTS += '<div title="Player" class="flex-row players" role="columnheader">Player</div>';
                                        htmlInsideTabsConstructorTS += '<div title="Team" class="flex-row playerTeam fix-width" role="columnheader">Team</div>';
                                        htmlInsideTabsConstructorTS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                        htmlInsideTabsConstructorTS += '</div>';
                                        htmlInsideTabsConstructorTS += '<div class="table__body">';
                                        $.each(res.result, function(key, value) {
                                            htmlInsideTabsConstructorTS += '<div class="flex-table row" role="rowgroup">';
                                            htmlInsideTabsConstructorTS += '<div class="flex-row first fix-width" role="cell">' + value.player_place + '.</div>';
                                            htmlInsideTabsConstructorTS += '<div class="flex-row players" role="cell"><a href="#">' + value.player_name + '</a></div>';
                                            htmlInsideTabsConstructorTS += '<div class="flex-row playerTeam" role="cell"><a href="#">' + value.team_name + '</a></div>';
                                            htmlInsideTabsConstructorTS += '<div class="flex-row goals fix-width" role="cell">' + value.goals + '</div>';
                                            htmlInsideTabsConstructorTS += '</div>';
                                        });
                                        htmlInsideTabsConstructorTS += '</div>';
                                        htmlInsideTabsConstructorTS += '</div>';
                                    } else {
                                        htmlInsideTabsConstructorTS += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>';
                                    }
                                    $('#matchTopScorers .tab-container').append(htmlInsideTabsConstructorTS);
                                });
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match Standings section
                                // If league_round: contains "finals" then hide Standings Tab
                                if (res.result[0].league_round.indexOf('finals') == -1) {
                                    htmlConstructor += '<section id="matchStandings" class="tab-content">';
                                    htmlConstructor += '<div class="tab-container">';
                                    // Send server request for Standings
                                    $.ajax({
                                        url: matchResultsDetailsAjaxURL,
                                        cache: false,
                                        data: {
                                            met: 'Standings',
                                            widgetKey: widgetKey,
                                            leagueId: res.result[0].league_key,
                                            stageKey: res.result[0].fk_stage_key
                                        },
                                        dataType: 'json'
                                    }).done(function (res) {
                                        // If server send results hide loading
                                        $('.loading').hide();
                                        var htmlInsideTabsConstructorS = '<div class="nav-tab-wrapper">';
                                        var firstElementInJson = 0;
                                        var htmlConstructorS = '';
                                        $.each(res.result, function (key, value) {
                                            var sorted = sortByKey(res.result[key], 'key');
                                            var sorted_array = sortByKeyAsc(sorted, "league_round");
                                            var groubedByTeam = groupBy(sorted_array, 'league_round');
                                            var leagueRoundMatchResult = '';
                                            var leagueRoundName = '';
                                            $.each(groubedByTeam, function (keyss, valuess) {
                                                $.each(valuess, function (keyssss, valuessss) {
                                                    if (valuessss.team_key == hometeamKeyMain) {
                                                        leagueRoundName = valuessss.league_round;
                                                        leagueRoundMatchResult = valuessss.league_round;
                                                    }
                                                });
                                            });
                                            var onlySelectedGroup = groubedByTeam[leagueRoundMatchResult];
                                            if (firstElementInJson == 0) {
                                                htmlConstructorS += '<a href="#' + key + '" class="standing-h2 nav-tab nav-tab-active">' + key + '</a>';
                                                htmlInsideTabsConstructorS += '<section id="' + key + '" class="tab-content active">';
                                                htmlInsideTabsConstructorS += '<div class="tablele-container">';
                                                if ($.isEmptyObject(onlySelectedGroup)) {
                                                    htmlInsideTabsConstructorS += '<div class="flex-table header" role="rowgroup">';
                                                    htmlInsideTabsConstructorS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Team" class="flex-row teams" role="columnheader">Team</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '<div class="table__body">';
                                                    htmlInsideTabsConstructorS += '<div class="flex-table-error row" role="rowgroup">';
                                                    htmlInsideTabsConstructorS += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                } else {
                                                    htmlInsideTabsConstructorS += '<div class="flex-table header">';
                                                    htmlInsideTabsConstructorS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                                    htmlInsideTabsConstructorS += '<div title="' + ((!leagueRoundName) ? "Team" : leagueRoundName) + '" class="flex-row teams" role="columnheader">' + ((!leagueRoundName) ? "Team" : leagueRoundName) + '</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '<div class="table__body">';
                                                    var colorForStanding = ['colorOne', 'colorTwo', 'colorThree', 'colorFour', 'colorFive', 'colorSix', 'colorSeven', 'colorEight', 'colorNine', 'colorTen'];
                                                    var colorStringValue = -1;
                                                    var stringToCompareStandings = '';
                                                    $.each(onlySelectedGroup, function (keys, values) {
                                                        htmlInsideTabsConstructorS += '<div class="flex-table row" role="rowgroup">';
                                                        if (values.standing_place_type) {
                                                            if (stringToCompareStandings != values.standing_place_type) {
                                                                stringToCompareStandings = values.standing_place_type;
                                                                colorStringValue++;
                                                                colorForStanding[colorStringValue];
                                                                htmlInsideTabsConstructorS += '<div class="flex-row first-sticky fix-width ' + colorForStanding[colorStringValue] + '" title="' + values.standing_place_type + '" role="cell">' + values.standing_place + '.</div>';
                                                            } else if (stringToCompareStandings == values.standing_place_type) {
                                                                colorForStanding[colorStringValue];
                                                                htmlInsideTabsConstructorS += '<div class="flex-row first-sticky fix-width ' + colorForStanding[colorStringValue] + '" title="' + values.standing_place_type + '" role="cell">' + values.standing_place + '.</div>';
                                                            }
                                                        } else if (!values.standing_place_type) {
                                                            colorStringValue = $(colorForStanding).length / 2;
                                                            htmlInsideTabsConstructorS += '<div class="flex-row first-sticky fix-width ' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + '" role="cell">' + values.standing_place + '.</div>';
                                                        }
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row teams" role="cell"><a href="#" onclick="windowPreventOpening()">' + values.standing_team + '</a></div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_P + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_W + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_D + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_L + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row goals" role="cell">' + values.standing_F + ':' + values.standing_A + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_PTS + '</div>';
                                                        htmlInsideTabsConstructorS += '</div>';
                                                    });
                                                    htmlInsideTabsConstructorS += '</div>';
                                                }
                                                htmlInsideTabsConstructorS += '</div>';
                                                htmlInsideTabsConstructorS += '</section>';
                                                firstElementInJson++
                                            } else {
                                                htmlConstructorS += '<a href="#' + key + '" class="standing-h2 nav-tab">' + key + '</a>';
                                                htmlInsideTabsConstructorS += '<section id="' + key + '" class="tab-content">';
                                                htmlInsideTabsConstructorS += '<div class="tablele-container">';
                                                if ($.isEmptyObject(onlySelectedGroup)) {
                                                    htmlInsideTabsConstructorS += '<div class="flex-table header" role="rowgroup">';
                                                    htmlInsideTabsConstructorS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Team" class="flex-row teams" role="columnheader">Team</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '<div class="table__body">';
                                                    htmlInsideTabsConstructorS += '<div class="flex-table-error row" role="rowgroup">';
                                                    htmlInsideTabsConstructorS += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                } else {
                                                    htmlInsideTabsConstructorS += '<div class="flex-table header">';
                                                    htmlInsideTabsConstructorS += '<div title="Rank" class="flex-row first fix-width" role="columnheader">#</div>';
                                                    htmlInsideTabsConstructorS += '<div title="' + ((!leagueRoundName) ? "Team" : leagueRoundName) + '" class="flex-row teams" role="columnheader">' + ((!leagueRoundName) ? "Team" : leagueRoundName) + '</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Matches Played" class="flex-row fix-width" role="columnheader">MP</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Wins" class="flex-row fix-width" role="columnheader">W</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Draws" class="flex-row fix-width" role="columnheader">D</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Losses" class="flex-row fix-width" role="columnheader">L</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Goals" class="flex-row goals" role="columnheader">G</div>';
                                                    htmlInsideTabsConstructorS += '<div title="Points" class="flex-row fix-width" role="columnheader">Pts</div>';
                                                    htmlInsideTabsConstructorS += '</div>';
                                                    htmlInsideTabsConstructorS += '<div class="table__body">';
                                                    $.each(onlySelectedGroup, function (keys, values) {
                                                        htmlInsideTabsConstructorS += '<div class="flex-table row" role="rowgroup">';
                                                        htmlInsideTabsConstructorS += '<div class="flex-row first fix-width" role="cell">' + values.standing_place + '.</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row teams" role="cell"><a href="#" onclick="windowPreventOpening()">' + values.standing_team + '</a></div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_P + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_W + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_D + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_L + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row goals" role="cell">' + values.standing_F + ':' + values.standing_A + '</div>';
                                                        htmlInsideTabsConstructorS += '<div class="' + (((hometeamKeyMain == values.team_key) || (awayteamKeyMain == values.team_key)) ? 'selectedMatchStandings' : '') + ' flex-row fix-width" role="cell">' + values.standing_PTS + '</div>';
                                                        htmlInsideTabsConstructorS += '</div>';
                                                    });
                                                    htmlInsideTabsConstructorS += '</div>';
                                                }
                                                htmlInsideTabsConstructorS += '</div>';
                                                htmlInsideTabsConstructorS += '</section>';
                                            }
                                        });
                                        htmlInsideTabsConstructorS += '</div>';
                                        $('#matchStandings .tab-container').append(htmlInsideTabsConstructorS);
                                        $('#matchStandings .nav-tab-wrapper').prepend(htmlConstructorS);

                                        // Switching tabs on click
                                        $('#matchStandings .nav-tab').unbind('click').on('click', function (e) {
                                            e.preventDefault();
                                            //Toggle tab link
                                            $(this).addClass('nav-tab-active').siblings().removeClass('nav-tab-active');
                                            //Toggle target tab
                                            $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                        });
                                    });
                                    htmlConstructor += '</div>';
                                    htmlConstructor += '</section>';
                                }

                                // Populate Match Odds section
                                htmlConstructor += '<section id="matchOdds" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';

                                // Send server request for Standings
                                $.ajax({
                                    url: matchResultsDetailsAjaxURL,
                                    cache: false,
                                    data: {
                                        met: 'Odds',
                                        widgetKey: widgetKey,
                                        from: sessionStorage.getItem('fixturesDate'),
                                        to: sessionStorage.getItem('fixturesDate'),
                                        matchId: matchId
                                    },
                                    dataType: 'json'
                                }).done(function(res) {

                                    // If server send results hide loading
                                    $('.loading').hide();

                                    if(!res.error){
                                        if(res.result){

                                            $('.d-none-tab-odds').removeClass('d-none-tab-odds');

                                            var htmlInsideTabsConstructorO = '<div class="nav-tab-wrapper">';
                                            var htmlConstructorO = '<a href="#1x2" class="standing-h2 nav-tab nav-tab-active">1x2</a>';
                                            htmlConstructorO += '<a href="#ah" class="standing-h2 nav-tab">Asian Handicap</a>';
                                            htmlConstructorO += '<a href="#ou" class="standing-h2 nav-tab">O/U</a>';
                                            htmlConstructorO += '<a href="#bts" class="standing-h2 nav-tab">BTS</a>';

                                            htmlInsideTabsConstructorO += '<section id="1x2" class="tab-content active">';
                                            htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                            htmlInsideTabsConstructorO += '<div class="flex-table header" role="rowgroup">';
                                            htmlInsideTabsConstructorO += '<div title="Bookmakers" class="flex-row bookmakers" role="columnheader">Bookmakers</div>';
                                            htmlInsideTabsConstructorO += '<div title="1" class="flex-row oddWidth" role="columnheader">1</div>';
                                            htmlInsideTabsConstructorO += '<div title="X" class="flex-row oddWidth" role="columnheader">X</div>';
                                            htmlInsideTabsConstructorO += '<div title="2" class="flex-row oddWidth" role="columnheader">2</div>';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '<div class="table__body">';
                                            var onextwo = '';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '</section>';

                                            htmlInsideTabsConstructorO += '<section id="ou" class="tab-content">';
                                            htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '</section>';

                                            htmlInsideTabsConstructorO += '<section id="bts" class="tab-content">';
                                            htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                            htmlInsideTabsConstructorO += '<div class="flex-table header" role="rowgroup">';
                                            htmlInsideTabsConstructorO += '<div title="Bookmakers" class="flex-row bookmakers" role="columnheader">Bookmakers</div>';
                                            htmlInsideTabsConstructorO += '<div title="Yes" class="flex-row oddWidth" role="columnheader">Yes</div>';
                                            htmlInsideTabsConstructorO += '<div title="No" class="flex-row oddWidth" role="columnheader">No</div>';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '<div class="table__body">';
                                            var btsyesno = '';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '</section>';

                                            htmlInsideTabsConstructorO += '<section id="ah" class="tab-content">';
                                            htmlInsideTabsConstructorO += '<div class="tablele-container">';
                                            htmlInsideTabsConstructorO += '</div>';
                                            htmlInsideTabsConstructorO += '</section>';

                                            var ahminus45 = [], ahminus4 = [], ahminus35 = [], ahminus3 = [], ahminus25 = [], ahminus2 = [], ahminus15 = [], ahminus1 = [], ahminus05 = [], ah0 = [], ahplus05 = [], ahplus1 = [], ahplus15 = [], ahplus2 = [], ahplus25 = [], ahplus3 = [], ahplus35 = [], ahplus4 = [], ahplus45 = [], ou05 = [], ou1 = [], ou15 = [], ou2 = [], ou25 = [], ou3 = [], ou35 = [], ou4 = [], ou45 = [], ou5 = [], ou55 = [];

                                            var asianHandicapArray = {
                                                'ah-4.5' : ahminus45 = [],
                                                'ah-4' : ahminus4 = [],
                                                'ah-3.5' : ahminus35 = [],
                                                'ah-3' : ahminus3 = [],
                                                'ah-2.5' : ahminus25 = [],
                                                'ah-2' : ahminus2 = [],
                                                'ah-1.5' : ahminus15 = [],
                                                'ah-1' : ahminus1 = [],
                                                'ah-0.5' : ahminus05 = [],
                                                'ah-0' : ah0 = [],
                                                'ah+0.5' : ahplus05 = [],
                                                'ah+1' : ahplus1 = [],
                                                'ah+1.5' : ahplus15 = [],
                                                'ah+2' : ahplus2 = [],
                                                'ah+2.5' : ahplus25 = [],
                                                'ah+3' : ahplus3 = [],
                                                'ah+3.5' : ahplus35 = [],
                                                'ah+4' : ahplus4 = [],
                                                'ah+4.5' : ahplus45 = [],
                                            };

                                            var overUnderArray = {
                                                '0.5' : ou05 = [],
                                                '1' : ou1 = [],
                                                '1.5' : ou15 = [],
                                                '2' : ou2 = [],
                                                '2.5' : ou25 = [],
                                                '3' : ou3 = [],
                                                '3.5' : ou35 = [],
                                                '4' : ou4 = [],
                                                '4.5' : ou45 = [],
                                                '5' : ou5 = [],
                                                '5.5' : ou55 = [],
                                            };

                                            $.each(res.result[matchId], function(key, value) {

                                                if(value['odd_1'] !== null || value['odd_x'] !== null || value['odd_2'] !== null) {
                                                    onextwo += '<div class="flex-table row" role="rowgroup">';
                                                    onextwo += '<div class="flex-row bookmakers" role="cell">' + ((typeof value.odd_bookmakers != 'undefined') ? value.odd_bookmakers : '' ) + '</div>';
                                                    onextwo += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.odd_1 != 'undefined') ? value.odd_1 : '' ) + '</div>';
                                                    onextwo += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.odd_x != 'undefined') ? value.odd_x : '' ) + '</div>';
                                                    onextwo += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.odd_2 != 'undefined') ? value.odd_2 : '' ) + '</div>';
                                                    onextwo += '</div>';
                                                }

                                                if(value['bts_no'] !== null || value['bts_yes'] !== null) {
                                                    btsyesno += '<div class="flex-table row" role="rowgroup">';
                                                    btsyesno += '<div class="flex-row bookmakers" role="cell">' + ((typeof value.odd_bookmakers != 'undefined') ? value.odd_bookmakers : '' ) + '</div>';
                                                    btsyesno += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.bts_yes != 'undefined') ? value.bts_yes : '' ) + '</div>';
                                                    btsyesno += '<div class="flex-row oddWidth" role="cell">' + ((typeof value.bts_no != 'undefined') ? value.bts_no : '' ) + '</div>';
                                                    btsyesno += '</div>';
                                                }

                                                $.each(asianHandicapArray, function(key, values) {
                                                    if((typeof value[key + '_1'] !== 'undefined' && value[key + '_1'] !== null) || (typeof value[key + '_2'] !== 'undefined' && value[key + '_2'] !== null)){
                                                        whatToPush(values, value.odd_bookmakers, value[key + '_1'], value[key + '_2']);
                                                    }
                                                });

                                                $.each(overUnderArray, function(key, values) {
                                                    if((typeof value['o+' + key] !== 'undefined' && value['o+' + key] !== null) || (typeof value['u+' + key] !== 'undefined' && value['u+' + key] !== null)){
                                                        whatToPush(values, value.odd_bookmakers, value['o+' + key], value['u+' + key]);
                                                    }
                                                });

                                            });

                                            var asianHandicapData = {
                                                "Asian handicap -4.5" : ahminus45,
                                                "Asian handicap -4" : ahminus4,
                                                "Asian handicap -3.5" : ahminus35,
                                                "Asian handicap -3" : ahminus3,
                                                "Asian handicap -2.5" : ahminus25,
                                                "Asian handicap -2" : ahminus2,
                                                "Asian handicap -1.5" : ahminus15,
                                                "Asian handicap -1" : ahminus1,
                                                "Asian handicap -0.5" : ahminus05,
                                                "Asian handicap 0" : ah0,
                                                "Asian handicap +0.5" : ahplus05,
                                                "Asian handicap +1" : ahplus1,
                                                "Asian handicap +1.5" : ahplus15,
                                                "Asian handicap +2" : ahplus2,
                                                "Asian handicap +2.5" : ahplus25,
                                                "Asian handicap +3" : ahplus3,
                                                "Asian handicap +3.5" : ahplus35,
                                                "Asian handicap +4" : ahplus4,
                                                "Asian handicap +4.5" : ahplus45
                                            };

                                            var allHandicaps = '';

                                            $.each(asianHandicapData, function(key, value) {
                                                if(value != ''){
                                                    allHandicaps += '<div class="flex-table header" role="rowgroup">';
                                                    allHandicaps += '<div title="'+key+'" class="flex-row bookmakers" role="columnheader">'+key+'</div>';
                                                    allHandicaps += '<div title="Home" class="flex-row oddWidth" role="columnheader">Home</div>';
                                                    allHandicaps += '<div title="Away" class="flex-row oddWidth" role="columnheader">Away</div>';
                                                    allHandicaps += '</div>';
                                                    allHandicaps += '<div class="table__body">';
                                                    $.each(value, function(keys, values) {
                                                        allHandicaps += '<div class="flex-table row" role="rowgroup">';
                                                        allHandicaps += '<div class="flex-row bookmakers" role="cell">' + values.bookmaker + '</div>';
                                                        allHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.one + '</div>';
                                                        allHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.two + '</div>';
                                                        allHandicaps += '</div>';
                                                    });
                                                    allHandicaps += '</div>';
                                                }
                                            });

                                            var ouData = {
                                                "Over/Under +0.5" : ou05,
                                                "Over/Under +1" : ou1,
                                                "Over/Under +1.5" : ou15,
                                                "Over/Under +2" : ou2,
                                                "Over/Under +2.5" : ou25,
                                                "Over/Under +3" : ou3,
                                                "Over/Under +3.5" : ou35,
                                                "Over/Under +4" : ou4,
                                                "Over/Under +4.5" : ou45,
                                                "Over/Under +5" : ou5,
                                                "Over/Under +5.5" : ou55
                                            };

                                            var allou = '';

                                            $.each(ouData, function(key, value) {
                                                if(value != ''){
                                                    allou += '<div class="flex-table header" role="rowgroup">';
                                                    allou += '<div title="'+key+'" class="flex-row bookmakers" role="columnheader">'+key+'</div>';
                                                    allou += '<div title="Over" class="flex-row oddWidth" role="columnheader">Over</div>';
                                                    allou += '<div title="Under" class="flex-row oddWidth" role="columnheader">Under</div>';
                                                    allou += '</div>';
                                                    allou += '<div class="table__body">';
                                                    $.each(value, function(keys, values) {
                                                        allou += '<div class="flex-table row" role="rowgroup">';
                                                        allou += '<div class="flex-row bookmakers" role="cell">' + values.bookmaker + '</div>';
                                                        allou += '<div class="flex-row oddWidth" role="cell">' + values.one + '</div>';
                                                        allou += '<div class="flex-row oddWidth" role="cell">' + values.two + '</div>';
                                                        allou += '</div>';
                                                    });
                                                    allou += '</div>';
                                                }
                                            });

                                            htmlInsideTabsConstructorO += '</div>';
                                            $('#matchOdds .tab-container').append(htmlInsideTabsConstructorO);
                                            $('#matchOdds .nav-tab-wrapper').prepend(htmlConstructorO);

                                            if(onextwo.length > 0){
                                                $('#1x2 .tablele-container .table__body').append(onextwo);
                                            } else {
                                                $('#1x2 .tablele-container .table__body').append('<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>');
                                            }

                                            if(btsyesno.length > 0){
                                                $('#bts .tablele-container .table__body').append(btsyesno);
                                            } else {
                                                $('#bts .tablele-container .table__body').append('<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>');
                                            }

                                            if(allHandicaps.length > 0){
                                                $('#ah .tablele-container').append(allHandicaps);
                                            } else {
                                                $('#ah .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Asian handicap" class="flex-row bookmakers" role="columnheader">Asian handicap</div><div title="1" class="flex-row oddWidth" role="columnheader">1</div><div title="2" class="flex-row oddWidth" role="columnheader">2</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                            }

                                            if(allou.length > 0){
                                                $('#ou .tablele-container').append(allou);
                                            } else {
                                                $('#ou .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Over/Under" class="flex-row bookmakers" role="columnheader">Over/Under</div><div title="Over" class="flex-row oddWidth" role="columnheader">Over</div><div title="Under" class="flex-row oddWidth" role="columnheader">Under</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                            }

                                            // Switching tabs on click
                                            $('#matchOdds .nav-tab').unbind('click').on('click', function(e) {
                                                e.preventDefault();
                                                //Toggle tab link
                                                $(this).addClass('nav-tab-active').siblings().removeClass('nav-tab-active');
                                                //Toggle target tab
                                                $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                            });
                                        }
                                    } else {
                                        $('#matchOdds .tab-container').addClass('lineForNoData').prepend('<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>');
                                    }
                                });
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                // Populate Match Prediction section
                                htmlConstructor += '<section id="matchPredictions" class="tab-content">';
                                htmlConstructor += '<div class="tab-container">';

                                // Send server request for Standings
                                $.ajax({
                                    url: matchResultsDetailsAjaxURL,
                                    cache: false,
                                    data: {
                                        met: 'Probabilities',
                                        widgetKey: widgetKey,
                                        from: sessionStorage.getItem('fixturesDate'),
                                        to: sessionStorage.getItem('fixturesDate'),
                                        matchId: matchId
                                    },
                                    dataType: 'json'
                                }).done(function(res) {

                                    console.log(res)
                                    // If server send results hide loading
                                    $('.loading').hide();

                                    if(!res.error){
                                        if(res.result) {
                                            $('.d-none-tab-prediction').removeClass('d-none-tab-prediction');

                                            var htmlInsideTabsConstructorP = '<div class="nav-tab-wrapper">';
                                            var htmlConstructorO = '<a href="#p1x2" class="standing-h2 nav-tab nav-tab-active">1x2</a>';
                                            htmlConstructorO += '<a href="#pdc" class="standing-h2 nav-tab">Double Chance</a>';
                                            htmlConstructorO += '<a href="#pah" class="standing-h2 nav-tab">Asian Handicap</a>';
                                            htmlConstructorO += '<a href="#pou" class="standing-h2 nav-tab">O/U</a>';
                                            htmlConstructorO += '<a href="#pbts" class="standing-h2 nav-tab">BTS</a>';

                                            htmlInsideTabsConstructorP += '<section id="p1x2" class="tab-content active">';
                                            htmlInsideTabsConstructorP += '<div class="tablele-container">';
                                            htmlInsideTabsConstructorP += '<div class="flex-table header" role="rowgroup">';
                                            htmlInsideTabsConstructorP += '<div title="" class="flex-row bookmakers" role="columnheader"></div>';
                                            htmlInsideTabsConstructorP += '<div title="1" class="flex-row oddWidth" role="columnheader">1</div>';
                                            htmlInsideTabsConstructorP += '<div title="X" class="flex-row oddWidth" role="columnheader">X</div>';
                                            htmlInsideTabsConstructorP += '<div title="2" class="flex-row oddWidth" role="columnheader">2</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '<div class="table__body">';
                                            if (res.result[0]['event_HW'] !== '' || res.result[0]['event_D'] !== '' || res.result[0]['event_AW'] !== '') {
                                                htmlInsideTabsConstructorP += '<div class="flex-table row" role="rowgroup">';
                                                htmlInsideTabsConstructorP += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_HW != 'undefined') ? res.result[0].event_HW : '') + '</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_D != 'undefined') ? res.result[0].event_D : '') + '</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_AW != 'undefined') ? res.result[0].event_AW : '') + '</div>';
                                                htmlInsideTabsConstructorP += '</div>';
                                            } else {
                                                htmlInsideTabsConstructorP += '<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>';
                                            }
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</section>';

                                            htmlInsideTabsConstructorP += '<section id="pdc" class="tab-content">';
                                            htmlInsideTabsConstructorP += '<div class="tablele-container">';
                                            htmlInsideTabsConstructorP += '<div class="flex-table header" role="rowgroup">';
                                            htmlInsideTabsConstructorP += '<div title="" class="flex-row bookmakers" role="columnheader"></div>';
                                            htmlInsideTabsConstructorP += '<div title="1" class="flex-row oddWidth" role="columnheader">1</div>';
                                            htmlInsideTabsConstructorP += '<div title="X" class="flex-row oddWidth" role="columnheader">X</div>';
                                            htmlInsideTabsConstructorP += '<div title="2" class="flex-row oddWidth" role="columnheader">2</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '<div class="table__body">';
                                            if (res.result[0]['event_HW_D'] !== '' || res.result[0]['event_HW_AW'] !== '' || res.result[0]['event_AW_D'] !== '') {
                                                htmlInsideTabsConstructorP += '<div class="flex-table row" role="rowgroup">';
                                                htmlInsideTabsConstructorP += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_HW_D != 'undefined') ? res.result[0].event_HW_D : '') + '</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_HW_AW != 'undefined') ? res.result[0].event_HW_AW : '') + '</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_AW_D != 'undefined') ? res.result[0].event_AW_D : '') + '</div>';
                                                htmlInsideTabsConstructorP += '</div>';
                                            } else {
                                                htmlInsideTabsConstructorP += '<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>';
                                            }
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</section>';

                                            htmlInsideTabsConstructorP += '<section id="pah" class="tab-content">';
                                            htmlInsideTabsConstructorP += '<div class="tablele-container">';

                                            var pasianHandicapData = {
                                                "Asian handicap -4.5": [{
                                                    home: res.result[0]['event_ah_h_-45'],
                                                    away: res.result[0]['event_ah_a_-45']
                                                }],
                                                "Asian handicap -3.5": [{
                                                    home: res.result[0]['event_ah_h_-35'],
                                                    away: res.result[0]['event_ah_a_-35']
                                                }],
                                                "Asian handicap -2.5": [{
                                                    home: res.result[0]['event_ah_h_-25'],
                                                    away: res.result[0]['event_ah_a_-25']
                                                }],
                                                "Asian handicap -1.5": [{
                                                    home: res.result[0]['event_ah_h_-15'],
                                                    away: res.result[0]['event_ah_a_-15']
                                                }],
                                                "Asian handicap -0.5": [{
                                                    home: res.result[0]['event_ah_h_-05'],
                                                    away: res.result[0]['event_ah_a_-05']
                                                }],
                                                "Asian handicap +0.5": [{
                                                    home: res.result[0]['event_ah_h_05'],
                                                    away: res.result[0]['event_ah_a_05']
                                                }],
                                                "Asian handicap +1.5": [{
                                                    home: res.result[0]['event_ah_h_15'],
                                                    away: res.result[0]['event_ah_a_15']
                                                }],
                                                "Asian handicap +2.5": [{
                                                    home: res.result[0]['event_ah_h_25'],
                                                    away: res.result[0]['event_ah_a_25']
                                                }],
                                                "Asian handicap +3.5": [{
                                                    home: res.result[0]['event_ah_h_35'],
                                                    away: res.result[0]['event_ah_a_35']
                                                }],
                                                "Asian handicap +4.5": [{
                                                    home: res.result[0]['event_ah_h_45'],
                                                    away: res.result[0]['event_ah_a_45']
                                                }]
                                            };

                                            var pallHandicaps = '';

                                            $.each(pasianHandicapData, function (key, value) {
                                                if (value != '') {
                                                    pallHandicaps += '<div class="flex-table header" role="rowgroup">';
                                                    pallHandicaps += '<div title="' + key + '" class="flex-row bookmakers" role="columnheader">' + key + '</div>';
                                                    pallHandicaps += '<div title="Home" class="flex-row oddWidth" role="columnheader">Home</div>';
                                                    pallHandicaps += '<div title="Away" class="flex-row oddWidth" role="columnheader">Away</div>';
                                                    pallHandicaps += '</div>';
                                                    pallHandicaps += '<div class="table__body">';
                                                    $.each(value, function (keys, values) {
                                                        pallHandicaps += '<div class="flex-table row" role="rowgroup">';
                                                        pallHandicaps += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                                        pallHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.home + '</div>';
                                                        pallHandicaps += '<div class="flex-row oddWidth" role="cell">' + values.away + '</div>';
                                                        pallHandicaps += '</div>';
                                                    });
                                                    pallHandicaps += '</div>';
                                                }
                                            });

                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</section>';

                                            htmlInsideTabsConstructorP += '<section id="pou" class="tab-content">';
                                            htmlInsideTabsConstructorP += '<div class="tablele-container">';

                                            var pouData = {
                                                "Over/Under": [{
                                                    over: res.result[0]['event_O'],
                                                    under: res.result[0]['event_U']
                                                }],
                                                "Over/Under +1": [{
                                                    over: res.result[0]['event_O_1'],
                                                    under: res.result[0]['event_U_1']
                                                }],
                                                "Over/Under +3": [{
                                                    over: res.result[0]['event_O_3'],
                                                    under: res.result[0]['event_U_3']
                                                }]
                                            };

                                            var pallou = '';

                                            $.each(pouData, function (key, value) {
                                                if (value != '') {
                                                    pallou += '<div class="flex-table header" role="rowgroup">';
                                                    pallou += '<div title="' + key + '" class="flex-row bookmakers" role="columnheader">' + key + '</div>';
                                                    pallou += '<div title="Over" class="flex-row oddWidth" role="columnheader">Over</div>';
                                                    pallou += '<div title="Under" class="flex-row oddWidth" role="columnheader">Under</div>';
                                                    pallou += '</div>';
                                                    pallou += '<div class="table__body">';
                                                    $.each(value, function (keys, values) {
                                                        pallou += '<div class="flex-table row" role="rowgroup">';
                                                        pallou += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                                        pallou += '<div class="flex-row oddWidth" role="cell">' + values.over + '</div>';
                                                        pallou += '<div class="flex-row oddWidth" role="cell">' + values.under + '</div>';
                                                        pallou += '</div>';
                                                    });
                                                    pallou += '</div>';
                                                }
                                            });

                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</section>';

                                            htmlInsideTabsConstructorP += '<section id="pbts" class="tab-content">';
                                            htmlInsideTabsConstructorP += '<div class="tablele-container">';
                                            htmlInsideTabsConstructorP += '<div class="flex-table header" role="rowgroup">';
                                            htmlInsideTabsConstructorP += '<div title="" class="flex-row bookmakers" role="columnheader"></div>';
                                            htmlInsideTabsConstructorP += '<div title="Yes" class="flex-row oddWidth" role="columnheader">Yes</div>';
                                            htmlInsideTabsConstructorP += '<div title="No" class="flex-row oddWidth" role="columnheader">No</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '<div class="table__body">';
                                            if (res.result[0]['event_bts'] !== '' || res.result[0]['event_ots'] !== '') {
                                                htmlInsideTabsConstructorP += '<div class="flex-table row" role="rowgroup">';
                                                htmlInsideTabsConstructorP += '<div class="flex-row bookmakers" role="cell">Chance</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_bts != 'undefined') ? res.result[0].event_bts : '') + '</div>';
                                                htmlInsideTabsConstructorP += '<div class="flex-row oddWidth" role="cell">' + ((typeof res.result[0].event_ots != 'undefined') ? res.result[0].event_ots : '') + '</div>';
                                                htmlInsideTabsConstructorP += '</div>';
                                            } else {
                                                htmlInsideTabsConstructorP += '<div class="flex-table-error row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 6px;">Sorry, no data!</p></div>';
                                            }
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</div>';
                                            htmlInsideTabsConstructorP += '</section>';

                                            htmlInsideTabsConstructorP += '</div>';
                                            $('#matchPredictions .tab-container').append(htmlInsideTabsConstructorP);
                                            $('#matchPredictions .nav-tab-wrapper').prepend(htmlConstructorO);

                                            if (pallHandicaps.length > 0) {
                                                $('#pah .tablele-container').append(pallHandicaps);
                                            } else {
                                                $('#pah .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Asian handicap" class="flex-row bookmakers" role="columnheader">Asian handicap</div><div title="1" class="flex-row oddWidth" role="columnheader">1</div><div title="2" class="flex-row oddWidth" role="columnheader">2</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                            }

                                            if (pallou.length > 0) {
                                                $('#pou .tablele-container').append(pallou);
                                            } else {
                                                $('#pou .tablele-container').append('<div class="flex-table header" role="rowgroup"><div title="Over/Under" class="flex-row bookmakers" role="columnheader">Over/Under</div><div title="Over" class="flex-row oddWidth" role="columnheader">Over</div><div title="Under" class="flex-row oddWidth" role="columnheader">Under</div></div><div class="table__body"><div class="flex-table row" role="rowgroup"><p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 5px;">Sorry, no data!</p></div></div>');
                                            }

                                            // Switching tabs on click
                                            $('#matchPredictions .nav-tab').unbind('click').on('click', function (e) {
                                                e.preventDefault();
                                                //Toggle tab link
                                                $(this).addClass('nav-tab-active').siblings().removeClass('nav-tab-active');
                                                //Toggle target tab
                                                $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                            });
                                        }
                                    } else {
                                        $('#matchPredictions .tab-container').addClass('lineForNoData').prepend('<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>');
                                    }
                                });
                                htmlConstructor += '</div>';
                                htmlConstructor += '</section>';

                                htmlConstructor += '</div>';
                                htmlConstructor += '</div>';
                                $('#matchResultsContentTable').append(htmlConstructor);
                                // Added close button in HTML
                                $('#matchResultsContentTable').append('<p class="closeWindow">close window</p>');
                                // Added click function to close window
                                $('.closeWindow').click(function() {
                                    window.close();
                                });
                                // Switching tabs on click
                                $('.nav-tab').unbind('click').on('click', function(e) {
                                    e.preventDefault();
                                    //Toggle tab link
                                    $(this).addClass('nav-tab-active').parent().parent().siblings().find('a').removeClass('nav-tab-active');
                                    //Toggle target tab
                                    $($(this).attr('href')).addClass('active').siblings().removeClass('active');
                                });
                            }
                            clearInterval(seeWhatMatchDetailsToShow);
                        }
                    }, 10);
                } else {
                    // If server not sending data, show pop-up and after click closing window
                    alert('Sorry, no data!');
                    window.close();
                }

            }).fail(function(error) {

            });
        },

        callback: function() {

        }

    });


    function socketsLive(matchId, widgetKey){
      var socket  = new WebSocket('wss://wss.allsportsapi.com/live_events?matchId='+matchId+'&widgetKey='+widgetKey+'&timezone='+getTimeZone());
      // Define the
      socket.onmessage = function(e) {
//                alert( e.data );
          if (e.data) {
            var data = JSON.parse(e.data);
              var windowWidthSize = $(window).width();
              res = Object();
              res.result = data;
              htmlConstructor = '';
              if (res.result) {
                htmlConstructor += '<div class="event_info_score">';
                htmlConstructor += '<div>' + res.result[0].event_final_result + '</div>';
                htmlConstructor += '</div>';
                htmlConstructor += '<div class="event_info_status">';
                var removeNumericAdd = res.result[0].event_status.replace('+', '');
                htmlConstructor += '<div class="' + (($.isNumeric(removeNumericAdd) || (removeNumericAdd == 'Half Time')) ? 'matchIsLive' : '') + '"> ' + (($.isNumeric(removeNumericAdd) || (removeNumericAdd == 'Half Time')) ? res.result[0].event_status + ((removeNumericAdd == 'Half Time') ? '' : '\'') : res.result[0].event_status) + '</div>';
                htmlConstructor += '</div>';
                $('.event_info').html(htmlConstructor);
                // Populate Match Summary section
                htmlConstructor = '';
                htmlConstructor += '<div class="tab-container">';
                var multipleArrays = [res.result[0].goalscorers, res.result[0].substitutes, res.result[0].cards];
                var flatArray = [].concat.apply([], multipleArrays);
                var nrArray = flatArray;
                nrArray.sort(naturalCompare);
                var newArray = {};
                $.each(nrArray, function(key, value) {
                  if (!newArray[value['info_time']]) {
                    newArray[value['info_time']] = [];
                  }
                  newArray[value['info_time']].push(value);
                });
                var orderedNewArray = {
                  '1st Half': newArray['1st Half'] ? newArray['1st Half'] : false,
                  '2nd Half': newArray['2nd Half'] ? newArray['2nd Half'] : false,
                  'Extra Time': newArray['Extra Time'] ? newArray['Extra Time'] : false,
                  'Penalty': newArray['Penalty'] ? newArray['Penalty'] : false
                };
                if (nrArray.length == 0) {
                    htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>';
                } else {
                    var htmlCC = 0;
                    var htmlCC2 = 0;
                    var first = true;
                    $.each(orderedNewArray, function(key, valueSub) {
                      if (valueSub) {
                        if (first && key != '1st Half') {
                          htmlConstructor += '<div class="lineupsTitle">1st Half</div>';
                          htmlConstructor += '<div class="noHalfEvent">-</div>';
                        }
                        first = false;
                        htmlConstructor += '<div class="lineupsTitle">'+key+'</div>';
                        $.each(valueSub, function(key2, value) {
                          if ((value.home_scorer || value.away_scorer || value.score_info) && value.score !== "substitution" && value.score ) {
                              htmlConstructor += '<div class="' + ((value.home_scorer || value.score_info == 'home') ? 'action_home' : 'action_away') + '">' + ((value.home_scorer || value.score_info == 'home' ) ? value.time + '\'<div class="imgMatchSummary" style="background-image: url(img/ball.png);"></div>' + value.home_scorer : '') + ' ' + ((value.away_scorer || value.score_info == 'away' ) ? value.time + '\'' + '<div class="imgMatchSummary" style="background-image: url(img/ball.png);"></div>' + value.away_scorer : '') + '</div>';
                          }
                          if ((value.home_scorer == '') && (value.away_scorer == '') && value.score_info == '') {
                              htmlConstructor += '<div class="action_unknown">' + (value.time + '\'<div class="imgMatchSummary" style="background-image: url(img/ball.png);"></div>') + '</div>';
                          }
                          if ((value.home_fault || value.away_fault || value.score_info)  && !value.score) {
                              htmlConstructor += '<div class="' + ((value.home_fault || value.score_info == 'home') ? 'action_home' : 'action_away') + '">' + ((value.home_fault || value.score_info == 'home') ? value.time + '\' ' + ((value.card == 'yellow card') ? '<div class="imgMatchSummary" style="background-image: url(img/yellow_card.svg);"></div>' : '<div class="imgMatchSummary" style="background-image: url(img/red_card.svg);"></div>') + ' ' + value.home_fault : '') + ' ' + ((value.away_fault || value.score_info == 'away') ? value.time + '\'' + ' ' + ((value.card == 'yellow card') ? '<div class="imgMatchSummary" style="background-image: url(img/yellow_card.svg);"></div>' : '<div class="imgMatchSummary" style="background-image: url(img/red_card.svg);"></div>') + ' ' + value.away_fault : '') + '</div>';
                          }
                          if ((value.home_fault == '') && (value.away_fault == '') && value.score_info == ''  && !value.score) {
                              htmlConstructor += '<div class="action_unknown">' + ((value.card == 'yellow card') ? '<div class="imgMatchSummary" style="background-image: url(img/yellow_card.svg);"></div>' : '<div class="imgMatchSummary" style="background-image: url(img/red_card.svg);"></div>') + '</div>';
                          }
                          if (value.score === "substitution") {
                              htmlConstructor += '<div class="' + ((value.home_scorer.in) ? 'action_home' : 'action_away') + '">' + ((value.home_scorer.in) ? value.time + '\'<div class="imgMatchSummary" style="background-image: url(img/match_green.png);"></div>' + value.home_scorer.in + '<div class="imgMatchSummary" style="background-image: url(img/match_red.png);"></div>' + value.home_scorer.out : '') + ' ' + ((value.away_scorer.in) ? value.time + '\'' + '<div class="imgMatchSummary" style="background-image: url(img/match_green.png);"></div>' + value.away_scorer.in + '<div class="imgMatchSummary" style="background-image: url(img/match_red.png);"></div>' + value.away_scorer.out : '') + '</div>';
                          }
                        });
                      }
                    });
                    htmlConstructor += '</div>';
                }
                if ((res.result[0].event_referee != '') || (res.result[0].event_stadium != '')) {
                    htmlConstructor += '<div>';
                    htmlConstructor += '<div class="matchExtraInfosTitle">Match Information</div>';
                    htmlConstructor += '<div class="matchExtraInfos">' + ((res.result[0].event_referee != '') ? 'Referee: ' + res.result[0].event_referee : '') + ' ' + ((res.result[0].event_stadium != '') ? 'Stadium: ' + res.result[0].event_stadium : '') + '</div>';
                    htmlConstructor += '</div>';
                }
                $("#matchSummary").html(htmlConstructor);

                // Populate Match Statistics section
                htmlConstructor = '';
                htmlConstructor += '<div class="tab-container">';
                if (res.result[0].statistics.length == 0) {
                    htmlConstructor += '<p class="" style="border-left: solid 0px transparent; margin-left:auto; margin-right:auto; margin-top: 13px; text-align:center;">Sorry, no data!</p>';
                } else {
                    $.each(res.result[0].statistics, function(key, value) {
                        if (JSON.stringify(value).indexOf('%') > -1) {
                            htmlConstructor += '<div class="matchStatisticsRow">';
                            htmlConstructor += '<div class="matchStatisticsRowText">';
                            htmlConstructor += '<div class="matchStatisticsRowHome">' + value.home + '</div>';
                            htmlConstructor += '<div class="matchStatisticsRowType">' + value.type + '</div>';
                            htmlConstructor += '<div class="matchStatisticsRowAway">' + value.away + '</div>';
                            htmlConstructor += '</div>';
                            htmlConstructor += '<div class="matchStatisticsRowBar">';
                            htmlConstructor += '<div class="matchStatisticsRowBarHome">';
                            htmlConstructor += '<div class="matchStatisticsRowBarHomeBg">';
                            htmlConstructor += '<div class="matchStatisticsRowHomeLine" style="width:' + value.home + ';background-color:' + ((value.home > value.away) ? 'red' : '') + ';"></div>';
                            htmlConstructor += '</div>';
                            htmlConstructor += '</div>';
                            htmlConstructor += '<div class="matchStatisticsRowBarAway">';
                            htmlConstructor += '<div class="matchStatisticsRowBarAwayBg">';
                            htmlConstructor += '<div class="matchStatisticsRowAwayLine" style="width:' + value.away + ';background-color:' + ((value.away > value.home) ? 'red' : '') + ';"></div>';
                            htmlConstructor += '</div>';
                            htmlConstructor += '</div>';
                            htmlConstructor += '</div>';
                            htmlConstructor += '</div>';
                        } else {
                            var x = parseInt(value.home) + parseInt(value.away);
                            var xx = 100 / x;
                            var tt = xx * value.home;
                            var vv = xx * value.away;
                            htmlConstructor += '<div class="matchStatisticsRow">';
                            htmlConstructor += '<div class="matchStatisticsRowText">';
                            htmlConstructor += '<div class="matchStatisticsRowHome">' + value.home + '</div>';
                            htmlConstructor += '<div class="matchStatisticsRowType">' + value.type + '</div>';
                            htmlConstructor += '<div class="matchStatisticsRowAway">' + value.away + '</div>';
                            htmlConstructor += '</div>';
                            htmlConstructor += '<div class="matchStatisticsRowBar">';
                            htmlConstructor += '<div class="matchStatisticsRowBarHome">';
                            htmlConstructor += '<div class="matchStatisticsRowBarHomeBg">';
                            htmlConstructor += '<div class="matchStatisticsRowHomeLine" style="width:' + tt + '%;background-color:' + ((tt > vv) ? 'red' : '') + ';"></div>';
                            htmlConstructor += '</div>';
                            htmlConstructor += '</div>';
                            htmlConstructor += '<div class="matchStatisticsRowBarAway">';
                            htmlConstructor += '<div class="matchStatisticsRowBarAwayBg">';
                            htmlConstructor += '<div class="matchStatisticsRowAwayLine" style="width:' + vv + '%;background-color:' + ((vv > tt) ? 'red' : '') + ';"></div>';
                            htmlConstructor += '</div>';
                            htmlConstructor += '</div>';
                            htmlConstructor += '</div>';
                            htmlConstructor += '</div>';
                        }
                    });
                }
                htmlConstructor += '</div>';
                $('#matchStatistics').html(htmlConstructor);
              }

              console.log(htmlConstructor);
          } else {
              // If server dont send new data we populate console.log with "No new data!"
              console.log('No new data!');
          }
      }
      socket.onclose = function(){
        // connection closed, discard old websocket and create a new one in 5s
        socket = null;
        setTimeout(function() {socketsLive(matchId, widgetKey); }, 5000);
      }

    }


    $.fn.widgetMatchResults = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + widgetMatchResults)) {
                $.data(this, "plugin_" + widgetMatchResults, new Plugin(this, options));
            }
        });
        return this;
    };

    $.fn.widgetMatchResults.defaults = {
        // WidgetKey will be set in jqueryGlobals.js and can be obtained from your account
        widgetKey: widgetKey,
        // Motod for this widget
        method: 'Fixtures',
        // Link to server data
        matchResultsDetailsAjaxURL: 'https://apiv2.allsportsapi.com/football/',
        // Background color for your Leagues Widget
        backgroundColor: null,
        // Width for your widget
        widgetWidth: '100%',
        // Set the match Id (it will be set automaticaly when you click on a match)
        matchId: (sessionStorage.getItem('matchDetailsKey') ? sessionStorage.getItem('matchDetailsKey') : null),
        // Set the match league logo (it will be set automaticaly when you click on a match)
        leagueLogo: (sessionStorage.getItem('leagueLogo') ? sessionStorage.getItem('leagueLogo') : 'img/no-img.png')
    };

})(jQuery, window, document);