repo ai: https://github.com/Vnaud-1/AI-service
AI service sẽ là 1 repo riêng ko chung và repo của web vì 
    1:Lý do kỹ thuật

        -AI dùng Python + lib nặng

        -Web BE thường Node / Java / Spring

        -Dependency conflict 

        -Deploy khó
    2:Lý do kiến trúc

        -AI có vòng đời khác web

        -AI cần ingest, retrain, test riêng

        -Web cần ổn định
    3:Lý do teamwork

        -Bạn sửa AI → không ảnh hưởng BE

        -BE sửa API → không ảnh hưởng AI
1: Tại sao lại là RAG
    1.1. Chatbot thông thường (không RAG) hoạt động thế nào?

        Chỉ dựa vào kiến thức đã học trong quá trình huấn luyện

        Không “nhìn” được dữ liệu bên ngoài tại thời điểm trả lời

        Dễ gặp các vấn đề:

        -Trả lời lỗi thời

        - Bịa thông tin (hallucination)

        - Không biết dữ liệu nội bộ / riêng tư của bạn

        => Ví dụ: hỏi về chính sách công ty bạn mới ban hành tuần trước → chatbot thường không biết.
1.2. RAG (Retrieval-Augmented Generation) là gì?

    RAG kết hợp 2 bước:

        Bước 1: Retrieval (Truy xuất)

            Tìm kiếm thông tin liên quan từ:

            CSDL nội bộ

            File PDF, Word

            Wiki công ty

            Vector database (FAISS, Pinecone, Milvus…)

        Bước 2: Generation (Sinh câu trả lời)

            LLM dùng nội dung vừa truy xuất làm “ngữ cảnh”

            Trả lời dựa trên tài liệu thật, không chỉ trí nhớ mô hình

            Nói cách khác: LLM + công cụ tìm kiếm = RAG

            Khả năng trích dẫn: RAG cho phép bạn hiển thị: "Nguồn: Video của Creator A". Fine-tuning không thể làm được việc này vì kiến thức đã bị trộn lẫn vào hàng tỷ tham số của mô hình.
    2: sơ đồ hoạt động 
        1(tổng thể )
            ┌─────────────┐
            │   Website   │
            │  (Frontend) │
            └─────┬───────┘
                  │
                  │ 1. User question
                  ▼
            ┌─────────────┐
            │   Backend   │
            │    (BE)     │
            └─────┬───────┘
                  │
        2. POST /chat (message)
                  │
                  ▼
        ┌────────────────────┐
        │   AI / RAG Service  │   ←  CODE
        │────────────────────│
        │  Embed question    │
        │  Retrieve context  │
        │  Build prompt      │
        │  Call LLM          │
        └─────┬──────────────┘
              │
              │ 3. Vector search
              ▼
        ┌────────────────────┐
        │    Vector DB       │
        │ (FAISS / pgvector)│
        └────────────────────┘
2(intgestion flow )
            
        ┌──────────────┐
        │  BE Database │
        │ (Recipes /   │
        │  Docs / KB)  │
        └─────┬────────┘
            │
            │ 1. BE lấy data
            ▼
        ┌──────────────┐
        │   Backend    │
        │    (BE)      │
        └─────┬────────┘
            │
            │ 2. POST /ingest
            ▼
        ┌────────────────────┐
        │   AI / RAG Service │
        │  - Chunk           │
        │  - Embed           │
        │  - Save vectors    │
        └─────┬──────────────┘
            │
            ▼
        ┌────────────────────┐
        │    Vector DB       │
        └────────────────────┘
3: team be cần làm gì :
        Cung cấp dữ liệu cho AI (1 lần hoặc định kỳ)

        Qua API /ingest

        Hoặc job batch

        BE chịu trách nhiệm:

        Query DB

        Làm sạch text

        Gửi sang AI

        Gọi AI service khi user chat

        AI service có URL cố định:
        dạng data sử dụng ( ví dụ shema)
        {
        "id": "recipe_001",
        "content": "Tên món: Bún bò Huế\n\nNguyên liệu:\n- Thịt bò...\n\nCách làm:\nBước 1: ...",
        "metadata": {
            "dish_name": "Bún bò Huế",
            "type": "mặn",
            "diet": ["không chay"],
            "ingredients": ["bò", "bún", "sả", "ớt"],
            "source": "youtube"
        }
        }
4: hướng làm
    1: Data Pipeline cho AI Recipe( tự động lọc và ghi  RecipeDocument schema cho data từ trang web hay video)
        ┌──────────────┐
        │  Input URL   │
        └──────┬───────┘
            ▼
        ┌──────────────────┐
        │ Source Detector  │  ← web / youtube / tiktok
        └──────┬───────────┘
            ▼
        ┌──────────────────┐
        │   Extractor      │
        │ (HTML / Caption)│
        └──────┬───────────┘
            ▼
        ┌──────────────────┐
        │  Cleaner &       │
        │  Normalizer      │
        └──────┬───────────┘
            ▼
        ┌──────────────────┐
        │ Schema Generator │
        │ (RecipeDocument)│
        └──────┬───────────┘
            ▼
        ┌──────────────────┐
        │   Ingest RAG     │
        └──────────────────┘
