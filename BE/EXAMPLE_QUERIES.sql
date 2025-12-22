-- ================================================
-- SAVORE DATABASE - EXAMPLE QUERIES
-- ================================================

-- ================================================
-- 1. USER MANAGEMENT
-- ================================================

-- Lấy tất cả users với roles của họ
SELECT 
    u.id,
    u.email,
    u.full_name,
    STRING_AGG(r.code, ', ') as roles
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY u.id, u.email, u.full_name;

-- Lấy user với wallet balance
SELECT 
    u.id,
    u.email,
    u.full_name,
    w.balance,
    w.currency
FROM users u
LEFT JOIN wallets w ON u.id = w.user_id;

-- Tìm tất cả CREATORS
SELECT DISTINCT
    u.id,
    u.email,
    u.full_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE r.code = 'CREATOR';

-- ================================================
-- 2. PRODUCT MANAGEMENT
-- ================================================

-- Lấy tất cả products với thông tin supplier
SELECT 
    p.id,
    p.name,
    p.price,
    p.status,
    u.full_name as supplier_name,
    u.email as supplier_email
FROM products p
JOIN users u ON p.supplier_id = u.id
WHERE p.status = 'ACTIVE'
ORDER BY p.created_at DESC;

-- Đếm số lượng products theo supplier
SELECT 
    u.full_name as supplier_name,
    COUNT(p.id) as total_products,
    SUM(CASE WHEN p.status = 'ACTIVE' THEN 1 ELSE 0 END) as active_products
FROM users u
LEFT JOIN products p ON u.id = p.supplier_id
GROUP BY u.id, u.full_name
HAVING COUNT(p.id) > 0;

-- ================================================
-- 3. POSTS & CONTENT
-- ================================================

-- Lấy tất cả posts với ingredients
SELECT 
    p.id,
    p.title,
    p.status,
    u.full_name as creator_name,
    COUNT(ri.id) as ingredient_count
FROM posts p
JOIN users u ON p.creator_id = u.id
LEFT JOIN recipe_ingredients ri ON p.id = ri.post_id
GROUP BY p.id, p.title, p.status, u.full_name
ORDER BY p.created_at DESC;

-- Chi tiết một post với tất cả ingredients
SELECT 
    p.id as post_id,
    p.title,
    p.video_url,
    prod.name as ingredient_name,
    ri.quantity_needed,
    prod.price,
    (ri.quantity_needed * prod.price) as estimated_cost
FROM posts p
JOIN recipe_ingredients ri ON p.id = ri.post_id
JOIN products prod ON ri.product_id = prod.id
WHERE p.id = 1; -- Thay đổi ID theo nhu cầu

-- ================================================
-- 4. ORDERS & SALES
-- ================================================

-- Lấy tất cả orders với tổng số items
SELECT 
    o.id,
    u.email as customer_email,
    o.total_price,
    o.status,
    COUNT(oi.id) as total_items,
    o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.email, o.total_price, o.status, o.created_at
ORDER BY o.created_at DESC;

-- Chi tiết một order
SELECT 
    o.id as order_id,
    o.status as order_status,
    oi.product_name_at_purchase,
    oi.quantity,
    oi.price_at_purchase,
    (oi.quantity * oi.price_at_purchase) as item_total,
    oi.commission_amount,
    oi.supplier_amount,
    supplier.full_name as supplier_name,
    creator.full_name as creator_name
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN users supplier ON oi.supplier_id = supplier.id
LEFT JOIN users creator ON oi.creator_id = creator.id
WHERE o.id = 1; -- Thay đổi ID theo nhu cầu

-- ================================================
-- 5. COMMISSIONS & REVENUE
-- ================================================

-- Tổng hoa hồng theo creator
SELECT 
    u.full_name as creator_name,
    u.email,
    COUNT(c.id) as total_commissions,
    SUM(CASE WHEN c.status = 'PENDING' THEN c.amount ELSE 0 END) as pending_amount,
    SUM(CASE WHEN c.status = 'PAID' THEN c.amount ELSE 0 END) as paid_amount,
    SUM(c.amount) as total_amount
FROM users u
JOIN commissions c ON u.id = c.creator_id
GROUP BY u.id, u.full_name, u.email
ORDER BY total_amount DESC;

-- Chi tiết hoa hồng chưa thanh toán
SELECT 
    c.id,
    u.full_name as creator_name,
    c.amount,
    oi.product_name_at_purchase,
    o.id as order_id,
    c.created_at
FROM commissions c
JOIN users u ON c.creator_id = u.id
JOIN order_items oi ON c.order_item_id = oi.id
JOIN orders o ON oi.order_id = o.id
WHERE c.status = 'PENDING'
ORDER BY c.created_at DESC;

-- ================================================
-- 6. WALLET & TRANSACTIONS
-- ================================================

-- Lịch sử giao dịch của một user
SELECT 
    t.id,
    t.type,
    t.source_type,
    t.amount,
    t.balance_after,
    t.status,
    t.created_at
FROM transactions t
JOIN wallets w ON t.wallet_id = w.id
WHERE w.user_id = 1 -- Thay đổi user_id theo nhu cầu
ORDER BY t.created_at DESC;

