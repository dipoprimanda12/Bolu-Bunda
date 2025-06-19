// === Toggle Keranjang ===
function toggleCart() {
  document.querySelector(".cart-box").classList.toggle("active");
}

let cart = [];

// Tambah produk ke keranjang
document.querySelectorAll(".add-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".produk-card");
    const id = card.dataset.id;
    const nama = card.dataset.nama;
    const harga = parseInt(card.dataset.harga);

    const existingItem = cart.find((item) => item.id === id);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({ id, nama, harga, qty: 1 });
    }

    updateCart();
  });
});

// Update isi keranjang
function updateCart() {
  const items = document.getElementById("cart-items");
  const badge = document.getElementById("cart-badge");
  const total = document.getElementById("total-price");

  items.innerHTML = "";
  let sum = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nama} - Rp${(item.harga * item.qty).toLocaleString("id-ID")}
      <br>
      <button onclick="changeQty('${item.id}', -1)">-</button>
      <span> ${item.qty} </span>
      <button onclick="changeQty('${item.id}', 1)">+</button>
      <button onclick="removeItem('${item.id}')">🗑️</button>
    `;
    items.appendChild(li);
    sum += item.harga * item.qty;
  });

  badge.textContent = cart.length;
  total.textContent = `Rp${sum.toLocaleString("id-ID")}`;
}

// Ubah jumlah item
function changeQty(id, amount) {
  const item = cart.find((item) => item.id === id);
  if (!item) return;

  item.qty += amount;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }

  updateCart();
}

// Hapus item
function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
}

// === Checkout ke WhatsApp ===
document
  .getElementById("checkout-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const nama = document.getElementById("name").value.trim();
    const no = document.getElementById("phone").value.trim();
    const catatan = document.getElementById("note").value.trim();
    const pesan = cart
      .map(
        (item) =>
          `- ${item.nama} x${item.qty} (Rp${(
            item.harga * item.qty
          ).toLocaleString("id-ID")})`
      )
      .join("\n");
    const total = cart.reduce((acc, item) => acc + item.harga * item.qty, 0);

    const teks = `Halo, saya mau pesan:\n${pesan}\nTotal: Rp${total.toLocaleString(
      "id-ID"
    )}\n\nNama: ${nama}\nHP: ${no}\nCatatan: ${catatan}`;

    window.open(`https://wa.me/6282278265310?text=${encodeURIComponent(teks)}`);
  });

// === Rating Bintang ===
const stars = document.querySelectorAll("#rating-input span");
const ratingInput = document.getElementById("rating");

stars.forEach((star) => {
  star.addEventListener("click", () => {
    const val = parseInt(star.getAttribute("data-value"));
    ratingInput.value = val;

    stars.forEach((s, i) => {
      s.classList.toggle("active", i < val);
    });
  });
});

// === Simpan Komentar ke localStorage ===
document
  .getElementById("form-komentar")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const nama = document.getElementById("nama").value.trim();
    const pesan = document.getElementById("pesan").value.trim();
    const rating = parseInt(document.getElementById("rating").value);

    if (nama && pesan && rating > 0) {
      const komentarBaru = { nama, pesan, rating };
      const komentarList =
        JSON.parse(localStorage.getItem("komentarList")) || [];
      komentarList.push(komentarBaru);
      localStorage.setItem("komentarList", JSON.stringify(komentarList));

      this.reset();
      ratingInput.value = 0;
      stars.forEach((s) => s.classList.remove("active"));
      loadKomentar();
    } else {
      alert("Silakan isi nama, komentar, dan rating.");
    }
  });

// === Tampilkan Komentar ===
function loadKomentar() {
  const komentarList = JSON.parse(localStorage.getItem("komentarList")) || [];
  const list = document.getElementById("list-komentar");
  list.innerHTML = "";

  const last5 = komentarList.slice(-5).reverse();
  last5.forEach((k) => {
    const div = document.createElement("div");
    div.innerHTML = `<p><strong>${k.nama}</strong> (${k.rating}⭐): ${k.pesan}</p>`;
    list.appendChild(div);
  });
}

// === Animasi Scroll Produk dan Elemen Lain ===
function animateOnScroll() {
  const items = document.querySelectorAll(".fade-in, .produk-card");
  const trigger = window.innerHeight * 0.85;

  items.forEach((item) => {
    const top = item.getBoundingClientRect().top;
    if (top < trigger) {
      item.classList.add("visible", "active");
    }
  });
}

window.addEventListener("scroll", animateOnScroll);
window.addEventListener("load", animateOnScroll);

// === Observer untuk Fade Section ===
const faders = document.querySelectorAll(".fade-section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  },
  { threshold: 0.2 }
);
faders.forEach((el) => observer.observe(el));

// === Slideshow Hero ===
let slideIndex = 0;
const slides = document.querySelectorAll(".slide");

function showSlides() {
  slides.forEach((slide) => slide.classList.remove("active"));
  slideIndex = (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add("active");
}
setInterval(showSlides, 4000);

// === Efek Opening dengan Mesin Ketik ===
document.addEventListener("DOMContentLoaded", function () {
  const textEl = document.querySelector(".typewriter-text");
  const main = document.getElementById("main-content");
  const opening = document.getElementById("opening");

  const text = "Selamat Datang Di Website Bolu-Bunda";
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      textEl.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    } else {
      setTimeout(() => {
        opening.style.display = "none";
        main.style.display = "block";
        animateOnScroll();
      }, 1000);
    }
  }

  typeWriter();
  loadKomentar();
});

// === Background Partikel ===
const canvas = document.getElementById("particle-background");
if (canvas) {
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 1,
      dy: (Math.random() - 0.5) * 1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    }
    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
