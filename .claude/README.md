# Cấu hình Claude Code cho dự án

| Đường dẫn | Mục đích |
|---|---|
| `../CLAUDE.md` | Ngữ cảnh dự án, Claude tự đọc mỗi phiên |
| `settings.json` | Quyền dùng chung (commit lên) |
| `settings.local.json` | Quyền cá nhân (đã gitignore) |
| `skills/analyze-request/` | Skill `/analyze-request`: phân tích → xác nhận → plan → làm và tick checklist |
| `agents/requirement-analyst.md` | Subagent chỉ đọc, phân tích yêu cầu dựa trên code |
| `plans/` | Các plan do skill tạo ra (`YYYY-MM-DD-<slug>.md`) |
| `../.mcp.json` | MCP server cấp dự án (Claude Code chỉ đọc file này ở root) |

## Cách dùng

```
/analyze-request thêm đĩa nhạc thứ 4 vào MusicPlayer
```
Luồng: agent phân tích → hỏi các điểm cần xác nhận → tạo plan trong `plans/` → (đồng ý) làm và tick `[x]` từng mục.

Tiếp tục plan dở dang: `/analyze-request` (không kèm tham số) hoặc "tiếp tục plan <tên>".

## MCP

| Server | Dùng cho | Ghi chú |
|---|---|---|
| `playwright` | E2E, kiểm tra UI trên trình duyệt, screenshot | `@playwright/mcp` |
| `chrome-devtools` | Lighthouse, performance trace, network, console | `chrome-devtools-mcp`, cần Chrome đã cài |

Lần đầu mở Claude Code sau khi thêm server, cần approve. Kiểm tra trạng thái bằng `/mcp`.
