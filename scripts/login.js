document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Sayfanın yenilenmesini engelle

    // Kullanıcı adı ve şifreyi al
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Basit doğrulama (burada sadece örnek için sabit bir kullanıcı adı ve şifre kontrolü yapıyoruz)
    if (username === 'admin' && password === 'admin123') {
        // Giriş başarılı, sessionStorage'da admin olarak kaydet
        sessionStorage.setItem('loggedIn', 'true');
        alert('Başarıyla giriş yaptınız!');
        window.location.href = 'admin.html'; // Admin sayfasına yönlendir
    } else {
        alert('Geçersiz kullanıcı adı veya şifre!');
    }
});
