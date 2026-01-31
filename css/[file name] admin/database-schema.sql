[file name]: database-schema.sql
[file content begin]
-- هيكل قاعدة البيانات لـ DIGTL MIRROR
-- يمكن استخدام MySQL أو PostgreSQL

CREATE DATABASE IF NOT EXISTS digtl_mirror;
USE digtl_mirror;

-- جدول المستخدمين (للموظفين والإدارة)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'manager', 'developer', 'support') DEFAULT 'support',
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول العملاء
CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول أنواع المشاريع
CREATE TABLE project_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2),
    estimated_duration_days INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول الطلبات (المشاريع المطلوبة)
CREATE TABLE project_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT NOT NULL,
    project_type_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(10, 2),
    status ENUM('pending', 'under_review', 'approved', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    deadline DATE,
    assigned_to INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (project_type_id) REFERENCES project_types(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- جدول المهام داخل المشروع
CREATE TABLE project_tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_to INT,
    status ENUM('todo', 'in_progress', 'review', 'completed') DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES project_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- جدول الملفات والمستندات
CREATE TABLE project_files (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size INT,
    uploaded_by INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES project_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- جدول الدفعات المالية
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'credit_card', 'paypal') DEFAULT 'bank_transfer',
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    transaction_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES project_requests(id) ON DELETE CASCADE
);

-- جدول المراسلات
CREATE TABLE communications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    user_id INT,
    client_id INT,
    message TEXT NOT NULL,
    type ENUM('email', 'sms', 'internal_note', 'meeting') DEFAULT 'internal_note',
    direction ENUM('incoming', 'outgoing') DEFAULT 'outgoing',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES project_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- جدول التقارير والإحصائيات
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_type VARCHAR(50) NOT NULL,
    period_start DATE,
    period_end DATE,
    data JSON,
    generated_by INT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (generated_by) REFERENCES users(id)
);

-- جدول الإعدادات
CREATE TABLE settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
    category VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول سجل النشاطات
CREATE TABLE activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- إضافة بيانات أولية
INSERT INTO users (username, password_hash, full_name, email, role) VALUES
('admin', '$2y$10$YourHashedPasswordHere', 'المسؤول الرئيسي', 'admin@digtlmirror.com', 'admin'),
('manager', '$2y$10$YourHashedPasswordHere', 'مدير المشاريع', 'manager@digtlmirror.com', 'manager');

INSERT INTO project_types (name, description, base_price, estimated_duration_days) VALUES
('website', 'تطوير مواقع ويب متكاملة', 2000, 30),
('mobile', 'تطبيقات موبايل لأنظمة iOS و Android', 4000, 60),
('system', 'أنظمة إدارة الشركات', 5000, 90),
('ecommerce', 'منصات تجارة إلكترونية', 3500, 45),
('finance', 'تطبيقات مالية ومحاسبية', 4500, 75);

-- إضافة إعدادات افتراضية
INSERT INTO settings (setting_key, setting_value, setting_type, category) VALUES
('company_name', 'DIGTL MIRROR', 'text', 'general'),
('company_email', 'info@digtlmirror.com', 'text', 'general'),
('company_phone', '+962795011908', 'text', 'general'),
('company_address', 'الأردن ~ عمان ~ العقبة', 'text', 'general'),
('default_currency', 'USD', 'text', 'financial'),
('tax_rate', '0.16', 'number', 'financial'),
('invoice_prefix', 'DM', 'text', 'financial'),
('email_notifications', 'true', 'boolean', 'notifications'),
('sms_notifications', 'false', 'boolean', 'notifications');

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX idx_project_requests_status ON project_requests(status);
CREATE INDEX idx_project_requests_client ON project_requests(client_id);
CREATE INDEX idx_project_requests_assigned ON project_requests(assigned_to);
CREATE INDEX idx_project_tasks_project ON project_tasks(project_id);
CREATE INDEX idx_project_tasks_status ON project_tasks(status);
CREATE INDEX idx_communications_project ON communications(project_id);
CREATE INDEX idx_payments_project ON payments(project_id);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_date ON activity_log(created_at);
[file content end]
