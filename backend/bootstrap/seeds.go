package bootstrap

import (
	"fmt"
	"hieu/goblog/database"
	"hieu/goblog/models"
	"time"

	"github.com/google/uuid"
)

type postSeed struct {
	Title   string
	Content string
	Author  string
}

type questionSeed struct {
	Title   string
	Content string
	Author  string
}

func samplePostSeeds() []postSeed {
	return []postSeed{
		{Title: "Redis cache khong chi la cache: Cach chong cache stampede", Content: "Bai viet giai thich cach Redis giup giam tai cho database, dong thoi doi pho voi cache stampede bang mutex, TTL phan nhieu va co che lam moi du lieu hop ly.", Author: "Nguyen Huy Hoang"},
		{Title: "Go routine va channel: Cai bay nhot khi moi bat dau", Content: "Mot so loi thuong gap khi dung goroutine, channel va wait group trong Go. Bai viet nay tong hop cach tranh deadlock va race condition khi xay dung API thuc te.", Author: "Le Minh Khoa"},
		{Title: "PostgreSQL index: Khi nao B-Tree khong con du", Content: "Khong phai query nao cung can index, va khong phai index nao cung tot. Bai viet nay di qua B-Tree, Hash, GIN va cach doc explain plan de chon index dung.", Author: "Pham Thu Ha"},
		{Title: "Debug API nhanh hon voi log co cau truc", Content: "Thay vi in log tua tung dong, hay thu structured logging de tim loi nhanh hon. Bai viet nay goi y cach them request id, latency va context khi debug backend.", Author: "Tran Quang Minh"},
		{Title: "Xay dung pagination cho REST API va frontend", Content: "Danh sach dai can pagination de tang toc do va trai nghiem nguoi dung. Bai viet nay so sanh offset pagination, cursor pagination va cach hien thi tren UI.", Author: "Doan Ngoc Anh"},
		{Title: "TypeScript ho tro team scale code the nao", Content: "Khi project lon dan, TypeScript giam bug va lam ro contract giua cac layer. Bai viet nay bat dau tu type co ban den cach to chuc folder trong app React.", Author: "Nguyen Anh Tuan"},
		{Title: "Khi nao nen dung queue trong he thong blog", Content: "Gui email thong bao, index search, va tinh toan thong ke co the tach ra bang queue. Bai viet nay no ro khi nao nen dung background job thay vi xu ly dong bo.", Author: "Vu Hanh"},
		{Title: "JWT, refresh token va nhung loi sai pho bien", Content: "Tu cach luu token cho den thoi diem rotate refresh token, bai viet nay tong hop cac diem de mat an toan thuong bi bo qua trong he thong dang nhap.", Author: "Ha Quang Duy"},
		{Title: "Docker Compose cho backend blog local setup", Content: "Khi muon chay toan bo stack local, Docker Compose giup dong goi database va backend thanh mot luong start ro rang. Bai viet nay mo ta cach hoat dong co ban.", Author: "Phan My Linh"},
		{Title: "React router patterns cho dashboard noi dung", Content: "Route nested, layout route va protected route la nhung mau rat hay gap trong dashboard. Bai viet nay so sanh khi nao nen tach layout rieng.", Author: "Truong Duc Long"},
		{Title: "Thiết kế content editor khong gay roi mat", Content: "Mot content editor tot can ro rang, co khoang trang va han che so truong khong can thiet. Bai viet nay chia se mot so nguyen tac UI co ban.", Author: "Bui Hoai Nam"},
		{Title: "Quan ly state khi danh sach bai viet tang nhanh", Content: "Khi so luong bai viet tang, cach render, filter va pagination can duoc tinh lai de khong lam UI cham. Bai viet nay de xuat mot so cach toi uu.", Author: "Ngo Bao Chau"},
		{Title: "Search theo title de nguoi dung tim bai nhanh hon", Content: "Tim kiem theo title la cach de nhat de bat dau, sau do co the mo rong sang content, author hoac tag. Bai viet nay giai thich cach lam phan search goi nhe.", Author: "Lam Quoc Dat"},
		{Title: "Giao dien trang danh sach nen co thong tin gi", Content: "Mot list page tot khong chi co item list ma con co hero, call to action, bo loc va thong tin trang thai. Bai viet nay phan tich structure hop ly.", Author: "Phuong Thao"},
		{Title: "Tao bai viet moi va preview truoc khi dang", Content: "Preview giup nguoi dung kiem tra noi dung truoc khi luu. Bai viet nay dua ra mot so y tuong cho trang tao va sua bai viet trong blog app.", Author: "Do Duc Hieu"},
		{Title: "Quan sat he thong co ban cho ung dung blog", Content: "Latency, error rate va request volume la nhung chi so nen co ngay tu dau. Bai viet nay dua ra cach doc nhung chi so co ban de theo doi he thong.", Author: "Thanh Nguyen"},
		{Title: "Tach component dung luc de giao dien de bao tri", Content: "Khi component bat dau dai ra, tach thanh cac khoi nho giup de doc, de test va de tai su dung hon. Bai viet nay no ve mot so dau hieu nen tach component.", Author: "Mai Khanh"},
		{Title: "Cloud deploy cho app blog nho va vua", Content: "Tu local len production can danh gia DB, env, backup va cache. Bai viet nay diem qua cac buoc can co khi deploy mot app blog nho.", Author: "Nguyen My Linh"},
		{Title: "Tan dung server side data thay vi fetch lan man", Content: "Khi danh sach du lieu khong qua lon, render server side va cache hop ly co the giam load UI. Bai viet nay no ve mot so trade-off co ban.", Author: "Thai Son"},
		{Title: "Tối ưu kết nối database trong Go backend", Content: "# Tối ưu kết nối database trong Go backend\n~ Bài viết thực chiến dành cho hệ thống có traffic tăng dần và cần giữ độ ổn định cao.\n\n> Nếu cấu hình connection pool không đúng, backend có thể chậm dần theo thời gian dù CPU chưa chạm ngưỡng.\n\n![Minh họa Go backend](https://upload.wikimedia.org/wikipedia/commons/2/23/Golang.png)\n\n## Vì sao đây là điểm nghẽn quan trọng?\nKhi số lượng request đồng thời tăng, database connection trở thành tài nguyên *khó chia sẻ nhất*.\nNếu mở quá ít kết nối, request phải chờ lâu; nếu mở quá nhiều, DB server lại quá tải.\n\n## Mục tiêu tối ưu\n- Giữ latency ổn định ở giờ cao điểm\n- Giảm lỗi timeout và lỗi *too many connections*\n- Tăng throughput nhưng vẫn đảm bảo an toàn tài nguyên\n\n## 1) Nắm chắc 4 thông số cốt lõi\n- **MaxOpenConns**: số kết nối tối đa app được mở\n- **MaxIdleConns**: số kết nối rảnh giữ lại trong pool\n- **ConnMaxLifetime**: tuổi thọ tối đa của kết nối\n- **ConnMaxIdleTime**: thời gian rảnh tối đa trước khi đóng kết nối\n\n## 2) Cấu hình theo tải thực tế, không theo cảm tính\n- Bắt đầu từ giá trị trung bình, đo số liệu sau mỗi lần tinh chỉnh\n- Tính theo tổng số instance backend đang chạy\n- Luôn chừa headroom cho migration, backup và tác vụ nền\n\n### Gợi ý baseline cho service cỡ vừa\n- **MaxOpenConns = 40**\n- **MaxIdleConns = 15**\n- **ConnMaxLifetime = 30 phút**\n- **ConnMaxIdleTime = 10 phút**\n\n~ Lưu ý: baseline chỉ để khởi động nhanh, vẫn cần điều chỉnh theo workload thật.\n\n## 3) Anti-pattern thường gặp\n- Mở kết nối mới theo từng request\n- Giữ transaction quá lâu\n- Query N+1 ở endpoint danh sách\n- Không đặt timeout cho thao tác đọc/ghi DB\n\n## 4) Kết hợp timeout và retry đúng cách\n- Dùng timeout ngắn cho endpoint đọc, timeout dài hơn cho ghi\n- Chỉ retry với lỗi tạm thời, không retry mọi lỗi\n- Kết hợp circuit breaker khi phụ thuộc service ngoài\n\n## 5) Theo dõi chỉ số để tối ưu liên tục\n- **Latency theo endpoint**\n- **Tỉ lệ lỗi DB theo loại lỗi**\n- **Số connection đang mở/đang dùng**\n- **Thời gian chờ lấy connection**\n\n---\n## Kết luận\nTối ưu connection pool là bài toán cân bằng giữa **hiệu năng**, *độ ổn định* và chi phí tài nguyên.\nKhi bạn cấu hình đúng + có đo lường liên tục, backend Go sẽ chạy mượt và ít lỗi đột biến hơn trong production.", Author: "Phạm Gia Hưng"},
		{Title: "Thiết kế middleware logging cho API có truy vết", Content: "Nội dung tập trung vào request id, thời gian phản hồi và log theo ngữ cảnh để dễ truy vết lỗi trong hệ thống backend nhiều service.", Author: "Lê Thu Trang"},
		{Title: "Xử lý lỗi nhất quán trong REST backend", Content: "Bài viết hướng dẫn chuẩn hóa cấu trúc lỗi trả về, mã trạng thái HTTP và thông điệp dễ hiểu để frontend tích hợp nhanh hơn.", Author: "Ngô Minh Quân"},
		{Title: "Bảo vệ endpoint bằng JWT và phân quyền theo vai trò", Content: "Giải thích cách kiểm tra token, tách quyền theo role và hạn chế truy cập vào các route nhạy cảm trong backend.", Author: "Trần Hoài Phương"},
		{Title: "Chiến lược cache Redis cho backend đọc nhiều", Content: "Phân tích cache aside, thời gian hết hạn hợp lý và cơ chế làm mới dữ liệu nhằm giảm tải database trong các API đọc thường xuyên.", Author: "Vũ Thanh Tùng"},
	}
}

