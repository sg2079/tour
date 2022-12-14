var $ = jQuery; 
var offset_minus = 0; 
var isMobile = false;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Opera Mobile|Kindle|Windows Phone|PSP|AvantGo|Atomic Web Browser|Blazer|Chrome Mobile|Dolphin|Dolfin|Doris|GO Browser|Jasmine|MicroB|Mobile Firefox|Mobile Safari|Mobile Silk|Motorola Internet Browser|NetFront|NineSky|Nokia Web Browser|Obigo|Openwave Mobile Browser|Palm Pre web browser|Polaris|PS Vita browser|Puffin|QQbrowser|SEMC Browser|Skyfire|Tear|TeaShark|UC Browser|uZard Web|wOSBrowser|Yandex.Browser mobile/i.test(navigator.userAgent)) isMobile = true;
$(document).ready(function(){
	offset_minus = $("#header").height();

	$("body").on("click", "#agree_chk", function(){
		if($(this).is(":checked")){
			$("#btnReceipt1").attr("disabled", false);
			$("#receiptForm").find("input[name=agree]").val("Y");
		}else{
			$("#btnReceipt1").attr("disabled", true);
			$("#receiptForm").find("input[name=agree]").val("");
		}
	});

	$("body").on("click", ".ticket_list", function(){
		if($(this).hasClass("click_disabled")){
			return false;
		}else{
			$(".ticket_list").removeClass("active");
			$(".ticket_detail").css("display", "none");

			$(this).addClass("active");
			$(this).next(".ticket_detail").css("display", "block");		
			
			var courseIdx = $(this).attr('data-id');
			$('#courseIdx').val(courseIdx);

			$("#btnReceipt3").attr("disabled", false);
			removeElement(1);
		}
	});

	$("body").on("click", ".btn-volume", function() {
		removeElement(2);

		var mode = $(this).attr("data-id");
		var max_qty = parseInt($(this).closest("form").attr("data-qty"));

		var this_qty, min_qty = 0;
		var qty1 = parseInt($("input[name=qty1]").val());
		var qty2 = parseInt($("input[name=qty2]").val());
		var qty3 = parseInt($("input[name=qty3]").val());
		var $el_qty = $(this).closest("tr").find("input[name^=qty]");
		switch(mode) {
			case "plus":
				if ((qty1+qty2+qty3) >= max_qty && $el_qty.attr("name") != "qty4") {
					ajax_error("예약가능인원이 초과되었습니다.<br />예약가능 인원 : "+max_qty+"명");
					return false;
				} else {			
					this_qty = parseInt($el_qty.val().replace(/[^0-9]/, "")) + 1;
					if (this_qty > max_qty) {
						this_qty = max_qty;
					}
				}
				break;
			case "minus":
				this_qty = parseInt($el_qty.val().replace(/[^0-9]/, "")) - 1;
				if(this_qty < min_qty) {
					this_qty = min_qty;
				}
				break;
			default:
				ajax_error("올바른 방법으로 이용해 주십시오.");
				break;
		}

		$el_qty.val(this_qty);
		calculate_price();
	});

	$('body').on('focusin keyup keydown keypress blur change click', ".customerVal", function() {
		customerFormCheck();
	});

	$("body").on("click", ".danalPaymentBtn", function(){
		var serviceType = $(this).closest("div").find("input[name=SERVICETYPE]").val();
		var receiptCode = $(this).closest("div").find("input[name=RECEIPTCODE]").val();

		danalPayment(serviceType, receiptCode);
	});

	$("body").on("click", ".copyAddr", function(){
		if ($(this).is(':checked')){
			var trKey = parseInt($(this).val()) - 1;
			var trClass = 'personRow' + String(trKey);
			var copyVal = $('#personSaveForm').find('tr.'+trClass).find('.pAddress').val();
			
			$(this).closest('tr').find('.pAddress').val(copyVal);
		}else{
			$(this).closest('tr').find('.pAddress').val("");
		}
	});

	$("body").on("click", ".copyAddrMobile", function(){
		if ($(this).is(':checked')){
			var trKey = parseInt($(this).val()) - 1;
			var trClass = 'personRow' + String(trKey);
			var copyVal = $('#personSaveForm').find('tr.'+trClass).find('.pAddress').val();
			
			$('#personSaveForm').find('tr.personRow' + $(this).val()).find('.pAddress').val(copyVal);
		}else{
			$('#personSaveForm').find('tr.personRow' + $(this).val()).find('.pAddress').val(copyVal);
		}
	});
}); // 초기 화면

