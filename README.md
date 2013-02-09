#utility

##TODO
при добавлении квартиры спрашивать сколько снимать в месяц

Прототип сервиса для оплаты коммунальных услуг

##Что хочется

* API
* Админка на бутстрепе
* Клиент на [ратчете](http://maker.github.com/ratchet/).
* Фавиконку для спригборда айфона
* Весь клиент на ajax
* Использовать node.js + mongodb

##API

Все описанные действия будут доступны по адресу /api/{действие}[/{id}]

###JSONы
GET /user/{id} - Возвращает строку таблицы, дополнительно возвращает квартиру и дом
GET /admin/{id}
GET /flat/{id} - Возвращает строку таблицы, дополнительно возвращает дом и жителей

TODO: реализовать авторизацию через POST

##Структура БД

###Жильцы
* login {String}
* password {String}
* name {String}
* phone {String}
* _flat {String} [admin | user]
*  type {String} [admin | user]

###Сообщения
* От кого {String}
* Кому {String}
* Время {String}
* Текст {String}

###Квартиры
* balance {Number}
* perMonthPayment {Number}
* number {Number}

###Лог
* type {String}
* time {String}
* user {String}
* flat {String}
* val {String}

##Функционал на мобильнике

* Залогинивание/разлогинивание
* Оплата услуг
* Пополнение счета
* Просмотр баланса, история платежей
* Личные сообщения
* Просмотр соседей (?)

##Установка (требования)
Предполагается, что система ставится на *nix систему
Для установки необходимы следующие консольные утилиты:
* [git](https://help.github.com/articles/set-up-git)
* [nodejs](http://nodejs.org/download/) причем в linux он вызывается командой nodejs, нужно сделать символичекую ссылку вида ```ln -s ~/путь/до/пакета/nodejs ~/такой/же/путь/но/node```, чтобы можно было вызывать node через команду ```node```.
* npm (node package manager) - обычно ставится вместе с nodejs, но зависит от дистрибуции
* [mongodb]
##Установка БД для Mac OS
```bash
brew install mongodb
mkdir ~/папка для бд
mongod --dbpath ~/путь до папки для бд/
#в другом терминале
mongo
#db.test.save( { a: 1 } )
#db.test.find()
```
##Установка
```bash
make #установка
make db-start # старт базы данных (возможно придется поменяьт путь в Makefile)
make db-template # заполнить базу данных первичными данными
make db-show # распечатать в консоль всю базу данных
make db-test # отвечает работает база данных или нет в консоль
make start #старт сервера
make db-erase # очистить всю базу данных
```
