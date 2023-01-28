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
          modal = document.querySelector('.modal'),
          modalCloseBtn = document.querySelector('[data-close]');

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

    modalCloseBtn.addEventListener('click', closeModal);


    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
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



    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'Загрузка',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так ...'
    };

    forms.forEach(item => {
        postData(item);
    });

    function postData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            // request.setRequestHeader('Content-type', 'multipart/form-data');
            request.setRequestHeader('Content-type', 'application/json');
            const formData = new FormData(form);
            

            const object = {};
            formData.forEach(function (value, key) {
                object[key] = value;
            });

            const json = JSON.stringify(object);

            // request.send(formData);
            request.send(json);
            
            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    statusMessage.textContent = message.success;
                    form.reset(); //алтернатива: перебрать валью инпутов и очистить
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 2000);
                } else {
                    statusMessage.textContent = message.failure;
                }
            });
        });
    }


});

