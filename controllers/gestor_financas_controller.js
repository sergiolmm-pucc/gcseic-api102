function calcularINSS(salario) {
    if (salario <= 1518) return salario * 0.075;
    if (salario <= 2793.88) return salario * 0.09 - 22.77;
    if (salario <= 4190.83) return salario * 0.12 - 106.59;
    if (salario <= 8157.41) return salario * 0.14 - 190.40;
    return 8157.41 * 0.14 - 190.40; // teto INSS
  }
  
  function calcularIRPF(salarioBase) {
    if (salarioBase <= 2259.20) return 0;
    if (salarioBase <= 2826.65) return salarioBase * 0.075 - 169.44 - 607.20;
    if (salarioBase <= 3751.05) return salarioBase * 0.15 - 381.44 - 607.20;
    if (salarioBase <= 4664.68) return salarioBase * 0.225 - 662.77 - 607.20;
    const ir = salarioBase * 0.275 - 896.00 - 607.20;
    return ir < 0 ? 0 : ir;
  }
  
  function validarDados(body) {
    if (typeof body.salarioBruto !== 'number' || body.salarioBruto <= 0) {
      return 'Salário bruto inválido ou ausente.';
    }
    if (!Array.isArray(body.gastosFixos)) {
      return 'Gastos fixos devem ser uma lista.';
    }
    for (const gasto of body.gastosFixos) {
      if (typeof gasto.nome !== 'string' || gasto.nome.trim() === '') {
        return 'Nome do gasto inválido.';
      }
      if (typeof gasto.valor !== 'number' || gasto.valor < 0) {
        return 'Valor do gasto inválido.';
      }
    }
    if (typeof body.percentualInvestimento !== 'number' ||
        body.percentualInvestimento < 0 || body.percentualInvestimento > 100) {
      return 'Percentual para investimento inválido.';
    }
    if (typeof body.percentualLazer !== 'number' ||
        body.percentualLazer < 0 || body.percentualLazer > 100) {
      return 'Percentual para lazer inválido.';
    }
    return null;
  }
  
  exports.calcularFinancas = (req, res) => {
    const erro = validarDados(req.body);
    if (erro) {
      return res.status(400).json({ erro });
    }
  
    const {
      salarioBruto,
      gastosFixos,
      percentualInvestimento,
      percentualLazer,
    } = req.body;
  
    // Soma gastos fixos
    const gastosTotais = gastosFixos.reduce((acc, g) => acc + g.valor, 0);
  
    // Calcula INSS
    const inss = calcularINSS(salarioBruto);
  
    // Base para IRPF
    const baseIRPF = salarioBruto - inss;
  
    // Calcula IRPF
    const irpf = calcularIRPF(baseIRPF);
  
    // Salário líquido após descontos e gastos
    const salarioLiquido = salarioBruto - inss - irpf - gastosTotais;
  
    // Valores para investimento e lazer
    const valorInvestimento = salarioLiquido * percentualInvestimento / 100;
    const valorLazer = salarioLiquido * percentualLazer / 100;
  
    // Saldo final disponível
    const saldoFinal = salarioLiquido - valorInvestimento - valorLazer;
  
    return res.json({
      inss: Number(inss.toFixed(2)),
      irpf: Number(irpf.toFixed(2)),
      gastosTotais: Number(gastosTotais.toFixed(2)),
      salarioLiquido: Number(salarioLiquido.toFixed(2)),
      valorInvestimento: Number(valorInvestimento.toFixed(2)),
      valorLazer: Number(valorLazer.toFixed(2)),
      saldoFinal: Number(saldoFinal.toFixed(2)),
    });
  };
  