function showSection(sectionId) {
    // Tüm bölümleri seç ve gizle
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // İlgili bölümü görünür yap
    const activeSection = document.getElementById(sectionId);
    activeSection.classList.add('active');
}







function toggleBox(box) {
    // Eğer kutu zaten açık değilse, onu aç
    if (!box.classList.contains('open')) {
        box.classList.add('open');
    } else {
        // Eğer kutu açıksa, kapat
        box.classList.remove('open');
    }
}





// Sayfa yüklendiğinde içerikleri geri yükle
document.addEventListener('DOMContentLoaded', function () {
    console.log("Sayfa yüklendi, içerikler yükleniyor...");
    loadContent();
});




function saveContent(page, title, description) {
    const contentData = JSON.parse(localStorage.getItem('contentData')) || {};
    if (!contentData[page]) {
        contentData[page] = [];
    }
    contentData[page].push({ title, description });
    
    // Home sayfasındaki box'ı da kaydet
    if (!contentData['Home']) {
        contentData['Home'] = [];
   }
    contentData['Home'].push({ title: title, link: page });
    
    localStorage.setItem('contentData', JSON.stringify(contentData));
    console.log("Veriler localStorage'a kaydedildi:", contentData);
    // Home box'a tıklama olayı ekle
homeBox.setAttribute('onclick', `gotoSectionAndContent('${link}', '${title}')`);
}

function loadContent() {
    const contentData = JSON.parse(localStorage.getItem('contentData')) || {};
    console.log("LocalStorage'dan alınan içerik:", contentData);

    for (const [page, items] of Object.entries(contentData)) {
        if (page !== 'Home') {
            const targetSection = document.querySelector(`#${page}`);
            if (targetSection) {
                items.forEach(({ title, description }) => {
                    const newBox = document.createElement('div');
                    newBox.classList.add('box');
                    newBox.setAttribute('onclick', 'toggleBox(this)');
                    newBox.setAttribute('data-content-title', title);

                    // Kullanıcının admin olup olmadığını kontrol edelim
                    const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';

                    newBox.innerHTML = `
                        <h3>${title}</h3>
                        <p>${description}</p>
                        ${isLoggedIn ? '<button class="delete-btn">Sil</button>' : ''}
                    `;

                    // Delete butonu için event listener ekleyelim (sadece adminlerde)
                    if (isLoggedIn) {
                        newBox.querySelector('.delete-btn').addEventListener('click', function (event) {
                            event.stopPropagation();
                            deleteBox(newBox, page);
                        });
                    }

                    targetSection.appendChild(newBox);
                });
            } else {
                console.warn(`Hedef bölüm bulunamadı: ${page}`);
            }
        } else {
            const homeSection = document.querySelector('#Home');
            if (homeSection) {
                items.forEach(({ title, link }) => {
                    const homeBox = document.createElement('div');
                    homeBox.classList.add('box');
                    homeBox.classList.add('home-box');
                    homeBox.innerHTML = `
                        <h4>${title}</h4>
                    `;
                    // Home box'a tıkladığınızda ilgili section'a ve içeriğe git
                    homeBox.setAttribute('onclick', `gotoSectionAndContent('${link}', '${title}')`);
                    homeSection.insertBefore(homeBox, homeSection.firstChild);
                });
            }
        }
    }
}


function gotoSectionAndContent(sectionId, contentTitle) {
    // Belirtilen section'a git
    const section = document.querySelector(`#${sectionId}`);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth' // Smooth scroll için
        });

        // Section içindeki content box'ını bul
        const contentBox = section.querySelector(`[data-content-title="${contentTitle}"]`);
        
        if (contentBox) {
            // Content box'ı aç
            contentBox.classList.toggle('open');
            console.log(`${contentTitle} içeriği ${contentBox.classList.contains('open') ? 'açıldı' : 'kapanıyor'}.`);
        } else {
            console.warn(`${sectionId} section'unda ${contentTitle} içeriği bulunamadı.`);
        }
    } else {
        console.error(`${sectionId} section'u bulunamadı.`);
    }
}








// Kutu tıklama olayını işleyen fonksiyon
function toggleBox(box) {
    box.classList.toggle('open');
}











