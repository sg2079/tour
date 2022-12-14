/*
GET /bookings/{businessId}
[예약] 예약 리스트 조회

GET /bookings/{businessId}/{bookingId}
[예약] 예약 조회
*/

//var domain = 'http://localhost:8076';
var domain = 'http://crm.haematour.co.kr:50505';

(function () {

    $(document).ready(function(){

		console.log("api_bookings.js >> 예약 javascript");

        if (localStorage.getItem("biz_select") == null){
            bookingsListALL();
        } else {
            console.log(localStorage.getItem("biz_select").split(",")[0])
            bookingsList(localStorage.getItem("biz_select").split(",")[0]);
        }

    });

})();

/**
 * 예약 리스트 전체 조회
 * GET /bookings
 */
async function bookingsListALL(){

    $.ajax({
       //headers: {'origin': '*', 'pragma': 'no-cache'},
       url : domain + '/bookings/all?orderByRegDate=DESC&page=0&size=5'
       , type : 'GET'
	   , async: true
	   , timeout: 300000
       , success : function(e){
           console.log(e);
		   var innerHtml = "";

            for(var i=0; i < e.length; i++){

                innerHtml += "<tr>"
                innerHtml += "<td>" + (i+1) + "</td>" // 번호 

                // 주문번호
                innerHtml += "<td style='text-align:center;'>" + e[i].bookingId + "</td>"
                // 업체명
                innerHtml += "<td>" + e[i].serviceName + "</td>"
                // 상품명
                innerHtml += "<td>" + e[i].bizItemName + "</td>"
                // 날짜
                innerHtml += "<td>" + e[i].startDate + "</td>"
                // 예약자
                innerHtml += "<td>" + e[i].name + "</td>"
                // 연락처
                innerHtml += "<td>" + e[i].phone + "</td>"
                // 인원
                innerHtml += "<td>" + e[i].bookingCount + "</td>"
                // 금액
                innerHtml += "<td>" + e[i].price + "</td>"
                // 결제구분
                innerHtml += "<td>" + e[i].nPayChargedName + "</td>"

                // hidden  e.businessId 업체 아이디
                innerHtml += '<input style="hidden;" value="'+ e[i].businessId +'" name="businessId" id="businessId">'
                // hidden  e.bizItemId 상품 아이디
                innerHtml += '<input style="hidden;" value="'+ e[i].bizItemId +'" name="bizItemId" id="bizItemId">'
                innerHtml += '</tr>'

            }

            $("#booking_tbody").html(innerHtml);
       }
       , error : function(req, status, error){
		   console.log(req + ", "+ status + ", "  + error);
           //alert("예약 리스트 조회 에 실패했습니다.");
       }
   });
}


/**
GET /bookings/{businessId}
[예약] 예약 리스트 조회
 */
function bookingsList(businessId){

    //let businessId = localStorage.getItem("biz_select").split(",")[0]

     $.ajax({
        //headers: {'origin': '*', 'pragma': 'no-cache'},
        url : domain + '/bookings/' + businessId
        , type : 'GET'
        , success : function(e){
            console.log(e);
            var innerHtml = "";

            for(var i=0; i < e.body.length; i++){

                innerHtml += "<tr>"
                innerHtml += "<td>" + (i+1) + "</td>" // 번호 

                // 주문번호
                innerHtml += "<td style='text-align:center;'>" + e.body[i].bookingId + "</td>"
                // 업체명
                innerHtml += "<td>" + e.body[i].serviceName + "</td>"
                // 상품명
                innerHtml += "<td>" + e.body[i].bizItemName + "</td>"
                // 날짜
                innerHtml += "<td>" + e.body[i].startDate + "</td>"
                // 예약자
                innerHtml += "<td>" + e.body[i].name + "</td>"
                // 연락처
                innerHtml += "<td>" + e.body[i].phone + "</td>"
                // 인원
                innerHtml += "<td>" + e.body[i].bookingCount + "</td>"
                // 금액
                innerHtml += "<td>" + e.body[i].price + "</td>"
                // 결제구분
                innerHtml += "<td>" + e.body[i].nPayChargedName + "</td>"

                // hidden  e.businessId 업체 아이디
                innerHtml += '<input style="hidden;" value="'+ e.body[i].businessId +'" name="businessId" id="businessId">'
                // hidden  e.bizItemId 상품 아이디
                innerHtml += '<input style="hidden;" value="'+ e.body[i].bizItemId +'" name="bizItemId" id="bizItemId">'
                innerHtml += '</tr>'

            }

            $("#booking_tbody").html(innerHtml);
        }
        , error : function(req, status, error){
            alert("예약 리스트 조회 에 실패했습니다.");
        }
    });
}

/**
GET /bookings/{businessId}/{bookingId}
[예약] 예약 조회
 */
function bookingsDetail(businessId,bookingId){
    $.ajax({
        url : domain + '/bookings/' + businessId + '/' + bookingId
        , type : 'GET'
        , success : function(e){
            console.log(e);
        }
        , error : function(req, status, error){
            alert("예약 조회 에 실패했습니다.");
        }
    });
}
