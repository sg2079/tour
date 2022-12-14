(function () {

     /* 시간 */
    const selectHourStart = 00;
    const selectHourEnd = 23;
    let selectHourOptions = "";

    for (let hour = selectHourStart; hour <= selectHourEnd; hour++) {
        selectHourOptions += `<option>${hour}시간</option>`;
    }
    for (const element of document.getElementsByClassName('hour-select')) {
        element.innerHTML = selectHourOptions
    }

    /* 분 */
    const selectMinutesStart = 00;
    const selectMinutesEnd = 59;
    let selectMinutesOptions = "";

    for (let minutes = selectMinutesStart; minutes <= selectMinutesEnd; minutes++) {
        selectMinutesOptions += `<option>${minutes}분</option>`;
    }
    for (const element of document.getElementsByClassName('minutes-select')) {
        element.innerHTML = selectMinutesOptions
    }

    // 글자수 제한
    $(document).on('input', '.limit', function () {
        if (Number($(this).next().find('.char_num').text()) >= Number($(this).next().find('.limit_cnt').text())) {
            console.log('!');
            let val = $(this).val().slice(0, $(this).val().length - 1)
            $(this).val(val);
        }

        $(this).next().find('.char_num').text($(this).val().length);
    });



    // 달력노출 & 비노출
    $(document).on('change', '.term_select', function () {

        if ($(this).val() === 'adjust') {

            $(this).next().css({
                'display': 'flex'
            });x
        } else {
            $(this).next().css({
                'display': 'none'
            });
        }
    });


    /* 숫자만 기입 */
    $(".phone").on("keyup", function(event) {
        if (event.which && (event.which  > 47 && event.which  < 58 || event.which == 8)) {
            
        }else{
            alert('숫자만 입력해주세요.');
            $(this).val($(this).val().replace(/[^0-9]/g,""));
        }
    });
    $(".won").on("keyup", function(event) {
        if (event.which && (event.which  > 47 && event.which  < 58 || event.which == 8)) {
            
        }else{
            alert('숫자만 입력해주세요.');
            $(this).val($(this).val().replace(/[^0-9]/g,""));
        }
    });


    // 원단위 콤마
    $(function() {
        var $input = $(".won");
        $input.on('keyup', function() {
          // 입력 값 알아내기
          var _this = this;
          numberFormat(_this)
        })
      
      });
      
      // 콤마 찍기
      function comma(str) {
        str = String(str);
        return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
      }
      
      // 콤마 풀기
      function uncomma(str) {
        str = String(str);
        return str.replace(/[^\d]+/g, '');
      }
      
      function numberFormat(obj) {
        obj.value = comma(uncomma(obj.value));
      }


    // 주차설정 토글
    $(document).on('click', '.parking_set_choose span', function () {
        if ($(this).hasClass('on')) {
            $(this).css({
                'background': '#467FCF',
                'color': '#fff'
            });
            $('.parking_set_choose').css({
                'border': '2px solid #467FCF'
            });

            $('.parking_set_choose span.off').css({
                'background': 'initial',
                'transition' : 'all .3s'
            });

            $('.parking_button_wrapper').css({
                'display': 'flex',
                'transition' : 'all .3s'
            }); 
           
            $('.parking_time_pay').css({
                'display': 'block',
                'transition' : 'all .3s'
            }); 
           
            $('.valet_wrapper').css({
                'display': 'block',
                'transition' : 'all .3s'
            }); 

        } else {
            $(this).css({
                'background': '#7f7e85',
                'color': '#fff'
            });
            $('.parking_set_choose').css({
                'border': '2px solid #7f7e85'
            });

            $('.parking_set_choose span.on').css({
                'background': 'initial',
                'transition' : 'all .3s'
            });
           
            $('.parking_button_wrapper').css({
                'display': 'none',
                'transition' : 'all .3s'
            });
          
            $('.parking_time_pay').css({
                'display': 'none',
                'transition' : 'all .3s'
            });
          
            $('.valet_wrapper').css({
                'display': 'none',
                'transition' : 'all .3s'
            });
        }
    })

    // 주차가능 토글
    $(document).on('click', '.parking_choose span', function () {
        if ($(this).hasClass('on')) {
            $(this).css({
                'background': '#467FCF',
                'color': '#fff'
            });
            $('.parking_choose').css({
                'border': '2px solid #467FCF'
            });

            $('.parking_time_pay').css({
                'display': 'block',
                'transition' : 'all .3s'
            });

            $('.parking_choose span.off').css({
                'background': 'initial',
                'transition' : 'all .3s'
            });

            $('.parking_pay').css({
                'display': 'block',
                'transition' : 'all .3s'
            }); 

        } else {
            $(this).css({
                'background': '#7f7e85',
                'color': '#fff'
            });
            $('.parking_choose').css({
                'border': '2px solid #7f7e85'
            });

            $('.parking_time_pay').css({
                'display': 'none',
                'transition' : 'all .3s'
            });

            $('.parking_choose span.on').css({
                'background': 'initial',
                'transition' : 'all .3s'
            });

            $('.parking_pay').css({
                'display': 'none',
                'transition' : 'all .3s'
            });
            $('.flat_pay').css({
                'display': 'none',
                'transition' : 'all .3s'
            });
           
        }
    })

     // 주차비유료
    $('#parking_nonfree').click(function(){
        $('.parking_time_pay').css({
            'display' : 'block'
        });
    })
    // 주차비무료
     $('#parking_free').click(function(){
        $('.parking_time_pay').css({
            'display' : 'none'
        });
    })
    $('.valet_pay_input').attr("disabled", false);
    
    //주차무료 입력막기
    $('#pay_first_free').click(function(){
        $('#time_over_pay_price').attr("disabled", true); 
    })
    $('#pay_first_nonfree').click(function(){
        $('#time_over_pay_price').attr("disabled", false); 
    })

    //발렛 입력막기 
    $('#valet_nonfree').click(function(){
        $('#valet_price').attr("disabled", false); 
    })
    $('#valet_no').click(function(){
        $('#valet_price').attr("disabled", true); 
    })
    $('#valet_free').click(function(){
        $('#valet_price').attr("disabled", true); 
    })

    // 정액과금
    $('.flat_over_pay').click(function(){
        $('.flat_pay').css({
            'display' : 'block'
        });
        $('.first_pay').css({
            'display' : 'none'
        });
        $('.over_pay').css({
            'display' : 'none'
        });
        $('.total_pay').css({
            'display' : 'none'
        });
    })
    // 시간당과금
    $('.time_over_pay').click(function(){
        $('.flat_pay').css({
            'display' : 'none'
        });
        $('.first_pay').css({
            'display' : 'block'
        });
        $('.over_pay').css({
            'display' : 'block'
        });
        $('.total_pay').css({
            'display' : 'block'
        });
    })
   

     // 재고노출 토글
     $(document).on('click', '.stock_set_choose span', function () {
        if ($(this).hasClass('on')) {
            $(this).css({
                'background': '#467FCF',
                'color': '#fff'
            });
            $('.stock_set_choose').css({
                'border': '2px solid #467FCF'
            });

            $('.stock_set_choose span.off').css({
                'background': 'initial',
                'transition' : 'all .3s'
            });

        } else {
            $(this).css({
                'background': '#7f7e85',
                'color': '#fff'
            });
            $('.stock_set_choose').css({
                'border': '2px solid #7f7e85'
            });

            $('.stock_set_choose span.on').css({
                'background': 'initial',
                'transition' : 'all .3s'
            });
        }
    })

    // 상세소개 추가
    let revealItemCnt = 1;

    
    let revealUl = $('.reveal_ul');
    let imgCnt = 0;
    let imgCnt2 = 0;

    function revealCntRest() {
        for (let i = 0; i < $('.reveal_cnt').length; i++) {
            $('.reveal_cnt')[i].innerText = i + 1;
        }
    }

    $(document).on('click', '.reveal_btn button', function () {

        let temp = `
        <li class="reveal_item">
            <div class="reveal_sort_wrapper">
                <span>노출순서 <span class="reveal_cnt"> 1</span></span>
                <div class="sort_btn">
                    <button class="up"><i class="fa-solid fa-angle-up"></i></button>
                    <button class="down"><i class="fa-solid fa-angle-down"></i></button>
                    <i class="fa-solid fa-x"></i>
                </div>
            </div>
    
            <div class="reveal_contents_wrapper">
                <div class="reveal_input_wrapper">
                    <span>제목</span>
                    <div class="reveal_input">
                        <input type="text" name="" id="" placeholder="제목을 입력해주세요." class="limit">
                        <span><span class="char_num">0</span>자<span class="limit_cnt"> / 40자(최소 3자)</span></span>
                    </div>
                </div>
    
                <div class="reveal_input_wrapper">
                    <span>설명</span>
                    <div class="reveal_input">
                        <textarea type="text" name="" id="" placeholder="설명을 입력해주세요." class="limit"></textarea>
                        <span><span class="char_num">0</span>자/<span class="limit_cnt"> / 600자(최소 4자)</span></span>
                    </div>
                </div>
    
                <div class="reveal_img_wrapper">
                    <ul>
                        <li class="img_list">
                        </li>
                    </ul>
    
                    <div class="add_image">
                        
                        <label for="reveal_img${imgCnt += 1}" style="border: 1px solid #aaa; line-height: 35px; width: 80px;
                        text-align: center; font-size: 15px; background-color: #f0f0f0;">파일추가</label>
                        <input type="file" multiple name="reveal_img" id="reveal_img${imgCnt2 += 1}">
                        <span class="reveal_notion" style="font-size: 14px; margin-left: 10px; color: #aaa;">한 장 당 최대 20MB, 3장</span>
    
                    </div>
                </div>
            </div>
        </li>
         `;

        revealItemCnt += 1;
        revealUl.append(temp);
        revealCntRest();
        if (revealItemCnt >= 5) {
            $(this).hide();
        }
    });



    // 상세소개 삭제
    $(document).on('click', '.sort_btn .fa-solid.fa-x', function () {
        $(this).closest('.reveal_item').remove();
        revealCntRest();
        revealItemCnt -= 1;
        $('.reveal_btn button').show();
    });


    // 이미지 삭제
    $(document).on('click', '.img_list i.fa-solid.fa-x', function () {
        $(this).closest('.img_list').remove();
    });



    // 이미지 파일 미리보기 추가
    $(document).on('change', 'input[name="reveal_img"]', function (e) {
        let fileUl = $(this).closest('.reveal_img_wrapper').find('ul');

        for (let i = 0; i < $(this)[0].files.length; i++) {
            let reader = new FileReader();
            reader.readAsDataURL($(this)[0].files[i]); //파일을 읽는 메서드 
            reader.onload = function () {
                let img_temp = `
                <li class="img_list">
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


    // 이미지 파일 미리보기 추가(대표이미지)
    $(document).on('change', 'input[name="enterprise_img"]', function (e) {
        let fileUl = $(this).closest('.image_file_wrapper').find('ul');

        for (let i = 0; i < $(this)[0].files.length; i++) {
            let reader = new FileReader();
            reader.readAsDataURL($(this)[0].files[i]); //파일을 읽는 메서드 
            reader.onload = function () {
                let img_temp = `
                <li class="img_list">
                    <img src="${reader.result}" alt="">
                    <i class="fa-solid fa-x"></i>
                </li>
                `
                fileUl.append(img_temp);
            }
        }
    });
    
    // 이미지 파일 미리보기 추가(예약상품이미지)
    $(document).on('change', 'input[name="res_img"]', function (e) {
        let fileUl = $(this).closest('.image_file_wrapper').find('ul');

        for (let i = 0; i < $(this)[0].files.length; i++) {
            let reader = new FileReader();
            reader.readAsDataURL($(this)[0].files[i]); //파일을 읽는 메서드 
            reader.onload = function () {
                let img_temp = `
                <li class="img_list">
                    <img src="${reader.result}" alt="">
                    <i class="fa-solid fa-x"></i>
                </li>
                `
                fileUl.append(img_temp);
            }
        }
    });


    // 버튼 업
    $(document).on('click', 'button.up', function () {
        let liTemp = $(this).closest('.reveal_item');
        liTemp.prev().before(liTemp)
    });

    // 버튼다운
    $(document).on('click', 'button.down', function () {
        let liTemp = $(this).closest('.reveal_item');
        liTemp.next().after(liTemp)
    });

    /* map */
    window.onload = function(){

        /* 지번 */
        document.getElementById("jibun").addEventListener("click", function(){ //주소입력칸을 클릭하면 카카오 지도 발생
            new daum.Postcode({
                oncomplete: function(data) { //선택시 입력값 세팅
                    document.getElementById("jibun").value = data.address; // 주소 넣기
                    document.querySelector("textarea[name=add_detail]").focus(); //상세입력 포커싱
                }
            }).open();
        });

        /* 도로명 */
       /*  document.getElementById("add_doro").addEventListener("click", function(){ //주소입력칸을 클릭하면 카카오 지도 발생
            new daum.Postcode({
                oncomplete: function(data) { //선택시 입력값 세팅
                    document.getElementById("add_doro").value = data.address; // 주소 넣기
                    document.querySelector("textarea[name=add_detail]").focus(); //상세입력 포커싱
                }
            }).open();
        }); */
    }

    /* 연락처 숫자만 기입 */
    $(".phone").on("keyup", function(event) {
        if (event.which && (event.which  > 47 && event.which  < 58 || event.which == 8)) {
            
        }else{
            alert('숫자만 입력해주세요.');
            $(this).val($(this).val().replace(/[^0-9]/g,""));
        }
    });



})();