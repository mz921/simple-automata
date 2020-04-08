interface IDDistributor{
    increment: () => number;
    reset: () => void
}


const idDistributor:IDDistributor =(function(){
    let id = 1
    return {
        increment: function(): number{
            return id++
        },
        reset: function(): void{
            id = 1;
        }
    }
})()

export {
    idDistributor
}