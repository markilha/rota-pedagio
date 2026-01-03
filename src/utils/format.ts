export const formatKm = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);

export const formatMinutes = (value: number) => {
  const hours = Math.floor(value / 60);
  const minutes = Math.round(value % 60);
  if (hours === 0) {
    return `${minutes} min`;
  }
  return `${hours}h ${minutes}min`;
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const formatLiters = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