function changeProcess(act, formId){
	var postData = $("#" + formId).serializeArray();

	$.ajax({
		type: "POST", 
		url : "../manager/ajax/getChangeProcess",
		data : postData,
		success : function(json){
			var getData = $.parseJSON(json);
			if(getData.code != "N"){
				$('#resultPanel').append(getData.html);
				$('#change-modal').modal("hide");

				if(getData.act == "cancle" && getData.code == "P"){
					paymentStep(8, getData.receiptCode);
				}
			}else{
				ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
			}
		},   
		error: function(xhr, status, error) {  
			ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
		} 
	});	
}

function changeReceipt(act, receiptCode){
	$.ajax({
		type: "GET", 
		url : "../manager/ajax/getChagneForm",
		data : ({ act : act, receiptCode : receiptCode }),
		success : function(html){
			$('#change-modal div.modal-content').html(html);
			$('#change-modal').modal("show");
		},   
		error: function(xhr, status, error) {  
			ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
		} 
	});	
}

function cancleSelectChange(elm){
	var elmText = elm.val();

	if (elmText == "no") {
		elm.closest("form").find("input[name=cancleMemo]").val("");
	}else{
		elm.closest("form").find("input[name=cancleMemo]").val(elmText);
	}
}

function prevCheckCart(){
	$.ajax({
		type: "GET", 
		url : "../manager/ajax/prevCheckCart",
		data : ({ act : "check" }),
		success : function(json){
			console.log(json);
			var getData = $.parseJSON(json);
			if(getData.code == "Y"){
				paymentStep(6, getData.receiptCode);

				if(getData.intoCheck){
					openPersonForm(getData.receiptCode, 'N');
				}
			}else{
				$("#receiptAgree").css("display", "block");
				$('html, body').animate({scrollTop : 0});
			}
		},   
		error: function(xhr, status, error) {  
			ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
		} 
	});
}

function paymentStep(step, receiptCode){
	$.ajax({
		type: "GET", 
		url : "../manager/ajax/getStepForm",
		data : ({ step : step, receiptCode : receiptCode }),
		success : function(html){
			$("#receiptResult").html(html);
			$(".receiptSection").css("display", "none");
			$("#receiptResult").css("display", "block");

			var offset = $('#receiptResult').offset();
			if(offset_minus == 0){
				$('html, body').animate({scrollTop : offset.top - offset_minus - 68 - 15}, 300);
			}else{
				$('html, body').animate({scrollTop : offset.top - offset_minus -30}, 300);
			}

			if(step == 6){
				var intervalTime = $("#intervalTime").val();
				create_limit_time(intervalTime);
			}
		},   
		error: function(xhr, status, error) {  
			ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
		} 
	});
}

var danalOpenIframe = function(formid, URL, popupName, iPopUpWinX, iPopUpWinY, params, TID, atype) {

	var installpop = "";
	installpop += '<form name="TID_FORM" id="TID_FORM" class="form-horizontal form-label-left" onsubmit="return false;">';
	installpop += '<input type="hidden" id="TempTID" name="TempTID" value="' + TID + '">';
	installpop += '</form>';

	installpop += '<div style="width:' + iPopUpWinX + 'px;height:' + iPopUpWinY + 'px; text-align:center;">';
	installpop += '<iframe id="' + popupName + '_iframe" name="' + popupName + '_iframe" scrolling="no" style="width:100%; height:100%; border: none; background:#fff;"></iframe>';
	installpop += '</div>';

	$('#danal-modal > div.modal-dialog > div.modal-content > div.modal-body').html(installpop);
	
	var myContent = "";

	myContent += '<form id="' + popupName + '_form" name="' + popupName + '_form" target="' + popupName + '_iframe" ACTION="' + URL + '" METHOD="POST">';
	myContent += '<input TYPE="HIDDEN" NAME="STARTPARAMS" VALUE="' + params + '">';
	myContent += '</form>';

	$('#' + popupName + '_iframe').contents().find('body').append(myContent);

	var form_target = popupName + '_form';
	
	$('#danal-modal').modal({
		show: true,
		keyboard: false,
		backdrop: 'static'
	});

	$('#' + popupName + '_iframe').contents().find('form').submit();	
};

