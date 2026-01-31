[file name]: api.php
[file content begin]
<?php
/**
 * واجهة برمجة التطبيقات (API) لنظام إدارة طلبات DIGTL MIRROR
 * تستخدم PHP مع MySQL
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// إعدادات الاتصال بقاعدة البيانات
define('DB_HOST', 'localhost');
define('DB_NAME', 'digtl_mirror');
define('DB_USER', 'root');
define('DB_PASS', '');

// استثناءات الأخطاء
ini_set('display_errors', 0);
error_reporting(E_ALL);

// دالة الاتصال بقاعدة البيانات
function connectDB() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'خطأ في الاتصال بقاعدة البيانات', 'message' => $e->getMessage()]);
        exit;
    }
}

// التحقق من التوكن (JWT بسيط)
function verifyToken() {
    $headers = getallheaders();
    
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(['error' => 'مصادقة مطلوبة']);
        exit;
    }
    
    $authHeader = $headers['Authorization'];
    $token = str_replace('Bearer ', '', $authHeader);
    
    // في التطبيق الحقيقي، يجب التحقق من التوكن باستخدام JWT
    // هذا مثال مبسط للتوضيح
    if ($token !== 'valid_token_example') {
        http_response_code(403);
        echo json_encode(['error' => 'توكن غير صالح']);
        exit;
    }
    
    return true;
}

// الحصول على بيانات JSON من الطلب
function getJsonInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true);
}

// معالجة طلبات OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// الحصول على المسار المطلوب
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path_segments = explode('/', trim($path, '/'));

// تجاهل المسار الأساسي إذا كان موجوداً
if (count($path_segments) > 0 && $path_segments[0] === 'api') {
    array_shift($path_segments);
}

// تحديد النقاط النهائية (Endpoints)
$endpoint = isset($path_segments[0]) ? $path_segments[0] : '';
$id = isset($path_segments[1]) ? intval($path_segments[1]) : 0;

// معالجة النقاط النهائية
try {
    switch ($endpoint) {
        case 'login':
            if ($request_method === 'POST') {
                handleLogin();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'طريقة غير مسموحة']);
            }
            break;
            
        case 'requests':
            // التحقق من التوكن لجميع عمليات الطلبات عدا GET
            if ($request_method !== 'GET') {
                verifyToken();
            }
            handleRequests($id, $request_method);
            break;
            
        case 'stats':
            if ($request_method === 'GET') {
                handleStats();
            } else {
                http_response_code(405);
                echo json_encode(['error' => 'طريقة غير مسموحة']);
            }
            break;
            
        case 'clients':
            verifyToken();
            handleClients($id, $request_method);
            break;
            
        case 'users':
            verifyToken();
            handleUsers($id, $request_method);
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'نقطة النهاية غير موجودة']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'خطأ في الخادم', 'message' => $e->getMessage()]);
}

// دالة معالجة تسجيل الدخول
function handleLogin() {
    $data = getJsonInput();
    
    if (!isset($data['username']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'اسم المستخدم وكلمة المرور مطلوبان']);
        return;
    }
    
    $pdo = connectDB();
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND is_active = 1");
    $stmt->execute([$data['username']]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'اسم المستخدم أو كلمة المرور غير صحيحة']);
        return;
    }
    
    // التحقق من كلمة المرور (في التطبيق الحقيقي، استخدم password_verify)
    if (!password_verify($data['password'], $user['password_hash'])) {
        // للتوضيح فقط - في التطبيق الحقيقي، يجب تشفير كلمات المرور
        if ($data['password'] !== 'admin123' && $data['password'] !== 'manager123') {
            http_response_code(401);
            echo json_encode(['error' => 'اسم المستخدم أو كلمة المرور غير صحيحة']);
            return;
        }
    }
    
    // تحديث وقت آخر دخول
    $updateStmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $updateStmt->execute([$user['id']]);
    
    // إنشاء توكن (في التطبيق الحقيقي، استخدم JWT)
    $token = base64_encode(json_encode([
        'user_id' => $user['id'],
        'username' => $user['username'],
        'role' => $user['role'],
        'exp' => time() + (24 * 60 * 60) // صلاحية 24 ساعة
    ]));
    
    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'full_name' => $user['full_name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);
}

// دالة معالجة الطلبات
function handleRequests($id, $method) {
    $pdo = connectDB();
    
    switch ($method) {
        case 'GET':
            if ($id > 0) {
                // الحصول على طلب محدد
                $stmt = $pdo->prepare("
                    SELECT pr.*, c.full_name as client_name, c.email as client_email, 
                           c.phone as client_phone, pt.name as project_type_name
                    FROM project_requests pr
                    LEFT JOIN clients c ON pr.client_id = c.id
                    LEFT JOIN project_types pt ON pr.project_type_id = pt.id
                    WHERE pr.id = ?
                ");
                $stmt->execute([$id]);
                $request = $stmt->fetch();
                
                if ($request) {
                    echo json_encode($request);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'الطلب غير موجود']);
                }
            } else {
                // الحصول على جميع الطلبات مع إمكانية التصفية
                $filters = $_GET;
                $query = "
                    SELECT pr.*, c.full_name as client_name, c.email as client_email, 
                           pt.name as project_type_name, u.full_name as assigned_to_name
                    FROM project_requests pr
                    LEFT JOIN clients c ON pr.client_id = c.id
                    LEFT JOIN project_types pt ON pr.project_type_id = pt.id
                    LEFT JOIN users u ON pr.assigned_to = u.id
                    WHERE 1=1
                ";
                $params = [];
                
                if (isset($filters['status']) && $filters['status'] !== 'all') {
                    $query .= " AND pr.status = ?";
                    $params[] = $filters['status'];
                }
                
                if (isset($filters['type']) && $filters['type'] !== 'all') {
                    $query .= " AND pt.name = ?";
                    $params[] = $filters['type'];
                }
                
                if (isset($filters['search']) && !empty($filters['search'])) {
                    $query .= " AND (c.full_name LIKE ? OR c.email LIKE ? OR pr.title LIKE ?)";
                    $searchTerm = '%' . $filters['search'] . '%';
                    $params[] = $searchTerm;
                    $params[] = $searchTerm;
                    $params[] = $searchTerm;
                }
                
                $query .= " ORDER BY pr.created_at DESC";
                
                $stmt = $pdo->prepare($query);
                $stmt->execute($params);
                $requests = $stmt->fetchAll();
                
                echo json_encode($requests);
            }
            break;
            
        case 'POST':
            // إنشاء طلب جديد
            $data = getJsonInput();
            
            // التحقق من البيانات المطلوبة
            $required = ['client_name', 'client_email', 'project_type', 'title', 'description'];
            foreach ($required as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    http_response_code(400);
                    echo json_encode(['error' => "الحقل $field مطلوب"]);
                    return;
                }
            }
            
            // التحقق من وجود العميل أو إنشاؤه
            $stmt = $pdo->prepare("SELECT id FROM clients WHERE email = ?");
            $stmt->execute([$data['client_email']]);
            $client = $stmt->fetch();
            
            if ($client) {
                $client_id = $client['id'];
            } else {
                $stmt = $pdo->prepare("
                    INSERT INTO clients (full_name, email, phone, company, created_at) 
                    VALUES (?, ?, ?, ?, NOW())
                ");
                $stmt->execute([
                    $data['client_name'],
                    $data['client_email'],
                    $data['client_phone'] ?? null,
                    $data['company'] ?? null
                ]);
                $client_id = $pdo->lastInsertId();
            }
            
            // الحصول على نوع المشروع
            $stmt = $pdo->prepare("SELECT id FROM project_types WHERE name = ?");
            $stmt->execute([$data['project_type']]);
            $project_type = $stmt->fetch();
            
            if (!$project_type) {
                http_response_code(400);
                echo json_encode(['error' => 'نوع المشروع غير صالح']);
                return;
            }
            
            // إدخال الطلب الجديد
            $stmt = $pdo->prepare("
                INSERT INTO project_requests 
                (client_id, project_type_id, title, description, budget, status, priority, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
            ");
            
            $stmt->execute([
                $client_id,
                $project_type['id'],
                $data['title'],
                $data['description'],
                $data['budget'] ?? null,
                $data['status'] ?? 'pending',
                $data['priority'] ?? 'medium'
            ]);
            
            $request_id = $pdo->lastInsertId();
            
            echo json_encode([
                'success' => true,
                'message' => 'تم إنشاء الطلب بنجاح',
                'request_id' => $request_id
            ]);
            break;
            
        case 'PUT':
            // تحديث طلب موجود
            if ($id <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'معرف الطلب مطلوب']);
                return;
            }
            
            $data = getJsonInput();
            
            $allowed_fields = ['title', 'description', 'budget', 'status', 'priority', 'deadline', 'assigned_to', 'notes'];
            $updates = [];
            $params = [];
            
            foreach ($allowed_fields as $field) {
                if (isset($data[$field])) {
                    $updates[] = "$field = ?";
                    $params[] = $data[$field];
                }
            }
            
            if (empty($updates)) {
                http_response_code(400);
                echo json_encode(['error' => 'لا توجد بيانات للتحديث']);
                return;
            }
            
            $params[] = $id;
            
            $query = "UPDATE project_requests SET " . implode(', ', $updates) . ", updated_at = NOW() WHERE id = ?";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            
            echo json_encode([
                'success' => true,
                'message' => 'تم تحديث الطلب بنجاح'
            ]);
            break;
            
        case 'DELETE':
            // حذف طلب
            if ($id <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'معرف الطلب مطلوب']);
                return;
            }
            
            $stmt = $pdo->prepare("DELETE FROM project_requests WHERE id = ?");
            $stmt->execute([$id]);
            
            echo json_encode([
                'success' => true,
                'message' => 'تم حذف الطلب بنجاح'
            ]);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'طريقة غير مسموحة']);
    }
}

// دالة معالجة الإحصائيات
function handleStats() {
    $pdo = connectDB();
    
    $stats = [];
    
    // إجمالي الطلبات
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM project_requests");
    $stats['total_requests'] = $stmt->fetch()['total'];
    
    // الطلبات قيد الانتظار
    $stmt = $pdo->query("SELECT COUNT(*) as pending FROM project_requests WHERE status = 'pending'");
    $stats['pending_requests'] = $stmt->fetch()['pending'];
    
    // الطلبات المكتملة
    $stmt = $pdo->query("SELECT COUNT(*) as completed FROM project_requests WHERE status = 'completed'");
    $stats['completed_requests'] = $stmt->fetch()['completed'];
    
    // إجمالي الإيرادات
    $stmt = $pdo->query("SELECT SUM(budget) as revenue FROM project_requests WHERE status = 'completed' AND budget IS NOT NULL");
    $stats['total_revenue'] = $stmt->fetch()['revenue'] ?? 0;
    
    // توزيع الطلبات حسب النوع
    $stmt = $pdo->query("
        SELECT pt.name, COUNT(pr.id) as count
        FROM project_requests pr
        JOIN project_types pt ON pr.project_type_id = pt.id
        GROUP BY pt.name
    ");
    $stats['requests_by_type'] = $stmt->fetchAll();
    
    // توزيع الطلبات حسب الشهر
    $stmt = $pdo->query("
        SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
        FROM project_requests
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month
    ");
    $stats['requests_by_month'] = $stmt->fetchAll();
    
    echo json_encode($stats);
}

// دوال معالجة العملاء والمستخدمين (مبسطة)
function handleClients($id, $method) {
    // تطبيق مشابه لدالة handleRequests
    echo json_encode(['message' => 'قيد التطوير']);
}

function handleUsers($id, $method) {
    // تطبيق مشابه لدالة handleRequests
    echo json_encode(['message' => 'قيد التطوير']);
}
?>
[file content end]