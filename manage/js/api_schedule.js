/**
GET /schedule/{businessId}/{bizItemId}
[스케줄] 일회성 스케줄 여러 건 조회

POST /schedule/{businessId}/{bizItemId}
[스케줄] 일회성 스케줄 생성

DELETE /schedule/{businessId}/{bizItemId}/{scheduleIds}
[스케줄] 일회성 스케줄 삭제

PATCH /schedule/{businessId}/{bizItemId}/{scheduleIds}
[스케줄] 일회성 스케줄 수정

GET /schedule/{businessId}/{bizItemId}/{scheduleId}
[스케줄] 일회성 스케줄 한 건 조회
 */

//var domain = 'http://localhost:8076';
var domain = 'http://crm.haematour.co.kr:50505';


(function () {

    
    $(document).ready(function(){

        scheduleList();

    });

})();



/**
 * 스케줄 리스트
 * 요청한 회차 중 이미 생성된 회차는 제외하고 추가했습니다.<br>추가된 회차정보를 확인해 주세요.
 */


/*
GET /schedule/{businessId}/{bizItemId}
[스케줄] 일회성 스케줄 여러 건 조회
*/
function scheduleList(){

    //var businessId =  $('#businessId').val();
    //var bizItemId =  $('#bizItemId').val();
    var businessId;
    if (localStorage.getItem("biz_select") == null){
        alert("업체를 선택해주세요.");
        return false;
    }
    
    businessId = localStorage.getItem("biz_select").split(",")[0]
    //businessId = 721529

    var bizItemId = 4492860

    $.ajax({
        url : domain + '/schedule/' + businessId + '/' + bizItemId
        , type : 'GET'
        , success : function(e){
            console.log(e);
            
        }
        , error : function(req, status, error){
            //console.log(req + ", "+ status + ", "  + error);
            alert("스케줄 여러 건 조회에 실패했습니다.");
        }
    });
}

/*
GET /schedule/{businessId}/{bizItemId}/{scheduleId}
[스케줄] 일회성 스케줄 한 건 조회
*/
function scheduleDetail(businessId,bizItemId,scheduleId){

    $.ajax({
        url : domain + '/schedule/' + businessId + '/' + bizItemId + '/' + scheduleId
        , type : 'GET'
        , success : function(e){
            console.log(e);
        }
        , error : function(req, status, error){
            //console.log(req + ", "+ status + ", "  + error);
            alert("스케줄 여러 건 조회에 실패했습니다.");
        }
    });
}

/**
 * 일회성 스케줄 삭제
 * DELETE /schedule/{businessId}/{bizItemId}/{scheduleId}
 */
function scheduleDelete(businessId,bizItemId,scheduleId){

    if(!confirm("회차를 삭제하면 회차정보/가격/재고에서 설정한 내용이 모두 삭제됩니다. 정말 삭제하시겠습니까?")){
        return false;
    }
    
    $.ajax({
        url : domain + '/schedule/' + businessId + '/' + bizItemId + '/' + scheduleId
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
}

/**
 * 일회성 스케줄 수정
 * PATCH /schedule/{businessId}/{bizItemId}/{scheduleIds}
 */
function scheduleUpdate(businessId,bizItemId,scheduleId){

    if(!confirm("스케줄을 수정하시겠습니까?")){
        return false;
    }

    const scheduleUpdateData = {
        "agencyKey" : agencyKey
        , "time" : time
        , "name" : scheduleCreateName
        , "prices": [
            {
                "priceId": 4078738
            }
        ]
    }
    
    $.ajax({
        url : domain + '/schedule/' + businessId + '/' + bizItemId + '/' + scheduleId
        , type : 'PATCH'
        , data : JSON.stringify(scheduleUpdateData)
        , contentType : 'application/json; charset=UTF-8'
        , success : function(){
            alert("스케줄 수정에 성공했습니다.");
        }
        , error : function(req, status, error){
            //console.log(req + ", "+ status + ", "  + error);
            alert("스케줄 수정에 실패했습니다.");
        }
    });
}




/**
 * 일회성 스케줄 생성
 * POST /schedule/{businessId}/{bizItemId}
 */
function scheduleCreate(businessId,bizItemId){

    // {
    //     "agencyKey": "MJ2210020001",
    //     "time": "2022-12-01T19:30:00",
    //     "name": "테스트",
    //     "prices": [
    //     {
    //         "priceId": 4078738
    //     }
    //     ]
    // }
    //q ? o.format("YYYY-MM-DD HH:mm:ss") : ""
//startMinute = 60 * b.params.hour + Number(b.params.minute)
    //startDate: a.moment(b.params.startDate).format("YYYY-MM-DD"),
    //"2022-12-01T19:30:00"
    

    if (_validation.nullLengthChecker($("#slot_date").val(),"반복 시작일")){
        return false;
    }

    if (_validation.nullLengthChecker($("#slot_endDate").val(),"반복 종료일")){
        return false;
    }

    var startDate = $("#slot_date").val();
    var endDate = $("#slot_endDate").val();
    var repeat = $("#slot_repeat").val();
    var hour = $("#seat_slot_hour").val();
    var minute = $("#seat_slot_minute").val();
    var slotName = $("#seat_slot_name").val();

    console.log(startDate);
    console.log(startDate.format("YYYY-MM-DD"));

    if (_validation.periodChecker(startDate,endDate)){
        return false;
    }

    if (_validation.nullLengthChecker($("#seat_slot_hour").val(),"반복 시간")){
        return false;
    }


    if (_validation.nullLengthChecker($("#seat_slot_minute").val(),"반복 분")){
        return false;
    }

    
    var agencyKey = "MJ2210020001";
    let time = $("time").val();
    let scheduleCreateName = $("name").val();
    let scheduleCreatePriceId = $("priceId").val();


    const scheduleCreateData = {
        "agencyKey" : agencyKey
        , "time" : time
        , "name" : scheduleCreateName
        , "prices": [
            {
                "priceId": 4078738
            }
        ]
    }


    $.ajax({
        url : domain + '/schedule/' + businessId + '/' + bizItemId
        , type : 'POST'
        , data : JSON.stringify(scheduleCreateData)
        , contentType : 'application/json; charset=UTF-8'
        , success : function(){
            alert("스케줄 생성에 성공했습니다.");
        }
        , error : function(req, status, error){
            //console.log(req + ", "+ status + ", "  + error);
            alert("스케줄 생성에 실패했습니다.");
        }
    });
}



function checkDatePicker(){
    var c = a.moment(b.impDateTimeSetting.startDate),
    d = a.moment(b.impDateTimeSetting.endDate);
    return c.isSame(d) && c.startHours === c.endHours ? !1 : !1;
}