func sampleQuestionSeeds() []questionSeed {
	return []questionSeed{
		{Title: "Làm sao tối ưu connection pool cho PostgreSQL trong backend Go?", Content: "Mình muốn cấu hình max open, max idle và lifetime hợp lý để tránh nghẽn kết nối khi traffic tăng. Có công thức thực tế nào không?", Author: "Trần Minh Đức"},
		{Title: "Nên dùng Redis cache theo chiến lược nào cho API đọc nhiều?", Content: "Với endpoint đọc dữ liệu thường xuyên, nên chọn cache aside hay write through để cân bằng tốc độ và độ nhất quán?", Author: "Lê Phương Anh"},
		{Title: "Thiết kế phân quyền role-based cho backend như thế nào cho dễ mở rộng?", Content: "Hiện mình có role admin, editor, user. Có nên lưu quyền theo bảng riêng hay hardcode trong service layer?", Author: "Nguyễn Quốc Bảo"},
		{Title: "Xử lý retry khi gọi service ngoài trong backend ra sao để không nhân lỗi?", Content: "Mình đang gọi API thanh toán và gặp timeout. Nên áp dụng exponential backoff kèm circuit breaker như thế nào?", Author: "Phạm Hoài Nam"},
		{Title: "Nên tổ chức middleware logging và tracing trong Gin theo thứ tự nào?", Content: "Có nhiều middleware như auth, logger, recovery, request id. Mình muốn thứ tự chuẩn để dễ debug và đo latency.", Author: "Vũ Thanh Lam"},
		{Title: "Làm sao chống race condition khi cập nhật dữ liệu đồng thời trong backend?", Content: "Khi nhiều request cùng cập nhật một bản ghi, nên dùng transaction lock hay optimistic locking để hiệu quả hơn?", Author: "Đỗ Khánh Linh"},
		{Title: "Chuẩn hóa response lỗi cho REST API backend nên bắt đầu từ đâu?", Content: "Mình muốn mọi lỗi trả về cùng format gồm code, message, details để frontend dễ xử lý. Có mẫu nào khuyến nghị không?", Author: "Ngô Đức Huy"},
		{Title: "JWT access token và refresh token nên lưu ở đâu để an toàn hơn?", Content: "Mình phân vân giữa HttpOnly cookie và localStorage. Trường hợp web app có cần kết hợp thêm CSRF token không?", Author: "Bùi Thu Hà"},
		{Title: "Khi nào nên tách backend thành microservices thay vì giữ monolith?", Content: "Dự án đang tăng nhanh về đội ngũ và tính năng. Có tiêu chí rõ ràng nào để quyết định tách service không?", Author: "Mai Quang Hưng"},
		{Title: "Giám sát backend production nên theo dõi những chỉ số nào trước tiên?", Content: "Mình muốn set dashboard cơ bản cho latency, error rate và throughput. Ngoài ra có chỉ số bắt buộc nào không?", Author: "Hoàng Gia Bảo"},
		{Title: "Why do many experienced project managers fail the PMP exam first try?", Content: "Ban nao co kinh nghiem PMP co the chia se them? Cau hoi nay hay gap khi chuyen tu kinh nghiem thuc te sang thi chuan hoa.", Author: "Russell Walker"},
		{Title: "Tu dong phan loai van ban va tao cong viec tu he thong quan ly van ban bang AI?", Content: "Minh dang tim cach dem question classification roi mapping sang workflow. Ai da lam chatgpt/llm workflow cho case nay?", Author: "Nguyen Thu Ha"},
		{Title: "Learning path cho Security Engineer", Content: "Nen bat dau tu nen tang nao, lab nao, va co nen hoc cloud security truoc khong?", Author: "Sea Anh"},
		{Title: "Nen chon PostgreSQL hay MySQL cho blog nho?", Content: "Mong nhan duoc so sanh thuc te ve concurrency, index va cache cho project blog nho.", Author: "Ngoc Anh"},
		{Title: "Cach thiet ke API cho trang hoi dap", Content: "Nen dung question/answer separate hay embed answers trong question? Trade-off la gi?", Author: "Thanh Tung"},
	}
}

