$(document).ready(function(){
  $(".toggle").click(function(){
    var id = $(this).attr("tid");
    var nim = $(this).attr("nim");
    
    $.getJSON("../toggle/?nim="+nim+"&tid="+id,function(data){
      $(".selesai[tid=" + id + "]").html(data.state);
    });
  });
});