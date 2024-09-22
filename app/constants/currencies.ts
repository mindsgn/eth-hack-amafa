interface Currency {
  name: string;
  symbol: string;
  country: string;
}

const currencies: Currency[] = [
  {
    name: "ZAR",
    symbol: "R",
    country: "South Africa"
  }
  /*
  { title: "USD" },  // US Dollar
  { title: "EUR" },  // Euro
  { title: "JPY" },  // Japanese Yen
  { title: "GBP" },  // British Pound Sterling
  { title: "AUD" },  // Australian Dollar
  { title: "CAD" },  // Canadian Dollar
  { title: "CHF" },  // Swiss Franc
  { title: "CNY" },  // Chinese Yuan
  { title: "SEK" },  // Swedish Krona
  { title: "NZD" },  // New Zealand Dollar
  { title: "MXN" },  // Mexican Peso
  { title: "SGD" },  // Singapore Dollar
  { title: "HKD" },  // Hong Kong Dollar
  { title: "NOK" },  // Norwegian Krone
  { title: "KRW" },  // South Korean Won
  { title: "TRY" },  // Turkish Lira
  { title: "RUB" },  // Russian Ruble
  { title: "INR" },  // Indian Rupee
  { title: "BRL" },  // Brazilian Real
  { title: "ZAR" },  // South African Rand
  { title: "DKK" },  // Danish Krone
  { title: "PLN" },  // Polish Zloty
  { title: "THB" },  // Thai Baht
  { title: "IDR" },  // Indonesian Rupiah
  { title: "HUF" },  // Hungarian Forint
  { title: "CZK" },  // Czech Koruna
  { title: "ILS" },  // Israeli Shekel
  { title: "CLP" },  // Chilean Peso
  { title: "PHP" },  // Philippine Peso
  { title: "AED" },  // UAE Dirham
  { title: "SAR" },  // Saudi Riyal
  { title: "MYR" },  // Malaysian Ringgit
  { title: "RON" }   // Romanian Leu
  */
  ];

export { currencies }