// إدارة نماذج الرصد

// بيانات الرصد
let monitoringData = JSON.parse(localStorage.getItem('monitoringData') || '[]');

// دوال عرض نماذج الرصد
function showSocialMonitoringForm() {
    showModal('monitoringModal');
    document.getElementById('monitoringModalTitle').textContent = 'رصد الشبكات الاجتماعية';
    
    const formContent = document.getElementById('monitoringFormContent');
    formContent.innerHTML = `
        <div class="form-group">
            <label>التاريخ:</label>
            <input type="date" id="socialDate" required>
        </div>
        <div class="form-group">
            <label>المنصة:</label>
            <select id="socialPlatform" required>
                <option value="">اختر المنصة</option>
                <option value="فيسبوك">فيسبوك</option>
                <option value="تويتر">تويتر</option>
                <option value="إنستغرام">إنستغرام</option>
                <option value="يوتيوب">يوتيوب</option>
                <option value="تيك توك">تيك توك</option>
                <option value="لينكد إن">لينكد إن</option>
                <option value="سناب شات">سناب شات</option>
                <option value="تيليجرام">تيليجرام</option>
            </select>
        </div>
        <div class="form-group">
            <label>اسم الحساب/الصفحة:</label>
            <input type="text" id="socialAccount" required placeholder="أدخل اسم الحساب أو الصفحة">
        </div>
        <div class="form-group">
            <label>الملف:</label>
            <select id="socialFile">
                <option value="">اختر الملف</option>
            </select>
        </div>
        <div class="form-group">
            <label>القضية:</label>
            <select id="socialIssue">
                <option value="">اختر القضية</option>
            </select>
        </div>
        <div class="form-group">
            <label>المسار:</label>
            <select id="socialPath">
                <option value="">اختر المسار</option>
                <option value="السياسي">السياسي</option>
                <option value="الاجتماعي">الاجتماعي</option>
                <option value="الثقافي">الثقافي</option>
                <option value="الدعائي">الدعائي</option>
                <option value="الدولي">الدولي</option>
            </select>
        </div>
        <div class="form-group">
            <label>المستوى:</label>
            <select id="socialLevel">
                <option value="">اختر المستوى</option>
                <option value="عالي">عالي</option>
                <option value="متوسط">متوسط</option>
                <option value="منخفض">منخفض</option>
            </select>
        </div>
        <div class="form-group">
            <label>نوع المادة:</label>
            <select id="socialMaterialType">
                <option value="">اختر نوع المادة</option>
                <option value="نص">نص</option>
                <option value="صورة">صورة</option>
                <option value="فيديو">فيديو</option>
                <option value="رابط">رابط</option>
                <option value="استطلاع">استطلاع</option>
            </select>
        </div>
        <div class="form-group">
            <label>مستوى النشر:</label>
            <select id="socialPublishLevel">
                <option value="">اختر مستوى النشر</option>
            </select>
        </div>
        <div class="form-group">
            <label>المحتوى/المنشور:</label>
            <textarea id="socialContent" required placeholder="أدخل المحتوى المرصود هنا..."></textarea>
        </div>
        <div class="form-group">
            <label>رابط المنشور:</label>
            <input type="url" id="socialLink" placeholder="https://...">
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" id="socialDailySummary">
                إضافة للخلاصة اليومية
            </label>
        </div>
        <button type="submit" class="submit-btn" onclick="submitSocialMonitoring(event)">حفظ البيانات</button>
    `;
    
    // تحديث القوائم
    updatePublishLevelOptions();
    updateFileOptions();
    updateIssueOptions();
    
    // تعيين التاريخ الحالي
    document.getElementById('socialDate').value = new Date().toISOString().split('T')[0];
}

