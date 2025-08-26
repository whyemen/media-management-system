// إدارة الوسائل والملفات والقضايا

// دالة فتح إدارة الوسائل
function openMediaManagement() {
    showModal('mediaManagementModal');
    
    // تحديث جميع القوائم
    updateFilesList();
    updateIssuesList();
    updatePublishLevelsList();
    updateWebsitesList();
    updateChannelsList();
    
    // تحديث قوائم الكيانات ومستوى النشر في النماذج
    updateEntityOptions();
    updatePublishLevelOptions();
}

// إدارة الملفات
function addNewFile() {
    const fileName = document.getElementById('newFileName').value.trim();
    if (!fileName) {
        showNotification('يرجى إدخال اسم الملف', 'error');
        return;
    }
    
    const files = JSON.parse(localStorage.getItem('files') || '[]');
    
    // التحقق من عدم وجود الملف مسبقاً
    if (files.some(file => file.name === fileName)) {
        showNotification('هذا الملف موجود مسبقاً', 'error');
        return;
    }
    
    files.push({
        id: generateId(),
        name: fileName,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('files', JSON.stringify(files));
    document.getElementById('newFileName').value = '';
    updateFilesList();
    updateFileOptions();
    showNotification('تم إضافة الملف بنجاح');
}

function updateFilesList() {
    const files = JSON.parse(localStorage.getItem('files') || '[]');
    const filesList = document.getElementById('filesList');
    
    if (!filesList) return;
    
    if (files.length === 0) {
        filesList.innerHTML = '<p style="color: #666; text-align: center;">لا توجد ملفات محفوظة</p>';
        return;
    }
    
    filesList.innerHTML = files.map(file => `
        <div class="list-item">
            <div class="list-item-content">
                <strong>${file.name}</strong>
                <small style="color: #666; display: block;">تم الإنشاء: ${formatDate(file.createdAt)}</small>
            </div>
            <div class="list-item-actions">
                <button class="edit-btn" onclick="editFile('${file.id}')">تعديل</button>
                <button class="delete-btn" onclick="deleteFile('${file.id}')">حذف</button>
            </div>
        </div>
    `).join('');
}

function deleteFile(fileId) {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;
    
    let files = JSON.parse(localStorage.getItem('files') || '[]');
    files = files.filter(file => file.id !== fileId);
    localStorage.setItem('files', JSON.stringify(files));
    
    updateFilesList();
    updateFileOptions();
    showNotification('تم حذف الملف');
}

// إدارة القضايا
function addNewIssue() {
    const issueName = document.getElementById('newIssueName').value.trim();
    if (!issueName) {
        showNotification('يرجى إدخال اسم القضية', 'error');
        return;
    }
    
    const issues = JSON.parse(localStorage.getItem('issues') || '[]');
    
    // التحقق من عدم وجود القضية مسبقاً
    if (issues.some(issue => issue.name === issueName)) {
        showNotification('هذه القضية موجودة مسبقاً', 'error');
        return;
    }
    
    issues.push({
        id: generateId(),
        name: issueName,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('issues', JSON.stringify(issues));
    document.getElementById('newIssueName').value = '';
    updateIssuesList();
    updateIssueOptions();
    showNotification('تم إضافة القضية بنجاح');
}

function updateIssuesList() {
    const issues = JSON.parse(localStorage.getItem('issues') || '[]');
    const issuesList = document.getElementById('issuesList');
    
    if (!issuesList) return;
    
    if (issues.length === 0) {
        issuesList.innerHTML = '<p style="color: #666; text-align: center;">لا توجد قضايا محفوظة</p>';
        return;
    }
    
    issuesList.innerHTML = issues.map(issue => `
        <div class="list-item">
            <div class="list-item-content">
                <strong>${issue.name}</strong>
                <small style="color: #666; display: block;">تم الإنشاء: ${formatDate(issue.createdAt)}</small>
            </div>
            <div class="list-item-actions">
                <button class="edit-btn" onclick="editIssue('${issue.id}')">تعديل</button>
                <button class="delete-btn" onclick="deleteIssue('${issue.id}')">حذف</button>
            </div>
        </div>
    `).join('');
}

function deleteIssue(issueId) {
    if (!confirm('هل أنت متأكد من حذف هذه القضية؟')) return;
    
    let issues = JSON.parse(localStorage.getItem('issues') || '[]');
    issues = issues.filter(issue => issue.id !== issueId);
    localStorage.setItem('issues', JSON.stringify(issues));
    
    updateIssuesList();
    updateIssueOptions();
    showNotification('تم حذف القضية');
}

// إدارة مستوى النشر
function addNewPublishLevel() {
    const levelName = document.getElementById('newPublishLevelName').value.trim();
    if (!levelName) {
        showNotification('يرجى إدخال اسم مستوى النشر', 'error');
        return;
    }
    
    const publishLevels = JSON.parse(localStorage.getItem('publishLevels') || '[]');
    
    // التحقق من عدم وجود المستوى مسبقاً
    if (publishLevels.some(level => level.name === levelName)) {
        showNotification('هذا المستوى موجود مسبقاً', 'error');
        return;
    }
    
    publishLevels.push({
        id: generateId(),
        name: levelName,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('publishLevels', JSON.stringify(publishLevels));
    document.getElementById('newPublishLevelName').value = '';
    updatePublishLevelsList();
    updatePublishLevelOptions();
    updateAssignmentPublishLevelOptions();
    showNotification('تم إضافة مستوى النشر بنجاح');
}

function updatePublishLevelsList() {
    const publishLevels = JSON.parse(localStorage.getItem('publishLevels') || '[]');
    const publishLevelsList = document.getElementById('publishLevelsList');
    
    if (!publishLevelsList) return;
    
    if (publishLevels.length === 0) {
        publishLevelsList.innerHTML = '<p style="color: #666; text-align: center;">لا توجد مستويات نشر محفوظة</p>';
        return;
    }
    
    publishLevelsList.innerHTML = publishLevels.map(level => `
        <div class="list-item">
            <div class="list-item-content">
                <strong>${level.name}</strong>
                <small style="color: #666; display: block;">تم الإنشاء: ${formatDate(level.createdAt)}</small>
            </div>
            <div class="list-item-actions">
                <button class="edit-btn" onclick="editPublishLevel('${level.id}')">تعديل</button>
                <button class="delete-btn" onclick="deletePublishLevel('${level.id}')">حذف</button>
            </div>
        </div>
    `).join('');
}

function deletePublishLevel(levelId) {
    if (!confirm('هل أنت متأكد من حذف هذا المستوى؟')) return;
    
    let publishLevels = JSON.parse(localStorage.getItem('publishLevels') || '[]');
    publishLevels = publishLevels.filter(level => level.id !== levelId);
    localStorage.setItem('publishLevels', JSON.stringify(publishLevels));
    
    updatePublishLevelsList();
    updatePublishLevelOptions();
    updateAssignmentPublishLevelOptions();
    showNotification('تم حذف مستوى النشر');
}

// إدارة المواقع
function addNewWebsite2() {
    const websiteName = document.getElementById('newWebsiteName2').value.trim();
    const websiteURL = document.getElementById('newWebsiteURL2').value.trim();
    const websiteEntity = document.getElementById('newWebsiteEntity2').value;
    const websitePublishLevel = document.getElementById('newWebsitePublishLevel2').value;
    
    if (!websiteName || !websiteURL || !websiteEntity || !websitePublishLevel) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    const websites = JSON.parse(localStorage.getItem('websites') || '[]');
    
    // التحقق من عدم وجود الموقع مسبقاً
    if (websites.some(website => website.name === websiteName)) {
        showNotification('هذا الموقع موجود مسبقاً', 'error');
        return;
    }
    
    websites.push({
        id: generateId(),
        name: websiteName,
        url: websiteURL,
        entity: websiteEntity,
        publishLevel: websitePublishLevel,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('websites', JSON.stringify(websites));
    
    // مسح النموذج
    document.getElementById('newWebsiteName2').value = '';
    document.getElementById('newWebsiteURL2').value = '';
    document.getElementById('newWebsiteEntity2').value = '';
    document.getElementById('newWebsitePublishLevel2').value = '';
    
    updateWebsitesList();
    updateWebsiteOptions();
    showNotification('تم إضافة الموقع بنجاح');
}

function updateWebsitesList() {
    const websites = JSON.parse(localStorage.getItem('websites') || '[]');
    const websitesList = document.getElementById('websitesList2');
    
    if (!websitesList) return;
    
    if (websites.length === 0) {
        websitesList.innerHTML = '<p style="color: #666; text-align: center;">لا توجد مواقع محفوظة</p>';
        return;
    }
    
    websitesList.innerHTML = websites.map(website => `
        <div class="list-item">
            <div class="list-item-content">
                <strong>${website.name}</strong>
                <small style="color: #666; display: block;">الكيان: ${website.entity}</small>
                <small style="color: #666; display: block;">مستوى النشر: ${website.publishLevel || 'غير محدد'}</small>
                <small style="color: #666; display: block;">الرابط: <a href="${website.url}" target="_blank">${website.url}</a></small>
            </div>
            <div class="list-item-actions">
                <button class="edit-btn" onclick="editWebsite('${website.id}')">تعديل</button>
                <button class="delete-btn" onclick="deleteWebsite('${website.id}')">حذف</button>
            </div>
        </div>
    `).join('');
}

function deleteWebsite(websiteId) {
    if (!confirm('هل أنت متأكد من حذف هذا الموقع؟')) return;
    
    let websites = JSON.parse(localStorage.getItem('websites') || '[]');
    websites = websites.filter(website => website.id !== websiteId);
    localStorage.setItem('websites', JSON.stringify(websites));
    
    updateWebsitesList();
    updateWebsiteOptions();
    showNotification('تم حذف الموقع');
}

// إدارة القنوات
function addNewChannel2() {
    const channelName = document.getElementById('newChannelName2').value.trim();
    const channelFrequency = document.getElementById('newChannelFrequency2').value.trim();
    const channelEntity = document.getElementById('newChannelEntity2').value;
    const channelPublishLevel = document.getElementById('newChannelPublishLevel2').value;
    
    if (!channelName || !channelFrequency || !channelEntity || !channelPublishLevel) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    const channels = JSON.parse(localStorage.getItem('tvChannels') || '[]');
    
    // التحقق من عدم وجود القناة مسبقاً
    if (channels.some(channel => channel.name === channelName)) {
        showNotification('هذه القناة موجودة مسبقاً', 'error');
        return;
    }
    
    channels.push({
        id: generateId(),
        name: channelName,
        frequency: channelFrequency,
        entity: channelEntity,
        publishLevel: channelPublishLevel,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('tvChannels', JSON.stringify(channels));
    
    // مسح النموذج
    document.getElementById('newChannelName2').value = '';
    document.getElementById('newChannelFrequency2').value = '';
    document.getElementById('newChannelEntity2').value = '';
    document.getElementById('newChannelPublishLevel2').value = '';
    
    updateChannelsList();
    updateTVChannelOptions();
    showNotification('تم إضافة القناة بنجاح');
}

function updateChannelsList() {
    const channels = JSON.parse(localStorage.getItem('tvChannels') || '[]');
    const channelsList = document.getElementById('channelsList2');
    
    if (!channelsList) return;
    
    if (channels.length === 0) {
        channelsList.innerHTML = '<p style="color: #666; text-align: center;">لا توجد قنوات محفوظة</p>';
        return;
    }
    
    channelsList.innerHTML = channels.map(channel => `
        <div class="list-item">
            <div class="list-item-content">
                <strong>${channel.name}</strong>
                <small style="color: #666; display: block;">الكيان: ${channel.entity}</small>
                <small style="color: #666; display: block;">مستوى النشر: ${channel.publishLevel || 'غير محدد'}</small>
                <small style="color: #666; display: block;">التردد: ${channel.frequency}</small>
            </div>
            <div class="list-item-actions">
                <button class="edit-btn" onclick="editChannel('${channel.id}')">تعديل</button>
                <button class="delete-btn" onclick="deleteChannel('${channel.id}')">حذف</button>
            </div>
        </div>
    `).join('');
}

function deleteChannel(channelId) {
    if (!confirm('هل أنت متأكد من حذف هذه القناة؟')) return;
    
    let channels = JSON.parse(localStorage.getItem('tvChannels') || '[]');
    channels = channels.filter(channel => channel.id !== channelId);
    localStorage.setItem('tvChannels', JSON.stringify(channels));
    
    updateChannelsList();
    updateTVChannelOptions();
    showNotification('تم حذف القناة');
}

// دوال تحديث القوائم في النماذج
function updateFileOptions() {
    const files = JSON.parse(localStorage.getItem('files') || '[]');
    const fileSelects = document.querySelectorAll('#socialFile, #webFile, #tvFile');
    
    fileSelects.forEach(select => {
        if (!select) return;
        
        const currentValue = select.value;
        select.innerHTML = '<option value="">اختر الملف</option>';
        
        files.forEach(file => {
            const option = document.createElement('option');
            option.value = file.name;
            option.textContent = file.name;
            select.appendChild(option);
        });
        
        if (currentValue) select.value = currentValue;
    });
}

function updateIssueOptions() {
    const issues = JSON.parse(localStorage.getItem('issues') || '[]');
    const issueSelects = document.querySelectorAll('#socialIssue, #webIssue, #tvIssue');
    
    issueSelects.forEach(select => {
        if (!select) return;
        
        const currentValue = select.value;
        select.innerHTML = '<option value="">اختر القضية</option>';
        
        issues.forEach(issue => {
            const option = document.createElement('option');
            option.value = issue.name;
            option.textContent = issue.name;
            select.appendChild(option);
        });
        
        if (currentValue) select.value = currentValue;
    });
}

function updatePublishLevelOptions() {
    const publishLevels = JSON.parse(localStorage.getItem('publishLevels') || '[]');
    const publishLevelSelects = document.querySelectorAll('#socialPublishLevel, #webPublishLevel, #tvPublishLevel');
    
    publishLevelSelects.forEach(select => {
        if (!select) return;
        
        const currentValue = select.value;
        select.innerHTML = '<option value="">اختر مستوى النشر</option>';
        
        publishLevels.forEach(level => {
            const option = document.createElement('option');
            option.value = level.name;
            option.textContent = level.name;
            select.appendChild(option);
        });
        
        if (currentValue) select.value = currentValue;
    });
}

function updateEntityOptions() {
    const entities = [
        'الحكومة', 'الحوثي', 'الإصلاح', 'الانتقالي', 'مؤتمر صنعاء', 'مؤتمر الساحل',
        'الناصري', 'البعث', 'الاشتراكي', 'حلف حضرموت', 'الإمارات', 'السعودية',
        'التحالف', 'الإعلام المستقل', 'الإعلام الدولي', 'كيان آخر'
    ];
    
    const entitySelects = document.querySelectorAll('#newWebsiteEntity2, #newChannelEntity2');
    
    entitySelects.forEach(select => {
        if (!select) return;
        
        const currentValue = select.value;
        select.innerHTML = '<option value="">اختر الكيان</option>';
        
        entities.forEach(entity => {
            const option = document.createElement('option');
            option.value = entity;
            option.textContent = entity;
            select.appendChild(option);
        });
        
        if (currentValue) select.value = currentValue;
    });
}

function updateWebsiteOptions() {
    const websites = JSON.parse(localStorage.getItem('websites') || '[]');
    const websiteSelects = document.querySelectorAll('#webSite');
    
    websiteSelects.forEach(select => {
        if (!select) return;
        
        const currentValue = select.value;
        select.innerHTML = '<option value="">اختر الموقع</option>';
        
        websites.forEach(website => {
            const option = document.createElement('option');
            option.value = website.name;
            option.textContent = website.name;
            option.dataset.entity = website.entity;
            select.appendChild(option);
        });
        
        if (currentValue) select.value = currentValue;
    });
}

function updateTVChannelOptions() {
    const channels = JSON.parse(localStorage.getItem('tvChannels') || '[]');
    const channelSelects = document.querySelectorAll('#tvChannel');
    
    channelSelects.forEach(select => {
        if (!select) return;
        
        const currentValue = select.value;
        select.innerHTML = '<option value="">اختر القناة</option>';
        
        channels.forEach(channel => {
            const option = document.createElement('option');
            option.value = channel.name;
            option.textContent = channel.name;
            option.dataset.entity = channel.entity;
            select.appendChild(option);
        });
        
        if (currentValue) select.value = currentValue;
    });
}

