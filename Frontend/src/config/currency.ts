// Devise affichée dans toute l'application. Un seul endroit à modifier
// pour adapter l'app à un autre pays/une autre devise.
export const CURRENCY_LABEL = "DA";

export const formatMoney = (value: number) =>
  `${value.toLocaleString("fr-FR")} ${CURRENCY_LABEL}`;