function showWebMonitoringForm() {
    showModal('monitoringModal');
    document.getElementById('monitoringModalTitle').textContent = 'رصد المواقع الإلكترونية';
    
    const formContent = document.getElementById('monitoringFormContent');
    formContent.innerHTML = `
        <div class="form-group">
            <label>التاريخ:</label>
            <input type="date" id="webDate" required>
        </div>
        <div class="form-group">
            <label>الموقع:</label>
            <select id="webSite" required onchange="updateWebsiteEntity()">
                <option value="">اختر الموقع</option>
            </select>
        </div>
        <div class="form-group">
            <label>الكيان التابع للموقع:</label>
            <input type="text" id="webEntityInput" readonly>
        </div>
        <div class="form-group">
            <label>الملف:</label>
            <select id="webFile">
                <option value="">اختر الملف</option>
            </select>
        </div>
        <div class="form-group">
            <label>القضية:</label>
            <select id="webIssue">
                <option value="">اختر القضية</option>
            </select>
        </div>
        <div class="form-group">
            <label>المسار:</label>
            <select id="webPath">
                <option value="">اختر المسار</option>
                <option value="السياسي">السياسي</option>
                <option value="الاجتماعي">الاجتماعي</option>
                <option value="الثقافي">الثقافي</option>
                <option value="الدعائي">الدعائي</option>
                <option value="الدولي">الدولي</option>
            </select>
        </div>
        <div class="form-group">
            <label>المستوى:</label>
            <select id="webLevel">
                <option value="">اختر المستوى</option>
                <option value="عالي">عالي</option>
                <option value="متوسط">متوسط</option>
                <option value="منخفض">منخفض</option>
            </select>
        </div>
        <div class="form-group">
            <label>نوع المادة:</label>
            <select id="webMaterialType">
                <option value="">اختر نوع المادة</option>
                <option value="خبر">خبر</option>
                <option value="مقال">مقال</option>
                <option value="تقرير">تقرير</option>
                <option value="تحليل">تحليل</option>
                <option value="رأي">رأي</option>
            </select>
        </div>
        <div class="form-group">
            <label>مستوى النشر:</label>
            <select id="webPublishLevel">
                <option value="">اختر مستوى النشر</option>
            </select>
        </div>
        <div class="form-group">
            <label>عنوان المقال/الخبر:</label>
            <input type="text" id="webTitle" required placeholder="أدخل العنوان...">
        </div>
        <div class="form-group">
            <label>ملخص المحتوى:</label>
            <textarea id="webContent" required placeholder="أدخل ملخص المحتوى هنا..."></textarea>
        </div>
        <div class="form-group">
            <label>رابط المقال:</label>
            <input type="url" id="webLink" placeholder="https://...">
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" id="webDailySummary">
                إضافة للخلاصة اليومية
            </label>
        </div>
        <button type="submit" class="submit-btn" onclick="submitWebMonitoring(event)">حفظ البيانات</button>
    `;
    
    // تحديث القوائم
    updatePublishLevelOptions();
    updateFileOptions();
    updateIssueOptions();
    updateWebsiteOptions();
    
    // تعيين التاريخ الحالي
    document.getElementById('webDate').value = new Date().toISOString().split('T')[0];
}

