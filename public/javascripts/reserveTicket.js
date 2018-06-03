const arr=new Array();
$( document ).ready(function() {
    $('button').each(function() {
        $(this).click(function(i) {
            arr.push($(this).val());
        });
    });
    console.log(arr.length)
})
