/*
GET /businesses
[업체] 업체 목록 조회

POST /businesses
[업체] 업체 생성

PATCH /businesses/{businessIds}
[업체] 업체 수정

DELETE /businesses/{businessId}
[업체] 업체 삭제

GET /businesses/{businessId}
[업체] 업체 목록 조회
*/
//var domain = 'http://localhost:8076';
var domain = 'http://crm.haematour.co.kr:50505';

(function () {

    $(document).ready(function(){

        businessesList();

    });

})();

/**
GET /businesses
[업체] 업체 목록 조회
 */
function businessesList(){

     $.ajax({
        //headers: {'origin': '*', 'pragma': 'no-cache'},
        url : domain + '/businesses'
        , type : 'GET'
        , success : function(e){

            console.log(e);
            var innerHtml = "";
            for(var i=0; i < e.body.length; i++){

                if (e.body[i].agencyKey == undefined || e.body[i].agencyKey == null || e.body[i].agencyKey == ""){
                    continue;
                }

                innerHtml += "<tr>"
                innerHtml += "<td>" + (i+1) + "</td>" // test 

                // 업체명
                innerHtml += "<td>" + e.body[i].serviceName + "</td>"
                // 업체코드
                innerHtml += "<td>" + e.body[i].agencyKey + "</td>"
                // 구분
                innerHtml += "<td>" + e.body[i].placeCategoryName + "</td>"
                // hidden  e.businessId 업체아이디
                innerHtml += '<input style="hidden;" value="'+ e.body[i].businessId +'" name="businessId" id="businessId">'
                // 수정/삭제
                innerHtml += "<td>"
                innerHtml += '<button class="btn btn-primary btn-sm iframe" style="display: flex;" href="service_edit.html?num='+ e.body[i].businessId +'">수정</button>'
                innerHtml += '<button class="btn btn-danger btn-sm" style="display: flex;" href="javascript:businessesDelete('+ e.body[i].businessId +');">삭제</button>'
                innerHtml += "</td>"
                innerHtml += "</tr>"
            }

            $("#business_tbody").html(innerHtml);

            if ($(".biz_select").val()  == "1"){
                onClickAddButton(e.body);
            }
            
        }
        , error : function(req, status, error){
            alert("업체 목록 조회 에 실패했습니다.");
        }
    });
}

function onClickAddButton(arr) {
    let selectEl = document.querySelector("#biz_select");
    for(var i=0; i < arr.length; i++){
        var objOption = document.createElement("option");
        objOption.text = arr[i].serviceName;
        var text = arr[i].businessId + ',' +  arr[i].agencyKey;
        objOption.value = text;
        //objOption.value = arr[i].businessId;
        selectEl.options.add(objOption);
    }
   
}

function onChangeBusinessSelectBox(){
    let selectEl = document.querySelector("#biz_select");
    let valueBiz = selectEl.value;
    localStorage.setItem("biz_select",valueBiz);
}

/**
GET /businesses/{businessId}
[업체] 업체 상세 조회
 */
function businessesDetail(businessId){
    
    $.ajax({
        url : domain + '/businesses/' + businessId
        , type : 'GET'
        , success : function(e){
            console.log(e);
        }
        , error : function(req, status, error){
            alert("업체  조회 에 실패했습니다.");
        }
    });
}


function getBusinessesName(businessId){
    
    var sNam = "";
    $.ajax({
        url : domain + '/businesses/' + businessId
        , type : 'GET'
        , success : function(e){
            console.log(e);
            
            //let x = document.querySelectorAll(".serviceName");
            let x = document.getElementsByClassName("serviceName");
            console.log;(x.length);

            for (var i = 0; i < x.length; i++){
                x[i].innerText = e.body.serviceName;
            }
            sNam =  e.body.serviceName;
        }
        , error : function(req, status, error){
            alert("업체  조회 에 실패했습니다.");
        }
    });
    return sNam;
}


