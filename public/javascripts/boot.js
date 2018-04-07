$(function(){

  formAction.checkPattern();
  formAction.emailImitater();
  formAction.checkAllFieldFilled();
});

formAction = function (){};

// 必須入力項目の入力チェック
formAction.checkPattern = function(){
  
  $('[required]').on('keyup change', function(e){
    
    // パスワード確認は例外としてcheckConfirmPassword()
    if ($(this).attr("id") == "account_password_confirm"){
      var original = $('#account_password');
      checkConfirmPassword(original, $(this));
      return;
    }

    // メールアドレスはドコモ/auのRFC2822非準拠のものもチェックして警告
    if ($(this).attr("id") == "email"){
      $('#email').popover({
        placement: "top",
        title: "ご利用いただけません",
        content: "メールアドレスの国際ルールに沿ったアドレスではなく、お客様へのメールがうまく配信されない恐れがあるため、ご利用いただけません。@の前に.をつけないか、連続した.を使わないアドレスをご利用ください",
        trigger:   "manual"
      });

      if ((/\.@/.test($(this).val()) || /\.{2,}/.test($(this).val())) && /@(docomo|ezweb)/.test($(this).val())){
        $('#email').popover("show");
      }  else{
        $('#email').popover("hide");
      }
    }
    
    if (e.type == "keyup") checkInput($(this));
    if (e.type == "change") checkSelect($(this));

  });
  
  $('.required input[type="radio"]:radio').on('click onkeypress', function (e){
    checkRadio($(this));
  });

  $('.required input[type="checkbox"]:checkbox').on('click onkeypress', function (){
    checkCheckbox($(this));
  });

  // 入力チェック pattern属性があればtest()、なければ無条件OK
  var checkInput = function (elm){
    
    if (checkAttr(elm, "pattern")){
      var regex = new RegExp ("^"+elm.attr("pattern")+"$");
      if (regex.test(elm.val()) == true){
        setStatus(elm, "dealed");
      } else if(elm.val() == ""){
        setStatus(elm, "alert");
      } else{
        setStatus(elm, "caution");
      }
    } else{
      if (elm.val() != ""){
        setStatus(elm, "dealed");
      }
    }

  };

  var checkSelect = function (elm){
    setStatus(elm, "dealed");
  };
  
  var checkRadio = function (elm){
    setStatus(elm.parents(".required"), "dealed");
  };

  var checkCheckbox = function (elm){
    var checked = false;
    // チェックボックスのどれか1つにチェックが入っていればOK
    elm.parents(".required").find(".checkbox").each(function(){
      if ($(this).find("input").is(":checked")){
        setStatus(elm.parents(".required"), "dealed");
        checked = true;
      }
    });
    if (checked == true) return;
    setStatus(elm.parents(".required"), "alert");
  };

  // パスワードが入力されたものと一致するか検証
  var checkConfirmPassword = function(original, confirm){
    
    if (confirm.val() == original.val()){
      setStatus(confirm, "dealed");
    } else if (confirm.val() == ""){
      setStatus(confirm, "alert");
    } else{
      setStatus(confirm, "caution");
    }
    
  };

};

// 必須入力項目が全て入力されているか確認して送信ボタンの有効/無効を切り替える
// 今のところ封印中
formAction.checkAllFieldFilled = function(){
  
  $("#submit").attr("disabled", "disabled");

  if (
      ($("[required]").length == $("[required].dealed").length) &&
      ($(".required").length == $(".required.dealed").length)
      ){
    $("#submit").removeAttr("disabled");
  }

};

// 確認用メールアドレスをインクリメンタルコピペ
formAction.emailImitater = function(){

  $('#email').on('keyup', function(){

    $("#email_confirm").parent().parent().removeClass("hide");
    $("#email_confirm").text($(this).val());

  });

};

// 内部関数：指定した日数分、今日から移動した日付を返す
// 内部関数：要素にステータスクラスを設定
function setStatus(elm, status){

  elm.removeClass("alert caution dealed");
  elm.addClass(status);
  return;

}

// 内部関数：属性存在確認
function checkAttr(elm, attr){

  return (typeof elm.attr(attr) !== 'undefined' && elm.attr(attr) !== false) ? true : false;

}

// 関数上書：複数のスクリプト読み込みに対応した$.getScript
var getScript = $.getScript;
$.getScript = function(url, fn){
  if (!$.isArray(url)) url = [url];
  $.when.apply(null, $.map(url, getScript)).done(function(){
    fn && fn();
  });
};
