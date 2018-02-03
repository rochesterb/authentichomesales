var app = angular.module("myApp", ["ngRoute"]);
var locationhost = '';
var serverbaseurl = location.origin;
var host = serverbaseurl + "/app";
//host = "https://honesthomesales.localtunnel.me/app"
var htmlfolder = host + "/demo";

console.log("public folder : " + htmlfolder);
console.log("serverbaseurl: " + host);
var services = {
    /*    mainapi: "http://c4ca0162.ngrok.io/app/api.php/",
        listapi: "http://c4ca0162.ngrok.io/app/list.php/",
        loginapi: "http://c4ca0162.ngrok.io/app/login.php/"  */
    mainapi: host + "/api.php/",
    listapi: host + "/list.php/",
    loginapi: host + "/login.php/"
}
app.controller('login', function($scope, $http, $window) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $scope.loginsubmit = function() {
        $http({
            method: 'POST',
            url: services.loginapi,
            data: $.param({
                username: $scope.username,
                password: $scope.password
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(data) {

            if (data.result == "success" || data.data.result == "success") {
                var bid = data.data.brokerid || data.brokerid;
                var username = data.data.username || data.username;
                localStorage.setItem("brokerId", bid);
                localStorage.setItem("brokername", username);

                //$window.location.href = (location.host == "localhost") ? "/hhs/demo/broker.html" : "http://dollardreamsvillas.com/honesthomesales/broker.html";

                $window.location.href = htmlfolder + "/broker.html";

                DOM(".alert-danger").addClass("hidden")
            } else {

                DOM(".alert-danger").removeClass("hidden")
            }
            DOM("#loginmodal").modal('hide'); // handle success things
        });



    }
});

app.controller('sectioncount', function($scope, $http) {
    $http.get(host + "/counts.php").then(function(response) {
        $scope.counts = response.data;
    });
});

app.controller('mainController', function($scope, $http, $timeout, $location) {
	$scope.brokerId = localStorage.getItem("brokerId");
    $scope.brokerName = localStorage.getItem("brokername");
	console.log("==="+localStorage.getItem("brokername"))

    $scope.buyerId = 0;
    $scope.sellerId = 0;
	$scope.isActive = function(route) {

        return route === $location.path();
    }
    $scope.edit_buyer = function(buyerId) {
        $scope.buyerId = buyerId;
        $http.get(services.mainapi + "buyers/" + buyerId).then(function(response) {
            $scope.buyerdataedit = response.data;
            DOM("#modal-editbuyer").modal('show');
        });

    }

    $scope.editbuyersubmit = function() {
        $scope.buyerdataedit.BrokerId = $scope.BrokerId;
        $http({
            method: 'PUT',
            url: services.mainapi + "buyers/" + $scope.buyerId,
            data: $scope.buyerdataedit,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(data) {
            DOM(".editsuccessadded").removeClass('hidden');
            // DOM("#modal-editbuyer").modal('hide');
            $timeout(function() {
                DOM(".editsuccessadded").addClass('hidden');
                //DOM("#section-buyer ul li").eq('0').find("a").trigger("click");
                window.location.reload();


            }, 100)
        });

    }


    $scope.edit_seller = function(sellerId) {
        $scope.sellerId = sellerId;
        $http.get(services.mainapi + "sellers/" + sellerId).then(function(response) {
            $scope.sellerdataedit = response.data;
            DOM("#modal-editseller").modal('show');
        });

    }
    $scope.editsellersubmit = function() {
		$scope.sellerdataedit.BrokerId = $scope.BrokerId;
        $http({
            method: 'PUT',
            url: services.mainapi + "sellers/" + $scope.sellerId,
            data: $scope.sellerdataedit,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(data) {
            DOM(".editsuccessadded").removeClass('hidden');
            //DOM("#editsellerform").addClass('hidden');
            $timeout(function() {
                DOM(".editsuccessadded").addClass('hidden');
                //DOM("#editsellerform").removeClass('hidden');
                window.location.reload();

            }, 100)
        });

    }
	$scope.editprop = function(propId) {
        $scope.propId = propId;
        $http.get(services.mainapi + "properties/" + propId).then(function(response) {
            $scope.propdataedit = response.data;
            DOM("#modal-editprop").modal('show');

        });

    }
$scope.editpropsubmit = function() {
		$scope.propdataedit.BrokerId = $scope.BrokerId
//		DOM("#modal-editprop").modal('hide');
//		DOM("#modal_wait").modal('show');
        $http({
            method: 'PUT',
            url: services.mainapi + "properties/" + $scope.propId,
            data: $scope.propdataedit,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(data) {
            DOM(".propeditsuccess").removeClass('hidden');
            //DOM("#editsellerform").addClass('hidden');
            $timeout(function() {
                DOM(".propeditsuccess").addClass('hidden');
                //DOM("#editsellerform").removeClass('hidden');
                window.location.reload();

            }, 100)
        });

    }
 $scope.deleteprop = function(prop) {
        $http({
            method: 'DELETE',
            url: services.mainapi + "properties/" + prop,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(data) {
           // DOM(".delete_buyer_success").removeClass('hidden');
            $timeout(function() {
              //  DOM(".delete_buyer_success").addClass('hidden');
window.location.reload();

            }, 1000)
        });

    }


})

app.controller('section-property', function($scope, $http, $timeout) {
	console.log("property call")
    $scope.prop = {};

    $scope.propListDB = function() {
        $http.get(services.listapi + "properties").then(function(response) {
            $scope.propertiesList = response.data;
            $scope.prop = response.data;
             localStorage.setItem("propertyListGlobal", response.data)

        });
    }
	$scope.hoverIn = function(ind){
		//console.log(ind)
		DOM(".prop"+ind).addClass("flip");
	}
	$scope.hoverOut = function(ind){
		//console.log(ind)
		DOM(".prop"+ind).removeClass("flip");
	}
    $scope.propListDB();
    $scope.addprop = {};
    $scope.addprop.BrokerId = $scope.brokerId;
    $scope.addprop.SellerId = $scope.SellerId;
    $scope.addpropertysubmit = function(bid) {
        $http({
            method: 'POST',
            url: services.mainapi + "properties",
            data: $scope.property,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(data) {
            DOM(".successpropadd").removeClass('hidden');
            DOM("#addpropertyform").addClass('hidden');
            $timeout(function() {
                DOM(".successpropadd").addClass('hidden');
                DOM("#addpropertyform").removeClass('hidden');
				window.location.reload();

            }, 100)
        });

    }
})

app.controller('sellerList', function($scope, $http, $location) {
    $scope.sellerListDB = function() {
        $http.get(services.listapi + "sellers").then(function(response) {
            $scope.sellerrecord = response.data;
        });

    }
    $scope.sellerListDB();
    $scope.sellerId = 0;


    $scope.editsellerdata = {};
    $scope.editSeller = function(a, b) {
        $scope.sellerId = a;
        $http.get(services.mainapi + "sellers/" + a).then(function(response) {
            $scope.editsellerdata = response.data;
            DOM("#editsellerform").removeClass("hidden")
            //$scope.apply();

        });
    }


    $scope.seller = {};


    $scope.delete_seller = function(sellerId) {
        $http({
            method: 'DELETE',
            url: services.mainapi + "sellers/" + sellerId,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(data) {
            DOM(".delete_seller_success").removeClass('hidden');
            DOM(".delete_seller_success").addClass('hidden');

            $timeout(function() {
                DOM(".delete_seller_success").addClass('hidden');
                DOM(".delete_seller_success").removeClass('hidden');


            }, 100)
            	window.location.reload();
        });

    }


    $scope.seller.BrokerId = $scope.brokerId ;
    $scope.addsellersubmit = function(bid) {
        $http({
            method: 'POST',
            url: services.mainapi + "sellers",
            data: $scope.seller,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(data) {
            DOM(".successadded").removeClass('hidden');
            DOM("#addsellerform").addClass('hidden');
            $timeout(function() {
                DOM(".successadded").addClass('hidden');
                DOM("#addsellerform").removeClass('hidden');

            }, 100)
        });
    }




});


app.controller('buyerList', function($scope, $http, $timeout) {
    $scope.buyerListDB = function() {
        $http.get(services.listapi + "buyers").then(function(response) {
            $scope.buyerrecord = response.data;
        });
    }
    $scope.buyerListDB();
    $scope.buyerdataedit = {};

    $scope.delete_buyer = function(buyerId) {
        $http({
            method: 'DELETE',
            url: services.mainapi + "buyers/" + buyerId,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(data) {
            DOM(".delete_buyer_success").removeClass('hidden');
            $timeout(function() {
                DOM(".delete_buyer_success").addClass('hidden');


            }, 100)
        });

    }


//    $scope.buyer = {};
    $scope.buyer.BrokerId = $scope.brokerId;
    $scope.addbuyersubmit = function(bid) {
        $http({
            method: 'POST',
            url: services.mainapi + "buyers",
            data: $scope.buyer,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(data) {
            DOM(".successadded").removeClass('hidden');
            DOM("#addbuyerform").addClass('hidden');
            $timeout(function() {
                DOM(".successadded").addClass('hidden');
                DOM("#addbuyerform").removeClass('hidden');

            }, 100)
        });
    }


});

app.controller('campaignCtrl', function($scope, $http, $timeout) {
	$scope.propertyListGlobal = {};
	console.log("camp");
	console.log(localStorage.getItem("propertyListGlobal"))
	//if(!(localStorage.getItem("propertyListGlobal"))){
		console.log("if===");
		 $http.get(services.listapi + "properties").then(function(response) {
           $scope.propertyListGlobal = response.data;
            // localStorage.setItem("propertyListGlobal", response.data);

        });
		$http.get(services.listapi + "buyers").then(function(response) {
           $scope.buyersListGlobal = response.data;
            // localStorage.setItem("propertyListGlobal", response.data);

        });
	//}else{
		//console.log("Else===");
		 //$scope.propertyListGlobal = localStorage.getItem("propertyListGlobal");
	//}



});

app.controller('notesCtrl', function($scope, $http, $timeout) {
    $scope.notesListDB = function() {
        $http.get(services.listapi + "notes").then(function(response) {
            $scope.notesrecord = response.data;
        });
    }
    $scope.notesListDB();
    $scope.notesdataedit = {};

    $scope.delete_note = function(noteId) {
        $http({
            method: 'DELETE',
            url: services.mainapi + "notes/" + noteId,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(data) {
            DOM(".delete_note_success").removeClass('hidden');
            $timeout(function() {
                DOM(".delete_note_success").addClass('hidden');
            }, 1000)
        });

    }


    $scope.note = {};
    $scope.note.NotesId = $scope.noteId;
    $scope.addnotesubmit = function(noteid) {
        $http({
            method: 'POST',
            url: services.mainapi + "notes",
            data: $scope.note,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(data) {
            DOM(".successadded").removeClass('hidden');
            DOM("#addnoteform").addClass('hidden');
            $timeout(function() {
                DOM(".successadded").addClass('hidden');
                DOM("#addnoteform").removeClass('hidden');

            }, 100)
        });
    }


});




app.directive('ngConfirmClick', [
    function() {
        return {
            link: function(scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click', function(event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction)
                        //	alert("yes")
                    }
                });
            }
        };
    }
])



app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "../demo/components/home.html",
            activetab: "home"
        })
        .when("/section-seller", {
            templateUrl: "../demo/components/seller.html",
            activetab: "seller"

        }).when("/section-buyer", {
            templateUrl: "../demo/components/buyer.html",
            activetab: "buyer"

        }).when("/section-property", {
            templateUrl: "../demo/components/property.html"
        }).when("/section-campaign", {
            templateUrl: "../demo/components/campaign.html"
        }).when("/section-notes", {
            templateUrl: "../demo/components/notes.html"
        }).otherwise({
            redirectTo: '/'
        });


})

$(document).ready(function() {
    var navHeight = $(document).height();
    var screenWidth = $("body").width();
    if (screenWidth > 1024) {
        $("head").append("<style>.m-h" + navHeight + "{min-height:" + navHeight + "px!important}</style>");
        $(".v-nav").addClass("m-h" + navHeight)
    }
	$("#property-list .thumbnail").on("hover",function(){
		//$(this).addClass('flip');
	})




})

function DOM(selector) {
    return angular.element(document.querySelectorAll(selector));
}



app.controller('notesCtrl', function($scope, $http, $timeout) {
    $scope.notesListDB = function() {
        $http.get(services.listapi + "notes").then(function(response) {
            $scope.notesRecord = response.data;
        });
    }
    $scope.notesListDB();
    $scope.delete_notes = function(noteId) {
        $http({
            method: 'DELETE',
            url: services.mainapi + "notes/" + noteId,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(data) {
            DOM(".delete_notes_success").removeClass('hidden');
            $timeout(function() {
                DOM(".delete_notes_success").addClass('hidden');


            }, 1000)
        });

    }


    $scope.notes = {};
    $scope.notes.BrokerId = $scope.brokerId;
    $scope.addNotessubmit = function(bid) {
        $http({
            method: 'POST',
            url: services.mainapi + "notes",
            data: $scope.notes,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function(data) {
            DOM(".successadded").removeClass('hidden');
            DOM("#addnotesform").addClass('hidden');
            $timeout(function() {
                DOM(".successadded").addClass('hidden');
                DOM("#addnotesform").removeClass('hidden');

            }, 100)
        });
    }


});