/*
PATCH /businesses/{businessIds}
[업체] 업체 수정
*/
function businessesUpdate(businessId){
            
    if(!confirm("정말 수정하시겠습니까?")){
        return false;
    }

    var jsonData = {

    }

    $.ajax({
        url : domain + '/businesses/' + businessId
        , type : 'PATCH'
        , data : JSON.stringify(jsonData)
        , contentType : 'application/json; charset=UTF-8'
        , success : function(){
            alert("업체 수정 에 성공했습니다.");
        }
        , error : function(req, status, error){
            alert("업체 수정 에 실패했습니다.");
        }
    });

}

/*
DELETE /businesses/{businessId}
[업체] 업체 삭제
*/
function businessesDelete(businessId){

    if(!confirm("삭제하면 설정된 모든 정보는 복원할 수 없습니다. 정말 삭제하시겠습니까?")){
        return false;
    }

    $.ajax({
        url : domain + '/businesses/' + businessId
        , type : 'DELETE'
        , success : function(){
            alert("업체 삭제 에 성공했습니다.");
        }
        , error : function(req, status, error){
            alert("업체 삭제 에 실패했습니다.");
        }
    });

}

/**
 * 업체 코드 생성 함수 
 * 
 * agencyKey
 * @returns 
 */
function agencyKeyCreate(){
    return "M" + "";
}

/**
POST /businesses
[업체] 업체 생성
*/
function businessesCreate(){

    // {
    //     "agencyKey": "MTEST",
    //     "serviceName": "테스트",
    //     "businessResources": [
    //       {
    //         "resourceTypeCode": "FL00",
    //         "resourceUrl": "https://ldb-phinf.pstatic.net/20221107_47/1667784509125z5D7j_PNG/Blue_Ship_Photo_National_Maritime_Day_Social_Media_Graphic.png"
    //       }
    //     ],
    //     "businessTypeId":12,
    //     "name": "테스트",
    //     "reprOwnerName": "테스트",
    //     "desc": "테스트",
    //     "email": "test@test.com",
    //     "addressJson": {
    //       "jibun": "전라북도 군산시 옥도면 선유도리 90-1",
    //       "roadAddr": "전라북도 군산시 옥도면 선유도3길 50"
    //     }
    //   }


    var additionalPropertyJson = {
        "isFreeParking" : $("#s_name").val(),
        "parkingCharge" : {
            "chargingTypeCode" : $("#parking_time").val(),
            "basicCharge" : $("#parking_time").val()
        }

    }

    var eventDescJson = {
        "desc" : $("#reserve_desc").val(),
        "isImpPeriod" : $("#term_select").val(),
        "impStartDate" : $("#reserve_date").val(),
        "isEventPeriod" : $("#term_select").val(),
        "title" : $("#reveal_title").val(),
        "context" : $("#reveal_desc").val(),
        "images" : {
            "src" : $("#reveal_img").val()
        }
    }

    var extra = {
        "phone":  $("#phone").val(),
        "promotionDesc" : $("#promotionDesc").val(),
        "websiteUrl" : $("#websiteUrl").val(),
        "isImpStock" : $("#isImpStock").val(),
    }

    var jsonData = {
        "agencyKey" : agencyKeyCreate(),
        "serviceName" : $("#s_name").val(),
        "businessTypeId":12,
        "desc" : $("#desc").val(),
        "businessResources" : [
            {
                "resourceTypeCode": "FL00",
                "resourceUrl" : $("#enter_img").val()
            }
        ],
        "name" : $("#reveal_img").val(),
        "owner" : $("#reprOwnerName").val(),
        "addressJson" : {
            "jibun" : $("#jibun").val()
        },
        "email":  $("#email").val(),
    }

    $.ajax({
        url : domain + '/businesses'
        , type : 'POST'
        , data : JSON.stringify(jsonData)
        , contentType : 'application/json; charset=UTF-8'
        , success : function(e){
            alert("업체 생성 에 성공했습니다.");
        }
        , error : function(req, status, error){
            alert("업체 생성 에 실패했습니다.");
        }
    });
}