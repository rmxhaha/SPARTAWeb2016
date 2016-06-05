$(document).ready(function(){
  $(".toggle").click(function(){
    var id = $(this).attr("dayid");
    var nim = $(this).attr("nim");
    $.getJSON("./toggle/?id="+id+"&nim="+nim,function(data){
      $(".hadir[nim=" + nim + "]").html(data.state);
    });
  });
});