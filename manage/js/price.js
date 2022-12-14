(function () {

    /*
        GET /prices/{businessId}/{bizItemId}
        [Price] 가격분류 여러건 조회
        
        POST /prices/{businessId}/{bizItemId}
        [Price] 가격분류 생성
        
        DELETE /prices/{businessId}/{bizItemId}/{priceIds}
        [Price] 가격분류 삭제
        
        PATCH /prices/{businessId}/{bizItemId}/{priceIds}
        [Price] 가격분류 수정
        
        GET /prices/{businessId}/{bizItemId}/{priceId}
        [Price] 가격분류 단건 조회
    */
    $(document).ready(function(){
       
        /* 가격분류 start */
        /*
        가격분류 생성
        POST /prices/{businessId}/{bizItemId}
        */
        $('#prices_add').on('click', function(){
            
            if ($('#seat_price_type_name').val() == null || $('#seat_price_type_name').val() == ""){
                alert("가격 분류 명을 입력하세요");
                return false;
            }

            if ($('#seat_price').val() == null || $('#seat_price').val() == ""){
                alert("판매가를 입력하세요");
                return false;
            }

            var data = {
                seat_price_type_name : $('#seat_price_type_name').val()
                , seat_price : $('#seat_price').val()
                , normalPrice : $('#normalPrice').val()
                , seat_price_type_desc : $('#seat_price_type_desc').val()
            };

            var businessId =  $('#businessId').val();
            var bizItemId =  $('#bizItemId').val();
            
            // POST /prices/{businessId}/{bizItemId}
            $.ajax({
                url : '/prices/' + businessId + '/' + bizItemId
                , type : 'POST'
                , data : data
                , dataType : 'application/json'
                , success : function(){
                    alert("가격분류 생성에 성공했습니다.");
                }
                , error : function(req, status, error){
                    //console.log(req + ", "+ status + ", "  + error);
                    alert("가격분류 생성에 실패했습니다.");
                }
            });
    
        });
        
        /**
         * 가격분류 삭제
         * DELETE /prices/{businessId}/{bizItemId}/{priceIds}
         */
        $('#prices_delete').on('click', function(){

            // 회차에 사용되고 있는 가격분류입니다.<br>가격분류를 삭제하면 회차정보 중 해당 가격분류를 사용하고 <br>있는 내용이 모두 삭제됩니다.
            if(!confirm("가격분류를 삭제하면 더이상 고객이 선택 할 수 없습니다. 정말 삭제하시겠습니까?")){
                return false;
            }

            var businessId =  $('#businessId').val();
            var bizItemId =  $('#bizItemId').val();
            var priceIds =  $('#priceIds').val();
            
            // POST /prices/{businessId}/{bizItemId}
            $.ajax({
                url : '/prices/' + businessId + '/' + bizItemId + '/' + priceIds
                , type : 'DELETE'
                , success : function(){
                    alert("가격분류 삭제되었습니다.");
                }
                , error : function(req, status, error){
                    //console.log(req + ", "+ status + ", "  + error);
                    alert("가격분류 삭제 실패되었습니다.");
                }
            });
    
        });

        /*
        가격분류 수정
        PATCH /prices/{businessId}/{bizItemId}/{priceIds}
        */
        $('#prices_modify').on('click', function(){
        
        if(!confirm("가격분류을 수정하시겠습니까?")){
            return false;
        }

        if ($('#seat_price_type_name').val() == null || $('#seat_price_type_name').val() == ""){
            alert("가격 분류 명을 입력하세요");
            return false;
        }

        if ($('#seat_price').val() == null || $('#seat_price').val() == ""){
            alert("판매가를 입력하세요");
            return false;
        }

        var data = {
            seat_price_type_name : $('#seat_price_type_name').val()
            , seat_price : $('#seat_price').val()
            , normalPrice : $('#normalPrice').val()
            , seat_price_type_desc : $('#seat_price_type_desc').val()
        };

        var businessId =  $('#businessId').val();
        var bizItemId =  $('#bizItemId').val();
        var priceIds =  $('#priceIds').val();
        
        $.ajax({
            url : '/prices/' + businessId + '/' + bizItemId + '/' + priceIds
            , type : 'PATCH'
            , data : data
            , dataType : 'application/json'
            , success : function(){
                alert("가격분류 수정에 성공했습니다.");
            }
            , error : function(req, status, error){
                //console.log(req + ", "+ status + ", "  + error);
                alert("가격분류 수정에 실패했습니다.");
            }
        });

    });
    /* 가격분류 END */

        /* 스케줄 start */

        /**
         * 스케줄 리스트
         * 요청한 회차 중 이미 생성된 회차는 제외하고 추가했습니다.<br>추가된 회차정보를 확인해 주세요.
         */
    
        /**
         * 일회성 스케줄 생성
         * POST /schedule/{businessId}/{bizItemId}
         */
         $('#schedules_add').on('click', function(){
        
    
            var businessId =  $('#businessId').val();
            var bizItemId =  $('#bizItemId').val();
            var data = {

            }

            $.ajax({
                url : '/schedule/' + businessId + '/' + bizItemId
                , type : 'POST'
                , data : data
                , dataType : 'application/json'
                , success : function(){
                    alert("스케줄 생성에 성공했습니다.");
                }
                , error : function(req, status, error){
                    //console.log(req + ", "+ status + ", "  + error);
                    alert("스케줄 생성에 실패했습니다.");
                }
            });
    
        });

        /**
         * 일회성 스케줄 수정
         * PATCH /schedule/{businessId}/{bizItemId}/{scheduleIds}
         */
         $('#schedules_upate').on('click', function(){
        
            if(!confirm("스케줄을 수정하시겠습니까?")){
                return false;
            }

            var businessId =  $('#businessId').val();
            var bizItemId =  $('#bizItemId').val();
            var scheduleIds =  $('#scheduleIds').val();
            var data = {

            }
            
            $.ajax({
                url : '/schedule/' + businessId + '/' + bizItemId + '/' + scheduleIds
                , type : 'PATCH'
                , data : data
                , dataType : 'application/json'
                , success : function(){
                    alert("스케줄 수정에 성공했습니다.");
                }
                , error : function(req, status, error){
                    //console.log(req + ", "+ status + ", "  + error);
                    alert("스케줄 수정에 실패했습니다.");
                }
            });
    
        });

        /**
         * 일회성 스케줄 삭제
         * DELETE /schedule/{businessId}/{bizItemId}/{scheduleIds}
         */
         $('#schedules_delete').on('click', function(){
        
            if(!confirm("회차를 삭제하면 회차정보/가격/재고에서 설정한 내용이 모두 삭제됩니다. 정말 삭제하시겠습니까?")){
                return false;
            }
    
            var businessId =  $('#businessId').val();
            var bizItemId =  $('#bizItemId').val();
            var scheduleIds =  $('#scheduleIds').val();
            var data = {

            }
            
            $.ajax({
                url : '/schedule/' + businessId + '/' + bizItemId + '/' + scheduleIds
                , type : 'DELETE'
                , success : function(){
                    alert("스케줄 삭제에 성공했습니다.");
                    /*
                "<p>판매된 " +
                  b.wordSet.BOOKING_TYPE +
                  "재고가 있는 회차는 제외하고 삭제했습니다.</p>"
                    */
                }
                , error : function(req, status, error){
                    //console.log(req + ", "+ status + ", "  + error);
                    alert("스케줄 삭제에 실패했습니다.");
                }
            });
    
        });
        /* 스케줄 END */

    });

})();