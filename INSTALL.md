# دليل تثبيت نظام إدارة الرصد الإعلامي

## متطلبات النظام

### الحد الأدنى للمتطلبات:
- خادم ويب (Apache 2.4+ أو Nginx 1.18+)
- دعم HTML5 و CSS3 و JavaScript ES6
- مساحة تخزين: 50 ميجابايت على الأقل
- ذاكرة: 512 ميجابايت RAM على الأقل

### المتطلبات الموصى بها:
- خادم ويب مع دعم HTTPS
- شهادة SSL صالحة
- نسخ احتياطية منتظمة
- مراقبة الخادم

## خطوات التثبيت

### 1. تحضير الخادم

#### لخوادم Apache:
```bash
# تأكد من تفعيل الوحدات المطلوبة
sudo a2enmod rewrite
sudo a2enmod deflate
sudo a2enmod expires
sudo a2enmod headers
sudo systemctl restart apache2
```

#### لخوادم Nginx:
```nginx
# إضافة إعدادات في ملف التكوين
location / {
    try_files $uri $uri/ /index.html;
}

location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1M;
    add_header Cache-Control "public, immutable";
}
```

### 2. رفع الملفات

1. **ضغط الملفات:**
   ```bash
   zip -r media-monitoring-system.zip *
   ```

2. **رفع الملفات للخادم:**
   - استخدم FTP/SFTP أو لوحة تحكم الاستضافة
   - ارفع جميع الملفات إلى المجلد الجذر للموقع
   - تأكد من الحفاظ على هيكل المجلدات

3. **فك الضغط على الخادم:**
   ```bash
   unzip media-monitoring-system.zip
   ```

### 3. ضبط الصلاحيات

```bash
# ضبط صلاحيات الملفات
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;

# ضبط صلاحيات خاصة لملفات معينة
chmod 644 .htaccess
chmod 644 robots.txt
```

### 4. اختبار التثبيت

1. **افتح الموقع في المتصفح:**
   ```
   https://yoursite.com
   ```

2. **اختبر تسجيل الدخول:**
   - اسم المستخدم: `director`
   - كلمة المرور: `123`

3. **تحقق من الوظائف الأساسية:**
   - تسجيل الدخول والخروج
   - إضافة بيانات رصد
   - إنشاء تكليف
   - إدارة الوسائل

## الإعدادات الإضافية

### 1. تفعيل HTTPS

```apache
# في ملف .htaccess
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 2. تحسين الأداء

#### ضغط الملفات:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

#### التخزين المؤقت:
```apache
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 3. الأمان

#### منع الوصول للملفات الحساسة:
```apache
<Files "README.md">
    Order allow,deny
    Deny from all
</Files>

<Files ".htaccess">
    Order allow,deny
    Deny from all
</Files>
```

#### إعدادات أمان إضافية:
```apache
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

## النسخ الاحتياطية

### 1. نسخ احتياطية للملفات:
```bash
# إنشاء نسخة احتياطية يومية
tar -czf backup-$(date +%Y%m%d).tar.gz /path/to/website/
```

### 2. نسخ احتياطية للبيانات:
- البيانات محفوظة في localStorage للمتصفح
- يُنصح بتصدير البيانات دورياً من واجهة الإدارة

## استكشاف الأخطاء

### مشاكل شائعة:

#### 1. الموقع لا يعمل:
- تحقق من صلاحيات الملفات
- تأكد من وجود ملف index.html
- راجع سجلات الخادم

#### 2. ملفات CSS/JS لا تعمل:
- تحقق من مسارات الملفات
- تأكد من صلاحيات القراءة
- تحقق من إعدادات MIME

#### 3. مشاكل تسجيل الدخول:
- تأكد من تفعيل JavaScript
- تحقق من دعم localStorage
- امسح ذاكرة التخزين المؤقت

### سجلات الأخطاء:

#### Apache:
```bash
tail -f /var/log/apache2/error.log
```

#### Nginx:
```bash
tail -f /var/log/nginx/error.log
```

## الصيانة

### 1. تحديثات دورية:
- راجع الملفات للتحديثات الأمنية
- احدث كلمات المرور الافتراضية
- راجع سجلات الوصول

### 2. مراقبة الأداء:
- راقب استخدام الموارد
- تحقق من سرعة التحميل
- راجع تقارير الأخطاء

### 3. أمان النظام:
- غيّر كلمات المرور الافتراضية
- راجع صلاحيات المستخدمين
- فعّل المصادقة الثنائية إذا أمكن

## الدعم الفني

للحصول على المساعدة:
1. راجع ملف README.md
2. تحقق من سجلات الأخطاء
3. تواصل مع فريق التطوير

---

**ملاحظة مهمة:** تأكد من تغيير كلمات المرور الافتراضية قبل النشر في بيئة الإنتاج!

