$(document).ready(()=>{
    setCreateListener()
   setDeleteListener()

    function setCreateListener() {
        $('#createCinema').click(()=>{
            $.post('/cinemas', {
                name: $('#name').val(),
                city: $('#city').val()
            }, (data, status)=>{
                if(status!='success') alert('Cannot create cinema')
                else{
                    $('#cinemas').append(data)
                }
            })
        })
    }

    function setDeleteListener() {
        $('#delete').click(()=>{
            var xpto = $('#namecinema').val()
            $.post(`/cinemas/${$('#namecinema').val()}/delete`, null, (data, status)=>{
                if(status!='success') alert('Cannot delete cinema')
                else{
                    $('tr').remove(`#${data}`)
                }
            })
        })
    }
})
