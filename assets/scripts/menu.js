// Получаем элементы
const menuToggle = document.getElementById('menuToggle');
const dropdownMenu = document.querySelector('.dropdown-menu');

// Получаем экземпляр dropdown Bootstrap
const dropdown = bootstrap.Dropdown.getOrCreateInstance(menuToggle);

// Отключаем закрытие по ESC в Bootstrap
dropdownMenu.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        event.stopPropagation();
    }
});

// Функция для переключения состояния гамбургера
function updateHamburgerState() {
    // Проверяем, открыт ли dropdown (Bootstrap добавляет класс show к меню)
    const isOpen = dropdownMenu.classList.contains('show');
    
    if (isOpen) {
        menuToggle.classList.add('active');
    } else {
        menuToggle.classList.remove('active');
    }
}

// Слушаем события Bootstrap dropdown
menuToggle.addEventListener('shown.bs.dropdown', function() {
    menuToggle.classList.add('active');
});

menuToggle.addEventListener('hidden.bs.dropdown', function() {
    menuToggle.classList.remove('active');
});

// Закрытие при клике вне меню
document.addEventListener('click', function(event) {
    const isClickInsideMenu = dropdownMenu.contains(event.target);
    const isClickOnButton = menuToggle.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnButton && menuToggle.classList.contains('active')) {
        dropdown.hide();
        menuToggle.classList.remove('active');
    }
});

// Наш обработчик для ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && menuToggle.classList.contains('active')) {
        // Закрываем dropdown через Bootstrap
        dropdown.hide();
        // Немедленно убираем активный класс с гамбургера
        menuToggle.classList.remove('active');
        // Предотвращаем дальнейшую обработку
        event.stopPropagation();
    }
});

// Кнопка "Наверх"
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});