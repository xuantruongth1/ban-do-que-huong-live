# Hướng dẫn Bản Đồ Quê Hương — Mai Trường LIVE

Mở `start-local.ps1` hoặc lối mở tool đang dùng. Điều khiển: http://127.0.0.1:3195/. Hướng dẫn có ngay trong menu **Hướng dẫn sử dụng** hoặc tại http://127.0.0.1:3195/huong-dan.html.

## Chuẩn bị một lần

1. Vào **Giao diện bản đồ**: chọn 63 tỉnh trước sáp nhập hoặc 34 tỉnh hiện nay, nền và số màu. Bản đồ đang chạy đổi bộ từ vòng tiếp theo.
2. Vào **MC & kịch bản**: chọn giọng nam/nữ, tốc độ và âm lượng, bật MC rồi lưu. Giọng hiện tại Nam Minh qua bộ Phật, tốc độ1.15. Giọng clone Tiệc Cưới vẫn được giữ để chọn lại. Các tùy chọn kỹ thuật, mẫu thoại và giọng dự phòng nằm trong **Công cụ nâng cao**.
3. Vào **Phim quê & giới thiệu**: chọn đúng quê, gán clip từ kho hoặc thêm MP4. Clip dọc mở lớn theo chiều cao màn LIVE, clip ngang dùng tỷ lệ ngang. Tỉnh chưa có clip vẫn có ảnh và lời giới thiệu.
4. Vào **Kho nhạc nền** để thêm tối đa20 bài, tối đa200MiB mỗi bài, rồi bật nhạc và lưu. Nhạc giảm khi MC nói và dừng khi chiếu clip.

## Bắt đầu LIVE

1. Bắt đầu phát TikTok LIVE bằng tài khoản của bạn.
2. Tại **Điều khiển**, nhập @tài khoản hoặc link LIVE và bấm **Kết nối**. Tool chỉ dùng kết nối LIVE thật; không có lựa chọn Giả lập. Đợi trạng thái xác nhận đã kết nối. Không bấm kết nối sang tài khoản khác khi vòng đang chạy nếu không muốn tạm dừng nguồn cũ.
3. Sao chép link màn LIVE ở cột xem trước. Thêm nguồn trình duyệt **1080 × 1920** trong OBS / LIVE Studio. Nếu dùng nguồn cửa sổ, bấm **Mở màn LIVE** rồi chọn đúng cửa sổ đó.
4. Nút **Kết nối LIVE** tự bật MC và nhạc dưới preview. Có thể bấm **Bật MC & nhạc** riêng nếu trình duyệt yêu cầu. Kiểm tra phần mềm phát sóng thu được tiếng của trình duyệt/tool. Chỉ giữ một đường thu để tránh vọng. Màn LIVE mở riêng có thể nhận quyền tiếng nếu bạn bấm nút âm thanh trên màn đó; chỉ một màn được phát tiếng cùng lúc.
5. Đặt **Thời lượng mỗi vòng**, bấm **Lưu thời lượng**. Mặc định5 phút. Thời lượng mới áp dụng từ vòng tiếp theo nếu đang đua.
6. Không cần bấm Chạy riêng. Bấm **Kết nối LIVE** sẽ tự bật quyền âm thanh từ thao tác bấm; khi TikTok nối thành công, tool bật MC, nhạc đã thêm và bắt đầu vòng đua. Các vòng tiếp theo tự nối tiếp. Giữ tool/server và màn giữ quyền âm thanh mở trong suốt phiên.

## Chu trình tự động

Đếm ngược → nhận bình luận/quà → hết giờ khóa điểm và tắt đèn vòng cũ → vinh danh, giới thiệu quê thắng → chiếu clip đã gán → nghỉ ngắn → vòng mới đặt lại điểm và đèn.

- Bình luận tên tỉnh có hoặc không dấu; không dùng biển số. Mỗi bình luận hợp lệ +1 điểm, thắp sáng và zoom quê.
- UID giữ đúng người chơi; bình luận tỉnh mới đổi quê được chọn cho tương tác tiếp theo.
- Người tặng quà cần chọn quê trước. Quà chưa có quê không tự gán điểm cho một tỉnh bất kỳ.
- Đồng điểm cao nhất: lần lượt về các quê đồng hạng. Không có điểm: không bịa quê thắng, tự chuẩn bị vòng mới.
- Sau30 giây không có thắp đèn, xuất hiện đèn tự động có tên mô phỏng. Có nhãn tự động; không cộng điểm, lượt bình luận hoặc số người thật. Tắt/chỉnh tại Giao diện.
- **Tạm dừng** giữ tiến trình; **Tiếp tục** chạy lại. Có thể dừng cả lúc vinh danh/chiếu clip.

## Điểm và quà

| Giá một món | Điểm mỗi món |
| --- | ---: |
| 1–4 xu | 3 |
| 5–29 xu | 30 |
| 30–99 xu | 100 |
| 100–499 xu | 500 |
| 500–1499 xu | 1500 |
| Từ1500 xu | 3000 và sáng toàn bản đồ |

Giá một món nhân số món, combo chốt không cộng lặp. Hoa hồng giới thiệu quê; bắn tim tạo tim bay; TikTok bay camera; bánh vòng pháo hoa; nước hoa mở đại chiến hai quê dẫn đầu; quà rồng làm sáng toàn bản đồ và cho rồng bay. Chủ tool gán lại trong **Quà & hiệu ứng**; chỗ chọn có icon, tên, xu và STT.

## Demo, nâng cao và hỗ trợ

- **Demo3 phút trên màn LIVE** chạy trên chính màn đang mở; không mở phòng/tab thử mới. Hết/dừng demo trả lại phiên trước. Thử trước khi chạy vòng thật.
- **Công cụ nâng cao** mở luật điểm, mẫu MC, nhật ký, bot thử và Phòng thử CSS. Không cần mở các mục này khi vận hành thông thường. Bot là dữ liệu mô phỏng tại máy.
- **Hỗ trợ & ủng hộ** có QR nhóm Zalo, liên hệ Mai Trường và QR ủng hộ tự nguyện. Dùng đúng ảnh từ bộ Tiệc Cưới/CƯỚI VIP của chủ tool.
- Không nghe tiếng: bấm lại Bật MC & nhạc, kiểm tra công tắc/âm lượng MC và thiết bị thu. Giọng trực tuyến cần Internet. Google dự phòng có thể khác giọng chính; hiện tắt mặc định để giữ đúng Nam Minh đã chọn.
- Không kết nối: kiểm tra tài khoản đang phát LIVE và mạng; xem Nhật ký trong Nâng cao. Kết nối lại đúng tài khoản.
- Giao diện cũ sau cập nhật: **Ctrl+F5** tại điều khiển và màn LIVE.

Màn phóng đất liền có bản toàn cảnh nhỏ; nút **Xem toàn cảnh lãnh thổ** cho xem trọn lớp tọa độ đất liền, Hoàng Sa và Trường Sa cùng hệ chiếu. Các nhãn tỉnh bám đúng vùng; tỉnh hẹp có thể dùng đường dẫn chú thích.
