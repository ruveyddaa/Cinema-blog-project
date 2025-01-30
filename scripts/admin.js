document.addEventListener('DOMContentLoaded', function () {
    const loggedIn = sessionStorage.getItem('loggedIn');

    fetch('index.html')
  .then(response => response.text())
  .then(data => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data;

    const series = tempDiv.querySelector('#series');
    const movie = tempDiv.querySelector('#movie');
    const award = tempDiv.querySelector('#awards');

    const adminContent = document.getElementById('admin-content');

    if (series) adminContent.appendChild(series.cloneNode(true));
    if (movie) adminContent.appendChild(movie.cloneNode(true));
    if (award) adminContent.appendChild(award.cloneNode(true));
  });

});




// Form gönderim olayı
document.getElementById('content-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Sayfanın yenilenmesini engelle

    
   

    // Formdan alınan başlık, açıklama ve hedef sayfa bilgileri
    const title = document.getElementById('content-title').value;
    const description = document.getElementById('content-description').value;
    const selectedPage = document.getElementById('content-page').value;

    // Hedef bölümü seç
    const targetSection = document.querySelector(`#${selectedPage}`);
    if (!targetSection) {
        console.error("Hedef bölüm bulunamadı. Seçim hatalı.");
        return;
    }

     

    // Yeni bir kutu (box) oluştur
    const newBox = document.createElement('div');
    newBox.classList.add('box');
    newBox.classList.add('full-box'); 
    newBox.setAttribute('onclick', 'toggleBox(this)');
    const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
    newBox.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        ${isLoggedIn ? '<button class="delete-btn">Sil</button>' : ''}
    `;
    if (isLoggedIn) {
        newBox.querySelector('.delete-btn').addEventListener('click', function (event) {
            event.stopPropagation();
            deleteBox(newBox, page);
        });
    }

    // Formu sıfırla
    document.getElementById('content-form').reset();


    // Yeni kutuyu hedef bölüme ekle
    targetSection.appendChild(newBox);

     // Home section'unda kısa kutu oluştur
     const homeSection = document.querySelector('#Home');
     if (homeSection) {
         const homeBox = document.createElement('div');
         homeBox.classList.add('box');
         homeBox.classList.add('home-box'); // Küçük box için ek sınıf
         homeBox.innerHTML = `
             <h4>${title}</h4>
             
         `;
         // Home box'a tıklama olayı ekle
         homeBox.setAttribute('onclick', `location.href='#${selectedPage}'`);
         
         // Home section'un en başına ekleme
         homeSection.insertBefore(homeBox, homeSection.firstChild);
     }

    // İçeriği localStorage'a kaydet
    saveContent(selectedPage, title, description);

   

    // Kullanıcıya bilgilendirme mesajı
    console.log(`${title} başarıyla ${selectedPage} bölümüne eklendi.`);
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

                    
                    const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';

                    newBox.innerHTML = `
                        <h3>${title}</h3>
                        <p>${description}</p>
                        ${isLoggedIn ? '<button class="delete-btn">Sil</button>' : ''}
                    `;

                    
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
                    
                    homeBox.setAttribute('onclick', `gotoSectionAndContent('${link}', '${title}')`);
                    homeSection.insertBefore(homeBox, homeSection.firstChild);
                });
            }
        }
    }
}



function gotoSectionAndContent(sectionId, contentTitle) {
   
    const section = document.querySelector(`#${sectionId}`);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth' 
        });

      
        const contentBox = section.querySelector(`[data-content-title="${contentTitle}"]`);
        
        if (contentBox) {
           
            contentBox.classList.toggle('open');
            console.log(`${contentTitle} içeriği ${contentBox.classList.contains('open') ? 'açıldı' : 'kapanıyor'}.`);
        } else {
            console.warn(`${sectionId} section'unda ${contentTitle} içeriği bulunamadı.`);
        }
    } else {
        console.error(`${sectionId} section'u bulunamadı.`);
    }
}





// kutuyo yıklanabilir yapar
function toggleBox(box) {
    box.classList.toggle('open');
}

 

function deleteBox(box, page) {
    const confirmDelete = confirm("Bu içeriği silmek istediğinizden emin misiniz?");
    if (confirmDelete) {
        const title = box.querySelector('h3').innerText;
        box.remove();

        // Home section'daki ilgili box'ı da sil
        const homeBoxes = document.querySelectorAll('.home-box');
        homeBoxes.forEach(homeBox => {
            if (homeBox.querySelector('h4').innerText === title) {
                homeBox.remove();
            }
        });

        // localStorage'dan ilgili verileri sil
        const contentData = JSON.parse(localStorage.getItem('contentData')) || {};

        // Belirtilen page'deki içeriği filtrele
        if (contentData[page]) {
            contentData[page] = contentData[page].filter(item => item.title !== title);
        }

        // Home bölümünden de ilgili içeriği filtrele
        if (contentData['Home']) {
            contentData['Home'] = contentData['Home'].filter(item => item.title !== title);
        }

        // localStorage'ı güncelleyelim
        localStorage.setItem('contentData', JSON.stringify(contentData));
        console.log(`${title} başlıklı içerik tamamen silindi.`);
    }
}


// localStorage.clear();   // lazım olduğında kullanmak için 


