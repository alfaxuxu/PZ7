// Инициализация карты
ymaps.ready(init);

function init() {
    // Создаем карту
    var myMap = new ymaps.Map("map", {
        center: [55.772399, 37.61], // Москва
        zoom: 11
    });

    // Добавляем метки магазинов
    var shops = [
        {
            coords: [55.762373, 37.607898],
            title: "Магазин на Тверской",
            address: "ул. Тверская, д. 15",
            phone: "+7 (495) 123-45-67"
        },
        {
            coords: [55.749096, 37.589599],
            title: "ПВЗ на Арбате",
            address: "ул. Арбат, д. 32",
            phone: "+7 (495) 765-43-21"
        },
        {
            coords: [55.790231, 37.531289],
            title: "Магазин в ТЦ 'Авиапарк'",
            address: "Ходынский бульвар, д. 4",
            phone: "+7 (495) 987-65-43"
        },
        {
            coords: [55.804612, 37.635512],
            title: "ПВЗ на Проспекте Мира'",
            address: "Проспект Мира, д. 89",
            phone: "+7  (495) 456-78-90"
        }
    ];

    // Добавляем каждую метку на карту
    shops.forEach(function (shop, index) {
        var placemark = new ymaps.Placemark(shop.coords, {
            balloonContentHeader: shop.title,
            balloonContentBody: `
                    <p><strong>Адрес:</strong> ${shop.address}</p>
                    <p><strong>Телефон:</strong> ${shop.phone}</p>
                `,
            hintContent: shop.title
        }, {
            preset: 'islands#blueShoppingIcon'
        });

        myMap.geoObjects.add(placemark);
    });
}