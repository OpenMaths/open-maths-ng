app.controller("BoardController",["$scope","$rootScope","$http","$timeout","$routeParams",function(e,t,o,s,a){t.title="Board",t.navTopTransparentClass=!1,e.grid=[],e.rows=sessionStorage.getItem("gridRows")?parseInt(sessionStorage.getItem("gridRows")):3,e.columns=sessionStorage.getItem("gridColumns")?parseInt(sessionStorage.getItem("gridColumns")):3;var n=a.id;for(i=0;i<e.rows;i++){var r=[];for(c=0;c<e.columns;c++)r.push(c);e.grid.push(r)}e.manageGrid=function(t,o){if("row"==o){var s=[];for(i=0;i<e.columns;i++)s.push(i);switch(t){case"add":if(e.rows>5)return!1;e.rows=e.rows+1,e.grid.push(s);break;case"remove":if(e.rows<3)return!1;e.rows=e.rows-1,e.grid.pop()}sessionStorage.setItem("gridRows",e.rows)}else if("column"==o){switch(t){case"add":if(e.columns>5)return!1;for(i=0;i<e.rows;i++)e.grid[i].push(e.columns);e.columns=e.columns+1;break;case"remove":if(e.columns<3)return!1;for(i=0;i<e.rows;i++)e.grid[i].pop();e.columns=e.columns-1}sessionStorage.setItem("gridColumns",e.columns)}};var l=function(t,i,a,n){var r=function(){e.fadeInUmi=!0},l="uriFriendlyTitle"==t?appConfig.apiUrl+"/"+i:appConfig.apiUrl+"/"+t+"/"+i;o.get(l).success(function(t){n&&(t.targetClasses=n),e.grid[a[0]][a[1]]=t,s(r,250)}).error(function(){e.notification={message:"There was an error loading the requested contribution.",type:"error",act:!0},s(function(){e.notification.act=!1},2500)})};l("uriFriendlyTitle",n,[1,1]),e.position=function(e,t,o,i){var s=[];if("up"==o)var a=[e-1,t];else if("down"==o)var a=[e+1,t];else if("left"==o)var a=[e,t-1];else if("right"==o)var a=[e,t+1];0==a[0]?s.push("closes-top"):2==a[0]?s.push("closes-bottom"):0==a[1]?s.push("closes-left"):2==a[1]&&s.push("closes-right"),l("id",i,[a[0],a[1]],s.join(" "))}}]),app.controller("ContributeController",["$scope","$rootScope","$http","$location","$timeout","$routeParams",function(e,t,o,i,s,a){if(e.omUser||(alert("You must be logged in to Contribute to OpenMaths!"),i.path("/")),t.title="Contribute",a.edit){var n=a.edit.split(":");"edit"!==n[0]&&i.path("/contribute"),o.get(appConfig.apiUrl+"/"+n[1]).success(function(o){e.editUmiData=o,t.title=e.editUmiData.title.title,e.createUmiForm={type:{id:o.umiType,label:o.umiType},title:o.title.title,titleSynonyms:o.titleSynonyms,latexContent:o.latexContent,seeAlso:o.seeAlso,tags:o.tags}}).error(function(){e.notification={message:"There was an error loading the requested contribution.",type:"error",act:!0},s(function(){e.notification.act=!1},2500)})}t.navTopTransparentClass=!1,e.errorMessages={required:"This field is required.",maxLength:"This field is exceeding the maximum length of 128 characters.",umiTitle:"The title should only consist of letters, spaces, or hyphens"},e.instructions={type:"What category of information?",title:"Users will be able to search your contribution.",titleSynonyms:"Comma-separated list of alternative names.",latexContent:"The actual content. You are free to use LaTeX (including text-mode macros!!).",prerequisiteDefinitions:"Comma-separated list of valid dependency Titles.",seeAlso:"Comma-separated list of valid Titles which may be related.",tags:"Comma-separated list of tags to help users find your contribution.",dispatch:"Submitting your contribution will create a request to pull the content into our database."},e.umiTypes=[{id:"Definition",label:"Definition"},{id:"Axiom",label:"Axiom"},{id:"Theorem",label:"Theorem"},{id:"Lemma",label:"Lemma"},{id:"Corollary",label:"Corollary"},{id:"Conjecture",label:"Conjecture"},{id:"Proof",label:"Proof"},{id:"HistoricalNote",label:"Historical Note"},{id:"PhilosophicalJustification",label:"Philosophical Justification"},{id:"Diagram",label:"Diagram"},{id:"Example",label:"Example"}],e.createUmi=function(){var t=e.createUmiForm,o={author:e.omUser.email,message:"Initialise UMI",content:t.latexContent,title:t.title,titleSynonyms:t.titleSynonyms?[t.titleSynonyms]:[],prerequisiteDefinitionIds:t.prerequisiteDefinitions?[t.prerequisiteDefinitions]:[],seeAlsoIds:t.seeAlso?[t.seeAlso]:[],tags:t.tags?[t.tags]:[],umiType:t.type.id};if(e.editUmiData)var i={umiId:e.editUmiData.id,author:e.omUser.email,message:"Update UMI",newLatex:t.latexContent};var a=e.editUmiData?i:o;console.log(a);var n=e.editUmiData?["PUT","update-latex"]:["POST","add"],r=new XMLHttpRequest,l="http://127.0.0.1:8080/"+n[1],c=JSON.stringify(a);r.open(n[0],l,!0),r.setRequestHeader("Content-type","application/json;charset=UTF-8"),r.onreadystatechange=function(){4!=r.readyState?(e.notification={message:"Your contribution was successfully posted!",type:"success",act:!0},s(function(){e.notification.act=!1},2500)):(e.notification={message:"There was an error ("+r.status+") making the request. Please check your contribution again before posting",type:"error",act:!0},s(function(){e.notification.act=!1},2500))},r.send(c)},e.assignData={},e.assignDataAll={},e.assignUmiId=function(t,o){var i=e.searchResults[t],s=i.data[o];e.assignData[s.id]=s.title,e.createUmiForm.prerequisiteDefinitions="",e.showSearchResults=!1,e.assignDataAll[t]=e.assignData},e.search=function(t){var i=e.createUmiForm[t],s=i.length;s>0?(e.showSearchResults=t,o.get(appConfig.apiUrl+"/search/"+i).success(function(o){e.searchResults={};var i={currentSelection:0,data:o};e.searchResults[t]=i,console.log(e.searchResults)}).error(function(e,t){alert("No data to display :-("),console.log(e+" | "+t)})):e.searchResults=!1}}]),app.controller("DiveController",["$scope","$rootScope","$http","$location",function(e,t,o,s){t.title="Dive Into",t.navTopTransparentClass=!0,e.searchUmiKeyDown=function(){var t=e.searchUmiTerm.length,s=2.5*t+"%";40>t&&(document.getElementById("masthead").style.backgroundPositionY=s),t>0?o.get(appConfig.apiUrl+"/search/"+e.searchUmiTerm).success(function(t){var o=100/(t.length+1),s=1;for(i=t.length;--i>=0;){var a=Math.floor(o*s)+"%";t[i].score=a,s+=1}e.searchUmiResults={currentSelection:0,data:t},console.log(e.searchUmiResults)}).error(function(e,t){alert("No data to display :-("),console.log(e+" | "+t)}):e.searchUmiResults=!1},e.getUmi=function(t){return t||e.searchUmiResults?(sessionStorage.setItem("umiLastSearchTitle",e.searchUmiTerm),sessionStorage.setItem("umiLastSearchResults",JSON.stringify(e.searchUmiResults)),void s.path("/board/"+t)):!1}}]),app.controller("FeaturesController",["$scope","$rootScope",function(e,t){t.title="Features",t.navTopTransparentClass=!0}]),app.controller("GlobalController",["$scope","$location","$window","$http","$timeout",function(e,t,o,i,s){function a(){var i=t.url().split("/");e.path=""==i[1]?"dive":i[1],o.ga("send","pageview",{page:t.path()})}if(console.log("OpenMaths is now running"),e.$watch(function(){return t.path()},a),e.setTheme=function(t){e.themeClass=t,localStorage.setItem("themeClass",t)},e.themeClass=localStorage.getItem("themeClass")?localStorage.getItem("themeClass"):"light",e.setUmiFont=function(t){e.umiFontClass=t,localStorage.setItem("umiFontClass",t)},e.umiFontClass=localStorage.getItem("umiFontClass")?localStorage.getItem("umiFontClass"):"umi-font-modern",sessionStorage.getItem("omUser")){var n=sessionStorage.getItem("omUser");e.omUser=JSON.parse(n)}e.googleSignIn=function(){return e.omUser?!1:void gapi.auth.signIn({callback:function(t){if(t.status.signed_in){var o=gapi.auth.getToken();i.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token="+o.access_token).success(function(t){e.omUser=t,sessionStorage.setItem("omUser",JSON.stringify(t)),e.notification={message:"You are now signed in as "+t.email+".",type:"success",act:!0},s(function(){e.notification.act=!1},2500)}).error(function(){e.notification={message:"There was an error during the sign in process.",type:"error",act:!0},s(function(){e.notification.act=!1},2500)})}else e.notification={message:"There was an error ("+t.error+") during the sign in process.",type:"error",act:!0},s(function(){e.notification.act=!1},2500)}})},e.googleSignOut=function(){gapi.auth.signOut(),e.omUser=!1,sessionStorage.removeItem("omUser"),e.notification={message:"You have been successfully signed out.",type:"info",act:!0},s(function(){e.notification.act=!1},2500)},e.accessUrlUser=function(o,i,a){return e.omUser?void t.url("/"+o):(e.notification={message:i,type:a,act:!0},s(function(){e.notification.act=!1},2500),!1)},e.searchResultsNavigate=function(e,t){if(!e)return!1;var o=Object.keys(e.data).length,i=e.currentSelection;38==t.keyCode&&i>0?e.currentSelection=i-1:40==t.keyCode&&o-1>i&&(e.currentSelection=i+1)}}]),app.controller("OoopsController",["$scope","$rootScope",function(e,t){t.title="Ooops"}]),app.controller("SassController",["$scope","$rootScope","$location",function(e,t){t.title="SASS Library"}]);