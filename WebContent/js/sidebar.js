

app.directive('extLink', function() {
  return {
    restrict: 'A',
    link: function(scope, elem) {
      console.log(elem);
      elem.bind('click', function(e) {
          console.log("sidebar");
        console.log(e);
        e.preventDefault();
        $("#wrapper").toggleClass("active")
      });
    }
  };
})

app.controller('cnt', function($scope) {
  
});