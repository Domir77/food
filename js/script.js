"use strict";

window.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tabheader__item'),
            tabsContent = document.querySelectorAll('.tabcontent'),
            tabsParent = document.querySelector('.tabheader__items');

    //ф-я скрывает табы
    function hideTabContent() {
        tabsContent.forEach( item => {
            //item.style.display = 'none';
            //сделаем через классы, добавили их в css
            item.classList.add('hide');
            item.classList.remove('show', 'fade'); 
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    //ф-я показывает табы
    function showTabContent(i=0) {
        //tabsContent[i].style.display = 'block';
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide'); 
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    //делегирование событий
    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });



    //Modal
    
    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        // modal.classList.toggle('show');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }   

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });


    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        // modal.classList.toggle('show');
        document.body.style.overflow = ''; //браузер сам восстановит по дефолту
    }



    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 5000);

    function showModalByScroll () {
        if (window.pageXOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            //как только долистали до конца, мод. окно высветилось 1 раз,  обраб. соб. удален
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);



    


    const getResourse = async (url) => {
        const res = await fetch(url);
 
        if (!res.ok) {
              throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        return await res.json();  //это промис
    };

    // getResourse('http://localhost:3000/menu')
    // .then(data => {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         new Menucard(amg, altimg, title, descr, price, '.menu .container').render();
    //     });
    // });

    getResourse('http://localhost:3000/menu')
    .then(data => createCard(data));

    function createCard(data) {
        data.forEach(({img, altimg, title, descr, price}) => {
            const element = document.createElement('div');

            element.classList.add('form');

            element.innerHTML = `
                <img src=${img} alt=${altimg}>
                <h3 class="menu__item-subtitle">${title}</h3>
                <div class="menu__item-descr">${descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${price}</span> грн/день</div>
                </div>            
            `;

            document.querySelector('.menu .container').append(element);
        });

    }









    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        // loading: 'Загрузка',
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так ...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

     const postData = async (url, data) => {
        const res = await fetch(url, {    
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();  //это промис
     };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            //form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);

            // const request = new XMLHttpRequest();
            // request.open('POST', 'server.php');
            // request.setRequestHeader('Content-type', 'multipart/form-data');
            // request.setRequestHeader('Content-type', 'application/json');
            const formData = new FormData(form);
            
            
            const json = JSON.stringify(Object.fromEntries(formData.entries()));
            

            // const object = {};
            // formData.forEach(function (value, key) {
            //     object[key] = value;
            // });
            
            // request.send(formData);
            // request.send(json);

            postData('http://localhost:3000/requests', json) //промис
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset(); //алтернатива: перебрать валью инпутов и очистить
            });
            
            // request.addEventListener('load', () => {
            //     if (request.status === 200) {
            //         console.log(request.response);
            //         showThanksModal(message.success);
            //         form.reset(); //алтернатива: перебрать валью инпутов и очистить
            //         statusMessage.remove();
            //     } else {
            //         showThanksModal(message.failure);
            //     }
            // });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        //скрыли предыдущий контент и открыли новый
        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);

        //чтобы все вернулось на свои места после закрытия мод. окна
        setTimeout(() => {
            thanksModal.remove();
            //показ предыдущего контента
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            //закрыть модальное
            closeModal();
        }, 4000);
    }


 


});




