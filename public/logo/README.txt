ЛОГОТИП RELOCOST — пакет файлов
==================================
Знак: «точка на карте» (пин). Цвета — точные токены из globals.css сайта.

ПАЛИТРА
- pine-tree  #1A2105  — тёмный (пин / фон, самый тёмный)
- copper     #E89B6E  — акцент (точка в пине; ссылки/кнопки на сайте)
- cream      #F6F1E8  — светлый (пин и надпись на тёмном фоне; заголовки)
Шрифт надписи: Manrope (основной) — текст в SVG переведён в кривые.
Доп. вариант надписи: Cormorant (serif, как заголовки сайта).

ВЕКТОР (SVG)
- relocost-icon.svg ...................... основная иконка, для светлого фона
- relocost-icon-on-dark.svg .............. иконка для тёмного фона (кремовый пин) — основной кейс сайта
- relocost-icon-mono-dark.svg ............ одноцветная тёмная (печать/штамп)
- relocost-icon-mono-light.svg ........... одноцветная кремовая
- relocost-app-icon.svg .................. иконка приложения (тёмно-зелёная плитка) — PWA / сторы
- relocost-favicon.svg ................... favicon, сам подстраивается под тёмную тему браузера
- relocost-logo-horizontal.svg ........... горизонтальный локап, Manrope
- relocost-logo-horizontal-on-dark.svg ... горизонтальный локап на тёмном фоне
- relocost-logo-horizontal-serif.svg ..... горизонтальный локап, Cormorant (serif)
- relocost-logo-stacked.svg .............. вертикальный локап

PNG
- icon-16/32/64/192/256/512/1024.png
- icon-on-dark-512/1024.png
- app-icon-180/192/512/1024.png  (180 = apple-touch-icon, 192 = android/PWA)
- favicon-16/32/48.png
- logo-horizontal-800/1600.png, -on-dark-1600.png, -serif-1600.png, logo-stacked-1000.png

КАК ПОДКЛЮЧИТЬ
- Favicon:  <link rel="icon" href="/relocost-favicon.svg">  + фолбэк favicon-32.png
- iOS:      <link rel="apple-touch-icon" href="/app-icon-180.png">
- PWA:      app-icon-192.png и app-icon-512.png
- Шапка (тёмный фон сайта): relocost-logo-horizontal-on-dark.svg или иконка relocost-icon-on-dark.svg
