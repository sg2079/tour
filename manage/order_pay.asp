<!--#include virtual="/inc/dbconfig.asp"-->
<!--#include virtual="/lib/SHA256.asp"-->
<%
	TableName = table & "_order"
	
	onum = Request("onum")

	strSQL = "select * from " & table & "_order where o_num = '" & onum & "'"
	rs.open strSQL, db, AdOpenKeySet

	If Not rs.eof Then
		o_name = rs("o_name")
		o_ccode = rs("o_ccode")
		o_tel = rs("o_tel")
		o_sdate = rs("o_sdate")
		o_edate = rs("o_edate")
		o_stime = rs("o_stime")
		o_stime_name = rs("o_stime_name")
		If o_stime_name <> "" Then o_stime = o_stime_name
		o_etime = rs("o_etime")
		o_etime_name = rs("o_etime_name")
		If o_etime_name <> "" Then o_etime = o_etime_name
		o_type = rs("o_type")
		o_email = "paymail@paymailinsert.co.kr"		'rs("o_email")
		o_amem = rs("o_amem")
		o_smem = rs("o_smem")
		o_srmem = rs("o_srmem")
		o_cmem = rs("o_cmem")
		o_bmem = rs("o_bmem")
		o_price = rs("o_price")
		o_tel = rs("o_tel")
		If o_type = "R" Then
			o_type = "왕복"
		Else
			o_type = "편도"
		End If
		o_area = rs("o_area")
		o_sarea = rs("o_sarea")
		o_pay = rs("o_pay")
		o_car_num = rs("o_car_num")
		o_car_name = rs("o_car_name")
		o_hotel_idx = rs("o_hotel_idx")
		If o_hotel_idx = "" Or isnull(o_hotel_idx) Then o_hotel_idx = 0
	End If
	rs.close

	strSQL = "select c_name, c_sms_ment, c_sms_ment2, c_bank, c_bank_num, c_bank_name from " & table & "_corpcode where c_code = '" & o_ccode & "'"
	rs.open strSQL, db, AdOpenKeySet

	If Not rs.eof Then
		c_name = rs("c_name")
		c_sms_ment = rs("c_sms_ment")
		c_sms_ment2 = rs("c_sms_ment2")
		c_bank = rs("c_bank")
		c_bank_num = rs("c_bank_num")
		c_bank_name = rs("c_bank_name")
	End If
	rs.close

	strSQL = "select * from " & table & "_product where p_num = '" & o_sarea & "'"
	rs.open strSQL, db, AdOpenKeySet

	If Not rs.eof Then
		p_a_ment = rs("p_a_ment")
		p_s_ment = rs("p_s_ment")
		p_sr_ment = rs("p_sr_ment")
		p_c_ment = rs("p_c_ment")
		p_b_ment = rs("p_b_ment")
		p_pay = rs("p_pay")
		p_ship = rs("p_ship")
		pe_code = rs("pe_code")
		pr_code = rs("pr_code")
	End If
	rs.close

	strSQL = "select * from " & table & "_area where a_code = '" & pe_code & "'"
	rs.open strSQL, db, AdOpenKeySet

	If Not rs.eof Then
		ae_name = rs("a_name")
	End If
	rs.close

	strSQL = "select * from " & table & "_area where a_code = '" & pr_code & "'"
	rs.open strSQL, db, AdOpenKeySet

	If Not rs.eof Then
		ar_name = rs("a_name")
	End If
	rs.close

	is_mobile = False
	mbchk = "iPhone|iPad|iPod|BlackBerry|Android|Windows CE|LG|MOT|SAMSUNG|SonyEricsson|Mobile|Symbian|Opera Mobi|Opera Mini|IEmobile|Mobile|lgtelecom|PPC"
	mbchks = Split(mbchk,"|")
	http_agent = Request.ServerVariables("HTTP_USER_AGENT")
	For i = 0 To UBound(mbchks)
		If InStr(http_agent, mbchks(i)) > 0 Then
			is_mobile = True
			Exit for
		End If
	Next

	''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	' <결제요청 파라미터>
	' 결제시 Form 에 보내는 결제요청 파라미터입니다.
	' 샘플페이지에서는 기본(필수) 파라미터만 예시되어 있으며, 
	' 추가 가능한 옵션 파라미터는 연동메뉴얼을 참고하세요.
	''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	merchantKey      = "hPNxzC7gklUm0NtI22ASzNGOA+b66uXMn0X4sfx1zNXxPmNqodT1Ls8gqAlx0PcbFW+rb9lVWPinFDuutCp+RA=="  '상점키
	merchantID       = "haema0129m"                             '상점아이디
	goodsCnt         = "1"                                      '결제상품개수
	goodsName        = o_area                             '결제상품명
	price            = o_price                                   '결제상품금액	
	buyerName        = o_name                                 '구매자명
	buyerTel         = o_tel                            '구매자연락처
	buyerEmail       = o_email                        '구매자메일주소
	moid             = onum                        '상품주문번호	
	encodeParameters = "CardNo,CardExpire,CardPwd"              '암호화대상항목 (변경불가)

	If is_mobile Then
		returnURL        = "http://" & Request.serverVariables("HTTP_HOST") & "/order_comp.asp"                                           '결과페이지 URL
		charSet          = "utf-8"                                                                                      '결과페이지 인코딩
	End If

	''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	' <가상계좌 입금 만료일>
	''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	tomorrow = (date()+1)
	tomorrow = Replace(tomorrow, "-", "")

	''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	' <해쉬암호화> (수정하지 마세요)
	' SHA256 해쉬암호화는 거래 위변조를 막기위한 방법입니다. 
	''''''''''''''''''''''''''''''''''''''''''''''''''''''''
	call initCodecs

	ediDate = getNow()
	hashString = SHA256_Encrypt(ediDate & merchantID & price & merchantKey)

	Function getNow()
	Dim aDate(2), aTime(2)
		aDate(0) = Year(Now)
		aDate(1) = Right("0" & Month(Now), 2)
		aDate(2) = Right("0" & Day(Now), 2)
		aTime(0) = Right("0" & Hour(Now), 2)
		aTime(1) = Right("0" & Minute(Now), 2)
		aTime(2) = Right("0" & Second(Now), 2)	
		getNow   = aDate(0)&aDate(1)&aDate(2)&aTime(0)&aTime(1)&aTime(2)	   
	End Function
