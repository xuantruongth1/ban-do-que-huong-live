# Bản Đồ Quê Hương Việt Nam — Mai Trường LIVE

Game thắp sáng quê hương cho TikTok LIVE. Bản **Windows x64 2.7.1**, có sẵn **65 clip**, ảnh giới thiệu quê, hai bộ bản đồ và giọng MC. Người xem bình luận tên tỉnh để tham gia, không bắt buộc tặng quà.

## Tải và chạy

1. Clone repo này hoặc tải ZIP từ **Code → Download ZIP**, giải nén vào một thư mục riêng.
2. Mở **START.bat**. Lần đầu chương trình tải runtime/model và bộ clip từ Release của chính repo, kiểm tra SHA-256 rồi giải nén. Cần Internet và nên trống ít nhất8GB ổ đĩa. Các lần sau dùng tài nguyên đã tải tại máy.
3. Trình duyệt mở `http://127.0.0.1:3195/`. Không cần cài Node/Python riêng. Giữ tool đang chạy trong suốt phiên.
4. Khi tài khoản đã TikTok LIVE: nhập @tài khoản, bấm **Kết nối**, bật **MC & nhạc**, rồi bấm **Chạy tự động** một lần.

Thêm nguồn trình duyệt **1080 × 1920** trong OBS / TikTok LIVE Studio bằng link màn LIVE hiển thị trong điều khiển. Thu một đường âm thanh để tránh vọng. Chạy **Demo3 phút** trước khi lên sóng. [Hướng dẫn đầy đủ](HDSD.md) có cả trong menu của tool.

## Chức năng

- Bản đồ63 tỉnh trước sáp nhập hoặc34 tỉnh hiện nay; nhãn tỉnh, Hoàng Sa, Trường Sa, phóng quê và bản toàn cảnh. Màu đậm; chỉnh số màu4–12, các tỉnh kề nhau phân màu khác nhau.
- Bình luận tên tỉnh có/không dấu: thắp đèn, zoom và +1 điểm. Vòng mặc định5 phút, chỉnh được; tự chốt kết quả, tắt đèn, giới thiệu/chiếu quê thắng, đặt lại điểm và chạy vòng kế tiếp. Đồng hạng lần lượt về từng quê.
- Sáu hiệu ứng gán quà: hoa hồng giới thiệu quê, tim bay, camera, pháo hoa, đại chiến hai quê và rồng vàng sáng cả bản đồ. Icon quà có STT, tên, xu; vương miện vua tỉnh, TOP điểm và TOP xu.
- MC theo diễn biến: chào, mở đèn, nhận quà, dẫn đầu/bám đuổi, tỉnh còn tối, chuyện quê, đếm ngược và vinh danh. Giữ Nam Minh tốc độ1.15 mặc định; có tùy chọn giọng clone Tiệc Cưới và model/reference đi kèm.
- 65 clip đã gán cho62 tỉnh cũ và34 tỉnh hiện nay; thiếu clip riêng Yên Bái. Giữ các clip trùng tỉnh để chọn lại. Clip dọc mở lớn, clip ngang giữ đúng tỷ lệ. Có ảnh/giới thiệu khi chưa có clip.
- Tám nền, kho nhạc20 bài × tối đa200MiB/bài, giảm nhạc khi MC nói, ngừng nhạc khi chiếu clip.
- Demo3 phút ngay màn LIVE; HDSD, QR nhóm Zalo và QR ủng hộ. Công cụ kỹ thuật nằm trong Nâng cao.

Sau30s không có thắp đèn có thể tạo đèn tự động có nhãn mô phỏng; không cộng điểm hoặc số người thật. Có thể tắt trong Giao diện.

## Luật điểm mặc định

| Xu/món | Điểm/món |
| --- | ---: |
| 1–4 | 3 |
| 5–29 | 30 |
| 30–99 | 100 |
| 100–499 | 500 |
| 500–1499 | 1500 |
| Từ1500 | 3000 và sáng cả bản đồ |

Giá từng món nhân số món, combo chốt không cộng lặp. Người tặng cần bình luận chọn quê trước. Có thể chỉnh trong Nâng cao.

## Lưu ý vận hành

Giọng trực tuyến và kết nối TikTok cần mạng; TikTok/dịch vụ kết nối có thể giới hạn lượt hoặc yêu cầu cấu hình riêng. Tool có thử kết nối lại; không cam kết mọi tài khoản/khu vực đều kết nối được. Giọng clone tại máy cần thời gian nạp model lần đầu.

Mỗi máy tự lưu tài khoản, lượt đua, cài đặt, clip và nhạc thêm trong `data/`. Repo không kèm key, tài khoản đã lưu hay lịch sử LIVE của chủ tool. Không commit thư mục đó. Google dự phòng tắt mặc định để giữ đúng giọng nam; bật được trong Nâng cao.

Đây là bản chạy đã bảo vệ theo quy tắc phát hành của chủ tool: backend bytecode, JavaScript trình duyệt minify/làm rối. Có thể clone và sử dụng; không phải cam kết công khai toàn bộ mã nguồn hay bảo vệ tuyệt đối khỏi dịch ngược. Chỉ chạy với runtime Windows x64 đi kèm. SHA-256 kiểm tra tệp/download, không thay chữ ký nhà phát hành.

Nguồn ảnh/giấy phép có tại `/credits.html` trong tool; dữ liệu/phép chiếu tại `public/map-metadata.json`. Sản phẩm không có biên bản chứng nhận bản đồ. Thành phần bên thứ ba giữ giấy phép riêng: [THIRD-PARTY.txt](THIRD-PARTY.txt).

## Hỗ trợ và cà phê ☕

Nhóm Zalo: [Tool game TikTok](https://zalo.me/g/rvny4herfbvyzbwxdiup). Liên hệ [Mai Trường](https://zalo.me/0359090502).

Anh em dùng thấy ổn, có thể ủng hộ một cốc cà phê trong mục **Hỗ trợ & ủng hộ** để góp tiền token và duy trì việc phát triển tool. Hoàn toàn tự nguyện, không phải điều kiện để chơi.
