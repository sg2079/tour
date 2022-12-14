<%@LANGUAGE = "VBSCRIPT" CODEPAGE = "65001"%>
<%
	Session.CodePage = 65001
	Response.charset = "utf-8"
%>
<!--#include virtual="inc/table.asp"-->

<%'해킹방지
array_split_item = Array("@@", "char", "nchar", "varchar", "nvarchar", "alter", "cast", "declare", "drop", "exec","execute", "fetch", "kill", "sys", "sysobjects", "syscolumns", "<script", "</script>", "'='", "'or", "or'", "or '", "sql'", "+ or", "';", "- -", "+ or", ")or", "or(", ") or", "or (")
	for each item in Request.QueryString
		for array_counter = lbound(array_split_item) to ubound(array_split_item)
		item_position1 = InStr(lcase(Request(item)), array_split_item(array_counter))
		item_position2 = InStr(lcase(Request.QueryString), array_split_item(array_counter))
			if (item_position1 > 0) or (item_position2 > 0) Then
%>

<script type="text/javascript">
alert("사용할 수 없는 문자열이 포함되어 입력이 취소되었습니다.");
location.href = "/";
</script>
<%
				Response.End()
				'Response.Redirect "/"
			end if
		next
	Next

	for each item in Request.Form
		for array_counter = lbound(array_split_item) to ubound(array_split_item)
			item_position1 = InStr(lcase(Request(item)), array_split_item(array_counter))
			item_position2 = InStr(lcase(Request.Form), array_split_item(array_counter))
			if (item_position1 > 0) or (item_position2 > 0) then
%>
<script type="text/javascript">
alert("사용할 수 없는 문자열이 포함되어 입력이 취소되었습니다.");
location.href = "/";
</script>
<%
				Response.End()
				'Response.Redirect "/"
			end if
		next
	Next
'strConnect= "Provider=Sqloledb;
'	      Data Source=컴퓨터이름 또는 ID;
'             Initial Catalog=데이터베이스명;
'             User ID=유저명;
'             Password=비밀번호;"
%>

<OBJECT RUNAT="server" PROGID="ADODB.Connection" id="db"></OBJECT>
<OBJECT RUNAT="server" PROGID="ADODB.Recordset"  id="rs"></OBJECT>
<OBJECT RUNAT="server" PROGID="ADODB.Recordset"  id="rs1"></OBJECT>
<OBJECT RUNAT="server" PROGID="ADODB.Recordset"  id="rs2"></OBJECT>

<%
strConnect= "Provider=Sqloledb;" &_
	    "Data Source=211.57.201.155;" &_
            "Initial Catalog=db_haema_2022;" &_
            "User ID=haema;" &_
            "Password=haema9134^^;" 

db.Open(strConnect)
Const adOpenKeySet = 1

Server.ScriptTimeout = 900000000


%>

