## processOrders
- Lấy danh sách order của user bị lỗi thì trả về false
- Lấy danh sách order của user không có order nào thì trả về mảng rỗng
- Lấy danh sách orders của user không rỗng thì loop xử lý lần lượt từng order dựa vào order type

### Áp dụng riêng cho mỗi loại order type

#### Order type A
- Lưu file csv chứa thông tin order:
  - Hàng đầu tiên chứa các label ID, Type, Amount, Flag, Status, Priority; hàng thứ 2 là các giá trị của order tương ứng với các label ở hàng 1.
  - Nếu order flag có giá trị là falsy thì cột flag sẽ là 'false', ngược lại sẽ là 'true'
  - Nếu order amount lớn hơn 150 thì thêm 1 dòng cuối cùng vào csv với giá trị ở cột thứ 5 là 'Note' và cột thứ 6 là 'High value order', các cột khác cùng hàng thì rỗng
- Nếu lưu csv thành công thì cập nhật status của order thành 'exported', ngược lại không thành công thì cập nhật status order thành 'export_failed'

#### Order type B
- Cập nhật order status thành api_error nếu client api response trả về không thành công (khác success)
- Cập nhật order status thành api_failure nếu client api trả về APIException trong quá trình xử lý
- Giữ nguyên order status trước đó (new) nếu client api trả về unknown exception trong quá trình xử lý
- Cập nhật order status thành processed nếu client api response amount lớn hơn hoặc bằng 50 và order amount bé hơn 100
- Cập nhật order status thành pending nếu client api response amount lbé hơn 50 hoặc order flag không falsy
- Cập nhật order status thành error nếu client api response amount lbé hơn 50 hoặc order flag không falsy

#### Order type C
- Cập nhật order status thành completed nếu order flag is true
- Cập nhật order status thành in_progress nếu order flag is falsy

#### Order type không hợp lệ (không thuộc A, B, C)
- Cập nhật order status thành unknown_type

### Áp dụng chung cho tất cả các loại order type
- Nếu order amount lớn hơn 200 thì cập nhật database order priority thành 'high'
- Nếu order amount bé hơn hoặc bằng 200 thì cập nhật database order priority thành 'low'
- Nếu update database order bị lỗi trả về database exception thì trả về order kèm status là db_error
- Nếu update database order bị lỗi trả về exception không xác định thì trả về order kèm status được xử lý từ các bước trước
- Nếu update database order thành công thì database sẽ chứa thông tin mới của order bao gồm status và priority mới được xử lý, đồng thời trả về thông tin order mới