%>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<!--#include virtual = "/inc/title.asp"-->
		<link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
		<link rel="stylesheet" type="text/css" href="assets/css/custom.css"/>	
		<link rel="stylesheet" href="assets/css/style.css">
<%If Not is_mobile Then%>
		<script src="https://web.nicepay.co.kr/v3/webstd/js/nicepay-2.0.js" type="text/javascript"></script>
		<script type="text/javascript">
		//결제창 최초 요청시 실행됩니다.
		function nicepayStart(){
			if (document.payForm.PayMethod.value == "NBANK")
			{
				//location.href = "order_n_comp.asp?onum=<%=onum%>";
				//return;
				goPay(document.payForm);
			}
			else
			{
				goPay(document.payForm);
			}
		}

		//결제 최종 요청시 실행됩니다. <<'nicepaySubmit()' 이름 수정 불가능>>
		function nicepaySubmit(){
			document.payForm.submit();
		}

		//결제창 종료 함수 <<'nicepayClose()' 이름 수정 불가능>>
		function nicepayClose(){
			alert("결제가 취소 되었습니다");
		}
		</script>
<%Else%>
		<script type="text/javascript">
		function goPay() {
			if (document.payForm.PayMethod.value == "NBANK")
			{
				//location.href = "order_n_comp.asp?onum=<%=onum%>";
				//return;
				document.charset = "euc-kr";
				document.payForm.submit();
			}
			else
			{
				document.charset = "euc-kr";
				document.payForm.submit();
			}
		}
		</script>
