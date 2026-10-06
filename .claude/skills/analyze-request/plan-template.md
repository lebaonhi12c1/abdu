# Plan: <tên ngắn>

- **Ngày tạo:** YYYY-MM-DD
- **Trạng thái:** Chờ xác nhận | Đang làm | Hoàn thành | Tạm dừng
- **Yêu cầu gốc:** <nguyên văn yêu cầu>
- **Ước lượng:** S | M | L

## Tóm tắt
<1–3 câu: làm gì, vì sao>

## Quyết định đã xác nhận
| # | Câu hỏi | Trả lời |
|---|---------|---------|
| 1 |         |         |

## Phạm vi ảnh hưởng
- `path`: <thay đổi gì>

## 1. Công việc chính
- [ ] <task cụ thể, có đường dẫn file>

## 2. Test
- [ ] Cập nhật hoặc thêm test Playwright trong `e2e/` (unit test Vitest chỉ thêm khi cần)
- [ ] Unit/component test: <case>
- [ ] E2E: <kịch bản>, chạy `npm run test:e2e` và pass
- [ ] Kiểm tra responsive: phần tử mới/đã sửa có test vị trí % ở 1280, 1920 và 2560px (xem `e2e/home.spec.js`)
- [ ] `npm run lint` pass
- [ ] `npm run build` pass

## 3. Performance
- [ ] Đo baseline trước khi sửa (Lighthouse qua chrome-devtools MCP): LCP, CLS, TBT, tổng dung lượng tải
- [ ] <tối ưu cụ thể, ví dụ nén/đổi sang webp/avif các ảnh lớn, lazy-load iframe>
- [ ] Đo lại sau khi sửa. Tiêu chí đạt: <ví dụ LCP < 2.5s mobile, không tăng bundle JS quá X KB>

## 4. Bảo mật
- [ ] `npm audit` không có lỗ hổng high/critical mới
- [ ] Link ngoài có `rel="noopener noreferrer"`
- [ ] Không có secret trong code hay biến `VITE_*`
- [ ] Header bảo mật trong `nginx.conf` (CSP, X-Content-Type-Options, Referrer-Policy...) phù hợp với thay đổi, ví dụ CSP vẫn cho phép YouTube
- [ ] <rủi ro riêng của yêu cầu này>

## 5. Scale up
- [ ] Cache header nginx đúng cho asset mới (asset có hash thì immutable)
- [ ] Kích thước Docker image / thời gian build CI không tăng bất thường
- [ ] App vẫn stateless, chạy được nhiều replica sau load balancer / CDN
- [ ] <điểm riêng của yêu cầu này>

## 6. MCP
- [ ] Đã kiểm tra MCP hiện có (`claude mcp list`, `.mcp.json`)
- [ ] <MCP cần thêm và đã thêm vào `.mcp.json`>, hoặc ghi "Không cần thêm"

## Rủi ro
- <rủi ro>: <cách giảm thiểu>

## Kết quả kiểm tra
<điền khi làm xong: output lint/build/test, số liệu Lighthouse trước/sau, kết quả npm audit>

## Ghi chú
<⚠️ mục bị bỏ qua và lý do, việc để làm sau>
