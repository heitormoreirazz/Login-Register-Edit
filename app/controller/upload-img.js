// ===== ELEMENTOS DO DOM =====
const avatarElement = document.querySelector('.avatar');
const avatarInput = document.getElementById('avatarInput');
const avatarImg = document.querySelector('.avatar-img');
const avatarIcon = document.querySelector('.avatar i');
const avatarLoading = document.querySelector('.avatar-loading');

// Modal de confirmação
const modal = document.querySelector('.avatar-modal');
const modalPreview = document.querySelector('.avatar-modal-preview');
const modalBtnConfirm = document.querySelector('.avatar-modal-btn-confirm');
const modalBtnCancel = document.querySelector('.avatar-modal-btn-cancel');

// Mensagens
const errorMessage = document.querySelector('.avatar-error');
const successMessage = document.querySelector('.avatar-success');

let selectedFile = null;
let previewDataUrl = null;

// ===== FUNÇÕES PRINCIPAIS =====

/**
 * Mostra mensagem de erro
 * @param {string} message - Mensagem de erro
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  setTimeout(() => {
    errorMessage.classList.remove('show');
  }, 4000);
}

/**
 * Mostra mensagem de sucesso
 * @param {string} message - Mensagem de sucesso
 */
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.classList.add('show');
  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 4000);
}

/**
 * Valida o arquivo selecionado
 * @param {File} file - Arquivo a validar
 * @returns {boolean} - True se válido
 */
function validateFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    showError('❌ Tipo inválido. Use JPG, PNG ou WebP.');
    return false;
  }

  if (file.size > maxSize) {
    showError('❌ Arquivo muito grande. Máximo 5MB.');
    return false;
  }

  return true;
}

/**
 * Abre o modal de confirmação com pré-visualização
 * @param {string} dataUrl - URL da imagem em base64
 */
function openConfirmModal(dataUrl) {
  previewDataUrl = dataUrl;
  modalPreview.src = dataUrl;
  modal.classList.add('show');
}

/**
 * Fecha o modal de confirmação
 */
function closeConfirmModal() {
  modal.classList.remove('show');
  previewDataUrl = null;
  selectedFile = null;
}

/**
 * Exibe a imagem no avatar
 * @param {string} dataUrl - URL da imagem em base64
 */
function displayAvatar(dataUrl) {
  avatarImg.src = dataUrl;
  avatarImg.classList.add('show');
  avatarIcon.classList.add('hide');
}

/**
 * Remove a imagem do avatar
 */
function removeAvatar() {
  avatarImg.src = '';
  avatarImg.classList.remove('show');
  avatarIcon.classList.remove('hide');
  avatarInput.value = '';
}

/**
 * Mostra indicador de carregamento
 */
function showLoading() {
  avatarLoading.classList.add('show');
}

/**
 * Esconde indicador de carregamento
 */
function hideLoading() {
  avatarLoading.classList.remove('show');
}

/**
 * Faz upload da imagem para o servidor/Supabase
 * @param {File} file - Arquivo a fazer upload
 */
async function uploadAvatar(file) {
  showLoading();

  try {
    const formData = new FormData();
    formData.append('file', file);

    // Enviar para seu servidor/Supabase
    const response = await fetch('/upload-avatar', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar imagem');
    }

    const data = await response.json();
    console.log('Avatar enviado:', data);

    // Exibir a imagem
    displayAvatar(previewDataUrl);
    closeConfirmModal();
    showSuccess('✅ Avatar atualizado com sucesso!');

    return data;
  } catch (error) {
    showError('❌ Erro ao enviar avatar');
    console.error(error);
  } finally {
    hideLoading();
  }
}

/**
 * Processa a seleção de arquivo
 * @param {File} file - Arquivo selecionado
 */
function handleFileSelect(file) {
  if (!validateFile(file)) {
    return;
  }

  selectedFile = file;

  // Ler arquivo e abrir modal de confirmação
  const reader = new FileReader();
  reader.onload = (e) => {
    openConfirmModal(e.target.result);
  };
  reader.readAsDataURL(file);
}

// ===== EVENT LISTENERS =====

// Clique no avatar para abrir seletor de arquivo
avatarElement.addEventListener('click', () => {
  avatarInput.click();
});

// Seleção de arquivo
avatarInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    handleFileSelect(file);
  }
});

// Botão confirmar no modal
modalBtnConfirm.addEventListener('click', () => {
  if (selectedFile) {
    uploadAvatar(selectedFile);
  }
});

// Botão cancelar no modal
modalBtnCancel.addEventListener('click', () => {
  closeConfirmModal();
});

// Fechar modal ao clicar fora
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeConfirmModal();
  }
});

// Drag and drop
avatarElement.addEventListener('dragover', (e) => {
  e.preventDefault();
  avatarElement.style.opacity = '0.7';
});

avatarElement.addEventListener('dragleave', () => {
  avatarElement.style.opacity = '1';
});

avatarElement.addEventListener('drop', (e) => {
  e.preventDefault();
  avatarElement.style.opacity = '1';

  const file = e.dataTransfer.files[0];
  if (file) {
    handleFileSelect(file);
  }
});

// ===== EXPORTAR FUNÇÕES (se usar módulos) =====
// export { uploadAvatar, removeAvatar, handleFileSelect };