function showTVMonitoringForm() {
    showModal('monitoringModal');
    document.getElementById('monitoringModalTitle').textContent = 'رصد القنوات التلفزيونية';
    
    const formContent = document.getElementById('monitoringFormContent');
    formContent.innerHTML = `
        <div class="form-group">
            <label>التاريخ:</label>
            <input type="date" id="tvDate" required>
        </div>
        <div class="form-group">
            <label>القناة:</label>
            <select id="tvChannel" required onchange="updateTVEntity()">
                <option value="">اختر القناة</option>
            </select>
        </div>
        <div class="form-group">
            <label>الكيان التابع للقناة:</label>
            <input type="text" id="tvEntityInput" readonly>
        </div>
        <div class="form-group">
            <label>الملف:</label>
            <select id="tvFile">
                <option value="">اختر الملف</option>
            </select>
        </div>
        <div class="form-group">
            <label>القضية:</label>
            <select id="tvIssue">
                <option value="">اختر القضية</option>
            </select>
        </div>
        <div class="form-group">
            <label>المسار:</label>
            <select id="tvPath">
                <option value="">اختر المسار</option>
                <option value="السياسي">السياسي</option>
                <option value="الاجتماعي">الاجتماعي</option>
                <option value="الثقافي">الثقافي</option>
                <option value="الدعائي">الدعائي</option>
                <option value="الدولي">الدولي</option>
            </select>
        </div>
        <div class="form-group">
            <label>المستوى:</label>
            <select id="tvLevel">
                <option value="">اختر المستوى</option>
                <option value="عالي">عالي</option>
                <option value="متوسط">متوسط</option>
                <option value="منخفض">منخفض</option>
            </select>
        </div>
        <div class="form-group">
            <label>نوع البرنامج:</label>
            <select id="tvProgramType">
                <option value="">اختر نوع البرنامج</option>
                <option value="نشرة أخبار">نشرة أخبار</option>
                <option value="برنامج حواري">برنامج حواري</option>
                <option value="تقرير إخباري">تقرير إخباري</option>
                <option value="وثائقي">وثائقي</option>
                <option value="مقابلة">مقابلة</option>
            </select>
        </div>
        <div class="form-group">
            <label>اسم البرنامج:</label>
            <input type="text" id="tvProgramName" required placeholder="أدخل اسم البرنامج...">
        </div>
        <div class="form-group">
            <label>وقت البث:</label>
            <input type="time" id="tvTime">
        </div>
        <div class="form-group">
            <label>مستوى النشر:</label>
            <select id="tvPublishLevel">
                <option value="">اختر مستوى النشر</option>
            </select>
        </div>
        <div class="form-group">
            <label>ملخص المحتوى:</label>
            <textarea id="tvContent" required placeholder="أدخل ملخص المحتوى المرصود هنا..."></textarea>
        </div>
        <div class="form-group">
            <label>
                <input type="checkbox" id="tvDailySummary">
                إضافة للخلاصة اليومية
            </label>
        </div>
        <button type="submit" class="submit-btn" onclick="submitTVMonitoring(event)">حفظ البيانات</button>
    `;
    
    // تحديث القوائم
    updatePublishLevelOptions();
    updateFileOptions();
    updateIssueOptions();
    updateTVChannelOptions();
    
    // تعيين التاريخ الحالي
    document.getElementById('tvDate').value = new Date().toISOString().split('T')[0];
}

// دوال حفظ بيانات الرصد
function submitSocialMonitoring(event) {
    event.preventDefault();
    
    const data = {
        id: generateId(),
        type: 'social',
        date: document.getElementById('socialDate').value,
        platform: document.getElementById('socialPlatform').value,
        account: document.getElementById('socialAccount').value,
        file: document.getElementById('socialFile').value,
        issue: document.getElementById('socialIssue').value,
        path: document.getElementById('socialPath').value,
        level: document.getElementById('socialLevel').value,
        materialType: document.getElementById('socialMaterialType').value,
        publishLevel: document.getElementById('socialPublishLevel').value,
        content: document.getElementById('socialContent').value,
        link: document.getElementById('socialLink').value,
        dailySummary: document.getElementById('socialDailySummary').checked,
        timestamp: new Date().toISOString(),
        source: 'راصد الشبكات الاجتماعية',
        priority: document.getElementById('socialLevel').value === 'عالي' ? 'عالي' : 
                 document.getElementById('socialLevel').value === 'متوسط' ? 'متوسط' : 'منخفض'
    };
    
    // التحقق من الحقول المطلوبة
    if (!data.date || !data.platform || !data.account || !data.content) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // حفظ البيانات
    monitoringData.push(data);
    localStorage.setItem('monitoringData', JSON.stringify(monitoringData));
    
    closeModal('monitoringModal');
    showNotification('تم حفظ بيانات الرصد بنجاح');
    
    // تحديث الإحصائيات
    updateStats();
}

