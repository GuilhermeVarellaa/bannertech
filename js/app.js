// Configuração da API
const API_URL = 'https://script.google.com/macros/s/AKfycbw9i7XwdbFIm6-VKfS_sBGwGq-pgsIvaUgHqGdL701R1wW2VYsbLQVBLAgbUzEA3Q-3Nw/exec';

// Variáveis globais
let selectedTemplate = null;
let currentStep = 1;
let templates = [];
let isLoggedIn = false;
let currentUser = null;

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Elementos principais
  const bannerGrid = document.querySelector('.banner-grid');
  const editorSection = document.getElementById('editor');
  const backButton = document.getElementById('back-to-templates');
  const generateButton = document.getElementById('generate-banner');
  const resultModal = document.getElementById('result-modal');
  const modalClose = document.querySelector('.modal-close');
  const categoryTabs = document.querySelectorAll('.category-tab');
  const editorSteps = document.querySelectorAll('.editor-step');
  const previewBanner = document.getElementById('preview-banner');
  
  // Elementos de navegação
  const navLinks = document.querySelectorAll('.nav-link');
  const loginButton = document.querySelector('.user-menu .btn-outline');
  const registerButton = document.querySelector('.user-menu .btn-primary');
  
  // Elementos de compartilhamento
  const shareButton = document.querySelector('#result-modal .btn-outline:nth-child(2)');
  
  // Campos de formulário
  const nomeInput = document.getElementById('nome');
  const cargoInput = document.getElementById('cargo');
  const empresaInput = document.getElementById('empresa');
  const corPrimariaInput = document.getElementById('cor-primaria');
  
  // Inicialização
  initializeApp();
  
  // Função de inicialização
  function initializeApp() {
    // Verifica login
    checkLoginStatus();
    
    // Carrega os templates da API
    carregarTemplates();
    
    // Inicializa os menus
    initializeMenus();
    
    // Inicializa compartilhamento
    initializeSharing();
    
    // Inicializa login/registro
    initializeAuth();
  }
  
  // Inicializa os menus
  function initializeMenus() {
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove classe active de todos os links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Adiciona classe active ao link clicado
        this.classList.add('active');
        
        const target = this.textContent.trim();
        
        switch(target) {
          case 'Galeria':
            showGallery();
            break;
          case 'Como Funciona':
            showHowItWorks();
            break;
          case 'Preços':
            showPricing();
            break;
          default:
            showHomepage();
            break;
        }
      });
    });
  }
  
  // Funções para os menus
  function showGallery() {
    showToast('Carregando galeria de banners...', 'success');
    // Aqui você pode implementar a lógica para mostrar uma galeria de banners criados
    // Por enquanto, vamos apenas rolar para a seção de categorias
    document.querySelector('.categories').scrollIntoView({ behavior: 'smooth' });
  }
  
  function showHowItWorks() {
    // Cria um modal explicativo
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Como Funciona o BannerTech</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="how-it-works">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h4>Escolha um template</h4>
                <p>Navegue pela nossa galeria e escolha o template que mais combina com seu estilo.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h4>Personalize</h4>
                <p>Adicione seu nome, cargo, empresa e ajuste as cores conforme sua preferência.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h4>Gere seu banner</h4>
                <p>Clique em "Gerar Banner" e pronto! Seu banner personalizado estará pronto para download.</p>
              </div>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h4>Compartilhe</h4>
                <p>Baixe seu banner e compartilhe nas suas redes sociais para aumentar sua presença profissional.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary">Entendi</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Adiciona evento para fechar o modal
    const closeButton = modal.querySelector('.modal-close');
    const confirmButton = modal.querySelector('.btn-primary');
    
    closeButton.addEventListener('click', function() {
      document.body.removeChild(modal);
    });
    
    confirmButton.addEventListener('click', function() {
      document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }
  
  function showPricing() {
    // Cria um modal de preços
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Planos e Preços</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="pricing-plans">
            <div class="pricing-plan">
              <div class="plan-header">
                <h4>Gratuito</h4>
                <div class="plan-price">R$ 0</div>
                <div class="plan-period">para sempre</div>
              </div>
              <div class="plan-features">
                <div class="plan-feature">3 templates básicos</div>
                <div class="plan-feature">Personalização limitada</div>
                <div class="plan-feature">Marca d'água BannerTech</div>
                <div class="plan-feature">Sem suporte</div>
              </div>
              <button class="btn btn-outline w-100">Plano Atual</button>
            </div>
            
            <div class="pricing-plan featured">
              <div class="plan-badge">Popular</div>
              <div class="plan-header">
                <h4>Profissional</h4>
                <div class="plan-price">R$ 19,90</div>
                <div class="plan-period">por mês</div>
              </div>
              <div class="plan-features">
                <div class="plan-feature">20+ templates premium</div>
                <div class="plan-feature">Personalização completa</div>
                <div class="plan-feature">Sem marca d'água</div>
                <div class="plan-feature">Suporte por email</div>
              </div>
              <button class="btn btn-primary w-100">Assinar</button>
            </div>
            
            <div class="pricing-plan">
              <div class="plan-header">
                <h4>Empresarial</h4>
                <div class="plan-price">R$ 49,90</div>
                <div class="plan-period">por mês</div>
              </div>
              <div class="plan-features">
                <div class="plan-feature">Todos os templates</div>
                <div class="plan-feature">Templates personalizados</div>
                <div class="plan-feature">Integração com APIs</div>
                <div class="plan-feature">Suporte prioritário</div>
              </div>
              <button class="btn btn-outline w-100">Contate-nos</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Adiciona evento para fechar o modal
    const closeButton = modal.querySelector('.modal-close');
    
    closeButton.addEventListener('click', function() {
      document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }
  
  function showHomepage() {
    // Rola para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Inicializa compartilhamento
  function initializeSharing() {
    if (shareButton) {
      shareButton.addEventListener('click', function() {
        // Verifica se a API Web Share está disponível
        if (navigator.share) {
          // Obtém a URL da imagem
          const imgUrl = document.querySelector('#result-modal .modal-body img').src;
          
          // Compartilha via Web Share API
          navigator.share({
            title: 'Meu banner profissional - BannerTech',
            text: 'Criei este banner profissional com BannerTech. Confira!',
            url: window.location.href
          })
          .then(() => showToast('Compartilhado com sucesso!', 'success'))
          .catch(error => {
            console.error('Erro ao compartilhar:', error);
            showToast('Erro ao compartilhar. Tente novamente.', 'error');
            // Fallback para compartilhamento manual
            showManualShareOptions(imgUrl);
          });
        } else {
          // Fallback para navegadores que não suportam Web Share API
          const imgUrl = document.querySelector('#result-modal .modal-body img').src;
          showManualShareOptions(imgUrl);
        }
      });
    }
  }
  
  // Mostra opções manuais de compartilhamento
  function showManualShareOptions(imgUrl) {
    const shareModal = document.createElement('div');
    shareModal.className = 'modal-backdrop active';
    shareModal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Compartilhar Banner</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p>Compartilhe seu banner nas redes sociais:</p>
          <div class="share-buttons">
            <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-button linkedin">
              <i class="fab fa-linkedin"></i> LinkedIn
            </a>
            <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent('Criei este banner profissional com BannerTech. Confira!')}&url=${encodeURIComponent(window.location.href)}" target="_blank" class="share-button twitter">
              <i class="fab fa-twitter"></i> Twitter
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" target="_blank" class="share-button facebook">
              <i class="fab fa-facebook"></i> Facebook
            </a>
            <a href="mailto:?subject=${encodeURIComponent('Meu banner profissional - BannerTech')}&body=${encodeURIComponent('Criei este banner profissional com BannerTech. Confira: ' + window.location.href)}" class="share-button email">
              <i class="fas fa-envelope"></i> Email
            </a>
          </div>
          <div class="mt-md">
            <p>Ou copie o link:</p>
            <div class="copy-link-container">
              <input type="text" value="${window.location.href}" readonly class="form-input">
              <button class="btn btn-outline copy-link-btn">Copiar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(shareModal);
    
    // Adiciona evento para fechar o modal
    const closeButton = shareModal.querySelector('.modal-close');
    const copyButton = shareModal.querySelector('.copy-link-btn');
    const linkInput = shareModal.querySelector('.copy-link-container input');
    
    closeButton.addEventListener('click', function() {
      document.body.removeChild(shareModal);
    });
    
    copyButton.addEventListener('click', function() {
      linkInput.select();
      document.execCommand('copy');
      showToast('Link copiado para a área de transferência!', 'success');
    });
    
    shareModal.addEventListener('click', function(e) {
      if (e.target === shareModal) {
        document.body.removeChild(shareModal);
      }
    });
  }
  
  // Inicializa autenticação
  function initializeAuth() {
    if (loginButton) {
      loginButton.addEventListener('click', function() {
        showLoginModal();
      });
    }
    
    if (registerButton) {
      registerButton.addEventListener('click', function() {
        showRegisterModal();
      });
    }
  }
  
  // Verifica status de login
  function checkLoginStatus() {
    // Verifica se há um usuário no localStorage
    const savedUser = localStorage.getItem('bannertech_user');
    
    if (savedUser) {
      try {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        updateUIForLoggedInUser();
      } catch (e) {
        console.error('Erro ao carregar usuário:', e);
        localStorage.removeItem('bannertech_user');
      }
    }
  }
  
  // Atualiza UI para usuário logado
  function updateUIForLoggedInUser() {
    if (loginButton && registerButton) {
      loginButton.textContent = 'Minha Conta';
      registerButton.textContent = 'Sair';
      
      // Atualiza evento do botão de registro para logout
      registerButton.removeEventListener('click', showRegisterModal);
      registerButton.addEventListener('click', function() {
        logout();
      });
      
      // Atualiza evento do botão de login para perfil
      loginButton.removeEventListener('click', showLoginModal);
      loginButton.addEventListener('click', function() {
        showProfileModal();
      });
    }
  }
  
  // Atualiza UI para usuário deslogado
  function updateUIForLoggedOutUser() {
    if (loginButton && registerButton) {
      loginButton.textContent = 'Entrar';
      registerButton.textContent = 'Cadastrar';
      
      // Restaura eventos originais
      registerButton.removeEventListener('click', logout);
      registerButton.addEventListener('click', function() {
        showRegisterModal();
      });
      
      loginButton.removeEventListener('click', showProfileModal);
      loginButton.addEventListener('click', function() {
        showLoginModal();
      });
    }
  }
  
  // Mostra modal de login
  function showLoginModal() {
    const loginModal = document.createElement('div');
    loginModal.className = 'modal-backdrop active';
    loginModal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Entrar</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <form id="login-form">
            <div class="form-group">
              <label class="form-label" for="login-email">Email</label>
              <input type="email" id="login-email" class="form-input" placeholder="seu@email.com" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="login-password">Senha</label>
              <input type="password" id="login-password" class="form-input" placeholder="Sua senha" required>
            </div>
            <div class="form-group text-right">
              <a href="#" class="forgot-password">Esqueceu a senha?</a>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary w-100">Entrar</button>
            </div>
          </form>
          <div class="auth-separator">
            <span>ou</span>
          </div>
          <div class="social-login">
            <button class="btn btn-outline w-100 mb-sm">
              <i class="fab fa-google"></i> Entrar com Google
            </button>
            <button class="btn btn-outline w-100">
              <i class="fab fa-github"></i> Entrar com GitHub
            </button>
          </div>
          <div class="auth-footer">
            <p>Não tem uma conta? <a href="#" class="switch-to-register">Cadastre-se</a></p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(loginModal);
    
    // Adiciona eventos
    const closeButton = loginModal.querySelector('.modal-close');
    const loginForm = loginModal.querySelector('#login-form');
    const switchToRegister = loginModal.querySelector('.switch-to-register');
    
    closeButton.addEventListener('click', function() {
      document.body.removeChild(loginModal);
    });
    
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      // Simulação de login
      login(email, password);
      
      document.body.removeChild(loginModal);
    });
    
    switchToRegister.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.removeChild(loginModal);
      showRegisterModal();
    });
    
    loginModal.addEventListener('click', function(e) {
      if (e.target === loginModal) {
        document.body.removeChild(loginModal);
      }
    });
  }
  
  // Mostra modal de registro
  function showRegisterModal() {
    const registerModal = document.createElement('div');
    registerModal.className = 'modal-backdrop active';
    registerModal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Criar Conta</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <form id="register-form">
            <div class="form-group">
              <label class="form-label" for="register-name">Nome Completo</label>
              <input type="text" id="register-name" class="form-input" placeholder="Seu nome completo" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="register-email">Email</label>
              <input type="email" id="register-email" class="form-input" placeholder="seu@email.com" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="register-password">Senha</label>
              <input type="password" id="register-password" class="form-input" placeholder="Crie uma senha forte" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="register-confirm-password">Confirmar Senha</label>
              <input type="password" id="register-confirm-password" class="form-input" placeholder="Confirme sua senha" required>
            </div>
            <div class="form-group">
              <label class="form-checkbox">
                <input type="checkbox" required>
                <span>Concordo com os <a href="#">Termos de Serviço</a> e <a href="#">Política de Privacidade</a></span>
              </label>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary w-100">Criar Conta</button>
            </div>
          </form>
          <div class="auth-separator">
            <span>ou</span>
          </div>
          <div class="social-login">
            <button class="btn btn-outline w-100 mb-sm">
              <i class="fab fa-google"></i> Cadastrar com Google
            </button>
            <button class="btn btn-outline w-100">
              <i class="fab fa-github"></i> Cadastrar com GitHub
            </button>
          </div>
          <div class="auth-footer">
            <p>Já tem uma conta? <a href="#" class="switch-to-login">Entrar</a></p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(registerModal);
    
    // Adiciona eventos
    const closeButton = registerModal.querySelector('.modal-close');
    const registerForm = registerModal.querySelector('#register-form');
    const switchToLogin = registerModal.querySelector('.switch-to-login');
    
    closeButton.addEventListener('click', function() {
      document.body.removeChild(registerModal);
    });
    
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;
      
      // Validação básica
      if (password !== confirmPassword) {
        showToast('As senhas não coincidem', 'error');
        return;
      }
      
      // Simulação de registro
      register(name, email, password);
      
      document.body.removeChild(registerModal);
    });
    
    switchToLogin.addEventListener('click', function(e) {
      e.preventDefault();
      document.body.removeChild(registerModal);
      showLoginModal();
    });
    
    registerModal.addEventListener('click', function(e) {
      if (e.target === registerModal) {
        document.body.removeChild(registerModal);
      }
    });
  }
  
  // Mostra modal de perfil
  function showProfileModal() {
    if (!currentUser) return;
    
    const profileModal = document.createElement('div');
    profileModal.className = 'modal-backdrop active';
    profileModal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">Meu Perfil</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="profile-header">
            <div class="profile-avatar">
              ${currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div class="profile-info">
              <h4>${currentUser.name}</h4>
              <p>${currentUser.email}</p>
              <span class="badge badge-success">Plano Gratuito</span>
            </div>
          </div>
          
          <div class="profile-stats">
            <div class="stat">
              <div class="stat-value">0</div>
              <div class="stat-label">Banners Criados</div>
            </div>
            <div class="stat">
              <div class="stat-value">0</div>
              <div class="stat-label">Compartilhamentos</div>
            </div>
            <div class="stat">
              <div class="stat-value">0</div>
              <div class="stat-label">Dias Restantes</div>
            </div>
          </div>
          
          <div class="profile-actions">
            <button class="btn btn-outline w-100 mb-sm">Editar Perfil</button>
            <button class="btn btn-outline w-100 mb-sm">Meus Banners</button>
            <button class="btn btn-primary w-100">Fazer Upgrade</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline logout-btn">Sair da Conta</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(profileModal);
    
    // Adiciona eventos
    const closeButton = profileModal.querySelector('.modal-close');
    const logoutButton = profileModal.querySelector('.logout-btn');
    
    closeButton.addEventListener('click', function() {
      document.body.removeChild(profileModal);
    });
    
    logoutButton.addEventListener('click', function() {
      document.body.removeChild(profileModal);
      logout();
    });
    
    profileModal.addEventListener('click', function(e) {
      if (e.target === profileModal) {
        document.body.removeChild(profileModal);
      }
    });
  }
  
  // Funções de autenticação
  function login(email, password) {
    // Simulação de login
    // Em um ambiente real, isso seria uma chamada à API
    
    // Simula verificação de credenciais
    if (email && password) {
      // Cria um usuário simulado
      currentUser = {
        id: 'user_' + Date.now(),
        name: email.split('@')[0], // Usa parte do email como nome
        email: email,
        plan: 'free'
      };
      
      // Salva no localStorage
      localStorage.setItem('bannertech_user', JSON.stringify(currentUser));
      
      isLoggedIn = true;
      updateUIForLoggedInUser();
      
      showToast('Login realizado com sucesso!', 'success');
    } else {
      showToast('Credenciais inválidas', 'error');
    }
  }
  
  function register(name, email, password) {
    // Simulação de registro
    // Em um ambiente real, isso seria uma chamada à API
    
    // Cria um usuário simulado
    currentUser = {
      id: 'user_' + Date.now(),
      name: name,
      email: email,
      plan: 'free'
    };
    
    // Salva no localStorage
    localStorage.setItem('bannertech_user', JSON.stringify(currentUser));
    
    isLoggedIn = true;
    updateUIForLoggedInUser();
    
    showToast('Conta criada com sucesso!', 'success');
  }
  
  function logout() {
    // Remove usuário do localStorage
    localStorage.removeItem('bannertech_user');
    
    currentUser = null;
    isLoggedIn = false;
    
    updateUIForLoggedOutUser();
    
    showToast('Você saiu da sua conta', 'success');
  }
  
  // Event Listeners - Adicionando verificações de existência
  
  // Voltar para templates
  if (backButton) {
    backButton.addEventListener('click', function() {
      editorSection.classList.remove('active');
      const categoriesSection = document.querySelector('.categories');
      if (categoriesSection) {
        categoriesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Gerar banner
  if (generateButton) {
    generateButton.addEventListener('click', function() {
      // Validação básica
      if (!nomeInput || !nomeInput.value || !cargoInput || !cargoInput.value) {
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
        empresa: empresaInput ? empresaInput.value || '' : '',
        corPrimaria: corPrimariaInput ? corPrimariaInput.value : '#4285f4'
      };
      
      // Chama a API para gerar o banner
      gerarBanner(dados)
        .then(result => {
          if (result.success) {
            // Atualiza a imagem no modal
            const resultImage = document.querySelector('#result-modal .modal-body img');
            if (resultImage) {
              resultImage.src = result.url;
              // Mostra o modal
              resultModal.classList.add('active');
            } else {
              showToast('Elemento de imagem de resultado não encontrado', 'error');
            }
          } else {
            showToast('Erro ao gerar banner: ' + (result.error || 'Erro desconhecido'), 'error');
          }
        })
        .catch(error => {
          showToast('Erro ao comunicar com o servidor: ' + error, 'error');
        });
    });
  }
  
  // Fechar modal
  if (modalClose && resultModal) {
    modalClose.addEventListener('click', function() {
      resultModal.classList.remove('active');
    });
    
    // Clique fora do modal para fechar
    resultModal.addEventListener('click', function(e) {
      if (e.target === resultModal) {
        resultModal.classList.remove('active');
      }
    });
  }
  
  // Alternar categorias
  if (categoryTabs && categoryTabs.length > 0) {
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove classe active de todas as tabs
        categoryTabs.forEach(t => t.classList.remove('active'));
        
        // Adiciona classe active na tab clicada
        this.classList.add('active');
        
        // Filtra os templates
        const category = this.textContent.trim();
        filterTemplates(category);
      });
    });
  }
  
  // Navegação entre etapas do editor
  if (editorSteps && editorSteps.length > 0) {
    editorSteps.forEach((step, index) => {
      step.addEventListener('click', function() {
        currentStep = index + 1;
        updateEditorSteps();
      });
    });
  }
  
  // Preview em tempo real
  const formInputs = document.querySelectorAll('.form-input');
  if (formInputs && formInputs.length > 0) {
    formInputs.forEach(input => {
      input.addEventListener('input', updatePreview);
    });
  }
  
  // Botão de download no modal
  const downloadButton = document.querySelector('#result-modal .btn-primary');
  if (downloadButton) {
    downloadButton.addEventListener('click', function() {
      const imgUrl = document.querySelector('#result-modal .modal-body img');
      if (imgUrl && imgUrl.src) {
        downloadBanner(imgUrl.src, `banner-${nomeInput.value.replace(/\s+/g, '-')}.png`);
      } else {
        showToast('Imagem de resultado não encontrada', 'error');
      }
    });
  }
  
  // Funções auxiliares
  
  // Carrega templates da API
  function carregarTemplates() {
    showToast('Carregando templates...', 'success');
    
    // Para teste local, podemos usar templates estáticos se a API não estiver disponível
    const useLocalTemplates = true; // Defina como false para usar a API real
    
    if (useLocalTemplates) {
      // Templates locais para teste
      const localTemplates = [
        {
          id: 'template1',
          nome: 'Tech Minimalista',
          categoria: 'Desenvolvedor',
          thumbnailUrl: 'img/template1.jpg'
        },
        {
          id: 'template2',
          nome: 'Code Pattern',
          categoria: 'Desenvolvedor',
          thumbnailUrl: 'img/template2.jpg'
        },
        {
          id: 'template3',
          nome: 'UI/UX Gradient',
          categoria: 'Designer',
          thumbnailUrl: 'img/template3.jpg'
        }
        // Adicione mais templates conforme necessário
      ];
      
      templates = localTemplates;
      renderizarTemplates(templates);
      showToast('Templates carregados localmente!', 'success');
      return;
    }
    
    // Carregamento da API real
    fetch(`${API_URL}?action=listarModelos`)
      .then(response => response.json())
      .then(data => {
        if (data.success && data.modelos) {
          templates = data.modelos;
          renderizarTemplates(templates);
          showToast('Templates carregados com sucesso!', 'success');
        } else {
          showToast('Erro ao carregar templates: ' + (data.error || 'Erro desconhecido'), 'error');
          // Carrega templates locais como fallback
          carregarTemplatesLocais();
        }
      })
      .catch(error => {
        showToast('Erro ao comunicar com o servidor: ' + error, 'error');
        // Carrega templates locais como fallback
        carregarTemplatesLocais();
      });
  }
  
  // Carrega templates locais como fallback
  function carregarTemplatesLocais() {
    const localTemplates = [
      {
        id: 'template1',
        nome: 'Tech Minimalista',
        categoria: 'Desenvolvedor',
        thumbnailUrl: 'img/template1.jpg'
      },
      {
        id: 'template2',
        nome: 'Code Pattern',
        categoria: 'Desenvolvedor',
        thumbnailUrl: 'img/template2.jpg'
      },
      {
        id: 'template3',
        nome: 'UI/UX Gradient',
        categoria: 'Designer',
        thumbnailUrl: 'img/template3.jpg'
      }
      // Adicione mais templates conforme necessário
    ];
    
    templates = localTemplates;
    renderizarTemplates(templates);
    showToast('Templates carregados localmente!', 'success');
  }
  
  // Renderiza os templates na grid
  function renderizarTemplates(templatesData) {
    if (!bannerGrid) {
      console.error('Banner grid não encontrada');
      return;
    }
    
    bannerGrid.innerHTML = '';
    
    templatesData.forEach(template => {
      const card = document.createElement('div');
      card.className = 'banner-card';
      card.setAttribute('data-id', template.id);
      card.setAttribute('data-categoria', template.categoria || 'Geral');
      
      card.innerHTML = `
        <img src="${template.thumbnailUrl}" alt="${template.nome}" class="banner-image">
        <div class="banner-info">
          <h3 class="banner-title">${template.nome}</h3>
          <div class="banner-meta">
            <i class="fas fa-eye"></i>
            <span>Visualizar</span>
          </div>
          <div class="banner-tags">
            <span class="banner-tag">${template.categoria || 'Geral'}</span>
          </div>
        </div>
        <div class="banner-overlay">
          <div class="banner-actions">
            <button class="btn btn-primary">Usar Template</button>
          </div>
        </div>
      `;
      
      // Adiciona evento de clique
      card.addEventListener('click', function() {
        selectedTemplate = template.id;
        
        // Atualiza preview com o template selecionado
        if (previewBanner) {
          previewBanner.src = template.thumbnailUrl;
        }
        
        // Mostra o editor
        if (editorSection) {
          editorSection.classList.add('active');
          
          // Scroll para o editor
          editorSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Mostra toast de confirmação
        showToast('Template selecionado com sucesso!', 'success');
      });
      
      bannerGrid.appendChild(card);
    });
  }
  
  // Atualiza o preview com os dados do formulário
  function updatePreview() {
    // Em uma implementação real, isso atualizaria o preview em tempo real
    // Aqui vamos simular a atualização do preview
    
    if (!previewBanner) return;
    
    // Obtém os valores dos campos
    const nome = nomeInput ? nomeInput.value : '';
    const cargo = cargoInput ? cargoInput.value : '';
    const empresa = empresaInput ? empresaInput.value : '';
    const corPrimaria = corPrimariaInput ? corPrimariaInput.value : '#4285f4';
    
    // Cria um canvas para manipular a imagem
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Carrega a imagem do template
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      // Define o tamanho do canvas
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Desenha a imagem original
      ctx.drawImage(img, 0, 0);
      
      // Configura o estilo do texto
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px Arial';
      ctx.textAlign = 'center';
      
      // Adiciona o nome
      if (nome) {
        ctx.fillText(nome, canvas.width / 2, canvas.height / 2 - 20);
      }
      
      // Adiciona o cargo
      if (cargo) {
        ctx.font = '24px Arial';
        ctx.fillText(cargo, canvas.width / 2, canvas.height / 2 + 20);
      }
      
      // Adiciona a empresa
      if (empresa) {
        ctx.font = '20px Arial';
        ctx.fillText(empresa, canvas.width / 2, canvas.height / 2 + 50);
      }
      
      // Adiciona um elemento de cor primária
      ctx.fillStyle = corPrimaria;
      ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 70, 100, 5);
      
      // Atualiza o preview
      previewBanner.src = canvas.toDataURL('image/jpeg');
    };
    
    // Define a fonte da imagem
    img.src = previewBanner.src;
    
    console.log('Atualizando preview com:', {
      nome: nome,
      cargo: cargo,
      empresa: empresa,
      corPrimaria: corPrimaria
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
        const cardCategory = card.getAttribute('data-categoria');
        card.style.display = (cardCategory === category) ? 'block' : 'none';
      });
    }
  }
  
  // Atualiza as etapas do editor
  function updateEditorSteps() {
    if (!editorSteps || editorSteps.length === 0) return;
    
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
    // Busca pelo elemento usando ID
    let toastContainer = document.getElementById('toast-container');
    
    // Se não encontrar pelo ID, tenta pela classe
    if (!toastContainer) {
      toastContainer = document.querySelector('.toast-container');
    }
    
    // Se ainda não encontrar, cria um novo
    if (!toastContainer) {
      console.warn('Toast container não encontrado, criando um novo');
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
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
        if (toastContainer && toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }
});