var danalOpenIframe2 = function(formid, URL, popupName, iPopUpWinX, iPopUpWinY, params, TID, mdevice) {
	
	var installpop = "";
	//installpop += '<form name="TID_FORM" id="TID_FORM" class="form-horizontal form-label-left" onsubmit="return false;">';
	//installpop += '<input type="hidden" id="TempTID" name="TempTID" value="' + TID + '">';
	//installpop += '</form>';
	
	installpop += '<div style="width:100%; height:100%; text-align:center; position:fixed; top:0;">';
	installpop += '<iframe id="' + popupName + '_iframe" name="' + popupName + '_iframe" scrolling="no" style="width:100%; height:100%; border: none; background:#fff;"></iframe>';
	installpop += '</div>';

	$('#danal-modal').html(installpop);
	
	var myContent = "";

	myContent += '<form id="' + popupName + '_form" name="' + popupName + '_form" target="' + popupName + '_iframe" ACTION="' + URL + '" METHOD="POST">';
	myContent += '<input TYPE="HIDDEN" NAME="STARTPARAMS" VALUE="' + params + '">';
	myContent += '</form>';

	$('#' + popupName + '_iframe').contents().find('body').append(myContent);

	var form_target = popupName + '_form';
	
	$('#danal-modal').modal({
		show: true,
		keyboard: false,
		backdrop: 'static'
	});
	$('#danal-modal').css({'width' : '100%', 'height' : '100%', 'top' : 0, 'bottom' : 'auto'});

	$('#' + popupName + '_iframe').contents().find('form').submit();	
};

function openPersonForm(receiptCode, step){
	console.log("openPersonForm");
	$.ajax({
		type: "POST", 
		url : "../manager/ajax/openPersonForm",
		data : ({ receiptCode : receiptCode, step : step, isMobile : isMobile }),
		success : function(html){
			var footerHtml = "<button type='button' class='btn btn-primary' onClick='savePersonForm();'>승선명부 저장</button>";
			footerHtml += "<button type='button' class='btn btn-danger' data-dismiss='modal'>취소</button>";

			$('#person-modal > div.modal-dialog > div.modal-content > div.modal-body').html(html);
			$('#person-modal > div.modal-dialog > div.modal-content > div.modal-footer').html(footerHtml);

			$('#person-modal').modal({
				show: true,
				keyboard: false,
				backdrop: 'static'
			});

			if(isMobile) $('#person-modal').css({'width' : '100%', 'height' : '100%', 'top' : 0, 'bottom' : 'auto'});
		},   
		error: function(xhr, status, error) {  
			ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
		} 
	});

}

function savePersonForm(){
	var allCheck = "Y";

	$('#personSaveForm').find('.personInput').each(function () {
		if($(this).val()){
			$(this).css("background", "#fff");
		}else{
			allCheck = "N";
			$(this).css("background", "#f2dede");
		}
	});

	if(allCheck == "Y"){
		var postData = $("#personSaveForm").serializeArray();

		$.ajax({
			type: "POST", 
			url : "../manager/ajax/savePerson",
			data : postData,
			success : function(json){
				var getData = $.parseJSON(json);
				if(getData.code == "Y"){
					$('#person-modal > div.modal-dialog > div.modal-content > div.modal-body').html("");
					$('#person-modal > div.modal-dialog > div.modal-content > div.modal-footer').html("");
					$('#person-modal').modal('hide');

					if(getData.paymentCheck == "Y"){
						if(getData.stepAct == "Y"){
							receiptStep(5);
						}else{
							$("#pay" + getData.receiptCode).attr("disabled", false);
						}					
						
					}else{
						$("#pay" + getData.receiptCode).attr("disabled", true);
					}
				}else if(getData.code == "R"){
					ajax_error("등록되지 않았습니다.<br />다시 시도해주십시요.");
				}
			},   
			error: function(xhr, status, error) {  
				ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
			} 
		});
	}
}

function danalPayment(serviceType, receiptCode){
	$.ajax({
		type: "POST", 
		url : "../manager/danal/DanalReady",
		data : ({ serviceType : serviceType, receiptCode : receiptCode }),
		dataType: "json",
		async: false,
		cache: false,
		success : function(data){
			if(data["RETURNCODE"] == "0000"){
				if(isMobile){
					danalOpenIframe2("_danal_form_", data["STARTURL"], '_danal_popup_', 690, 490, data["STARTPARAMS"], data["TID"]);
				}else{
					danalOpenIframe("_danal_form_", data["STARTURL"], '_danal_popup_', 690, 490, data["STARTPARAMS"], data["TID"]);
				}
			}else{
				ajax_error("정상적으로 이용바랍니다.");
			}
		},   
		error: function(xhr, status, error) {  
			ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
		} 
	});
}

