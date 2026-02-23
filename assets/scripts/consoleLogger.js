// consoleLogger.js
document.addEventListener('DOMContentLoaded', function() {
    // Слушаем кастомное событие formValid, которое диспатчит validation.js
    document.addEventListener('formValid', function(event) {
        // Получаем данные формы из события
        const formData = event.detail;
        
        // Очищаем консоль для наглядности (опционально)
        console.clear();
        
        // Построчный вывод данных
        console.log('Имя:', formData.name);
        console.log('Телефон:', formData.phone);
        console.log('Email:', formData.email);
        console.log('Тема:', formData.subject);
        console.log('Сообщение:', formData.message);
        console.log('Согласие на обработку:', formData.consent ? 'Да' : 'Нет');

        // Вывод временной метки
        const timestamp = new Date().toLocaleString();
        console.log('Время отправки:', timestamp);
        
        console.log('--- Данные формы успешно отправлены ---');
    });
});