func seedSamplePosts() {
	seeds := samplePostSeeds()
	seedTitles := make([]string, 0, len(seeds))
	for _, seed := range seeds {
		seedTitles = append(seedTitles, seed.Title)
	}

	var existingPosts []models.Post
	if err := database.DB.Where("title IN ?", seedTitles).Find(&existingPosts).Error; err != nil {
		fmt.Printf("khong the tai danh sach bai viet da co: %v\n", err)
		return
	}

	existingTitleMap := make(map[string]struct{}, len(existingPosts))
	for _, post := range existingPosts {
		existingTitleMap[post.Title] = struct{}{}
	}

	now := time.Now()
	posts := make([]models.Post, 0, len(seeds))
	seedMap := make(map[string]postSeed, len(seeds))
	for _, seed := range seeds {
		seedMap[seed.Title] = seed
	}

	for _, existingPost := range existingPosts {
		seed := seedMap[existingPost.Title]
		if err := database.DB.Model(&models.Post{}).
			Where("id = ?", existingPost.ID).
			Updates(map[string]interface{}{
				"content":    seed.Content,
				"author":     seed.Author,
				"updated_at": now,
			}).Error; err != nil {
			fmt.Printf("khong the cap nhat bai seed theo tieu de %s: %v\n", existingPost.Title, err)
		}
	}

	for index, seed := range seeds {
		if _, exists := existingTitleMap[seed.Title]; exists {
			continue
		}

		createdAt := now.Add(-time.Duration(index) * time.Hour)
		posts = append(posts, models.Post{
			ID:        uuid.New(),
			Title:     seed.Title,
			Content:   seed.Content,
			Author:    seed.Author,
			UserID:    uuid.New(),
			CreatedAt: createdAt,
			UpdatedAt: createdAt,
		})
	}

	if len(posts) == 0 {
		return
	}

	if err := database.DB.Create(&posts).Error; err != nil {
		fmt.Printf("khong the tao du lieu bai viet mau: %v\n", err)
	}
}

