## Cấu trúc (đã refactor)
- Chia theo module, phần liên quan order sẽ được move vào ./src/modules/orders
- Phần xử lý order đã được refactor và tách theo type ở ./src/modules/orders/processors
- Các file khác đã được move vào các folder đúng mục đích tương ứng

## Yêu cầu
- NodeJS >= 22

## Test cases
- Xem tại [đây](./tests/test-cases.md)

## Unit test
- Coverage 100%, report tại [đây](https://phupt-nals.github.io/phupt-unit-test/)
- [Coverage screenshot](./tests/coverage.png)
