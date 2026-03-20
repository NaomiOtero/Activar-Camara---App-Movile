let currentScreen = 'a1';
let mediaStream = null;

function goTo(id) {
  const cur = document.getElementById(currentScreen);
  cur.classList.remove('active');
  cur.classList.add('exit-left');
  setTimeout(() => cur.classList.remove('exit-left'), 400);

  const next = document.getElementById(id);
  next.classList.add('active');
  currentScreen = id;

  if (id === 'a3') startCamera();
  if (id !== 'a3') stopCamera();
}

function setErr(id, msg) {
  const el = document.getElementById('e_' + id);
  const inp = document.getElementById('f_' + id);
  if (el) el.textContent = msg;
  if (inp) {
    inp.classList.toggle('error', !!msg);
    inp.classList.toggle('ok', !msg && inp.value.trim() !== '');
  }
  return !msg;
}

function hasSequential(str) {
  for (let i = 0; i < str.length - 2; i++) {
    const a = str.charCodeAt(i), b = str.charCodeAt(i+1), c = str.charCodeAt(i+2);
    if ((b - a === 1 && c - b === 1) || (a - b === 1 && b - c === 1)) return true;
  }
  return false;
}

function validateNombre() {
  const v = document.getElementById('f_nombre').value.trim();
  if (!v) return setErr('nombre', 'El nombre es requerido');
  if (v.length < 3) return setErr('nombre', 'Mínimo 3 caracteres');
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v)) return setErr('nombre', 'Solo letras');
  return setErr('nombre', '');
}

function validateCorreo() {
  const v = document.getElementById('f_correo').value.trim();
  if (!v) return setErr('correo', 'El correo es requerido');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return setErr('correo', 'Correo inválido');
  return setErr('correo', '');
}

function validateTel() {
  const input = document.getElementById('f_tel');
  input.value = input.value.replace(/\D/g, ''); 
  const v = input.value.trim();
  if (!v) return setErr('tel', 'El teléfono es requerido');
  if (v.length !== 10) return setErr('tel', 'Debe tener exactamente 10 dígitos');
  return setErr('tel', '');
}

function validatePass() {
  const v = document.getElementById('f_pass').value;
  const checks = {
    len: v.length >= 8,
    upper: /[A-Z]/.test(v),
    lower: /[a-z]/.test(v),
    num: /[0-9]/.test(v),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v),
    seq: !hasSequential(v)
  };
  Object.entries(checks).forEach(([k, ok]) => {
    document.getElementById('chk_' + k)?.classList.toggle('pass', ok);
  });
  const allOk = Object.values(checks).every(Boolean);
  if (!v) return setErr('pass', 'La contraseña es requerida');
  if (!allOk) return setErr('pass', 'La contraseña no cumple los requisitos');
  return setErr('pass', '');
}

function validateFecha() {
  const v = document.getElementById('f_fecha').value;
  if (!v) return setErr('fecha', 'La fecha es requerida');
  const age = (Date.now() - new Date(v)) / (365.25*24*3600*1000);
  if (age < 10 || age > 120) return setErr('fecha', 'Fecha inválida');
  return setErr('fecha', '');
}

function validateGenero() {
  const v = document.getElementById('f_genero').value;
  const inp = document.getElementById('f_genero');
  const el = document.getElementById('e_genero');
  if (!v) { el.textContent = 'Selecciona una opción'; inp.classList.add('error'); return false; }
  el.textContent = '';
  inp.classList.remove('error');
  inp.classList.add('ok');
  return true;
}

function validateAll() {
  const n = validateNombre();
  const c = validateCorreo();
  const t = validateTel();
  const p = validatePass();
  const f = validateFecha();
  const g = validateGenero();
  return n && c && t && p && f && g;
}

function togglePass() {
  const inp = document.getElementById('f_pass');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}


function getFormData() {
  return {
    'Nombre': document.getElementById('f_nombre').value,
    'Correo': document.getElementById('f_correo').value,
    'Teléfono': document.getElementById('f_tel').value,
    'Contraseña': '•'.repeat(document.getElementById('f_pass').value.length),
    'Nacimiento': document.getElementById('f_fecha').value,
    'Género': document.getElementById('f_genero').value
  };
}

// ── MODAL ─────────────────────────────────────────────────────────────
let modalCallback = null;

function showModal(title, icon, data, btnLabel, cb) {
  document.getElementById('modalTitle').innerHTML = `<span class="icon">${icon}</span>${title}`;
  const body = document.getElementById('modalBody');
  body.innerHTML = '';
  Object.entries(data).forEach(([k,v]) => {
    body.innerHTML += `<div class="modal-row"><span class="key">${k}</span><span class="val">${v||'—'}</span></div>`;
  });
  document.getElementById('modalBtn').textContent = btnLabel || 'Cerrar';
  modalCallback = cb || null;
  document.getElementById('modal').classList.add('show');
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
  if (modalCallback) { const cb = modalCallback; modalCallback = null; cb(); }
}

function handleSalir() {
  if (!validateAll()) return;
  showModal('Datos capturados', '·', getFormData(), '↩ Regresar al inicio', () => goTo('a1'));
}

function handleContinuar() {
  if (!validateAll()) return;
  showModal('Datos del formulario', '·', getFormData(), ' · Ir a cámara', () => goTo('a3'));
}

// ── CAMERA ────────────────────────────────────────────────────────────
  async function startCamera() {
    const statusEl = document.getElementById('camStatus');
    statusEl.textContent = 'Solicitando acceso...';
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      document.getElementById('videoEl').srcObject = mediaStream;
      statusEl.textContent = '';
      document.getElementById('shutterBtn').style.pointerEvents = 'all';
    } catch(e) {
      statusEl.textContent = 'Sin acceso a cámara (' + e.message + ')';
      document.getElementById('shutterBtn').style.pointerEvents = 'none';
    }
  }

function stopCamera() {
  if (mediaStream) { mediaStream.getTracks().forEach(t => t.stop()); mediaStream = null; }
}

function takePhoto() {
  const video = document.getElementById('videoEl');
  const canvas = document.getElementById('snapCanvas');
  if (!mediaStream) return;

  const flash = document.getElementById('flashEl');
  flash.classList.add('active');
  setTimeout(() => flash.classList.remove('active'), 200);

  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const dataURL = canvas.toDataURL('image/jpeg', 0.85);

  // salvar en el local storage
  let photos = JSON.parse(localStorage.getItem('camPhotos') || '[]');
  photos.unshift({ ts: Date.now(), data: dataURL });
  if (photos.length > 20) photos = photos.slice(0, 20);
  try {
    localStorage.setItem('camPhotos', JSON.stringify(photos));
  } catch(e) { console.warn('localStorage lleno'); }

  // Show thumbnail
  renderGallery(photos);
  document.getElementById('camStatus').textContent = `· Foto guardada (${photos.length} total)`;
  setTimeout(() => { document.getElementById('camStatus').textContent = ''; }, 2500);
}

function renderGallery(photos) {
  if (!photos.length) return;
  const wrap = document.getElementById('galleryWrap');
  wrap.style.display = 'block';
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  photos.slice(0,8).forEach(p => {
    const img = document.createElement('img');
    img.src = p.data;
    gallery.appendChild(img);
  });
}

function exitCamera() {
  stopCamera();
  goTo('a1');
}

// Load existing gallery if returning
document.getElementById('a3').addEventListener('transitionend', () => {
  if (currentScreen === 'a3') {
    const photos = JSON.parse(localStorage.getItem('camPhotos') || '[]');
    if (photos.length) renderGallery(photos);
  }
});