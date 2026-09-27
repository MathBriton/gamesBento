const SUFIXOS = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

/** Números grandes no estilo clicker: 950, 1.25K, 34.5M, 120B... */
export function formatarNumero(n: number): string {
  if (!Number.isFinite(n)) return '∞';
  if (n < 0) return `-${formatarNumero(-n)}`;
  if (n < 1000) return n < 10 && n % 1 !== 0 ? n.toFixed(1) : String(Math.floor(n));
  const grupo = Math.floor(Math.log10(n) / 3);
  if (grupo >= SUFIXOS.length) return n.toExponential(2).replace('+', '');
  const valor = n / 1000 ** grupo;
  const texto = valor < 10 ? valor.toFixed(2) : valor < 100 ? valor.toFixed(1) : String(Math.floor(valor));
  return `${texto}${SUFIXOS[grupo]}`;
}

export function formatarDuracao(ms: number): string {
  const totalMin = Math.floor(ms / 60_000);
  const horas = Math.floor(totalMin / 60);
  const minutos = totalMin % 60;
  if (horas === 0) return `${minutos}min`;
  return minutos === 0 ? `${horas}h` : `${horas}h ${minutos}min`;
}