function danalRequest(result, TID){
	$('#danal-modal > div.modal-dialog > div.modal-content > div.modal-body').html("");
	$('#danal-modal').modal('hide');
	if(result == "Success"){
		ajax_error("결제 결과를 수신중입니다.<br />잠시만 기다려주세요.", "최대 1분정도 소요됩니다.");

		$.ajax({
			type: "GET", 
			url : "../manager/danal/DanalNotiRequest",
			data : ({ TID : TID }),
			success : function(json){
				var getData = $.parseJSON(json);

				if(getData.code == "Y"){
					$('#alert-modal').modal('hide');
					paymentStep(7, getData.receiptCode);
				}
			},   
			error: function(xhr, status, error) {  
				ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
			} 
		});
	}else if(result == "Fail"){
		ajax_error("결제를 실패하였습니다.<br />다시 진행해주세요.");
	}else if(result == "Cancle"){
		ajax_error("결제를 취소하였습니다.");
	}
}

function ajax_error(msg_html, foot_html){
	if(!foot_html) foot_html = "<button type='button' class='btn conceptBgColor' style='height:32px !important;' data-dismiss='modal'>확인</button>"
	$('#alert-modal div.modal-text').html(msg_html);
	$('#alert-modal div.modal-footer').html(foot_html);

	$('#alert-modal').modal({
		show: true,
		keyboard: false,
		backdrop: 'static'
	});
}

function receiptAgree(){
	$("#receiptAgree").css("display", "none");
	$("#receiptStepWrap").css("display", "block");

	if(offset_minus == 0){
		var offset = $("#mobileHeader").height();
		$('html, body').animate({scrollTop : offset - 68}, 100);
	}

	receiptInit();
	
	// 모바일에서 약관동의 후 넘어갈 때 캘린더가 보이지 않고 footer가 보여서 캘린더로 가도록 수정
	//location.href="#receiptStepWrap";	
}

function receiptInit(){
	console.log("receiptInit");

	$('.receipt').each(function(){ 
		$(this).css("display", "none");
		$(this).find(".btn-ticket").attr("disabled", true);
	});

	$('.receipt:eq(0)').css("display", "block");
	
	setDatePicker();
	
	$('#receiptForm').find("input:hidden").each(function() {
		$(this).val("");
	});
}

function removeElement(elm_id){
	$(".receipt").each(function(index) {
		if (index > (elm_id)) {
			$(this).find("btn.btn-ticket").attr("disabled", false);
			$(this).css("display", "none");
		}
	});
}

function setDatePicker(){
	console.log("setDatePicker");
	var option = { dateFormat: "yy-mm-dd", gotoCurrent:false, minDate: 0, maxDate: "+8M", defaultDate:"", todayHighlight: true, 
		onSelect:function(){
			removeElement(1);

			var today = new Date();					
			var check_date = new Date(today);

			check_date.setDate(today.getDate()+1);

			var sel_date = new Date(this.value);
			
			if(sel_date < check_date){
				$("#btnReceipt2").attr("disabled", true);
				$('#refund_alert').modal('show');
				$('#selectDate').val(this.value);
			}else{
				$('#selectDate').val(this.value);
				receiptStep(0);
			}
		}
	};
	$.extend(option,$.datepicker.regional['ko']);
	$("#receiptDate").datepicker(option);

	$(".ui-datepicker-today").find("a").removeClass("ui-state-active");	
}

