/**
 * Sistema de Logging Profissional
 * Organiza e formata logs de forma clara e legível
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Cores de texto
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  
  // Cores de fundo
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

class Logger {
  constructor() {
    this.enabled = process.env.NODE_ENV !== 'test';
  }

  /**
   * Formata timestamp
   */
  getTimestamp() {
    const now = new Date();
    return now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Linha separadora
   */
  separator(char = '─', length = 80) {
    if (!this.enabled) return;
    console.log(colors.gray + char.repeat(length) + colors.reset);
  }

  /**
   * Header de seção
   */
  header(title, color = 'cyan') {
    if (!this.enabled) return;
    console.log('\n' + colors[color] + colors.bright + '┌─ ' + title + colors.reset);
  }

  /**
   * Footer de seção
   */
  footer() {
    if (!this.enabled) return;
    console.log(colors.gray + '└' + '─'.repeat(79) + colors.reset + '\n');
  }

  /**
   * Log de informação
   */
  info(message, data = null) {
    if (!this.enabled) return;
    console.log(colors.cyan + '│ ℹ ' + colors.reset + message);
    if (data) {
      console.log(colors.gray + '│   ' + JSON.stringify(data, null, 2).split('\n').join('\n│   ') + colors.reset);
    }
  }

  /**
   * Log de sucesso
   */
  success(message, data = null) {
    if (!this.enabled) return;
    console.log(colors.green + '│ ✓ ' + colors.reset + message);
    if (data) {
      console.log(colors.gray + '│   ' + JSON.stringify(data, null, 2).split('\n').join('\n│   ') + colors.reset);
    }
  }

  /**
   * Log de erro
   */
  error(message, error = null) {
    if (!this.enabled) return;
    console.log(colors.red + '│ ✗ ' + colors.reset + message);
    if (error) {
      if (error.message) {
        console.log(colors.red + '│   Erro: ' + error.message + colors.reset);
      }
      if (process.env.NODE_ENV === 'development' && error.stack) {
        console.log(colors.gray + '│   ' + error.stack.split('\n').join('\n│   ') + colors.reset);
      }
    }
  }

  /**
   * Log de aviso
   */
  warn(message, data = null) {
    if (!this.enabled) return;
    console.log(colors.yellow + '│ ⚠ ' + colors.reset + message);
    if (data) {
      console.log(colors.gray + '│   ' + JSON.stringify(data, null, 2).split('\n').join('\n│   ') + colors.reset);
    }
  }

  /**
   * Log de debug
   */
  debug(message, data = null) {
    if (!this.enabled || process.env.NODE_ENV !== 'development') return;
    console.log(colors.magenta + '│ ⚙ ' + colors.reset + message);
    if (data) {
      console.log(colors.gray + '│   ' + JSON.stringify(data, null, 2).split('\n').join('\n│   ') + colors.reset);
    }
  }

  /**
   * Log de requisição HTTP
   */
  request(method, path, details = {}) {
    if (!this.enabled) return;
    
    const methodColors = {
      GET: 'blue',
      POST: 'green',
      PUT: 'yellow',
      PATCH: 'yellow',
      DELETE: 'red'
    };
    
    const color = methodColors[method] || 'white';
    
    this.header(`${method} ${path}`, color);
    
    if (details.origin) {
      console.log(colors.gray + '│ ' + colors.reset + 'Origem: ' + colors.cyan + details.origin + colors.reset);
    }
    
    if (details.ip) {
      console.log(colors.gray + '│ ' + colors.reset + 'IP: ' + colors.cyan + details.ip + colors.reset);
    }
    
    if (details.user) {
      console.log(colors.gray + '│ ' + colors.reset + 'Usuário: ' + colors.cyan + details.user + colors.reset);
    }
    
    if (details.timestamp !== false) {
      console.log(colors.gray + '│ ' + colors.reset + 'Horário: ' + colors.gray + this.getTimestamp() + colors.reset);
    }
  }

  /**
   * Log de resposta HTTP
   */
  response(statusCode, message = null) {
    if (!this.enabled) return;
    
    const color = statusCode < 300 ? 'green' : statusCode < 400 ? 'yellow' : 'red';
    const icon = statusCode < 300 ? '✓' : statusCode < 400 ? '⚠' : '✗';
    
    console.log(colors[color] + `│ ${icon} Status: ${statusCode}` + colors.reset + (message ? ` - ${message}` : ''));
  }

  /**
   * Log de autenticação
   */
  auth(type, user, success = true) {
    if (!this.enabled) return;
    
    const actions = {
      login: 'Login',
      logout: 'Logout',
      register: 'Registro',
      refresh: 'Refresh Token'
    };
    
    const action = actions[type] || type;
    
    if (success) {
      this.header(`${action} - Sucesso`, 'green');
      this.success(`Usuário: ${user}`);
      this.info(`Horário: ${this.getTimestamp()}`);
    } else {
      this.header(`${action} - Falha`, 'red');
      this.error(`Tentativa de ${action.toLowerCase()} falhou`);
      this.info(`Usuário: ${user}`);
      this.info(`Horário: ${this.getTimestamp()}`);
    }
    
    this.footer();
  }

  /**
   * Log de operação de carteira
   */
  carteira(action, data) {
    if (!this.enabled) return;
    
    const actions = {
      create: { title: 'Nova Carteira Criada', icon: '✓', color: 'green' },
      update: { title: 'Carteira Atualizada', icon: '✓', color: 'yellow' },
      delete: { title: 'Carteira Removida', icon: '✗', color: 'red' },
      qrcode: { title: 'QR Code Gerado', icon: '⚡', color: 'magenta' },
      view: { title: 'Carteira Consultada', icon: 'ℹ', color: 'blue' }
    };
    
    const config = actions[action] || { title: action, icon: '•', color: 'white' };
    
    this.header(config.title, config.color);
    
    if (data.nome) {
      this.info(`Nome: ${data.nome}`);
    }
    
    if (data.codigo) {
      this.info(`Código: ${data.codigo}`);
    }
    
    if (data.loja) {
      this.info(`Loja: ${data.loja}`);
    }
    
    if (data.admin) {
      this.info(`Admin: ${data.admin}`);
    }
    
    if (data.ip) {
      this.info(`IP: ${data.ip}`);
    }
    
    this.info(`Horário: ${this.getTimestamp()}`);
    this.footer();
  }

  /**
   * Log de inicialização do servidor
   */
  serverStart(config) {
    if (!this.enabled) return;
    
    console.log('\n' + colors.bright + colors.green + '╔' + '═'.repeat(78) + '╗' + colors.reset);
    console.log(colors.bright + colors.green + '║' + ' '.repeat(25) + '🚀 SERVIDOR INICIADO' + ' '.repeat(33) + '║' + colors.reset);
    console.log(colors.bright + colors.green + '╚' + '═'.repeat(78) + '╝' + colors.reset);
    
    console.log(colors.cyan + '\n📍 Configurações:' + colors.reset);
    console.log(colors.gray + '  ├─' + colors.reset + ' Porta: ' + colors.white + config.port + colors.reset);
    console.log(colors.gray + '  ├─' + colors.reset + ' Ambiente: ' + colors.white + config.env + colors.reset);
    console.log(colors.gray + '  ├─' + colors.reset + ' API Local: ' + colors.cyan + config.localUrl + colors.reset);
    console.log(colors.gray + '  └─' + colors.reset + ' Health Check: ' + colors.cyan + config.healthUrl + colors.reset);
    
    if (config.allowedOrigins && config.allowedOrigins.length > 0) {
      console.log(colors.cyan + '\n🔒 CORS - Origens Permitidas:' + colors.reset);
      config.allowedOrigins.forEach((origin, index) => {
        const isLast = index === config.allowedOrigins.length - 1;
        const prefix = isLast ? '  └─' : '  ├─';
        console.log(colors.gray + prefix + colors.reset + ' ' + colors.white + origin + colors.reset);
      });
    }
    
    console.log(colors.green + '\n✅ Servidor pronto para receber requisições\n' + colors.reset);
    this.separator('═');
  }

  /**
   * Log de CORS
   */
  cors(origin, allowed) {
    if (!this.enabled) return;
    
    if (allowed) {
      console.log(colors.green + '│ ✓ CORS' + colors.reset + ' - Origem permitida: ' + colors.cyan + (origin || 'sem origem') + colors.reset);
    } else {
      console.log(colors.red + '│ ✗ CORS' + colors.reset + ' - Origem bloqueada: ' + colors.red + origin + colors.reset);
    }
  }
}

module.exports = new Logger();
