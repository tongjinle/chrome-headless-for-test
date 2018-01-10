$(()=>{
    $('#change').click(function(){
        $('.left>.title').css('color','green');
    });


    $('#asyncGet').click(function(){
        getData().then((data)=>{
            $('.right>.list').append(data.map(n=>(`<li>${n}</li>`)));
        });
    });
});


function getData(){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            let data = ['北京', '上海', '广州', '杭州', ];
            resolve(data);
        },1000*Math.random());
    });
}