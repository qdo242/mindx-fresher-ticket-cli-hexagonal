# Ticket Manager CLI

CLI tool quản lý tickets với Hexagonal Architecture

## Cài đặt

```bash
# Clone project
git clone <url>
cd ticket-cli

# Cài dependencies
npm install

# Build
npm run build
```

## Ví dụ
1. Tạo ticket mới:
```
npm start -- create "Học TypeScript" "Học cơ bản" high urgent learning
```


2. Xem danh sách tickets

```npm start -- list
npm start -- list --status open
npm start -- list --priority high
npm start -- list --tags urgent,learning
```


3. Xem chi tiết ticket:
```
npm start -- show [ticket]
```

4. Cập nhật status ticket
```
npm start -- update [ticket] --status in-progress
```

5. Hướng dẫn
```
npm start -- help
```