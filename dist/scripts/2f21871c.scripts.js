"use strict";var app=angular.module("angNewsApp",["ngCookies","ngResource","ngSanitize","ngRoute","firebase","ui.bootstrap","google-maps"]).constant("FIREBASE_URL","https://blinding-fire-5694.firebaseio.com/").constant("APP_NAME","ang-news").constant("APP_VERSION","0.1");app.config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/carousel-home.html",controller:"CarouselHomeCtrl"}).when("/posts",{templateUrl:"views/posts.html",controller:"PostsCtrl"}).when("/posts/:postId",{templateUrl:"views/showpost.html",controller:"PostViewCtrl"}).when("/users/:username",{templateUrl:"views/profile.html",controller:"ProfileCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"AuthCtrl"}).when("/register",{templateUrl:"views/register.html",controller:"AuthCtrl"}).when("/weather",{templateUrl:"views/weather.html",controller:"WeatherCtrl"}).when("/reserve",{templateUrl:"views/reserve.html",controller:"ReservationCtrl"}).when("/map",{templateUrl:"views/map.html",controller:"MapCtrl"}).when("/contacts",{templateUrl:"views/panel.html",controller:"ContactsCtrl"}).when("/services",{templateUrl:"views/panel.html",controller:"ServicesCtrl"}).when("/test",{templateUrl:"views/test.html"}).otherwise({redirectTo:"/"})}]),app.config(["datepickerConfig",function(a){a.showWeeks=!1,a.startingDay=1}]),app.config(["datepickerPopupConfig",function(a){a.showButtonBar=!1}]),app.run(["$rootScope",function(a){a.cfg={siteName:"B&B Gli Olivi",siteLogo:"images/bbgliolivi-logo.png"}}]),app.controller("CarouselHomeCtrl",["$scope","Carousel",function(a,b){a.interval=5e3,a.slides=[],a.getSlides=function(){a.slides=b.getSlides()},a.getSlide=function(c){a.slideId=c,a.slides=b.getSlide({slideId:c})},a.getSlides()}]),app.controller("PostsCtrl",["$scope","$location","Post",function(a,b,c){"/"===b.path()&&(a.posts=c.all),a.resetPost=function(){a.post={url:"http://",title:""}},a.resetPost(),a.submitPost=function(){c.create(a.post).then(function(a){console.log(a),b.path("/posts/"+a.name())})},a.upVotePost=function(a,b){b?c.clearVote(a,b):c.upVote(a)},a.downVotePost=function(a,b){b?c.clearVote(a,!b):c.downVote(a)},a.upVoted=function(a){return c.upVoted(a)},a.downVoted=function(a){return c.downVoted(a)},a.deletePost=function(a){c.delete(a)}}]),app.controller("PostViewCtrl",["$scope","$routeParams","Post",function(a,b,c){a.post=c.find(b.postId),a.addComment=function(){c.addComment(b.postId,a.comment),a.comment=""},a.removeComment=function(b,d){c.deleteComment(a.post,b,d)},a.upVotePost=function(a){a?c.clearVote(b.postId,!0):c.upVote(b.postId)},a.downVotePost=function(a){a?c.clearVote(b.postId,!1):c.downVote(b.postId)},a.upVoted=function(){return c.upVoted(a.post)},a.downVoted=function(){return c.downVoted(a.post)}}]),app.controller("ProfileCtrl",["$scope","$routeParams","Post","User",function(a,b,c,d){function e(){a.posts={},angular.forEach(a.user.posts,function(b){a.posts[b]=c.find(b)})}function f(){a.comments={},angular.forEach(a.user.comments,function(b){var d=c.find(b.postId);d.$on("loaded",function(){a.comments[b.id]=d.$child("comments").$child(b.id),a.commentedPosts[b.postId]=d})})}a.user=d.findByUsername(b.username),a.commentedPosts={},a.user.$on("loaded",function(){e(),f()})}]),app.controller("AuthCtrl",["$scope","$location","Auth","User",function(a,b,c,d){c.signedIn()&&b.path("/"),a.$on("$firebaseSimpleLogin:login",function(){b.path("/")}),a.login=function(){c.login(a.user).then(function(){b.path("/")},function(b){a.error=b.toString()})},a.register=function(){c.register(a.user).then(function(c){d.create(c,a.user.username),b.path("/")},function(b){a.error=b.toString()})}}]),app.controller("NavCtrl",["$scope","$location","Post","Auth",function(a,b,c,d){a.resetPost=function(){a.post={url:"http://",title:""}},a.submitPost=function(){c.create(a.post).then(function(c){a.resetPost(),b.path("/posts/"+c)})},a.logout=function(){d.logout()},a.resetPost()}]),app.controller("WeatherCtrl",["$scope","$rootScope","$log","YahooWeatherFactory",function(a,b,c,d){function e(a,b,c){var d=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"],e=d.length,f=parseInt(a);return d[parseInt((f+360/e/2)/(360/e)%e)]+" "+parseFloat(b).toFixed(1)+" "+c}a.position=null,a.weather=null,a.forecast=null,a.location="Portovenere",a.WOEID="721122",a.units="c",a.title=a.location+" - Weather",a.subtitleLeft="Current weather",a.subtitleRight="Forecast",a.getWeatherForWOEID=function(){d.getWeatherForWOEID(a.WOEID,a.units,function(b){a.currentWeatherForWoeid=b,a.weather={},a.weather.forecast=[{},{},{},{},{}];for(var c=a.currentWeatherForWoeid.query.results.channel,d=0;d<a.weather.forecast.length;d++)a.weather.forecast[d].dayname=c.item.forecast[d].day,a.weather.forecast[d].temperature=c.item.forecast[d].low+"&deg;"+(0===d?"":c.units.temperature+" / "+c.item.forecast[d].high+"&deg;"+c.units.temperature),a.weather.forecast[d].description=c.item.forecast[d].text,0===d&&(a.weather.forecast[d].icon="images/weather/yahoo/white/"+c.item.condition.code+".png",a.weather.forecast[d].humidity="Humidity: "+c.atmosphere.humidity+"%",a.weather.forecast[d].wind="Wind: "+e(c.wind.direction,c.wind.speed,c.units.speed))},function(b){a.currentWeatherForWoeid=null,c.info("Failure: "+b)})},a.getWeatherForWOEID()}]),app.controller("ReservationCtrl",["$scope","$rootScope",function(a,b){a.cfg=b.cfg,a.legend="Reservation",a.thanks="Thanks for your reservation request!<br />We will now contact you by email...",a.fields={namesurname:{title:"Your name and surname",required:!0,minlen:3,maxlen:48},howmany:{title:"How many persons you are",required:!0,min:1,max:2},car:{title:"Do you need parking?",required:!0},when:{title:"The date of your arrival",required:!0},duration:{title:"The nights you will stay",required:!0,min:2,max:"undefined"},time:{title:"The time of your arrival",required:!0,minhour:12,maxhour:21,times:[]},email:{title:"Your email address",required:!0},phone:{title:"Your phone number",required:!1},info:{title:"Other info...",required:!1}};for(var c=a.fields.time.minhour;c<=a.fields.time.maxhour;c++)a.fields.time.times.push((10>c?"0"+c:c)+":00");a.submitForm=function(){a.resForm.submitted=a.resForm.$valid?!0:!0},a.resetForm=function(){a.resForm.$setPristine(!0),a.resForm.submitted=!1}}]),app.controller("DatepickerCtrl",["$scope",function(a){a.minDate=new Date,a.maxDate=new Date,a.maxDate.setYear(a.maxDate.getFullYear()+2),a.format="fullDate",a.disabled=function(a,b){return"day"===b&&17===a.getDate()}}]),app.controller("PhoneCtrl",["$scope",function(a){a.phoneNumberPattern=function(){var b=/^\+?[0-9 \-\.]{10,}\*?$/;return{test:function(c){return a.requirePhone===!1?!0:b.test(c)}}}()}]),app.controller("MapCtrl",["$scope","$rootScope",function(a,b){var c=44.05954,d=9.84278,e=13;angular.extend(a,{map:{center:{latitude:c,longitude:d},zoom:e,draggable:!0,options:{streetViewControl:!1,panControl:!1,maxZoom:20,minZoom:3,mapTypeId:google.maps.MapTypeId.HYBRID,mapTypeControl:!1},tooltip:b.cfg.siteName}})}]),app.controller("ContactsCtrl",["$scope","$rootScope",function(a,b){a.cfg=b.cfg,a.title="Contact us",a.fields=[{key:"Address",val:"Via II Traversa Olivo, 13 - 19025 - Portovenere (SP)",glyphicon:"home",ord:1},{key:"Phone",val:"+39 0187 790224",glyphicon:"phone-alt",ord:2},{key:"Mobile",val:" +39 349 2405593",glyphicon:"phone",ord:3},{key:"Email",val:"gliolivi@portovenere.biz",glyphicon:"envelope",ord:4},{key:"Web",val:"www.portovenere.biz",glyphicon:"globe",ord:5}]}]),app.controller("ServicesCtrl",["$scope","$rootScope",function(a,b){a.cfg=b.cfg,a.title="Prices and Services",a.fields=[{key:"Room",val:"Double, with private bathroom",glyphicon:"map-marker",ord:1},{key:"Parking",val:"One reserved place",glyphicon:"record",ord:2},{key:"Foreign languages spoken",val:"English, French",glyphicon:"globe",ord:3},{key:"Double room price in low season (1/10 - 31/5)",val:"90€ per night",glyphicon:"usd",ord:4},{key:"Double room price in middle season (1/6 - 30/9)",val:"100€ per night",glyphicon:"usd",ord:5},{key:"Double room price in high season (1/8 - 31/8)",val:"120€ per night",glyphicon:"usd",ord:6},{key:"Breakfast",val:"Inclusive",glyphicon:"cutlery",ord:7},{key:"Additional services",val:"Fridge bar, TV sat, WI-FI",glyphicon:"plus-sign",ord:8}]}]),app.factory("Post",["$firebase","FIREBASE_URL","User",function(a,b,c){var d=new Firebase(b+"posts"),e=a(d),f={all:e,create:function(a){if(c.signedIn()){var b=c.getCurrent();return a.owner=b.username,e.$add(a).then(function(a){var c=a.name();return b.$child("posts").$child(c).$set(c),c})}},find:function(a){return e.$child(a)},"delete":function(a){if(c.signedIn()){var b=f.find(a);b.$on("loaded",function(){var d=c.findByUsername(b.owner);e.$remove(a).then(function(){d.$child("posts").$remove(a)})})}},addComment:function(a,b){if(c.signedIn()){var d=c.getCurrent();b.username=d.username,b.postId=a,e.$child(a).$child("comments").$add(b).then(function(b){d.$child("comments").$child(b.name()).$set({id:b.name(),postId:a})})}},upVote:function(a){if(c.signedIn()){var b=c.getCurrent(),d=e.$child(a);d.$child("upvotes").$child(b.username).$set(b.username).then(function(){b.$child("upvotes").$child(a).$set(a),d.$child("downvotes").$remove(b.username),b.$child("downvotes").$remove(a),d.$child("score").$transaction(function(a){return a?a+1:1})})}},downVote:function(a){if(c.signedIn()){var b=c.getCurrent(),d=e.$child(a);d.$child("downvotes").$child(b.username).$set(b.username).then(function(){b.$child("downvotes").$child(a).$set(a),d.$child("upvotes").$remove(b.username),b.$child("upvotes").$remove(a),d.$child("score").$transaction(function(a){return void 0===a||null===a?-1:a-1})})}},clearVote:function(a,b){if(c.signedIn()){var d=c.getCurrent(),f=d.username,g=e.$child(a);g.$child("upvotes").$remove(f),g.$child("downvotes").$remove(f),d.$child("upvotes").$remove(a),d.$child("downvotes").$remove(a),g.$child("score").$transaction(function(a){return b?a-1:a+1})}},upVoted:function(a){return c.signedIn()&&a.upvotes?a.upvotes.hasOwnProperty(c.getCurrent().username):void 0},downVoted:function(a){return c.signedIn()&&a.downvotes?a.downvotes.hasOwnProperty(c.getCurrent().username):void 0},deleteComment:function(a,b,d){if(c.signedIn()){var e=c.findByUsername(b.username);a.$child("comments").$remove(d).then(function(){e.$child("comments").$remove(d)})}}};return f}]),app.factory("Auth",["$firebaseSimpleLogin","FIREBASE_URL","$rootScope",function(a,b,c){var d=new Firebase(b),e=a(d),f={register:function(a){return e.$createUser(a.email,a.password)},login:function(a){return e.$login("password",{email:a.email,password:a.password,rememberMe:!0})},signedIn:function(){return null!==e.user},logout:function(){e.$logout()}};return c.signedIn=function(){return f.signedIn()},f}]),app.factory("User",["$firebase","FIREBASE_URL","$rootScope",function(a,b,c){function d(a){c.currentUser=h.findByUsername(a)}function e(){delete c.currentUser}var f=new Firebase(b+"users"),g=a(f),h={create:function(a,b){g[b]={md5_hash:a.md5_hash,username:b,$priority:a.uid},g.$save(b).then(function(){d(b)})},findByUsername:function(a){return a?g.$child(a):void 0},getCurrent:function(){return c.currentUser},signedIn:function(){return void 0!==c.currentUser}};return c.$on("$firebaseSimpleLogin:login",function(b,c){var e=a(f.startAt(c.uid).endAt(c.uid));e.$on("loaded",function(){d(e.$getIndex()[0])})}),c.$on("$firebaseSimpleLogin:logout",function(){e()}),h}]),app.factory("YahooWeatherFactory",["$rootScope","$http",function(a,b){var c='http://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid="{woeid}" and u="{units}" &format=json';return{getWeatherForWOEID:function(a,d,e,f){var g=c.replace("{woeid}",a).replace("{units}",d);b.get(g).success(function(a){e(a)}).error(function(a){f(a)})}}}]),app.factory("Carousel",["$resource",function(a){var b="//localhost/ang-news/api/";return a(b+"slide/:slideId",{slideId:"@slideId"},{getSlides:{method:"GET",isArray:!0},getSlide:{method:"GET",params:{slideId:"@slideId"},isArray:!0}})}]),app.filter("hostnameFromUrl",function(){return function(a){var b=document.createElement("a");return b.href=a,b.hostname}}),app.filter("capitalize",function(){return function(a){return a&&null!==a?(a=a.toLowerCase(),a.substring(0,1).toUpperCase()+a.substring(1)):void 0}}),app.directive("checkUsername",["User",function(a){var b=/^[^.$\[\]#\/\s]+$/;return{require:"ngModel",link:function(c,d,e,f){f.$parsers.unshift(function(c){return b.test(c)?0===a.findByUsername(c).$getIndex().length?(f.$setValidity("taken",!0),f.$setValidity("invalid",!0),c):(f.$setValidity("taken",!1),void f.$setValidity("invalid",!0)):(f.$setValidity("taken",!0),void f.$setValidity("invalid",!1))})}}}]),app.directive("formAutofillFix",function(){return{link:function(a,b,c,d){a.$watch(function(){return b.val()},function(a,b){a!==b&&d.$setViewValue(a)})}}}),app.directive("ngFocus",[function(){var a="ng-focused";return{restrict:"A",require:"ngModel",link:function(b,c,d,e){e.$focused=!1,c.bind("focus",function(){c.addClass(a),b.$apply(function(){e.$focused=!0})}).bind("blur",function(){c.removeClass(a),b.$apply(function(){e.$focused=!1})})}}}]),app.directive("paypalButton",function(){return{restrict:"E",scope:{},compile:function(a,b){function c(b){a.replaceWith('<span style="background-color:red; color:yellow; padding:.5em;">'+g+": "+b+"</span>")}var d=["en_US","es_ES","fr_FR","it_IT","de_DE"],e=["AUD","CAD","CZK","DKK","EUR","HKD","HUF","ILS","JPY","MXN","NOK","NZD","PHP","PLN","GBP","RUB","SGD","SEK","CHF","TWD","THB","USD"],f=["SM","LG"],g=this.name,h=b.action||"https://www.paypal.com/us/cgi-bin/webscr",i=b.business,j=b.languageCode||"en_US",k=b.currencyCode||"USD",l=b.itemName,m=parseFloat(b.amount),n=b.buttonSize||"SM",o=b.imgAlt||"Make payments with PayPal - it's fast, free and secure!";if(!i)return c("business not specified!");if(!l)return c("item name not specified!");if(!m)return c("amount not specified!");if(isNaN(m))return c("amount is not a number!");if(d.indexOf(j)<0)return c("unforeseen language code!");if(e.indexOf(k)<0)return c("unforeseen currency code!");if(f.indexOf(n)<0)return c("unforeseen button size!");var p="http://www.paypalobjects.com/"+j+"/i/btn/btn_buynow_"+n+".gif",q='<form name="_xclick" action="'+h+'" method="post"><input type="hidden" name="cmd" value="_xclick"><input type="hidden" name="business" value="'+i+'"><input type="hidden" name="currency_code" value="'+k+'"><input type="hidden" name="item_name" value="'+l+'"><input type="hidden" name="amount" value="'+m+'"><input type="image" src="'+p+'" border="0" name="submit" alt="'+o+'"></form>';a.replaceWith(q)}}});