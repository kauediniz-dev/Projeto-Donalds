export const removeCpfPoctuation = (cpf: string): string => {
  return cpf.replace(/[\.\-]+/g, "");
};

export function isValidCPF(cpf: string): boolean {
  // 1. Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/[^\d]+/g, "");

  // 2. Valida se o formato básico está correto (11 dígitos, não repetidos)
  if (cpfLimpo.length !== 11 || !!cpfLimpo.match(/(\d)\1{10}/)) {
    return false;
  }

  // 3. Função auxiliar para calcular os dígitos verificadores
  const calcularDigito = (parteCPF: string, pesoInicial: number): number => {
    let soma = 0;
    for (let i = 0; i < parteCPF.length; i++) {
      soma += parseInt(parteCPF.charAt(i)) * (pesoInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 || resto === 11 ? 0 : resto;
  };

  // 4. Validação do primeiro dígito
  const primeiroDigito = calcularDigito(cpfLimpo.substring(0, 9), 10);
  if (primeiroDigito !== parseInt(cpfLimpo.charAt(9))) {
    return false;
  }

  // 5. Validação do segundo dígito
  const segundoDigito = calcularDigito(cpfLimpo.substring(0, 10), 11);
  if (segundoDigito !== parseInt(cpfLimpo.charAt(10))) {
    return false;
  }

  return true;
}

// Exemplos de uso:
console.log(isValidCPF("123.456.789-00")); // false
console.log(isValidCPF("111.111.111-11")); // false
// console.log(isValidCPF('CPF_VALIDO_AQUI')); // true
