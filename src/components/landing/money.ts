export function money(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export function monthlyContribution(targetCents: number, savedCents: number, months: number) {
  if (
    ![targetCents, savedCents, months].every(Number.isSafeInteger) ||
    targetCents < 0 ||
    savedCents < 0 ||
    months < 1
  )
    throw new RangeError("Use centavos inteiros não negativos e um prazo de pelo menos um mês.");
  return Math.ceil(Math.max(0, targetCents - savedCents) / months);
}
