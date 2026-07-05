// Andalousia starter script (corrigé)
document.addEventListener("DOMContentLoaded", () => {

  const searchBtn = document.getElementById("searchToggleBtn");
  const searchBar = document.getElementById("searchBar");
  const searchInput = document.getElementById("searchInput");

  const cartBtn = document.getElementById("cartBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartCloseBtn = document.getElementById("cartCloseBtn");
  const cartItemsEl = document.getElementById("cartItems");
  const cartCountEl = document.getElementById("cartCount");
  const cartTotalEl = document.getElementById("cartTotal");

  const wishlistBtn = document.getElementById("wishlistBtn");
  const favoritesDrawer = document.getElementById("favoritesDrawer");
  const favoritesCloseBtn = document.getElementById("favoritesCloseBtn");
  const favoritesItemsEl = document.getElementById("favoritesItems");
  const favoritesCountEl = document.getElementById("favoritesCount");

  const overlay = document.getElementById("overlay");

  const productsGrid = document.getElementById("productsGrid");
  const resultsCount = document.getElementById("resultsCount");

  // ==========================
  // DONNÉES PRODUITS
  // ==========================

  const products = [
    { id: 1, name: "Bol émaillé", origin: "Fès", categorie: "ceramique", price: 320 ,image:"image/BOL.jpeg"},
    { id: 2, name: "Tajine traditionnel", origin: "Safi", categorie: "ceramique", price: 450 , image:"image/tagin2.jpg" },
    { id: 3, name: "Babouches artisanales", origin: "Marrakech", categorie: "mode", price: 280 , image:"image/babouche.jpg"  },
    { id: 4, name: "Lanterne marocaine", origin: "Chefchaouen", categorie: "mode", price: 390 , image:"image/lanterne.jpg" },
  ];

  // état
  let filteredProducts = [...products];
  let cart = [];
  let favorites = [];

  // ==========================
  // OUVERTURE / FERMETURE
  // ==========================

  function open(element) {
    if (element) element.classList.add("open");
    if (overlay) overlay.classList.add("open");
  }

  function closeAll() {
    cartDrawer?.classList.remove("open");
    favoritesDrawer?.classList.remove("open");
    searchBar?.classList.remove("open");
    overlay?.classList.remove("open");
  }

  // ==========================
  // RECHERCHE
  // ==========================

  searchBtn?.addEventListener("click", () => {
    searchBar?.classList.toggle("open");
    searchInput?.focus();
  });

  searchInput?.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    filteredProducts = products.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.origin.toLowerCase().includes(query) ||
      p.categorie.toLowerCase().includes(query)
    );
    renderProducts(filteredProducts);
  });

  // Filtres par catégorie (boutons avec data-categorie="ceramique" | "mode" | "all")
  document.querySelectorAll("[data-categorie]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.categorie;
      filteredProducts = cat === "all" ? [...products] : products.filter((p) => p.categorie === cat);
      renderProducts(filteredProducts);
    });
  });

  // ==========================
  // PANIER
  // ==========================

  cartBtn?.addEventListener("click", () => {
    open(cartDrawer);
  });

  window.addToCart = function (id) {
    const existing = cart.find((i) => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      const product = products.find((p) => p.id === id);
      if (!product) return;
      cart.push({ ...product, qty: 1 });
    }
    renderCart();
    open(cartDrawer);
  };

  window.removeFromCart = function (id) {
    cart = cart.filter((i) => i.id !== id);
    renderCart();
  };

  function renderCart() {
    if (!cartItemsEl) return;

    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    if (cartCountEl) cartCountEl.textContent = totalQty;

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `<div class="empty-products">Votre panier est vide.</div>`;
    } else {
      cartItemsEl.innerHTML = cart
        .map(
          (item) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.name}${item.qty > 1 ? ` × ${item.qty}` : ""}</h4>
            <p>${item.origin}</p>
            <strong>${item.price * item.qty} MAD</strong>
          </div>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Retirer</button>
        </div>
      `
        )
        .join("");
    }

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    if (cartTotalEl) cartTotalEl.textContent = `${total} MAD`;
  }

  // ==========================
  // FAVORIS
  // ==========================

  wishlistBtn?.addEventListener("click", () => {
    open(favoritesDrawer);
  });

  window.toggleFavorite = function (id) {
    const exists = favorites.find((p) => p.id === id);
    if (exists) {
      favorites = favorites.filter((p) => p.id !== id);
    } else {
      const product = products.find((p) => p.id === id);
      if (product) favorites.push(product);
    }
    renderFavorites();
    renderProducts(filteredProducts); // met à jour l'état du cœur sur les cartes
  };

  function renderFavorites() {
    if (!favoritesItemsEl) return;

    if (favoritesCountEl) favoritesCountEl.textContent = favorites.length;

    if (favorites.length === 0) {
      favoritesItemsEl.innerHTML = `<div class="empty-products">Aucun favori pour le moment.</div>`;
    } else {
      favoritesItemsEl.innerHTML = favorites
        .map(
          (item) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>${item.origin}</p>
            <strong>${item.price} MAD</strong>
          </div>
          <button class="remove-btn" onclick="toggleFavorite(${item.id})">Retirer</button>
        </div>
      `
        )
        .join("");
    }
  }

  // ==========================
  // FERMETURE
  // ==========================

  cartCloseBtn?.addEventListener("click", closeAll);
  favoritesCloseBtn?.addEventListener("click", closeAll);
  overlay?.addEventListener("click", closeAll);

  // ==========================
  // PRODUITS (rendu)
  // ==========================

  function renderProducts(list = filteredProducts) {
    if (!productsGrid) return;

    if (resultsCount) resultsCount.textContent = `${list.length} produit${list.length > 1 ? "s" : ""}`;

    if (list.length === 0) {
      productsGrid.innerHTML = `<div class="empty-products">Aucun produit trouvé.</div>`;
      return;
    }

    productsGrid.innerHTML = list
      .map((product) => {
        const isFav = favorites.some((f) => f.id === product.id);
        return `
        <div class="product-card">
          <div class="product-image">
            ${
              product.image
                ? `<img src="${product.image}" alt="${product.name}">`
                : `<div class="product-image-placeholder"></div>`
            }
            ${product.badge ? `<span class="badge">${product.badge}</span>` : ""}
          </div>

          <div class="product-content">
            <h3>${product.name}</h3>
            <p>${product.origin}</p>
            <strong>${product.price} MAD</strong>

            <div class="product-actions">
              <button
                class="wishlist-btn ${isFav ? "active" : ""}"
                onclick="toggleFavorite(${product.id})">
                ❤️
              </button>
              <button
                class="cart-btn"
                onclick="addToCart(${product.id})">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  // ==========================
  // INITIALISATION
  // ==========================

  renderProducts(filteredProducts);
  renderCart();
  renderFavorites();
});
