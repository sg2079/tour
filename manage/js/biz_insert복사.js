(function () {

    // 글자수 제한
    $(document).on('input', '.limit', function () {
        if (Number($(this).next().find('.char_num').text()) >= Number($(this).next().find('.limit_cnt').text())) {
            console.log('!');
            let val = $(this).val().slice(0, $(this).val().length - 1)
            $(this).val(val);
        }

        $(this).next().find('.char_num').text($(this).val().length);
    });



       // 첨부파일/이미지 삭제
       $(document).on('click', '.file_list i.fa-solid.fa-x', function () {
        $(this).closest('.file_list').remove();
    });



    // 이미지 파일 미리보기 추가
    $(document).on('change', 'input[name="enterprise_img"]', function (e) {
        let fileUl = $(this).closest('.image_file_wrapper').find('ul');

        for (let i = 0; i < $(this)[0].files.length; i++) {
            let reader = new FileReader();
            reader.readAsDataURL($(this)[0].files[i]); //파일을 읽는 메서드 
            reader.onload = function () {
                let img_temp = `
                <li class="img_list" style="cursor: pointer;">
                    <img src="${reader.result}" alt="">
                    <i class="fa-solid fa-x"></i>
                </li>
                `
                fileUl.append(img_temp);
            }
        }
    });


    /* 업체사진 드래그해서 순서변경 */
    $('#img_list').sortable({ 
        start:function(event,ui){ 
            // 드래그 시작 시 호출
        }, 
        stop:function(event,ui){ 
            // 드래그 종료 시 호출
            reorder(); 
        } 
    }); 


    /* 주소찾기 */
    window.onload = function(){
        /* 업체정보 주소 */
        document.getElementById("biz_add").addEventListener("click", function(){ //주소입력칸을 클릭하면 카카오 지도 발생
            new daum.Postcode({
                oncomplete: function(data) { //선택시 입력값 세팅
                    document.getElementById("biz_add").value = data.address; // 주소 넣기
                    //document.querySelector("input[name=add_detail]").focus(); //상세입력 포커싱
                }
            }).open();
        });
    }

    /* 주소 입력 시 지도 */
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = {
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };  
   
    /* 주소 클릭 시 map 보이도록 */
    $('#biz_add').click(function(){
        $('#map').css({
            'display' : 'block'
        });
    }); 
        
    $('#add_detail').click(function(){
        // 상세입력칸 click했을때

        // 지도 생성    
        var map = new kakao.maps.Map(mapContainer, mapOption); 

        //이동 막기
        map.setDraggable(false);
        
        // 주소-좌표 변환 객체를 생성
        var geocoder = new kakao.maps.services.Geocoder();
        
        // 주소로 좌표를 검색
        geocoder.addressSearch($('#biz_add').val(), function(result, status) {

            // 정상적으로 검색이 완료됐으면 
            if (status === kakao.maps.services.Status.OK) {
                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                
                // 추출한 좌표를 통해 도로명 주소 추출
                let lat = result[0].y;
                let lng = result[0].x;
                getAddr(lat,lng);
                function getAddr(lat,lng){
                    let geocoder = new kakao.maps.services.Geocoder();

                    let coord = new kakao.maps.LatLng(lat, lng);
                    let callback = function(result, status) {
                        if (status === kakao.maps.services.Status.OK) {
                            // 추출한 도로명 주소를 해당 input의 value값으로 적용
                            $('#biz_add').val(result[0].road_address.address_name);
                        }
                    }
                    geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
                }
                
                // 결과값으로 받은 위치를 마커로 표시
                var marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });
                                        
                // 지도의 중심을 결과값으로 받은 위치로 이동
                map.setCenter(coords);
            } 
        }); 
    });



    

     /* 위치가 달라요 버튼 클릭 시 */
    $('#map_btn_false').click(function(){

        //모달창 보이도록
        $('.map_false').css({
            'display' : 'block'
        });

        //배경 스크롤 방지
        $('body').css("overflow", "hidden");


        //모달창 지도
        var mapContainer = document.getElementById('map_edit'), // 지도를 표시할 div 
            mapOption = { 
                center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };
        
        var map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성
        
        // 마커 표시 위치
        var markerPosition = new kakao.maps.LatLng(33.450701, 126.570667); 
        
        // 마커 생성
        var marker = new kakao.maps.Marker({
            position: markerPosition
        });
        
        // 마커 표시
        marker.setMap(map);
        
        // 마커 드래그
        marker.setDraggable(true); 
    });

    /* 모달창 닫기 */
    $('.xi-close').click(function(){
        $('.map_false').css({
            'display' : 'none'
        });
        //배경 스크롤 방지 해제
        $('body').css("overflow", "scroll");
    });

    $('.map_false_save_btn').click(function(){
        $('.map_false').css({
            'display' : 'none'
        });
    });

    //지도 움직이기 가능 마커표시 ! 
    //확인 누르면 모달창 꺼지고 원래지도에 반영/지도움직이지않음



                        


    /* 연락처 숫자만 기입 */
    $(".phone").on("keyup", function(event) {
        if (event.which && (event.which  > 47 && event.which  < 58 || event.which == 8)) {
            
        }else{
            alert('숫자만 입력해주세요.');
            $(this).val($(this).val().replace(/[^0-9]/g,""));
        }
    });

     /* 해시태그 */
    $(document).ready(function () {
        var tag = {};
        var counter = 0;

        // 입력한 값을 태그로 생성한다.
        function addTag (value) {
            tag[counter] = value;
            counter++; // del-btn 의 고유 id 가 된다.
        }

        // tag 안에 있는 값을 array type 으로 만들어서 넘긴다.
        function marginTag () {
            return Object.values(tag).filter(function (word) {
                return word !== "";
            });
        }
    
        // 서버에 제공
        $("#tag-form").on("submit", function (e) {
            var value = marginTag(); // return array
            $("#rdTag").val(value); 

            $(this).submit();
        });

        $("#tag").on("keypress", function (e) {
            var self = $(this);

            //엔터나 스페이스바 눌렀을때 실행
            if (e.key === "Enter" || e.keyCode == 32) {

                var tagValue = self.val(); // 값 가져오기

                // 해시태그 값 없으면 실행X
                if (tagValue !== "") {

                    // 같은 태그가 있는지 검사, 있으면 해당값이 array 로 return
                    var result = Object.values(tag).filter(function (word) {
                        return word === tagValue;
                    })
                
                    // 해시태그가 중복되었는지 확인
                    if (result.length == 0) { 
                        $("#tag-list").append("<li class='tag-item'>"+tagValue+"<span class='del-btn' idx='"+counter+"'>x</span></li>");
                        addTag(tagValue);
                        self.val("");
                    } else {
                        alert("태그값이 중복됩니다.");
                    }
                }
                e.preventDefault(); // SpaceBar 시 빈공간이 생기지 않도록 방지
            }
        });

        // 삭제 버튼 
        // 인덱스 검사 후 삭제
        $(document).on("click", ".del-btn", function (e) {
            var index = $(this).attr("idx");
            tag[index] = "";
            $(this).parent().remove();
        });
    })   

})();