-- Tổng hợp giao dịch theo loại
SELECT 
    u.full_name,
    t.source_type,
    COUNT(t.id) as transaction_count,
    SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE 0 END) as total_credit,
    SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE 0 END) as total_debit
FROM users u
JOIN wallets w ON u.id = w.user_id
JOIN transactions t ON w.id = t.wallet_id
WHERE t.status = 'COMPLETED'
GROUP BY u.id, u.full_name, t.source_type;

-- ================================================
-- 7. ANALYTICS & REPORTS
-- ================================================

-- Top selling products
SELECT 
    p.name,
    COUNT(oi.id) as times_sold,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.quantity * oi.price_at_purchase) as total_revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('PAID', 'COMPLETED')
GROUP BY p.id, p.name
ORDER BY total_revenue DESC
LIMIT 10;

-- Top creators by commission
SELECT 
    u.full_name as creator_name,
    COUNT(DISTINCT p.id) as total_posts,
    COUNT(DISTINCT oi.id) as total_sales_from_posts,
    SUM(oi.commission_amount) as total_commission_earned
FROM users u
JOIN posts p ON u.id = p.creator_id
LEFT JOIN order_items oi ON p.id = oi.source_post_id
WHERE oi.id IS NOT NULL
GROUP BY u.id, u.full_name
ORDER BY total_commission_earned DESC
LIMIT 10;

-- Revenue by supplier
SELECT 
    u.full_name as supplier_name,
    COUNT(DISTINCT p.id) as total_products,
    COUNT(oi.id) as total_orders,
    SUM(oi.supplier_amount) as total_revenue
FROM users u
JOIN products p ON u.id = p.supplier_id
LEFT JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('PAID', 'COMPLETED')
GROUP BY u.id, u.full_name
ORDER BY total_revenue DESC;

-- Monthly sales report
SELECT 
    DATE_TRUNC('month', o.created_at) as month,
    COUNT(DISTINCT o.id) as total_orders,
    COUNT(oi.id) as total_items,
    SUM(o.total_price) as total_revenue,
    AVG(o.total_price) as avg_order_value
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.status IN ('PAID', 'COMPLETED')
GROUP BY DATE_TRUNC('month', o.created_at)
ORDER BY month DESC;

-- ================================================
-- 8. PERFORMANCE QUERIES
-- ================================================

-- Posts with highest conversion rate
SELECT 
    p.id,
    p.title,
    u.full_name as creator_name,
    COUNT(DISTINCT oi.order_id) as total_orders,
    SUM(oi.quantity * oi.price_at_purchase) as total_sales,
    SUM(oi.commission_amount) as total_commission
FROM posts p
JOIN users u ON p.creator_id = u.id
LEFT JOIN order_items oi ON p.id = oi.source_post_id
WHERE p.status = 'PUBLISHED'
GROUP BY p.id, p.title, u.full_name
HAVING COUNT(DISTINCT oi.order_id) > 0
ORDER BY total_sales DESC
LIMIT 10;

-- Products that need restocking (example - would need inventory table)
SELECT 
    p.id,
    p.name,
    p.status,
    u.full_name as supplier_name,
    COUNT(oi.id) as times_ordered,
    SUM(oi.quantity) as total_quantity_ordered
FROM products p
JOIN users u ON p.supplier_id = u.id
LEFT JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.status, u.full_name
ORDER BY total_quantity_ordered DESC;

-- ================================================
-- 9. DATA VALIDATION
-- ================================================

-- Check for orders without items
SELECT o.* 
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE oi.id IS NULL;

-- Check for wallets with negative balance
SELECT 
    u.email,
    w.balance,
    w.currency
FROM wallets w
JOIN users u ON w.user_id = u.id
WHERE w.balance < 0;

-- Check for commissions without corresponding order items
SELECT c.*
FROM commissions c
LEFT JOIN order_items oi ON c.order_item_id = oi.id
WHERE oi.id IS NULL;

-- ================================================
-- 10. USEFUL AGGREGATIONS
-- ================================================

-- Platform statistics
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM products WHERE status = 'ACTIVE') as active_products,
    (SELECT COUNT(*) FROM posts WHERE status = 'PUBLISHED') as published_posts,
    (SELECT COUNT(*) FROM orders WHERE status IN ('PAID', 'COMPLETED')) as completed_orders,
    (SELECT SUM(balance) FROM wallets) as total_wallet_balance,
    (SELECT SUM(amount) FROM commissions WHERE status = 'PENDING') as pending_commissions;

-- User activity summary
SELECT 
    u.email,
    u.full_name,
    COUNT(DISTINCT o.id) as orders_placed,
    COUNT(DISTINCT p.id) as posts_created,
    COUNT(DISTINCT prod.id) as products_listed,
    w.balance as wallet_balance
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
LEFT JOIN posts p ON u.id = p.creator_id
LEFT JOIN products prod ON u.id = prod.supplier_id
LEFT JOIN wallets w ON u.id = w.user_id
GROUP BY u.id, u.email, u.full_name, w.balance
ORDER BY u.created_at DESC;
