---
name: analyze-request
description: Phân tích một yêu cầu mới dựa trên dự án, liệt kê các điểm cần xác nhận với người dùng, rồi tạo plan có checklist (chức năng, test, performance, bảo mật, scale up, MCP) lưu trong .claude/plans/ và tick dần khi làm. Dùng khi người dùng đưa ra yêu cầu feature/bug/thay đổi mới, hoặc gõ /analyze-request.
argument-hint: <mô tả yêu cầu>
---

# Phân tích yêu cầu → xác nhận → plan

Yêu cầu của người dùng: **$ARGUMENTS**

Nếu `$ARGUMENTS` rỗng, hỏi người dùng yêu cầu là gì rồi mới làm tiếp. Giao tiếp với người dùng bằng tiếng Việt.

## Bước 1: Phân tích

Gọi agent `requirement-analyst` (Agent tool, `subagent_type: "requirement-analyst"`). Truyền nguyên văn yêu cầu và mọi ngữ cảnh người dùng đã cung cấp (ảnh, link, file). Chờ kết quả, không tự phân tích song song.

Tóm tắt ngắn kết quả cho người dùng: phạm vi, rủi ro chính, ước lượng.

## Bước 2: Xác nhận

Lấy các "Điểm cần xác nhận" từ kết quả phân tích:
- Hỏi bằng `AskUserQuestion`, tối đa 4 câu mỗi lần. Đặt lựa chọn đề xuất lên đầu, có ghi "(Recommended)".
- Còn nhiều hơn 4 câu thì hỏi tiếp lượt sau. Bỏ những câu đã trả lời được nhờ câu trước.
- Không còn điểm nào cần hỏi thì nói rõ là không cần xác nhận và chuyển sang bước 3.

**Không viết plan trước khi người dùng trả lời xong.**

## Bước 3: Tạo plan

1. Đọc [plan-template.md](plan-template.md).
2. Tạo file `.claude/plans/YYYY-MM-DD-<slug>.md` (lấy ngày hôm nay, slug tiếng Anh dạng kebab-case, ngắn).
3. Điền đủ mọi mục trong template:
   - Mục nào không áp dụng thì ghi `- [x] Không áp dụng: <lý do>`. **Không xoá mục.**
   - Task phải cụ thể đến file: `- [ ] Thêm prop X vào src/components/ImageFrame.jsx`.
   - Mỗi mục Test / Performance / Bảo mật phải có **tiêu chí đạt đo được** (ví dụ "LCP < 2.5s trên Lighthouse mobile", "`npm audit` không có high/critical").
   - Ghi lại các câu trả lời xác nhận ở bước 2 vào mục "Quyết định đã xác nhận".
4. Gửi người dùng đường dẫn plan và tóm tắt 3–5 dòng. Hỏi có bắt đầu làm luôn không.

## Bước 4: MCP còn thiếu

Nếu phần MCP trong kết quả phân tích có mục "Cần thêm":
1. Kiểm tra `.mcp.json` ở root dự án (Claude Code chỉ đọc MCP cấp dự án từ file này, nên nó không nằm trong `.claude/`).
2. Thêm server vào `.mcp.json`. Trên Windows, server chạy bằng `npx` phải bọc qua `cmd /c`:
   ```json
   "ten-server": { "command": "cmd", "args": ["/c", "npx", "-y", "<package>@latest"] }
   ```
   Server HTTP: `{ "type": "http", "url": "<url>" }`.
3. **Không bao giờ ghi secret hay token vào `.mcp.json`.** Dùng `${ENV_VAR}` và báo người dùng cần set biến môi trường nào.
4. Thêm một dòng vào bảng MCP trong `.claude/README.md`.
5. Báo người dùng: phải khởi động lại Claude Code và duyệt (approve) server mới, sau đó kiểm tra bằng `/mcp`.
6. Tick mục MCP tương ứng trong plan.

## Bước 5: Thực hiện (khi người dùng đồng ý)

- Làm theo thứ tự task trong plan. **Xong mục nào thì sửa `- [ ]` thành `- [x]` ngay** trong file plan, không dồn đến cuối.
- Mục làm không được hoặc bị bỏ qua: giữ `- [ ]` và thêm ghi chú `⚠️ <lý do>`. Không được tick khống.
- Cập nhật trường `Trạng thái` ở đầu plan: `Chờ xác nhận` → `Đang làm` → `Hoàn thành` (hoặc `Tạm dừng`).
- Trước khi báo xong: chạy `npm run lint` và `npm run build`, cùng mọi lệnh test/đo đạc ghi trong plan. Ghi kết quả thật (số liệu, output) vào mục "Kết quả kiểm tra".
- Cuối cùng báo cho người dùng: số mục đã xong trên tổng số mục, và các mục còn ⚠️.

## Tiếp tục một plan có sẵn

Nếu người dùng nói "tiếp tục plan X" hoặc gọi `/analyze-request` mà không có yêu cầu mới trong khi `.claude/plans/` có plan đang ở trạng thái `Đang làm`: mở plan đó, liệt kê các mục `- [ ]` còn lại, rồi làm tiếp từ bước 5.
