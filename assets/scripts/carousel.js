// Массив данных товаров - центральное хранилище информации о всех товарах
// Каждый товар содержит: изображение, название, цену, состояние "избранное" и "в корзине"
const cardsData = [
    { image: './assets/img/photo1.jpg', title: 'Смартфон Apple iPhone 15 Pro', price: '124 990 ₽', isFavorite: false, inCart: false },
    { image: './assets/img/photo2.jpg', title: 'Наушники Sony WH-1000XM5', price: '34 990 ₽', isFavorite: false, inCart: false },
    { image: './assets/img/photo3.jpg', title: 'ПК HYPERPC WARRIOR GeForce RTX 4060 Ti Dual 8G', price: '219 700 ₽', isFavorite: false, inCart: false },
    { image: './assets/img/photo4.jpg', title: 'Смартфон Samsung Galaxy S24', price: '89 990 ₽', isFavorite: false, inCart: false },
    { image: './assets/img/photo5.jpg', title: 'Ноутбук Lenovo Yoga Slim 7', price: '79 990 ₽', isFavorite: false, inCart: false},
    { image: './assets/img/photo6.jpg', title: 'Планшет Apple iPad Air (5 gen)', price: '74 990 ₽', isFavorite: false, inCart: false},
    { image: './assets/img/photo7.png', title: 'Веб-камера Logitech Brio 4K', price: '16 990 ₽', isFavorite: false, inCart: false },
    { image: './assets/img/photo8.jpg', title: 'Игровой ПК HYPERPC X600', price: '189 990 ₽', isFavorite: false, inCart: false }
];

// Объект для отслеживания текущей позиции (смещения) каждой карусели
// Хранит состояние отдельно для "Новинок" и "Популярного"
const carouselState = {
    new: 0,        // текущая позиция карусели "Новинки"
    popular: 0     // текущая позиция карусели "Популярное"
};

// Функция определения количества видимых карточек в зависимости от ширины окна
// Адаптивная логика для разных размеров экрана
function visibleCards() {
    if (window.innerWidth < 576) return 1;   // Мобильные устройства
    if (window.innerWidth < 992) return 2;   // Планшеты
    if (window.innerWidth < 1200) return 3;  // Небольшие десктопы
    return 4;                                // Большие экраны
}

