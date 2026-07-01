
  const products = [
    { id:1, name:"Bol émaillé de Fès", origin:"Fès, Maroc", price:32, badge:"Nouveau", gradient:"linear-gradient(155deg,#4C8F80,#2F6F62 55%,#1F3A3F)" },
    { id:2, name:"Assiette zellige bleu nuit", origin:"Fès, Maroc", price:28, badge:null, gradient:"linear-gradient(155deg,#7A2E38,#2F6F62 60%,#16262A)" },
    { id:3, name:"Tapis berbère (mini)", origin:"Atlas, Maroc", price:145, badge:"Pièce unique", gradient:"linear-gradient(155deg,#D9A441,#C1622D 55%,#16262A)" },
    { id:4, name:"Coussin brodé fil d'or", origin:"Séville, Espagne", price:45, badge:null, gradient:"linear-gradient(155deg,#C1622D,#7A2E38 55%,#16262A)" },
    { id:5, name:"Sac en cuir tanné", origin:"Marrakech, Maroc", price:89, badge:null, gradient:"linear-gradient(155deg,#8A5A34,#4C3A24 55%,#16262A)" },
    { id:6, name:"Babouches en cuir", origin:"Marrakech, Maroc", price:38, badge:"Best-seller", gradient:"linear-gradient(155deg,#D9A441,#8A5A34 55%,#16262A)" },
    { id:7, name:"Lanterne ajourée", origin:"Chefchaouen, Maroc", price:65, badge:null, gradient:"linear-gradient(155deg,#4C8F80,#1F3A3F 60%,#0F1C1F)" },
    { id:8, name:"Théière gravée", origin:"Fès, Maroc", price:55, badge:null, gradient:"linear-gradient(155deg,#C9BCA0,#8A7C68 55%,#16262A)" },
  ];

  let cart = [];

  function renderProducts(){
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(p => `
      <div class="product-card">
        <div class="arch-frame product-media" style="background:${p.gradient}">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
        </div>
        <div class="product-name">${p.name}</div>
        <div class="product-origin">${p.origin}</div>
        <div class="product-row">
          <span class="product-price">${p.price} €</span>
          <button class="add-btn" id="add-${p.id}" onclick="addToCart(${p.id})">+</button>
        </div>
      </div>
    `).join('');
  }

  function addToCart(id){
    const existing = cart.find(i => i.id === id);
    if (existing) { existing.qty += 1; }
    else { const p = products.find(pr => pr.id === id); cart.push({ ...p, qty:1 }); }
    const btn = document.getElementById('add-'+id);
    btn.classList.add('added');
    btn.textContent = '✓';
    setTimeout(() => { btn.classList.remove('added'); btn.textContent='+'; }, 700);
    renderCart();
    openCart();
  }

  function removeFromCart(id){
    cart = cart.filter(i => i.id !== id);
    renderCart();
  }

  function renderCart(){
    const itemsEl = document.getElementById('cartItems');
    const countEl = document.getElementById('cartCount');
    const totalEl = document.getElementById('cartTotal');
    const totalQty = cart.reduce((s,i)=>s+i.qty,0);
    countEl.textContent = totalQty;

    if (cart.length === 0){
      itemsEl.innerHTML = `<div class="cart-empty">Votre panier est vide.<br>Découvrez la collection.</div>`;
    } else {
      itemsEl.innerHTML = cart.map(i => `
        <div class="cart-item">
          <div class="cart-item-media" style="background:${i.gradient}"></div>
          <div class="cart-item-info">
            <div class="name">${i.name} ${i.qty>1 ? '× '+i.qty : ''}</div>
            <div class="price">${i.price * i.qty} €</div>
            <div class="cart-item-remove" onclick="removeFromCart(${i.id})">Retirer</div>
          </div>
        </div>
      `).join('');
    }
    const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
    totalEl.textContent = total + ' €';
  }

  function openCart(){
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('overlay').classList.add('open');
  }
  function closeCart(){
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('overlay').classList.remove('open');
  }

  renderProducts();
  renderCart();