// Funções de API

// Gera o banner através da API
async function gerarBanner(dados) {
  try {
    // Para teste local, podemos simular uma resposta
    const useLocalSimulation = true; // Defina como false para usar a API real
    
    if (useLocalSimulation) {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Cria um canvas para gerar o banner
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Define o tamanho do banner
          canvas.width = 1200;
          canvas.height = 630;
          
          // Preenche o fundo com a cor primária
          ctx.fillStyle = dados.corPrimaria || '#4285f4';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Adiciona um gradiente
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Adiciona elementos decorativos
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.beginPath();
          ctx.arc(100, 100, 80, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(canvas.width - 150, canvas.height - 100, 120, 0, Math.PI * 2);
          ctx.fill();
          
          // Configura o estilo do texto
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          
          // Adiciona o nome
          ctx.font = 'bold 72px Arial';
          ctx.fillText(dados.nome, canvas.width / 2, canvas.height / 2 - 50);
          
          // Adiciona o cargo
          ctx.font = '48px Arial';
          ctx.fillText(dados.cargo, canvas.width / 2, canvas.height / 2 + 50);
          
          // Adiciona a empresa, se fornecida
          if (dados.empresa) {
            ctx.font = '36px Arial';
            ctx.fillText(dados.empresa, canvas.width / 2, canvas.height / 2 + 120);
          }
          
          // Adiciona uma linha decorativa
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2 - 100, canvas.height / 2 + 180);
          ctx.lineTo(canvas.width / 2 + 100, canvas.height / 2 + 180);
          ctx.stroke();
          
          // Adiciona marca d'água BannerTech
          ctx.font = '24px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.fillText('Criado com BannerTech', canvas.width / 2, canvas.height - 30);
          
          resolve({
            success: true,
            url: canvas.toDataURL('image/jpeg'),
            id: 'simulated_banner_' + Date.now()
          });
        }, 1500); // Simula um tempo de processamento
      });
    }
    
    // Implementação real com JSONP
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const callbackName = 'callback_' + Math.floor(Math.random() * 1000000);
      
      // Define a função de callback global
      window[callbackName] = function(data) {
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
      if (dados.empresa) params.append('empresa', dados.empresa);
      if (dados.corPrimaria) params.append('corPrimaria', dados.corPrimaria);
      params.append('callback', callbackName);
      
      // Cria e adiciona o script
      script.src = `${API_URL}?${params.toString()}`;
      document.body.appendChild(script);
      
      // Timeout para evitar que a promessa fique pendente para sempre
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