function submitWebMonitoring(event) {
    event.preventDefault();
    
    const data = {
        id: generateId(),
        type: 'web',
        date: document.getElementById('webDate').value,
        site: document.getElementById('webSite').value,
        entity: document.getElementById('webEntityInput').value,
        file: document.getElementById('webFile').value,
        issue: document.getElementById('webIssue').value,
        path: document.getElementById('webPath').value,
        level: document.getElementById('webLevel').value,
        materialType: document.getElementById('webMaterialType').value,
        publishLevel: document.getElementById('webPublishLevel').value,
        title: document.getElementById('webTitle').value,
        content: document.getElementById('webContent').value,
        link: document.getElementById('webLink').value,
        dailySummary: document.getElementById('webDailySummary').checked,
        timestamp: new Date().toISOString(),
        source: 'راصد المواقع الإلكترونية',
        priority: document.getElementById('webLevel').value === 'عالي' ? 'عالي' : 
                 document.getElementById('webLevel').value === 'متوسط' ? 'متوسط' : 'منخفض'
    };
    
    // التحقق من الحقول المطلوبة
    if (!data.date || !data.site || !data.title || !data.content) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // حفظ البيانات
    monitoringData.push(data);
    localStorage.setItem('monitoringData', JSON.stringify(monitoringData));
    
    closeModal('monitoringModal');
    showNotification('تم حفظ بيانات الرصد بنجاح');
    
    // تحديث الإحصائيات
    updateStats();
}

function submitTVMonitoring(event) {
    event.preventDefault();
    
    const data = {
        id: generateId(),
        type: 'tv',
        date: document.getElementById('tvDate').value,
        channel: document.getElementById('tvChannel').value,
        entity: document.getElementById('tvEntityInput').value,
        file: document.getElementById('tvFile').value,
        issue: document.getElementById('tvIssue').value,
        path: document.getElementById('tvPath').value,
        level: document.getElementById('tvLevel').value,
        programType: document.getElementById('tvProgramType').value,
        programName: document.getElementById('tvProgramName').value,
        time: document.getElementById('tvTime').value,
        publishLevel: document.getElementById('tvPublishLevel').value,
        content: document.getElementById('tvContent').value,
        dailySummary: document.getElementById('tvDailySummary').checked,
        timestamp: new Date().toISOString(),
        source: 'راصد القنوات التلفزيونية',
        priority: document.getElementById('tvLevel').value === 'عالي' ? 'عالي' : 
                 document.getElementById('tvLevel').value === 'متوسط' ? 'متوسط' : 'منخفض'
    };
    
    // التحقق من الحقول المطلوبة
    if (!data.date || !data.channel || !data.programName || !data.content) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // حفظ البيانات
    monitoringData.push(data);
    localStorage.setItem('monitoringData', JSON.stringify(monitoringData));
    
    closeModal('monitoringModal');
    showNotification('تم حفظ بيانات الرصد بنجاح');
    
    // تحديث الإحصائيات
    updateStats();
}

// دوال تحديث الكيانات
function updateWebsiteEntity() {
    const siteSelect = document.getElementById('webSite');
    const entityInput = document.getElementById('webEntityInput');
    
    if (siteSelect && entityInput) {
        const selectedSite = siteSelect.value;
        entityInput.value = websiteEntities[selectedSite] || '';
    }
}

function updateTVEntity() {
    const channelSelect = document.getElementById('tvChannel');
    const entityInput = document.getElementById('tvEntityInput');
    
    if (channelSelect && entityInput) {
        const selectedChannel = channelSelect.value;
        entityInput.value = tvEntities[selectedChannel] || '';
    }
}

// دوال عرض التقارير
function showMySocialReports() {
    const socialReports = monitoringData.filter(item => item.type === 'social');
    showReportsList(socialReports, 'تقارير الشبكات الاجتماعية');
}

function showMyWebReports() {
    const webReports = monitoringData.filter(item => item.type === 'web');
    showReportsList(webReports, 'تقارير المواقع الإلكترونية');
}

function showMyTVReports() {
    const tvReports = monitoringData.filter(item => item.type === 'tv');
    showReportsList(tvReports, 'تقارير القنوات التلفزيونية');
}

function showReportsList(reports, title) {
    if (reports.length === 0) {
        showNotification('لا توجد تقارير محفوظة');
        return;
    }
    
    // يمكن تطوير واجهة عرض التقارير هنا
    alert(`${title}: ${reports.length} تقرير محفوظ`);
}

// دالة تحميل بيانات الرصد للمحلل
function loadMonitoringData() {
    // تحديث البيانات من localStorage
    monitoringData = JSON.parse(localStorage.getItem('monitoringData') || '[]');
    
    // يمكن إضافة منطق عرض البيانات للمحلل هنا
    console.log(`تم تحميل ${monitoringData.length} عنصر للتحليل`);
}

