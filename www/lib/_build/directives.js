app.directive("navTop",function(){return{restrict:"A",templateUrl:"views/partials/nav-top.html",scope:!0,transclude:!1}}),app.directive("notification",function(){return{restrict:"A",templateUrl:"views/partials/notification.html",scope:!0,transclude:!1}}),app.directive("omBind",["$compile",function(t){return{restrict:"A",replace:!0,link:function(i,n,e){i.$watch(e.omBind,function(e){n.html(e),t(n.contents())(i),MathJax.Hub.Queue(["Typeset",MathJax.Hub,n[0]])})}}}]),app.directive("stopEvent",function(){return{restrict:"A",link:function(t,i){i.bind("click",function(t){t.stopPropagation()})}}});