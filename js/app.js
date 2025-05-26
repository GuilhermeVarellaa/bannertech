const API_URL = 'https://script.google.com/macros/s/AKfycbw9i7XwdbFIm6-VKfS_sBGwGq-pgsIvaUgHqGdL701R1wW2VYsbLQVBLAgbUzEA3Q-3Nw/exec';
// Variáveis globais
let selectedTemplate = null;
let currentStep = 1;
let templates = [];
// DOM Elements
document.addEventListener('DOMContentLoaded', function () {
  // Elementos principais
  const bannerGrid = document.querySelector('.banner-grid');
  const editorSection = document.getElementById('editor');
  const backButton = document.getElementById('back-totemplates');
  const generateButton = document.getElementById('generatebanner');
  const resultModal = document.getElementById('result-modal');
  const modalClose = document.querySelector('.modal-close');
  const categoryTabs = document.querySelectorAll('.categorytab');
  const editorSteps = document.querySelectorAll('.editor-step');
  const previewBanner = document.getElementById('previewbanner');
  // Campos de formulário
  const nomeInput = document.getElementById('nome');
  const cargoInput = document.getElementById('cargo');
  const empresaInput = document.getElementById('empresa');
  const corPrimariaInput = document.getElementById('corprimaria');
  // Carrega os templates da API
  carregarTemplates();
  // Event Listeners
  // Voltar para templates
  backButton.addEventListener('click', function () {
    editorSection.classList.remove('active');
    document.querySelector('.categories').scrollIntoView({
      behavior: 'smooth'
    });
  });
  1.
  // Gerar banner
  generateButton.addEventListener('click', function () {
    // Validação básica
    if (!nomeInput.value || !cargoInput.value) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
return;
    }
    if (!selectedTemplate) {
      showToast('Selecione um template primeiro.', 'error');
      return;
    }
    // Mostra toast de processamento
    showToast('Gerando seu banner...', 'success');
    // Dados para enviar à API
    const dados = {
      modeloId: selectedTemplate,
      nome: nomeInput.value,
      cargo: cargoInput.value,
      empresa: empresaInput.value || ''
    };
    // Chama a API para gerar o banner
    gerarBanner(dados)
      .then(result => {
        if (result.success) {
          // Atualiza a imagem no modal
          document.querySelector('#result-modal .modal-bodyimg').src = result.url;
// Mostra o modal
resultModal.classList.add('active');
        } else {
          showToast('Erro ao gerar banner: ' + (result.error ||
            'Erro desconhecido'), 'error');
        }
      })
      .catch(error => {
        showToast('Erro ao comunicar com o servidor: ' + error,
          'error');
      });
  });
  // Fechar modal
  modalClose.addEventListener('click', function () {
    resultModal.classList.remove('active');
  });
  // Clique fora do modal para fechar
  resultModal.addEventListener('click', function (e) {
    if (e.target === resultModal) {
      resultModal.classList.remove('active');
    }
  });
  // Alternar categorias
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      // Remove classe active de todas as tabs
      categoryTabs.forEach(t => t.classList.remove('active'));
      // Adiciona classe active na tab clicada
      this.classList.add('active');
      // Filtra os templates
      const category = this.textContent.trim();
      filterTemplates(category);
    });
  });
  // Navegação entre etapas do editor
  editorSteps.forEach((step, index) => {
    step.addEventListener('click', function () {
      currentStep = index + 1;
      updateEditorSteps();
    });
  });
  // Preview em tempo real
  const formInputs = document.querySelectorAll('.form-input');
  formInputs.forEach(input => {
    input.addEventListener('input', updatePreview);
  });
  // Botão de download no modal
  document.querySelector('#result-modal .btnprimary').addEventListener('click', function () {
    const imgUrl = document.querySelector('#result-modal .modalbody img').src;
    downloadBanner(imgUrl, `banner-${nomeInput.value.replace(/\s +/g, '-')}.png`);
  });
  // Funções auxiliares
  // Carrega templates da API
  function carregarTemplates() {
    showToast('Carregando templates...', 'success');
    fetch(`${API_URL}?action=listarModelos`)
      .then(response => response.json())
      .then(data => {
        if (data.success && data.modelos) {
          templates = data.modelos;
          renderizarTemplates(templates);
          showToast('Templates carregados com sucesso!',
            'success');
        } else {
          showToast('Erro ao carregar templates: ' +
            (data.error || 'Erro desconhecido'), 'error');
        }
      })
      .catch(error => {
        showToast('Erro ao comunicar com o servidor: ' + error,
          'error');
      });
  }
  // Renderiza os templates na grid
  function renderizarTemplates(templatesData) {
    bannerGrid.innerHTML = '';
    templatesData.forEach(template => {
      const card = document.createElement('div');
      card.className = 'banner-card';
      card.setAttribute('data-id', template.id);
      card.setAttribute('data-categoria', template.categoria ||
        'Geral');
      card.innerHTML = `
 <img src="${template.thumbnailUrl}" alt="$
{template.nome}" class="banner-image">
 <div class="banner-info">
 <h3 class="banner-title">${template.nome}</h3>
 <div class="banner-meta">
 <i class="fas fa-eye"></i>
 <span>Visualizar</span>
 </div>
 <div class="banner-tags">
 <span class="banner-tag">${template.categoria ||
        'Geral'}</span>
 </div>
 </div>
 <div class="banner-overlay">
 <div class="banner-actions">
 <button class="btn btn-primary">Usar Template</
button>
 </div>
 </div>
 `;
      // Adiciona evento de clique
      card.addEventListener('click', function () {
        selectedTemplate = template.id;
        // Atualiza preview com o template selecionado
        previewBanner.src = template.thumbnailUrl;
        // Mostra o editor
        editorSection.classList.add('active');
        // Scroll para o editor
        editorSection.scrollIntoView({ behavior: 'smooth' });
        // Mostra toast de confirmação
        showToast('Template selecionado com sucesso!',
          'success');
      });
      bannerGrid.appendChild(card);
    });
  }
  // Atualiza o preview com os dados do formulário
  function updatePreview() {
    // Em uma implementação real, isso atualizaria o preview
    console.log('Atualizando preview com:', {
      nome: nomeInput.value,
      cargo: cargoInput.value,
      empresa: empresaInput.value,
      corPrimaria: corPrimariaInput.value
    });
  }
  // Filtra templates por categoria
  function filterTemplates(category) {
    const cards = document.querySelectorAll('.banner-card');
    if (category === 'Todos') {
      cards.forEach(card => {
        card.style.display = 'block';
      });
    } else {
      cards.forEach(card => {
        const cardCategory = card.getAttribute('datacategoria');
        card.style.display = (cardCategory === category) ?
          'block' : 'none';
      });
    }
  }
  // Atualiza as etapas do editor
  function updateEditorSteps() {
    editorSteps.forEach((step, index) => {
      if (index + 1 === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }
  // Exibe toast de notificação
  function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toast-container');
  
  // Verificar se o elemento existe
  if (!toastContainer) {
    console.warn('Toast container não encontrado');
    return;
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' 
    ? '<i class="fas fa-check-circle"></i>' 
    : '<i class="fas fa-exclamation-circle"></i>';
  
  toast.innerHTML = `${icon} <span>${message}</span>`;
  
  toastContainer.appendChild(toast);
  
  // Remove o toast após 3 segundos
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 3000);
}
});
// Funções de API
// Gera o banner através da API
async function gerarBanner(dados) {
  try {
    // Em um ambiente real, usaríamos fetch para chamar a API
    // Como o Google Apps Script tem limitações de CORS, usamos
    JSONP
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const callbackName = 'callback_' +
        Math.floor(Math.random() * 1000000);
      // Define a função de callback global
      window[callbackName] = function (data) {
        delete window[callbackName];
        document.body.removeChild(script);
        resolve(data);
      };
      // Cria a URL com os parâmetros
      const params = new URLSearchParams();
      params.append('action', 'gerarBanner');
      params.append('modeloId', dados.modeloId);
      params.append('nome', dados.nome);
      params.append('cargo', dados.cargo);
      if (dados.empresa) params.append('empresa',
        dados.empresa);
      params.append('callback', callbackName);
      // Cria e adiciona o script
      script.src = `${API_URL}?${params.toString()}`;
      document.body.appendChild(script);
      // Timeout para evitar que a promessa fique pendente para
      sempre
      setTimeout(() => {
        if (window[callbackName]) {
          delete window[callbackName];
          document.body.removeChild(script);
          reject(new Error('Timeout ao chamar a API'));
        }
      }, 10000);
    });
  } catch (error) {
    console.error('Erro ao gerar banner:', error);
    return { success: false, error: error.toString() };
  }
}
// Função para download do banner
function downloadBanner(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'banner.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