// Основная функция инициализации карусели
// trackId - ID DOM-элемента дорожки карусели
// carouselType - тип карусели ('new' или 'popular')
function initCarousel(trackId, carouselType = 'new') {
    const track = document.getElementById(trackId);
    if (!track) return; // Защита от отсутствия элемента

    // Выбираем данные для отображения:
    // Для "Популярного" - перевернутый массив (чтобы показать разные товары)
    // Для "Новинок" - оригинальный массив
    const dataToUse = carouselType === 'popular' 
        ? [...cardsData].reverse() // Создаем копию и переворачиваем
        : cardsData;
    
    // Вспомогательная функция для получения оригинального индекса товара
    // Необходима для корректной работы перевернутого массива "Популярного"
    const getOriginalIndex = (displayIndex) => {
        if (carouselType === 'popular') {
            return cardsData.length - 1 - displayIndex; // Обратный индекс для перевернутого массива
        }
        return displayIndex; // Для "Новинок" индекс совпадает
    };

    // Генерация HTML-разметки для всех карточек товаров
    track.innerHTML = dataToUse.map((card, displayIndex) => {
        const originalIndex = getOriginalIndex(displayIndex);
        return `
            <div class="card product-card" data-index="${originalIndex}">
                <img src="${card.image}" class="card-img-top" alt="${card.title}">
                <div class="card-body">
                    <h5 class="card-title product-title">${card.title}</h5>
                    <div class="card-price product-price mb-3">${card.price}</div>
                    <div class="d-flex gap-2 mt-auto">
                        <!-- Кнопка "Избранное" с динамическим классом active -->
                        <button class="btn-favorite ${cardsData[originalIndex].isFavorite ? 'active' : ''}" 
                                onclick="toggleFavorite(${originalIndex})">
                            <i class="bi bi-heart"></i>
                        </button>
                        <!-- Кнопка "Корзина" с динамическим текстом и стилем -->
                        <button class="cart-btn btn ${cardsData[originalIndex].inCart ? 'btn-success' : 'btn-primary'} flex-grow-1" 
                                onclick="toggleCart(${originalIndex})">
                            ${cardsData[originalIndex].inCart 
                                ? '<i class="bi bi-check2 me-2"></i>В корзине' 
                                : '<i class="bi bi-cart-plus me-2"></i>В корзину'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join(''); // Преобразуем массив в строку

    // Устанавливаем начальную позицию карусели
    updateCarousel(trackId, carouselType);
}

// Функция обновления визуальной позиции карусели
// Применяет CSS трансформацию для сдвига дорожки
function updateCarousel(trackId, carouselType = 'new') {
    const track = document.getElementById(trackId);
    if (!track) return;

    const card = track.querySelector('.product-card');
    if (!card) return;

    // Рассчитываем ширину одной карточки с учетом отступа (gap)
    const cardWidth = card.offsetWidth + 20; // 20px - предположительный gap между карточками
    const position = carouselState[carouselType]; // Получаем текущую позицию из состояния
    
    // Применяем трансформацию для сдвига всей дорожки
    track.style.transform = `translateX(-${position * cardWidth}px)`;
}

// Функция перемещения карусели на один шаг
// direction: -1 для предыдущего слайда, 1 для следующего
// carouselType: тип карусели для обновления состояния
function moveSlide(direction, carouselType = 'new') {
    // Максимальная позиция рассчитывается исходя из количества видимых карточек
    const maxPosition = Math.max(0, cardsData.length - visibleCards());
    const newPosition = carouselState[carouselType] + direction;

    // Циклическая навигация: если вышли за границы, переходим на противоположный конец
    if (newPosition < 0) {
        carouselState[carouselType] = maxPosition; // Переход к последнему слайду
    } else if (newPosition > maxPosition) {
        carouselState[carouselType] = 0; // Переход к первому слайду
    } else {
        carouselState[carouselType] = newPosition; // Обычное перемещение
    }

    // Обновляем визуальное положение карусели
    updateCarousel(getTrackId(carouselType), carouselType);
}

// Вспомогательная функция для получения ID трека по типу карусели
function getTrackId(carouselType) {
    return carouselType === 'popular' ? 'popularTrack' : 'cardsTrack';
}

// Функция переключения состояния "Избранное" для товара
function toggleFavorite(index) {
    // Изменяем состояние в основном массиве данных
    cardsData[index].isFavorite = !cardsData[index].isFavorite;
    
    // Обновляем все кнопки "Избранное" для данного товара во всех каруселях
    // Используем data-index для поиска всех экземпляров товара
    document.querySelectorAll(`[data-index="${index}"] .btn-favorite`).forEach(btn => {
        btn.classList.toggle('active'); // Переключаем класс active
    });
}

// Функция переключения состояния "В корзине" для товара
function toggleCart(index) {
    // Сохраняем предыдущее состояние для проверки
    const wasInCart = cardsData[index].inCart;
    
    // Инвертируем состояние (добавить/удалить из корзины)
    cardsData[index].inCart = !wasInCart;
    
    // Обновляем все кнопки "Корзина" для данного товара
    document.querySelectorAll(`[data-index="${index}"] .cart-btn`).forEach(btn => {
        if (cardsData[index].inCart) {
            // Если товар добавлен в корзину - меняем на зеленую кнопку с галочкой
            btn.innerHTML = '<i class="bi bi-check2 me-2"></i>В корзине';
            btn.className = 'cart-btn btn btn-success flex-grow-1';
        } else {
            // Если товар удален из корзины - возвращаем синюю кнопку с иконкой корзины
            btn.innerHTML = '<i class="bi bi-cart-plus me-2"></i>В корзину';
            btn.className = 'cart-btn btn btn-primary flex-grow-1';
        }
    });
}

// Инициализация при полной загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем обе карусели
    initCarousel('cardsTrack', 'new');       // Карусель "Новинки"
    initCarousel('popularTrack', 'popular'); // Карусель "Популярное"
    
    // Обработчик изменения размера окна - пересчитываем позиции каруселей
    window.addEventListener('resize', () => {
        updateCarousel('cardsTrack', 'new');
        updateCarousel('popularTrack', 'popular');
    });
});