function receiptStep(step){
	console.log("receiptStep", step);
	removeElement(step);

	if(step == 0){
		var date = $('#selectDate').val();
		$.ajax({
			type: "GET", 
			url : "../manager/ajax/getDatePicker",
			data : ({ date : date }),
			success : function(json){
				var getData = $.parseJSON(json);
				$("#receiptSid").val(getData.receiptSid);
				$("#receiptCode").val(getData.receiptCode);
				$("#selectDate").val(getData.selectDate);
				$("#selectDate").val(getData.selectDate);

				$("#selectVdate").text(getData.selectVdate);
				$("#btnReceipt2").attr("disabled", false);
			},   
			error: function(xhr, status, error) {  
				ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
			} 
		});	
	}else{		
		var postData = $("#receiptForm").serializeArray();
		postData.push({ name:"step" , value: step });
		$.ajax({
			type: "GET", 
			url : "../manager/ajax/getStepForm",
			data : postData,
			success : function(html){
				$('.receipt:eq(' + step +')').html(html);
				$('.receipt:eq(' + step +')').css("display", "block");

				if(offset_minus == 0){
					var offset = $('.receipt:eq(' + step +')').offset();
					$('html, body').animate({scrollTop : offset.top - offset_minus - 68 - 15}, 300);
				}

				if(offset_minus != 0 && step > 2){
					var offset = $('.receipt:eq(' + step +')').offset();
					$('html, body').animate({scrollTop : offset.top - offset_minus -30}, 300);
				}
			},   
			error: function(xhr, status, error) {  
				ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
			} 
		});
	}
}
function customerFormCheck(key){
	var allCheck = "Y";
	$('#customerForm').find('.customerVal').each(function () {
		if($(this).val()){
			if(key == "Y"){
				$(this).css("background", "#fff");
			}
		}else{
			allCheck = "N";
			if(key == "Y"){
				$(this).css("background", "#f2dede");
			}
		}
	});

	if(allCheck == "Y"){
		$("#btnReceipt6").attr("disabled", false);
	}else{
		$("#btnReceipt6").attr("disabled", true);
	}

	if(key == "Y"){
		return allCheck;
	}
}

function saveCustomer(intoWrite){
	var formCheck = customerFormCheck("Y");
	if(formCheck == "Y"){
		var receiptData = $("#receiptForm").serializeArray();
		var amountData = $("#amountForm").serializeArray();
		var customerData = $("#customerForm").serializeArray();
		var postData = $.merge( $.merge( receiptData, amountData ), customerData );
		
		$.ajax({
			type: "POST", 
			url : "../manager/ajax/saveReceipt",
			data : postData,
			success : function(json){
				var getData = $.parseJSON(json);

				console.log(getData);
				if(getData.code == "Y"){
					if(intoWrite == "Y"){
						openPersonForm(getData.receiptCode, 'Y');
					}else{
						receiptStep(5);
						//paymentStep(6, getData.receiptCode); 결제대기로 넘어가는 경우
					}
				}else if(getData.code == "R"){
					if(getData.paymentCheck == "Y"){
						ajax_error("이미 등록된 예약입니다.<br />예약 내용을 확인후 결제바랍니다.");
					}else{
						var foot_html = "<button type='button' class='btn conceptBgColor' style='height:32px !important;' data-dismiss='modal' onClick='openPersonForm(\"" + getData.receiptCode + "\", \"Y\")'>확인</button>"
						ajax_error("이미 등록된 예약입니다.<br />승선명부 작성후 결제바랍니다.", foot_html);
					}
				}
			},   
			error: function(xhr, status, error) {  
				ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
			} 
		});
	}
}

function eMailChange(elm){
	var mailDomain = elm.val();

	if (mailDomain == "no") {
		$('#customerForm').find("input[name=cMailDomain]").attr("readonly",false);
		$('#customerForm').find("input[name=cMailDomain]").val("");
		$('#customerForm').find("input[name=cMailDomain]").select();
	}else{
		$('#customerForm').find("input[name=cMailDomain]").val(mailDomain);
		$('#customerForm').find("input[name=cMailDomain]").attr("readonly",true);
	}

	customerFormCheck();
}

function phoneConfirm(){
	var phoneNumber1 = $('#phoneNumber1').val();
	var phoneNumber2 = $('#phoneNumber2').val();
	var phoneNumber3 = $('#phoneNumber3').val();

	if(phoneNumber1 && phoneNumber2 && phoneNumber3){
		$.ajax({
			type: "GET", 
			url : "../manager/ajax/sendSMSconfirm",
			data : ({ phoneNumber1 : phoneNumber1, phoneNumber2 : phoneNumber2, phoneNumber3 : phoneNumber3 }),
			success : function(json){
				var getData = $.parseJSON(json);
				if(getData.code == "Y"){
					$("#phoneNumber").val(getData.phoneNumber);
					$("#smsMsg").html("인증번호가 발송되었습니다.");
					$("#phoneConfirmBtn").attr("disabled", false);
				}else{
					$("#smsMsg").html(getData.msg);
				}
			},   
			error: function(xhr, status, error) {  
				ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
			} 
		});
	}
}

