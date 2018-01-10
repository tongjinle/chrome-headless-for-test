module.exports = function(second=200){
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve(second);
        },second);
    });
};