func seedSampleComments() {
	var existingCount int64
	if err := database.DB.Model(&models.Comment{}).Count(&existingCount).Error; err != nil {
		fmt.Printf("khong the dem so binh luan mau: %v\n", err)
		return
	}

	if existingCount > 0 {
		return
	}

	var posts []models.Post
	if err := database.DB.Order("created_at desc").Limit(4).Find(&posts).Error; err != nil {
		fmt.Printf("khong the tai bai viet de seed binh luan: %v\n", err)
		return
	}

	if len(posts) == 0 {
		return
	}

	now := time.Now()
	comments := []models.Comment{}
	starterComments := []struct {
		author  string
		content string
	}{
		{author: "Minh Anh", content: "Phan cache stampede trong bai nay rat de hieu, minh se thu ap dung cho service cua minh."},
		{author: "Quoc Dat", content: "Phan TTL phan nhieu la diem minh thay huu ich nhat, cam on ban da tong hop."},
		{author: "Thao Vy", content: "Ban viet ve Copilot trong VS Code rat sat voi thuc te, minh rat thich phan workflow."},
		{author: "Hoang Phuc", content: "Phan AI Agent lam minh nghi nhieu hon ve cach to chuc task trong editor."},
	}

	for index, post := range posts {
		commentSeed := starterComments[index%len(starterComments)]
		createdAt := now.Add(-time.Duration(index) * 20 * time.Minute)
		comments = append(comments, models.Comment{
			ID:        uuid.New(),
			PostID:    post.ID,
			UserID:    uuid.New(),
			Author:    commentSeed.author,
			Content:   commentSeed.content,
			CreatedAt: createdAt,
			UpdatedAt: createdAt,
		})
	}

	if err := database.DB.Create(&comments).Error; err != nil {
		fmt.Printf("khong the seed binh luan mau: %v\n", err)
	}
}

