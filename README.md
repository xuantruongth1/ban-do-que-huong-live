# Bản Đồ Quê Hương Việt Nam — Mai Trường LIVE

Tool tương tác TikTok LIVE, bản **2.8.0**. Mã nguồn ứng dụng được công khai, không làm rối JavaScript, không bytecode backend, không yêu cầu key kích hoạt.

## Tải EXE — dành cho người dùng

**[Tải bộ cài Windows 64-bit](https://github.com/xuantruongth1/ban-do-que-huong-live/releases/download/v2.8.0/Ban-Do-Que-Huong-Mai-Truong-Setup-2.8.0-x64.exe)** · [Trang phát hành](https://github.com/xuantruongth1/ban-do-que-huong-live/releases/tag/v2.8.0)

Mở EXE, chọn thư mục cài, rồi mở biểu tượng **Bản Đồ Quê Hương – Mai Trường LIVE**. Có sẵn 65 clip, ảnh quê, runtime và model giọng; không cần cài Node/Python riêng. Dự kiến cần khoảng 5 GB dung lượng cài đặt và 8 GB trống trong lần cài đầu.

1. Bắt đầu TikTok LIVE trên tài khoản của bạn.
2. Nhập @tài khoản trong tool rồi bấm **Kết nối LIVE**. Thao tác này bật quyền âm thanh; kết nối thành công sẽ tự bật MC, nhạc đã thêm và chạy vòng đua.
3. Thêm link màn LIVE hiển thị trong tool vào OBS / LIVE Studio, nguồn trình duyệt **1080 × 1920**. Kiểm tra phần thu tiếng của nguồn/app để có MC, nhạc và tiếng clip. Chỉ thu một đường để tránh vọng.
4. Không cần bấm Chạy riêng. Hết vòng tự tắt đèn, giới thiệu/chiếu quê thắng rồi sang vòng mới. **Ngắt** tạm dừng; kết nối lại tiếp tục vòng đang dở.

Nhạc người dùng thêm ở Kho nhạc. Trình duyệt có thể yêu cầu bấm nút âm thanh riêng khi thay đổi nguồn hoặc quyền tự phát bị chặn. [HDSD](HDSD.md) có cả trong menu ứng dụng.

## Clone mã nguồn để chạy

```powershell
git clone https://github.com/xuantruongth1/ban-do-que-huong-live.git
cd ban-do-que-huong-live
```

**Cách dễ nhất trên Windows:** mở `START.bat`. Lần đầu tự tải runtime/model và 65 clip từ GitHub Release, kiểm SHA-256 rồi mở trình duyệt. Các lần sau dùng tài nguyên tại máy. Bộ tải dùng chung các gói tài nguyên 2.7.0 không đổi byte, còn mã nguồn và tính năng dùng bản 2.8.0 mới.

**Nếu đã có Node 22 trở lên:**

```powershell
npm ci
npm run setup
npm start
```

`npm run setup` chỉ chuẩn bị tài nguyên. `npm start` chạy web tại `http://127.0.0.1:3195/`. Có thể đổi cổng qua `HOMETOWN_PORT`.

## Chức năng

- Chọn 63 tỉnh trước sáp nhập hoặc 34 tỉnh hiện nay, có nhãn tỉnh và lớp Hoàng Sa/Trường Sa cùng hệ chiếu. Phóng đất liền kèm toàn cảnh lãnh thổ.
- Bình luận tên tỉnh có/không dấu để thắp đèn, zoom và +1 điểm. Không dùng biển số. Người tặng cần chọn quê trước.
- Vòng mặc định 5 phút, chỉnh được. Tự công bố kết quả, tắt đèn, giới thiệu ảnh/MC, chiếu clip rồi đặt lại điểm/đèn và mở vòng tiếp theo. Đồng hạng lần lượt về từng quê.
- Hoa hồng giới thiệu quê, tim bay, camera quanh quê, pháo hoa, đại chiến hai quê và rồng vàng sáng toàn bản đồ. Chọn lại quà bằng icon, tên, xu và STT. Có vua tỉnh/vương miện, TOP điểm và TOP quà.
- MC chào hỏi, mời bình luận, đọc người thắp đèn/quà, tiến độ, bám đuổi, đếm ngược, vinh danh và chuyện quê. Chuẩn bị trước câu kế, ưu tiên quà, giữ số liệu đúng diễn biến.
- Giọng mặc định Nam Minh 1.15; có lựa chọn giọng clone Tiệc Cưới với model/reference gốc đi kèm. Không tự đổi giọng dự phòng khi đã tắt.
- 65 clip đã gán cho 62 quê cũ và 34 tỉnh hiện nay, giữ clip trùng tỉnh để chọn lại. Chưa có clip riêng Yên Bái; khi thiếu clip vẫn có ảnh và lời giới thiệu. Clip dọc mở lớn, clip ngang đúng tỷ lệ.
-8 nền; chọn 4–12 màu đậm, tỉnh kề nhau khác màu; kho nhạc 20 bài × tối đa 200MiB/bài, tự hạ nhạc khi MC nói, dừng nhạc khi chiếu clip.
-Demo 3 phút trên chính màn LIVE, HDSD và QR hỗ trợ/ủng hộ. Công cụ thử kỹ thuật nằm trong Nâng cao.

Sau 30s không có thắp đèn có thể tạo đèn tự động với tên mô phỏng. Có nhãn tự động, không cộng điểm hoặc số người thật; tắt/chỉnh được trong Giao diện.

| Giá một món | Điểm mỗi món |
| --- | ---: |
| 1–4 xu | 3 |
| 5–29 xu | 30 |
| 30–99 xu | 100 |
| 100–499 xu | 500 |
| 500–1499 xu | 1500 |
| Từ 1500 xu | 3000 và sáng toàn bản đồ |

Điểm tính theo giá từng món nhân số món; combo không cộng lặp. Luật chỉnh được trong Nâng cao.

## Phát triển và build EXE

```powershell
npm ci
npm run setup
npm test
npm start
npm run dist:win
```

Mã backend trong `server.mjs`, engine và MC/bản đồ ở `public/`, kết nối và service ở `core/`/`vendor/`, desktop ở `desktop.cjs`. Mã worker giọng gốc có trong `python/wedding_voice.py`; runtime đã kèm worker đã biên dịch để giữ đúng bộ giọng hiện tại. Không có lớp bảo vệ riêng cho JavaScript/backend. Electron dùng sandbox/context isolation cho webview như cấu hình vận hành thông thường.

Các bài kiểm thử browser dùng Playwright: `npx playwright install chromium` hoặc dùng Chrome/Edge đã cài ở các test chọn channel. Test connector mock chạy trong tiến trình riêng, không gửi tương tác giả lên TikTok.

Nếu cần tạo lại đường biên, dữ liệu và script GIS ở `tools/`; cài Python và `tools/requirements-map.txt`, chạy `npm run build`, sau đó `npm run assets:labels` khi web local đang mở. File nhãn tính sẵn có hash hình học; dữ liệu đổi thì tự tính lại thay vì dùng nhãn cũ.

## Dữ liệu và giới hạn

EXE lưu dữ liệu tại thư mục ứng dụng của Windows, mở qua menu **Thư mục dữ liệu**. Bản clone dùng `data/`. Tài khoản, điểm, nhạc/clip bạn thêm và lịch sử được lưu ở máy riêng; không có key, tài khoản hay lịch sử LIVE của chủ tool trong repo. Các thư mục dữ liệu/runtime được Git bỏ qua.

TikTok hoặc dịch vụ kết nối có thể giới hạn lượt, thay đổi giao thức hoặc yêu cầu cấu hình riêng. Chờ cơ chế thử lại, không bấm dồn. Tool dùng giao thức cộng đồng, không phải sản phẩm chính thức của TikTok. Giọng trực tuyến cần mạng; clone tại máy cần thời gian nạp model ban đầu.

Nguồn ảnh/giấy phép ở `/credits.html`, dữ liệu/phép chiếu ở `public/map-metadata.json`. Chưa có biên bản chứng nhận sản phẩm bản đồ. Thành phần bên thứ ba giữ giấy phép riêng: [THIRD-PARTY.txt](THIRD-PARTY.txt), `licenses/` và metadata trong runtime. Bộ cài chưa có chữ ký Authenticode; SHA-256 chỉ đối chiếu tệp tải, không thay chữ ký xác thực nhà phát hành.

## Hỗ trợ & cà phê ☕

[Nhóm Tool game TikTok](https://zalo.me/g/rvny 4herfbvyzbwxdiup) · [Zalo Mai Trường](https://zalo.me/0359090502)

Anh em dùng thấy ổn có thể donate một cốc cà phê ở mục **Hỗ trợ & ủng hộ**, góp tiền token và duy trì phát triển tool. Hoàn toàn tự nguyện. Gặp lỗi gửi ảnh và mô tả thao tác vào nhóm giúp mình nhé!
