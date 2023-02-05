"use strict";

console.log('запрос данных');

const req = new Promise(function(resolve, rejected) {
    setTimeout(() => {
        console.log('Поготовка данных');
    
        const product ={
            name: 'TV',
            price: 2000
        };
        
        setTimeout(() => {
            product.status = 'order';
            console.log(product);
        }, 2000);
     }, 2000);
});


 