func seedSampleQuestions() {
	seeds := sampleQuestionSeeds()
	seedTitles := make([]string, 0, len(seeds))
	for _, seed := range seeds {
		seedTitles = append(seedTitles, seed.Title)
	}

	var existingQuestions []models.Question
	if err := database.DB.Where("title IN ?", seedTitles).Find(&existingQuestions).Error; err != nil {
		fmt.Printf("khong the tai danh sach cau hoi da co: %v\n", err)
		return
	}

	existingTitleMap := make(map[string]struct{}, len(existingQuestions))
	for _, question := range existingQuestions {
		existingTitleMap[question.Title] = struct{}{}
	}

	now := time.Now()
	questions := make([]models.Question, 0, len(seeds))
	for index, seed := range seeds {
		if _, exists := existingTitleMap[seed.Title]; exists {
			continue
		}

		createdAt := now.Add(-time.Duration(index) * 15 * time.Minute)
		questions = append(questions, models.Question{
			ID:        uuid.New(),
			Title:     seed.Title,
			Content:   seed.Content,
			Author:    seed.Author,
			UserID:    uuid.New(),
			CreatedAt: createdAt,
			UpdatedAt: createdAt,
		})
	}

	if len(questions) == 0 {
		return
	}

	if err := database.DB.Create(&questions).Error; err != nil {
		fmt.Printf("khong the seed cau hoi mau: %v\n", err)
		return
	}

	var latestQuestions []models.Question
	if err := database.DB.Order("created_at desc").Limit(2).Find(&latestQuestions).Error; err != nil {
		fmt.Printf("khong the lay cau hoi vua tao de seed tra loi: %v\n", err)
		return
	}

	answers := []models.Answer{}
	for index, question := range latestQuestions {
		answerTime := now.Add(-time.Duration(index) * 30 * time.Minute)
		answers = append(answers, models.Answer{
			ID:         uuid.New(),
			QuestionID: question.ID,
			UserID:     uuid.New(),
			Author:     "GOBLO Helper",
			Content:    "Cau tra loi mau de minh hoa luong hoi dap hoat dong.",
			CreatedAt:  answerTime,
			UpdatedAt:  answerTime,
		})
	}

	if len(answers) > 0 {
		if err := database.DB.Create(&answers).Error; err != nil {
			fmt.Printf("khong the seed tra loi mau: %v\n", err)
		}
	}
}

func SeedAll() {
	seedSamplePosts()
	seedSampleComments()
	seedSampleQuestions()
}