function phoneConfirmCheck(){
	var phoneConfirmChk = $('#phoneConfirmChk').val();
	var phoneNumber = $('#phoneNumber').val();
	var phoneNumber1 = $('#phoneNumber1').val();
	var phoneNumber2 = $('#phoneNumber2').val();
	var phoneNumber3 = $('#phoneNumber3').val();
	var phoneConfirmNo = $("#phoneConfirmNo").val();

	if(phoneConfirmChk){
		ajax_error("이미 인증되었습니다.<br />예약자 정보를 입력해주세요.");
	}else{
		if(phoneNumber1 && phoneNumber2 && phoneNumber3){
			$.ajax({
				type: "POST", 
				url : "../manager/ajax/checkSMSconfirm",
				data : ({ phoneNumber : phoneNumber, phoneNumber1 : phoneNumber1, phoneNumber2 : phoneNumber2, phoneNumber3 : phoneNumber3, phoneConfirmNo : phoneConfirmNo}),
				success : function(json){
					var getData = $.parseJSON(json);
					if(getData.code == "Y"){
						$("#phoneConfirmChk").val("Y");
						$("#smsMsg").html(getData.msg);
						$("#btnReceipt5").attr("disabled", false);
					}else{
						$("#phoneConfirmChk").val("");
						ajax_error(getData.msg);
						$("#smsMsg").html(getData.msg);
						$("#btnReceipt5").attr("disabled", true);
					}
				},   
				error: function(xhr, status, error) {  
					ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
				} 
			});
		}
	}
}

function calculate_price(){
	var $el_cust_price = $("input[name^=custPrice]");
	var $el_price = $("input[name^=price]");
	var $el_qty = $("input[name^=qty]");
	var price, cust_price, qty, total_qty=0, total=0, cust_total=0, sale_total=0;
	$el_price.each(function(index) {
		price = parseInt($(this).val());
		cust_price = parseInt($el_cust_price.eq(index).val());
		qty = parseInt($el_qty.eq(index).val());
		cust_total += cust_price * qty;
		total += price * qty;
		sale_total = cust_total-total;
		$(".qty-cust-price").eq(index).empty().html(numberWithCommas(String(price * qty)));
		$(".qty-price").eq(index).empty().html(numberWithCommas(String(cust_price * qty)));
		
		if(index < 3){
			total_qty += qty;
		}
		
	});
	$(".amountPrice").empty().html(numberWithCommas(String(total))+"원");
	$(".salePrice").empty().html(numberWithCommas(String(sale_total))+"원");		
	$(".paymentPrice").empty().html(numberWithCommas(String(cust_total))+"원");

	if(total_qty > 0){
		$("#btnReceipt4").attr("disabled", false);
	}else{
		$("#btnReceipt4").attr("disabled", true);
	}
}


function create_limit_time(timer2){
	setInterval(function() {
		var timer = timer2.split(':');
		var minutes = parseInt(timer[0], 10);
		var seconds = parseInt(timer[1], 10);
		--seconds;

		minutes = (seconds < 0) ? --minutes : minutes;

		if (minutes < 0) clearInterval(interval);
		
		seconds = (seconds < 0) ? 59 : seconds;
		seconds = (seconds < 10) ? '0' + seconds : seconds;
		
		//minutes = (minutes < 10) ?  minutes : minutes;
		$("#limitTime").text(addZeros(minutes ,2) + '분 ' + addZeros(seconds ,2) + '초');

		timer2 = minutes + ':' + seconds;
	}, 1000);
}

function addZeros(num, digit) { // 자릿수 맞춰주기
	  var zero = '';
	  num = num.toString();
	  if (num.length < digit) {
		for (i = 0; i < digit - num.length; i++) {
		  zero += '0';
		}
	  }
	  return zero + num;
}

function receiptSearch(){
	var receiptName = $("#receiptSearchForm").find("input[name=receiptName]").val();
	var receiptPhone = $("#receiptSearchForm").find("input[name=receiptPhone]").val();
	
	if(receiptName && receiptPhone){
		$.ajax({
			type: "POST", 
			url : "../manager/ajax/searchReceipt",
			data : ({ receiptName : receiptName, receiptPhone : receiptPhone }),
			success : function(html){
				$('#receiptViewDiv').html(html);
			},   
			error: function(xhr, status, error) {  
				ajax_error("연결이 원활하지 않습니다.<br />다시 시도해주세요.");
			} 
		});
	}else{
		ajax_error("예약자명과 휴대폰번호를 정확히 입력해주세요.");
	}
}