<%End If%>
		<script type="text/javascript">
			setTimeout(function() {
			  alert("결제시간이 초과 되었습니다!\n상품 선택 페이지로 돌아갑니다.");
			  location.href = "product.htm?code=<%=o_ccode%>";
			  document.getElementById("contactBtn").style.display = "none";
			}, 300000);
		</script>
	</head>

	<body>
    <main class="main-area">

        <!--// Contact Section Start //-->
        <section class="section">
            <div class="container">
                <div class="justify-content-center">
                    <div>
                        <div class="section-heading">
                            <h2 class="section-title">온라인예약</h2>
                        </div>
                    </div>
                </div>
				<div class="row align-items-start justify-content-center contact-form-wrap">
						<%If Not is_mobile Then%>
						<form id="payForm" name="payForm" method="post" action="order_comp.asp">
						<%Else%>
						<form name="payForm" target="_self" method="post" action="https://web.nicepay.co.kr/v3/smart/smartPayment.jsp" accept-charset="euc-kr">
						<%End If%>
						<div>
							<p class="contact-form-wrap">
								<span style="font-weight:bold; color:#333333; font-size:1.5em;">예약상세내역</span><br>
									출발일 : <%=o_sdate%><br>
									출발정보 : <%=o_stime%><%If o_etime <> "" And Not isnull(o_etime) And (o_edate = "" Or isnull(o_edate)) Then%> ~ <%=o_etime%><%End If%> / <%=o_area%><%If ar_name <> "" Then%> (<%=ar_name%>)<%End If%>
									<%If o_edate <> "" And Not isnull(o_edate) Then%>
									<br>
									도착일 : <%=o_edate%> / <%=ae_name%>(<%=o_etime%>)<br>
									<%End If%>
									예약자 : <%=o_name%><br>
									상품 : <%=o_area%><%If ae_name <> "" And o_area <> ae_name Then%>→<%=ae_name%><%End If%><br>
									승선구분 : <%=o_type%><br>
									승선인원 : <%If p_a_ment <> "" Then%>대인(<%=p_a_ment%>)<%Else%>대인<%End If%>&nbsp;&nbsp;<%=o_amem%>명
									<%If o_smem > 0 Then%> / <%If p_s_ment <> "" Then%>중고생(<%=p_s_ment%>)<%Else%>중고생<%End If%>&nbsp;&nbsp;<%=o_smem%>명<%End If%>
									<%If o_srmem > 0 Then%> / <%If p_sr_ment <> "" Then%>경로(<%=p_sr_ment%>)<%Else%>경로<%End If%>&nbsp;&nbsp;<%=o_srmem%>명<%End If%>
									<%If o_cmem > 0 Then%> / <%If p_c_ment <> "" Then%>소아(<%=p_c_ment%>)<%Else%>소아<%End If%>&nbsp;&nbsp;<%=o_cmem%>명<%End If%>
									<%If o_bmem > 0 Then%> / <%If p_b_ment <> "" Then%>유아(<%=p_b_ment%>)<%Else%>유아<%End If%>&nbsp;&nbsp;<%=o_bmem%>명<%End If%>
									<br>
									<%If o_car_num > 0 Then%><br>차량 : <%=o_car_name%> <%=o_car_num%>대<%End If%>
									<%If o_hotel_idx > 0 Then%>
									<%
										strSQL = "select * from " & table & "_hotel where hotel_num = '" & o_hotel_idx & "' order by hotel_num asc"
										rs2.open strSQL, db, AdOpenKeySet

										If Not rs2.eof Then
											hotel_num = rs2("hotel_num")
											hotel_name = rs2("hotel_name")
											hotel_price = rs2("hotel_price")
											hotel_max = rs2("hotel_max")
											hotel_week = rs2("hotel_week")
										End If
										rs2.close
									%>
									<br>- 객실 : <%=hotel_name%><%End If%>
									<p class="contact-form-wrap" style="color:#ff3300; font-weight:bold;">
									결제선택 : <select name="PayMethod">
									<option value="CARD">신용카드</option>
									<%If p_pay = "A" And o_ccode <> "MJ2103150001" Then%>
									<option value="BANK">계좌이체</option>
									<%End If%>
									<%If o_ccode = "MJ2103150001" Then%>
									<option value="BANK">계좌이체</option>
									<%End If%>
									</p>
								</select>
							</p>
							<div class="col-sm-12 text-center" style="margin-top:20px;">
								<div class="contact-btn-left">
									<button type="button" id="contactBtn" class="default-button" onclick="<%If Not is_mobile Then%>nicepayStart();<%Else%>goPay();<%End If%>">결제</button>
								</div>
							</div>
						</div>
						<input type="hidden" name="GoodsName" id="GoodsName" value="<%=c_name%> 티켓" />
						<input type="hidden" name="Amt" id="Amt" value="<%=price%>" />
						<input type="hidden" name="Moid" id="Moid" value="<%=onum%>" />
						<input type="hidden" name="BuyerName" id="BuyerName" value="<%=o_name%>" />
						<input type="hidden" name="BuyerEmail" id="BuyerEmail" value="<%=o_email%>" />
						<input type="hidden" name="BuyerTel" id="BuyerTel" value="<%=o_tel%>" />
						<input type="hidden" name="MID" id="MID" value="<%=merchantID%>" />
						<!-- IP --> 
						<input type="hidden" name="UserIP" value="<%=Request.ServerVariables("REMOTE_ADDR")%>">
						<input type="hidden" name="MallIP" value="<%=Request.ServerVariables("LOCAL_ADDR")%>">

						<!-- 옵션 -->
						<input type="hidden" name="VbankExpDate" value="<%=tomorrow%>"/>             <!-- 가상계좌입금만료일 -->
						<input type="hidden" name="BuyerEmail" value="<%=buyerEmail%>"/>             <!-- 구매자 이메일 -->				  
						<input type="hidden" name="GoodsCl" value="0"/>                              <!-- 상품구분(실물(1),컨텐츠(0)) -->
						<input type="hidden" name="TransType" value="0"/>                            <!-- 일반(0)/에스크로(1) --> 
						<input type="hidden" name="MallReserved"  value=""/>                         <!-- 상점 여분 필드 --> 
						<%If is_mobile Then%>
						<input type="hidden" name="ReturnURL" value="<%=returnURL%>"/>               <!-- 결과페이지 URL -->
						<input type="hidden" name="CharSet" value="<%=charSet%>"/>                   <!-- 결과페이지 인코딩 -->
						<input type="hidden" name="ReturnURL" value="<%=returnURL%>"/>  
						<%End If%>

						<!-- 변경 불가능 -->
						<input type="hidden" name="EncodeParameters" value="<%=encodeParameters%>"/> <!-- 암호화대상항목 -->
						<input type="hidden" name="EdiDate" value="<%=ediDate%>"/>                   <!-- 전문 생성일시 -->
						<input type="hidden" name="EncryptData" value="<%=hashString%>"/>            <!-- 해쉬값 -->
						<input type="hidden" name="TrKey" value=""/>                                 <!-- 필드만 필요 -->
						<input type="hidden" name="SocketYN" value="Y">                              <!-- 소켓통신 유무-->
						<input type="hidden" name="MerchantKey" value="<%=merchantKey%>"/>           <!-- 상점 키 -->
						<input type="hidden" name="AcsNoIframe" value="Y"/>					 	   <!-- 나이스페이 결제창 프레임 옵션 (변경불가) -->

						</form>
					</div>

					<!-- The popover content -->

					<div id="popover" style="display: none">
						<a href="#"><span class="glyphicon glyphicon-pencil"></span></a>
						<a href="#"><span class="glyphicon glyphicon-remove"></span></a>
					</div>
            </div>
        </section>
        <!--// Contact Section End //-->
		<!-- JavaScript includes -->

		<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script> 
		<script src="assets/js/bootstrap.min.js"></script>
		<script src="assets/js/customjs.js"></script>

	</body>
</html>