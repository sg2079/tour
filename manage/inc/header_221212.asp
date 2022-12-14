    
    <header id="header" class="media">
        <div class="pull-left h-logo">
            <a href="index.html" class="hidden-xs" style="display: flex; align-items: flex-end; margin-bottom: 10px;">
                해마여행사<small style="margin-left: 5px;">admin</small>
            </a>
            
            <!-- 업체선택 -->
            <select class="biz_select">
                <option>업체선택</option>
                <option></option>
                <option></option>
            </select>

            <style>
                .biz_select {
                    width: 175px; height: 30px; background-color: #759fdb; color: white; border:none; padding: 5px;
                }
                .biz_select>option {
                    background-color: white;
                    color: #333;
                }
                
            </style>
            <div class="menu-collapse" data-ma-action="sidebar-open" data-ma-target="main-menu">
                <div class="mc-wrap">
                    <div class="mcw-line top palette-White bg"></div>
                    <div class="mcw-line center palette-White bg"></div>
                    <div class="mcw-line bottom palette-White bg"></div>
                </div>
            </div>
        </div>

        <ul class="pull-right h-menu">
            <li class="hm-search-trigger">
                <a href="" data-ma-action="search-open">
                    <i class="hm-icon zmdi zmdi-search"></i>
                </a>
            </li>
            
           <!--  <li class="dropdown hidden-xs hidden-sm h-apps">
                <a data-toggle="dropdown" href="">
                    <i class="hm-icon zmdi zmdi-apps"></i>
                </a>
                <ul class="dropdown-menu pull-right">
                    <li>
                        <a href="calendar.html">
                            <i class="palette-Red-400 bg zmdi zmdi-calendar"></i>
                            <small>달력</small>
                        </a>
                    </li>
                    
                    <li>
                        <a href="">
                            <i class="palette-Green-400 bg zmdi zmdi-file-text"></i>
                            <small>공지</small>
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <i class="palette-Orange-400 bg zmdi zmdi-trending-up"></i>
                            <small>관리</small>
                        </a>
                    </li>
                </ul>
            </li> -->

            <li class="hm-alerts" data-user-alert="sua-messages" data-ma-action="sidebar-open" data-ma-target="user-alerts">
                <a href=""><i class="hm-icon zmdi zmdi-notifications"></i></a>
            </li>
            <li class="dropdown hm-profile">
                <a data-toggle="dropdown" href="">
                    <img src="http://haematour.co.kr/manage/logo.png" alt="">
                </a>
                
                <ul class="dropdown-menu pull-right dm-icon">
                    <li>
                        <a href="profile.html"><i class="zmdi zmdi-account"></i>프로필 보기</a>
                    </li>
                    <li>
                        <a href=""><i class="zmdi zmdi-time-restore"></i>로그아웃</a>
                    </li>
                </ul>
            </li>
        </ul>
        
        <div class="media-body h-search">
            <form class="p-relative">
                <input type="text" class="hs-input" placeholder="검색어를 입력하세요">
                <i class="zmdi zmdi-search hs-reset" data-ma-action="search-clear"></i>
            </form>
        </div>
        
    </header>

        