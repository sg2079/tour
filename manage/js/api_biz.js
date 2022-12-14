//var domain = 'http://localhost:8076';
var domain = 'http://crm.haematour.co.kr:50505';

(function () {

    /*
        GET /bizitems
        [상품] 상품 목록 전체 조회

        GET /bizitems/{businessId}
        [상품] 상품 목록 조회

        POST /bizitems/{businessId}
        [상품] 상품 생성

        PATCH /bizitems/{businessId}/{bizItemIds}
        [상품] 상품 수정

        DELETE /bizitems/{businessId}/{bizItemId}
        [상품] 상품 삭제

        GET /bizitems/{businessId}/{bizItemId}
        [상품] 상품 조회
    */
    $(document).ready(function(){        

        bizList();
        

    });

})();

/**
 * [상품] 상품 목록 전체 조회
 *  GET /bizitems
 */
function bizAllList(){
     $.ajax({
        //headers: {'origin': '*', 'pragma': 'no-cache'},
        url : domain + '/bizitems/all'
        , type : 'GET'
        , success : function(e){
            console.log(e);
        }
        , error : function(req, status, error){
            alert("상품 목록 조회 에 실패했습니다.");
        }
    });
}

/**
 * [상품] 상품 목록 조회
 *  GET /bizitems/{businessId}
 */
function bizList(){


    if (localStorage.getItem("biz_select") == null){
        alert("업체를 선택해주세요.");
        return false;
    }
    
    var businessId = localStorage.getItem("biz_select").split(",")[0]

    $.ajax({
        url : domain + '/bizitems/' + businessId
        , type : 'GET'
        , success : function(e){
            console.log(e);

            var innerHtml = "";
            var serviceName = getBusinessesName(businessId);

                for(var i=0; i < e.body.length; i++){
    
                    innerHtml += "<tr>"
                    innerHtml += "<td>" + (i+1) + "</td>" // test 
                    // 업체명
                    innerHtml += "<td class='serviceName'>" + serviceName + "</td>"
                    // 상품명
                    innerHtml += "<td>" + e.body[i].name + "</td>"
                    // 가격
                    innerHtml += "<td>" + e.body[i].price + "</td>"
                    // hidden  e.agencyKey 업체 키
                    innerHtml += '<input style="hidden;" value="'+ e.body[i].agencyKey +'" name="agencyKey" id="agencyKey">'
                    // hidden  e.businessId 업체 아이디
                    innerHtml += '<input style="hidden;" value="'+ e.body[i].businessId +'" name="businessId" id="businessId">'
                    // hidden  e.bizItemId 상품 아이디
                    innerHtml += '<input style="hidden;" value="'+ e.body[i].bizItemId +'" name="bizItemId" id="bizItemId">'
                    // 수정/삭제
                    innerHtml += "<td>"
                    innerHtml += '<button class="btn btn-primary btn-sm iframe" style="display: flex;" href="product_edit.html?num='+ e.body[i].businessId +' ,' + e.body[i].bizItemId + '">수정</button>'
                    innerHtml += '<button class="btn btn-danger btn-sm" style="display: flex;" href="javascript:productDelete('+ e.body[i].businessId +' ,' + e.body[i].bizItemId + ');">삭제</button>'
                    innerHtml += "</td>"
                    innerHtml += "</tr>"
               }
    
               $("#product_tbody").html(innerHtml);
        }
        , error : function(req, status, error){
            alert("상품 목록 조회 에 실패했습니다.");
        }
    });
}

/**
 * POST /bizitems/{businessId}
 * [상품] 상품 생성
*/
function productCreate(){

    var businessId;
    if (localStorage.getItem("biz_select") == null){
        alert("업체를 선택해주세요.");
        return false;
    }
    
    businessId = localStorage.getItem("biz_select").split(",")[0]

    var jsonData = {

    }

    $.ajax({
        url : domain + '/bizitems/' + businessId
        , type : 'POST'
        , data : JSON.stringify(jsonData)
        , contentType : 'application/json; charset=UTF-8'
        , success : function(e){
            alert("상품 생성 에 성공했습니다.");
        }
        , error : function(req, status, error){
            alert("상품 생성 에 실패했습니다.");
        }
    });

}

/*
DELETE /bizitems/{businessId}/{bizItemId}
[상품] 상품 삭제
*/
function productDelete(businessId,bizItemId){

    if(!confirm("삭제하면 설정된 모든 정보는 복원할 수 없습니다. 정말 삭제하시겠습니까?")){
        return false;
    }

    $.ajax({
        url : domain + '/bizitems/' + businessId + '/' + bizItemId
        , type : 'DELETE'
        , success : function(){
            alert("상품 삭제 에 성공했습니다.");
        }
        , error : function(req, status, error){
            alert("상품 삭제 에 실패했습니다.");
        }
    });
}

/*
PATCH /bizitems/{businessId}/{bizItemIds}
[상품] 상품 수정
*/
function productUpdate(businessId,bizItemId){
    
    if(!confirm("정말 수정하시겠습니까?")){
        return false;
    }

    var jsonData = {

    }

    $.ajax({
        url : domain + '/bizitems/' + businessId + '/' + bizItemId
        , type : 'PATCH'
        , data : JSON.stringify(jsonData)
        , contentType : 'application/json; charset=UTF-8'
        , success : function(){
            alert("상품 수정 에 성공했습니다.");
        }
        , error : function(req, status, error){
            alert("상품 수정 에 실패했습니다.");
        }
    });
}

