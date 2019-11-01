# Laravel WebSockets Demo 🛰

This is a demo application built with the [Laravel WebSockets](https://github.com/beyondcode/laravel-websockets) package.

Be sure to check out the [official documentation](https://docs.beyondco.de/laravel-websockets/).

## Usage

1. Clone this repository
2. `composer install`
3. `cp .env.example .env`
4. `php artisan migrate`
5. `php artisan key:generate`
6. `php artisan websockets:serve`

## Credits

- [Marcel Pociot](https://github.com/mpociot)
- [Freek Van der Herten](https://github.com/freekmurze)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.


//Run by below cmd
php artisan serve --host=192.200.12.96 --port=8000
UPDATE PUSHER_APP_BROADCASTING_HOST in .env file
UPDATE IN public js group.js wsHost: '127.0.0.1',