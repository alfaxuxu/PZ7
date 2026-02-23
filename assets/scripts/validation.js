document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');

    // Форматирование ввода телефона
    // Автоматически форматирует введенный номер в формат +7 XXX XXX XX XX
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            let value = this.value.replace(/\D/g, ''); // Удаляем все нецифровые символы

            // Убираем первую цифру если это 8 или 7 (для замены на +7)
            if (value.length && (value[0] === '8' || value[0] === '7')) {
                value = value.slice(1);
            }

            // Форматируем номер
            this.value = value.length ? '+7 ' + [
                value.slice(0, 3),
                value.slice(3, 6),
                value.slice(6, 8),
                value.slice(8, 10)
            ].filter(Boolean).join(' ') : '+7 ';
        });
    }
    
    if (form) {
        // Отключаем HTML5 валидацию для всей формы, кроме чекбокса
        form.setAttribute('novalidate', true);
        
        // Для чекбокса возвращаем HTML5 валидацию
        const privacyPolicy = document.getElementById('privacyPolicy');
        if (privacyPolicy) {
            privacyPolicy.setAttribute('required', true);
        }
        
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            clearErrors(); // Очищаем предыдущие ошибки
            
            // Получаем все поля формы
            const name = document.getElementById('name');
            const phone = document.getElementById('phone');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            const privacyPolicy = document.getElementById('privacyPolicy');
            
            let isValid = true;
            
            // Валидация полей
            
            // Кастомная валидация для имени
            if (!name.value.trim()) {
                showError(name, 'Пожалуйста, введите ваше имя');
                isValid = false;
            } else if (name.value.trim().length < 2) {
                showError(name, 'Имя должно содержать минимум 2 символа');
                isValid = false;
            }

            // Кастомная валидация для номера телефона
            if (!phone.value.trim() || phone.value.trim() === '+7 ') {
                showError(phone, 'Пожалуйста, введите номер телефона');
                isValid = false;
            } else {
                // Проверяем, что введено достаточно цифр (минимум 10 цифр после +7)
                const phoneDigits = phone.value.replace(/\D/g, '');
                if (phoneDigits.length < 11) { // +7 и 10 цифр = 11 цифр
                    showError(phone, 'Указан неверный номер телефона');
                    isValid = false;
                }
            }
            
            // Кастомная валидация для email
            if (!email.value.trim()) {
                showError(email, 'Пожалуйста, введите email');
                isValid = false;
            } else {
                const emailValue = email.value.trim();
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (!emailPattern.test(emailValue)) {
                    showError(email, 'Введите корректный email (формат: email@example.com)');
                    isValid = false;
                }
            }
            
            // Кастомная валидация для темы
            if (!subject.value || subject.value === 'Выберите тему...' || subject.disabled) {
                showError(subject, 'Пожалуйста, выберите тему обращения');
                isValid = false;
            }
            
            // Кастомная валидация для сообщения
            if (!message.value.trim()) {
                showError(message, 'Пожалуйста, введите сообщение');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                showError(message, 'Сообщение должно содержать минимум 10 символов');
                isValid = false;
            }
            
            // HTML5 валидация для чекбокса
            if (!privacyPolicy.checkValidity()) {
                // Показываем стандартное сообщение HTML5
                privacyPolicy.reportValidity();
                isValid = false;
            }
            
            // Успешная отправка
            if (isValid) {
                // Собираем данные формы
                const formData = {
                    name: name.value.trim(),
                    phone: phone.value.trim(),
                    email: email.value.trim(),
                    subject: subject.options[subject.selectedIndex]?.text || subject.value,
                    message: message.value.trim(),
                    consent: privacyPolicy.checked
                };
                
                // Диспатчим событие для логгера
                document.dispatchEvent(new CustomEvent('formValid', { 
                    detail: formData 
                }));
                
                alert('Форма успешно отправлена!\nВ ближайшее время мы свяжемся с вами.\n#Данные в консоли.');
                form.reset();
                clearErrors();
            }
        });
        
        // Сброс формы
        form.addEventListener('reset', function() {
            clearErrors();
            const subject = document.getElementById('subject');
            subject.classList.remove('is-invalid');
            
            setTimeout(() => {
                subject.value = '';
                const options = subject.querySelectorAll('option');
                options.forEach(option => {
                    if (option.disabled) {
                        option.selected = true;
                    }
                });
            }, 0);
        });
        
        // Очистка
        const inputs = form.querySelectorAll('input:not([type="checkbox"]), select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                removeError(this);
            });
        });
    }
    
    // Сообщение об ошибке для указанного элемента
    function showError(element, message) {
        element.classList.add('is-invalid');
        
        let feedback = element.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            element.parentNode.insertBefore(feedback, element.nextSibling);
        }
        
        feedback.textContent = message;
    }
    
    // Удаление сообщения об ошибке для указанного элемента
    function removeError(element) {
        element.classList.remove('is-invalid');
        
        const nextElement = element.nextElementSibling;
        if (nextElement && nextElement.classList.contains('invalid-feedback')) {
            nextElement.remove();
        }
        
        const parent = element.parentNode;
        const feedbackElements = parent.querySelectorAll('.invalid-feedback');
        feedbackElements.forEach(el => el.remove());
    }
    
     // Очищает все сообщения об ошибках в форме
    function clearErrors() {
        document.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        
        document.querySelectorAll('.invalid-feedback').forEach(el => {
            el.remove();
        });
    }
});