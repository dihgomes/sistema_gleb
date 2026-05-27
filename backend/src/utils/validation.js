function validarNomeUsuario(nome) {
  if (!nome || nome.trim() === '') {
    return {
      valid: false,
      error: 'Nome é obrigatório'
    };
  }

  const contemNumeros = /\d/.test(nome);
  
  if (contemNumeros) {
    return {
      valid: false,
      error: 'Nome não pode conter números'
    };
  }

  const apenasLetrasECaracteresEspeciais = /^[^\d]+$/.test(nome);
  
  if (!apenasLetrasECaracteresEspeciais) {
    return {
      valid: false,
      error: 'Nome deve conter apenas letras e caracteres especiais'
    };
  }

  return {
    valid: true,
    error: null
  };
}

function validarSenha(senha) {
  if (!senha || senha.trim() === '') {
    return {
      valid: false,
      error: 'Senha é obrigatória'
    };
  }

  if (senha.length < 6) {
    return {
      valid: false,
      error: 'Senha deve ter no mínimo 6 caracteres'
    };
  }

  const contemMaiuscula = /[A-Z]/.test(senha);
  if (!contemMaiuscula) {
    return {
      valid: false,
      error: 'Senha deve conter pelo menos uma letra maiúscula'
    };
  }

  const contemMinuscula = /[a-z]/.test(senha);
  if (!contemMinuscula) {
    return {
      valid: false,
      error: 'Senha deve conter pelo menos uma letra minúscula'
    };
  }

  const contemNumero = /\d/.test(senha);
  if (!contemNumero) {
    return {
      valid: false,
      error: 'Senha deve conter pelo menos um número'
    };
  }

  const contemCaractereEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);
  if (!contemCaractereEspecial) {
    return {
      valid: false,
      error: 'Senha deve conter pelo menos um caractere especial (!@#$%^&*()_+-=[]{};\':"|,.<>/?)'
    };
  }

  return {
    valid: true,
    error: null
  };
}

function validarCredenciais(nome, senha) {
  const errors = [];

  const nomeValidation = validarNomeUsuario(nome);
  if (!nomeValidation.valid) {
    errors.push(nomeValidation.error);
  }

  const senhaValidation = validarSenha(senha);
  if (!senhaValidation.valid) {
    errors.push(senhaValidation.error);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function getDicasSenha() {
  return [
    'Mínimo de 6 caracteres',
    'Pelo menos uma letra maiúscula (A-Z)',
    'Pelo menos uma letra minúscula (a-z)',
    'Pelo menos um número (0-9)',
    'Pelo menos um caractere especial (!@#$%^&*...)'
  ];
}

export {
  validarNomeUsuario,
  validarSenha,
  validarCredenciais,
  getDicasSenha
};
