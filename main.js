
var app = angular.module('myApp',[])

app.controller('myCtrl',function ($scope,$http,$window) {
	console.log('hi')
    $scope.cart_items = []
    arr_mainList = window.main_json
    $scope.totalProducts = arr_mainList.length
    $scope.tags_arr = []

    for (var i = arr_mainList.length - 1; i >= 0; i--) {
        compare_at_price = parseInt(arr_mainList[i]['compare_at_price'])
        price            = parseInt(arr_mainList[i]['price'])
        discount = (compare_at_price - price)/compare_at_price
        discount = Math.round(discount*100)
        arr_mainList[i]['discount'] = discount
        arr_mainList[i]['display_options'] = 0;
        arr_mainList[i]['ATC_display'] = 0;
        tag_name = arr_mainList[i].tag
        $scope.tags_arr.push(tag_name)
    }
    $scope.tags_arr = [...new Set($scope.tags_arr)]
    
    
    angular.element($window).bind('resize', function() {
        check_screen_size()
        console.log($scope.mainList)
    });
    function check_screen_size(){
        $scope.split_size = 5
        if($(window).width()>1024){
            $scope.split_size = 5
        }else if($(window).width()<=1024 && $(window).width()>786){
            $scope.split_size = 3
        }else if($(window).width()<=786 && $(window).width()>425){
            $scope.split_size = 2
        }else{
            $scope.split_size = 1
        }
        $scope.mainList = chunk_arr(arr_mainList);

    }
    $(document).on('click', '.dropdown-menu', function (e) {
        e.stopPropagation();
    });
    function chunk_arr(arr){
        return_arr = []
        for(x =0 ; x<arr.length ; x+=$scope.split_size){
            main = arr.slice(x,x+$scope.split_size)
            return_arr.push(main)
        }
        return return_arr
    }
    $scope.filter_tag = function(tag_name){
        if(tag_name != 'all'){
            temp_arr = angular.copy(arr_mainList)
            temp_arr = temp_arr.filter((v)=> v.tag.toLowerCase() == tag_name.toLowerCase())
            $scope.mainList = chunk_arr(temp_arr);
        }else{
            $scope.mainList = chunk_arr(arr_mainList);
        }
        $scope.filter_applied = 1;
    }
    $scope.clear_filter = function(){
        $scope.mainList = chunk_arr(arr_mainList);
        $scope.filter_applied = 0;
    }
    $scope.sort_by_price = function(order){
        $scope.filter_applied = 1;
        temp = angular.copy(arr_mainList)
        if (order=='desc') {
            temp.sort((v,d)=> (parseInt(v.price) >= parseInt(d.price))? -1 : 1)
        }else{
            temp.sort((v,d)=> (parseInt(v.price) < parseInt(d.price))? -1 : 1)
        }
        $scope.mainList = chunk_arr(temp);
    }

    $scope.size_option_index = 0

    $scope.add_to_cart = function(item){
        var cart = $(".cart_icon");
        var current_div = $("#display_options_"+item.id);
        var imgtodrag = $('<img width="30px" height="30px" src="'+item.image_src[0]+'"/>')
        var position = cart.position();

        if (imgtodrag) {
            var imgclone = imgtodrag.clone()
            .offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            })
            .css({
                'opacity': '0.7',
                'position': 'absolute',
                'height': '10vh',
                'width': '10vh',
                'z-index': '100'
            })
            .appendTo($('#display_options_'+item.id))
            .animate({
                'top': cart.offset().top - current_div.offset().top,
                'left': cart.offset().left - current_div.offset().left,
                'width': 25,
                'height': 25,
            }, 800, 'easeInOutExpo');
            setTimeout(function () {
                cart.effect("shake", {
                    times: 1
                }, 170);
            }, 800);

            imgclone.animate({
                'width': 0,
                'height': 0
            }, function () {
                $(this).detach()
            });
        }

        temp = {
            'name': item.name,
            'vendor' : item.vendor,
            'price'  : item.price,
            'size' : item.options[$scope.size_option_index].value,
            'id' : item.options[$scope.size_option_index].id,
            'qty' : 1
        }
        $scope.cart_items.push(temp);
    }

    $scope.cart_actions = function(action,index){
        switch(action){
            case 'plus' :  
                $scope.cart_items[index].qty += 1;
                break;
            case 'minus' :  
                $scope.cart_items[index].qty -= 1;
                break;
            case 'delete' :  
                $scope.cart_items.splice(index,1)
                break;
            default : break;
        }
    }

    check_screen_size()

})