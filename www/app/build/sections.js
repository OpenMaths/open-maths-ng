!function(){"use strict";function e(e,t){e.$parent.title=t.pageTitle,e.$parent.transparentNav=t.pageTransparentNav}angular.module("omApp").controller("BoardController",e).constant("magicForBoard",{pageTitle:"Board",pageTransparentNav:!1}),e.$inject=["$scope","magicForBoard"]}(),function(){"use strict";function e(e,t,o,r,n,i,a,s,c){function u(u){u.rows=i.get("gridRows")?_.parseInt(i.get("gridRows")):c.gridDefaultRowCount,u.columns=i.get("gridColumns")?_.parseInt(i.get("gridColumns")):c.gridDefaultColumnCount;for(var l=e.uriFriendlyTitle?e.uriFriendlyTitle:!1,g=[],m=0;m<u.rows;m++){for(var f=[],p=0;p<u.columns;p++)f.push(p);g.push(f)}u.grid=g,u.manageGrid=function(e,t){if("row"==t){for(var o=[],r=0;r<u.columns;r++)o.push(r);switch(e){case"add":if(u.rows>c.gridMaxRows-1)return!1;u.rows=u.rows+1,u.grid.push(o);break;case"remove":if(u.rows<c.gridMinRows+1)return!1;u.rows=u.rows-1,u.grid.pop();break;default:return a.log("Method"+e+"not allowed","debug"),!1}return i.set("gridRows",u.rows),!0}if("column"==t){switch(e){case"add":if(u.columns>c.gridMaxColumns-1)return!1;for(var r=0;r<u.rows;r++)u.grid[r].push(u.columns);u.columns=u.columns+1;break;case"remove":if(u.columns<c.gridMinColumns+1)return!1;for(r=0;r<u.rows;r++)u.grid[r].pop();u.columns=u.columns-1;break;default:return a.log("Method"+e+"not allowed","debug"),!1}return i.set("gridColumns",u.columns),!0}return a.log("Type"+t+"not allowed","debug"),!1};var d=function(e,i,l,g){if(i===!1)return n.generate("A parameter must be present to access this section. Try navigating through search.","info"),r.url("/"),!1;var m=function(){u.fadeInUmi=!0},f="uriFriendlyTitle"==e?s.api+i:s.api+e+"/"+i;t.get(f).success(function(t){a.log("UMI "+e+" => "+i+" loaded.","info"),g&&(t.targetClasses=g),u.grid[l.row][l.column]=t,o(m,c.fadeUmiTimeout)}).error(function(e){n.generate("There was an error loading requested contribution.","error",e)})};d("uriFriendlyTitle",l,c.gridStartingPosition,!1),u.position=function(e,t,o,r){var n=[];if("up"==o)var i=[e-1,t];else if("down"==o)var i=[e+1,t];else if("left"==o)var i=[e,t-1];else if("right"==o)var i=[e,t+1];0==i[0]?n.push("closes-top"):i[0]==u.rows-1?n.push("closes-bottom"):0==i[1]?n.push("closes-left"):i[1]==u.columns-1&&n.push("closes-right");var i={row:i[0],column:i[1]};d("id",r,i,n.join(" "))}}var l={restrict:"EA",templateUrl:"app/sections/section.board/board.layout.html",link:u};return l}angular.module("omApp").directive("boardLayout",e).constant("magicForBoardDirective",{fadeUmiTimeout:250,gridDefaultRowCount:3,gridDefaultColumnCount:3,gridMaxRows:6,gridMinRows:2,gridMaxColumns:6,gridMinColumns:2,gridStartingPosition:{row:1,column:1}}),e.$inject=["$routeParams","$http","$timeout","$location","notification","sStorage","logger","magic","magicForBoardDirective"]}(),function(){"use strict";function e(e,t,o,r,n,i,a){n.check(),e.$parent.title=a.pageTitle,e.$parent.transparentNav=a.pageTransparentNav,e.createUmiForm={umiType:"",title:"",titleSynonyms:"",content:"",prerequisiteDefinitionIds:{},seeAlsoIds:{},tags:""};var s;e.formErrorMessages=a.formErrorMessages,e.formInstructions=a.formInstructions,e.formUmiTypes=a.formUmiTypes,e.steps=a.steps,e.stepsKeys=_.keys(e.steps),e.activeStep=0,e.goToStep=function(t){var o=_.indexOf(e.stepsKeys,t);o<=e.activeStep?e.activeStep=o:r.generate("Please complete the current step first before proceeding further.","info")},e.toggleFormalVersion=function(){e.formalVersion=e.formalVersion?!1:!0,e.formalVersion?r.generate("Your contribution is now of type Formal.","info"):r.generate("Your contribution is no longer of type Formal.","info")},e.createUmi=function(){var t=e.createUmiForm,o={auth:{accessToken:e.omUser.accessToken,gPlusId:e.omUser.id},message:"Initialise UMI",umiType:t.umiType.id,title:_.capitalise(t.title),titleSynonyms:t.titleSynonyms?_.cleanseCSV(t.titleSynonyms):[],content:t.content,prerequisiteDefinitionIds:t.prerequisiteDefinitionIds?_.keys(t.prerequisiteDefinitionIds):[],seeAlsoIds:t.seeAlsoIds?_.keys(t.seeAlsoIds):[],tags:t.tags?_.cleanseCSV(t.tags):[]};return console.log(o),!1},e.latexToHtml=function(){var n=e.createUmiForm.content;return n?(o.cancel(s),e.parsedContent=n,s=o(function(){},a.parseContentTimeout),void s.then(function(){e.parsingContent=!0,e.timeScale=_.timeScale(e.createUmiForm.content),t.post(i.api+"latex-to-html",e.createUmiForm.content).success(function(t){var r,n="parsed"==_.first(_.keys(t))?!0:!1;if(n)e.editorError=!1,r=t.parsed;else{var i=_.first(_.values(t)),s=_.parseInt(i[1])-4,c=e.createUmiForm.content.substr(s,8);e.editorError={message:i[0],offset:i[1],where:c},r=e.createUmiForm.content}e.parsedContent=r,o(function(){e.parsingContent=!1},a.parseContentProgressTimeout)}).error(function(e){r.generate("There was an error parsing content","error",e)})})):(e.parsedContent="",!1)}}angular.module("omApp").controller("ContributeController",e).constant("magicForContribute",{pageTitle:"Contribute",pageTransparentNav:!1,parseContentTimeout:2e3,parseContentProgressTimeout:750,steps:{"basic-settings":"Basic Settings",editor:"Editor","preview-and-publish":"Preview & Publish"},formErrorMessages:{required:"This field is required.",maxLength:"This field is exceeding the maximum length of 128 characters.",umiTitle:"The title should only consist of letters, spaces, or hyphens"},formInstructions:{umiType:"What category of information?",title:"Users will be able to search your contribution.",titleSynonyms:"Comma-separated list of alternative names.",content:"The actual content. You are free to use LaTeX (including text-mode macros!!).",prerequisiteDefinitionIds:"Comma-separated list of valid dependency Titles.",seeAlsoIds:"Comma-separated list of valid Titles which may be related.",tags:"Comma-separated list of tags to help users find your contribution."},formUmiTypes:[{id:"Definition",label:"Definition",formal:"allow"},{id:"Axiom",label:"Axiom",formal:"allow"},{id:"Theorem",label:"Theorem",formal:"allow"},{id:"Lemma",label:"Lemma",formal:"allow"},{id:"Corollary",label:"Corollary",formal:"allow"},{id:"Conjecture",label:"Conjecture",formal:"allow"},{id:"Proof",label:"Proof",formal:"allow"},{id:"HistoricalNote",label:"Historical Note"},{id:"PhilosophicalJustification",label:"Philosophical Justification"},{id:"Diagram",label:"Diagram"},{id:"Example",label:"Example"},{id:"PartialTheorem",label:"Partial Theorem",formal:"allow"}]}),e.$inject=["$scope","$http","$timeout","notification","userLevel","magic","magicForContribute"]}(),function(){"use strict";function e(){var e={restrict:"E",templateUrl:"app/sections/section.contribute/contribute.layout.html"};return e}angular.module("omApp").directive("contributeLayout",e)}(),function(){"use strict";function e(e,t){e.$parent.title=t.pageTitle,e.$parent.transparentNav=t.pageTransparentNav}angular.module("omApp").controller("DiveController",e).constant("magicForDive",{pageTitle:"Dive Into",pageTransparentNav:!0}),e.$inject=["$scope","magicForDive"]}(),function(){"use strict";function e(){var e={restrict:"E",templateUrl:"app/sections/section.dive/dive.layout.html",controller:"SearchController"};return e}angular.module("omApp").directive("diveLayout",e)}(),function(){"use strict";function e(e,t,o,r,n,i,a){function s(){var o=t.url().split("/");e.path=""==o[1]?a.pageDefaultWelcomeLabel:o[1],e.omUser=r.get("omUser"),e.gapiActive=r.get("gapiActive"),i.debug||n.sendPageView(t.path())}e.title=a.pageTitle,e.siteName=i.siteName,e.siteLanguage=i.siteLanguage,e.description=i.description,e.cssPath=i.css,e.uiSettings=o.get("uiSettings")?o.get("uiSettings"):a.uiSettingsDefault,e.$watch(function(){return t.path()},s)}angular.module("omApp").controller("GlobalController",e).constant("magicForGlobal",{pageTitle:"Page",pageDefaultWelcomeLabel:"dive",uiSettingsDefault:{theme:"light",font:"umi-font-modern"}}).constant("magic",{siteName:"OpenMaths",siteLanguage:"en",description:"The way Mathematics should be done.",css:_.getCSSPath(),api:_.getApiUrl(),debug:_.getDebug()}),e.$inject=["$scope","$location","lStorage","sStorage","googleAnalytics","magic","magicForGlobal"]}(),function(){"use strict";function e(e,t,o){function r(r,n,i){e.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token="+n.access_token).success(function(n){n.accessToken=r.access_token,n.avatarStyle={"background-image":"url('"+n.picture+"')"},e.post(o.api+"arft",n.id).success(function(a){var s={code:r.code,gPlusId:n.id,arfToken:a};e.post(o.api+"login",s).success(function(e){"successMsg"==_.first(_.keys(e))?i(n):t.generate("There was an error signing you in to our application server.","error",e)}).error(function(e){t.generate("There was an error signing you in to our application server.","error",e)})}).error(function(e){t.generate("There was an error getting the anti request forgery token from our application server.","error",e)})}).error(function(e){t.generate("There was an error retrieving user data from Google.","error",e)})}function n(r,n){e.post(o.api+"logout",r).success(function(){n()}).error(function(e,o){t.generate("There was an error signing you out of our application server.","error",[e,o])})}return{signIn:r,signOut:n}}angular.module("omApp").factory("omAuth",e),e.$inject=["$http","notification","magic"]}(),function(){"use strict";function e(e,t,o){function r(r){var n=t.get("omUser");return n?void e.url("/"+r):(o.generate("You need to be signed in to access this section.","info"),!1)}function n(){var r=t.get("omUser");return r?void 0:(o.generate("You need to be signed in to access this section.","info"),e.url("/"),!1)}return{access:r,check:n}}angular.module("omApp").factory("userLevel",e),e.$inject=["$location","sStorage","notification"]}(),function(){"use strict";function e(){var e={restrict:"A",templateUrl:"app/sections/shared.autocomplete/layout.html",scope:{autocompleteData:"=model"},controller:"SearchController"};return e}angular.module("omApp").directive("autocomplete",e)}(),function(){"use strict";function e(e){function t(t,o,r){t.$watch(r.omBind,function(r){o.html(r),e(o.contents())(t),MathJax.Hub.Queue(["Typeset",MathJax.Hub,o[0]])})}var o={restrict:"A",replace:!0,link:t};return o}angular.module("omApp").directive("omBind",e),e.$inject=["$compile"]}(),function(){"use strict";function e(){var e={restrict:"A",templateUrl:"app/sections/shared.footer/layout.html"};return e}angular.module("omApp").directive("footerLayout",e)}(),function(){"use strict";function e(e,t){function o(o){e.ga("send","pageview",{page:o}),t.log("GA Sent: "+o,"info")}var r={sendPageView:o};return r}angular.module("omApp").factory("googleAnalytics",e),e.$inject=["$window","logger"]}(),function(){"use strict";function e(e,t,o){function r(r,n){return-1==_.indexOf(o.allowedTypes,n)?(e.debug("$log type "+n+" not allowed"),!1):void(t.debug?e[n](r):"")}var n={log:r};return n}angular.module("omApp").factory("logger",e).constant("magicForLoggerFactory",{allowedTypes:["info","warn","error","debug","log"]}),e.$inject=["$log","magic","magicForLoggerFactory"]}(),function(){"use strict";function e(e,t,o,r,n,i,a){function s(s){e.initGapi=function(){s.gapiActive=a.set("gapiActive",{status:"active"})},s.googleSignIn=function(){return s.omUser?(s.dropDownUser=s.dropDownUser?!1:!0,!1):void gapi.auth.signIn({callback:function(e){if(1==e.status.signed_in)r.signIn(e,gapi.auth.getToken(),c);else{var t=e.error;"immediate_failed"!==t&&"user_signed_out"!==t?o.generate("There was an error ("+t+") during the sign in process.","error"):n.log(t,"debug")}}})},s.googleSignOut=function(){gapi.auth.signOut(),r.signOut({accessToken:s.omUser.accessToken,gPlusId:s.omUser.id},u)};var c=function(e){a.set("omUser",e),s.omUser=e,o.generate("You are now signed in as "+e.email+".","success")},u=function(){a.remove("omUser"),s.omUser=!1,o.generate("You have been successfully signed out.","info")};s.setUI=function(e,t){var o=s.uiSettings;switch(e){case"font":o.font=t;break;case"theme":o.theme=t}i.set("uiSettings",o),s.uiSettings=o},s.accessUserLevel=function(e){return t.access(e)}}var c={restrict:"A",templateUrl:"app/sections/shared.navigation/layout.html",scope:!0,link:s};return c}angular.module("omApp").directive("navTopLayout",e),e.$inject=["$window","userLevel","notification","omAuth","logger","lStorage","sStorage"]}(),function(){"use strict";function e(e,t){function o(o){var r=2500;t.subscribe(function(t){o.notification=t,o.act=!0,e(function(){o.act=!1},r)})}var r={restrict:"EA",templateUrl:"app/sections/shared.notification/layout.html",scope:{},replace:!0,link:o};return r}angular.module("omApp").directive("notificationLayout",e),e.$inject=["$timeout","notification"]}(),function(){"use strict";function e(e,t){function o(e){n.push(e)}function r(o,r,i){if(-1==_.indexOf(t.allowedTypes,r))return e.log("Method "+r+" not allowed.","debug"),!1;var a={message:o,type:r};i&&(a.trace=i),e.log(a,"info"),_.forEach(n,function(e){e(a)})}var n=[];return{subscribe:o,generate:r}}angular.module("omApp").factory("notification",e).constant("magicForNotificationFactory",{allowedTypes:["info","warning","error","success"]}),e.$inject=["logger","magicForNotificationFactory"]}(),function(){"use strict";function e(e,t,o,r,n,i,a,s){function c(t){if(!e.searchResults)return!1;var o=_.keys(e.searchResults.data).length,r=e.searchResults.currentSelection;return t==s.keyUp&&r>0?e.searchResults.currentSelection=r-1:t==s.keyDown&&o-1>r&&(e.searchResults.currentSelection=r+1),!1}function u(){if(!e.searchResults)return!1;var t=e.searchResults.currentSelection,o=e.searchResults.data[t];return e.autocompleteData[o.id]=o.title,e.searchTerm="",e.searchResults="",!1}var l;e.searchResultsNavigate=function(t,o,r){if(!t)return!1;var n=_.keys(t.data).length,i=t.currentSelection;if(o.keyCode==s.keyReturn)if(o.preventDefault(),"getUmi"==_.first(r)){var a=e.searchResults.data[e.searchResults.currentSelection].uriFriendlyTitle;e[r](a)}else"autocomplete"==_.first(r)&&e.autocomplete(r[1]);return o.keyCode==s.keyUp&&i>0?(o.preventDefault(),t.currentSelection=i-1):o.keyCode==s.keyDown&&n-1>i&&(o.preventDefault(),t.currentSelection=i+1),!1},e.search=function(r,c,u){c&&(e.showAutocomplete=!0);var m=function(t,o){var r=t.split("."),n=_.first(r);return r.length>1?(r.reverse().pop(),m(r.reverse().join("."),e[n])):o?o[n]:e[n]},m=m(r,!1),f=m.length;return u&&g(f),1>f?(e.searchResults=!1,!1):(o.cancel(l),l=o(function(){},s.keyboardDelay),void l.then(function(){t.get(a.api+"search/"+m).success(function(t){if(i.log("Listing results for term: "+m,"info"),t.length>0){var o={currentSelection:0,data:t};e.searchResults=o}else e.searchResults=!1,n.generate("No results found :-(","info")}).error(function(e){n.generate("There was an error with the connection to our API.","error",e)})}))},e.autocomplete=function(t,o){var r=e.searchResults,n=o?r.data[o]:r.data[r.currentSelection];if(e.createUmiForm[t]="",e.showAutocomplete=!1,e.searchResults=!1,e.autocompleteData[t])e.autocompleteData[t][n.id]=n.title;else{var i={};i[n.id]=n.title,e.autocompleteData[t]=i}},e.removeUmiId=function(t,o){delete e.autocompleteData[t][o]},e.getUmi=function(e){return e?void r.path("/board/"+e):(n.generate("No URI argument present","error"),!1)};var g=function(e){if(e<s.simulateDivingMaxTermLength){var t=e*(100/s.simulateDivingMaxTermLength)+"%";document.getElementById(s.simulateDivingDomId).style.backgroundPositionY=t}};e.nRemoveTag=function(t){delete e.autocompleteData[t]},e.nAutocomplete=function(t){var o=e.searchResults.data[t];return e.autocompleteData[o.id]=o.title,e.searchTerm="",e.searchResults="",!1},e.nConfirm=function(e){return e.keyCode==s.keyReturn?(e.preventDefault(),u()):void 0},e.nSearch=function(r){if(r.keyCode==s.keyUp||r.keyCode==s.keyDown)return r.preventDefault(),c(r.keyCode);var u=e.searchTerm,g=u.length;return 1>g?(e.searchResults=!1,!1):(o.cancel(l),l=o(function(){},s.keyboardDelay),void l.then(function(){t.get(a.api+"search/"+u).success(function(t){i.log("Listing results for term: "+u,"info"),t.length>0?e.searchResults={currentSelection:0,data:t}:(e.searchResults=!1,n.generate("No results found :-(","info"))}).error(function(e){n.generate("There was an error with the connection to our API.","error",e)})}))}}angular.module("omApp").controller("SearchController",e).constant("magicForSearch",{keyDown:40,keyUp:38,keyReturn:13,simulateDivingMaxTermLength:40,simulateDivingDomId:"page-layout",keyboardDelay:250}),e.$inject=["$scope","$http","$timeout","$location","notification","logger","magic","magicForSearch"]}(),function(){"use strict";function e(){function e(e,t){t.bind("click",function(e){e.stopPropagation()})}var t={restrict:"A",link:e};return t}angular.module("omApp").directive("stopEvent",e)}(),function(){"use strict";function e(e){function t(t,o){return e.localStorage.setItem(t,JSON.stringify(o)),!0}function o(t){var o=e.localStorage.getItem(t);return o?JSON.parse(o):!1}function r(t){return o(t)?(e.localStorage.removeItem(t),!0):!1}var n={set:t,get:o,remove:r};return n}angular.module("omApp").factory("lStorage",e),e.$inject=["$window"]}(),function(){"use strict";function e(e){function t(t,o){return e.sessionStorage.setItem(t,JSON.stringify(o)),!0}function o(t){var o=e.sessionStorage.getItem(t);return o?JSON.parse(o):!1}function r(t){return o(t)?(e.sessionStorage.removeItem(t),!0):!1}var n={set:t,get:o,remove:r};return n}angular.module("omApp").factory("sStorage",e),e.$inject=["$window"]}();