export function numeroATexto(num) {
  const unidades = ["", "Uno", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve"];
  const decenas = ["", "Diez", "Veinte", "Treinta", "Cuarenta", "Cincuenta", "Sesenta", "Setenta", "Ochenta", "Noventa"];
  const diecis = ["Diez", "Once", "Doce", "Trece", "Catorce", "Quince", "Dieciséis", "Diecisiete", "Dieciocho", "Diecinueve"];
  const veintis = ["Veinte", "Veintiuno", "Veintidós", "Veintitrés", "Veinticuatro", "Veinticinco", "Veintiseis", "Veintisiete", "Veintiocho", "Veintinueve"];
  const centenas = ["", "Ciento", "Doscientos", "Trescientos", "Cuatrocientos", "Quinientos", "Seiscientos", "Setecientos", "Ochocientos", "Novecientos"];

  if (num === 0) return "Cero";
  if (num < 10) return unidades[num];
  if (num < 20) return diecis[num - 10];
  if (num < 30) return veintis[num - 20];
  if (num < 100) return decenas[Math.floor(num / 10)] + (num % 10 !== 0 ? " y " + unidades[num % 10] : "");

  if (num < 1000) {
    return centenas[Math.floor(num / 100)] + (num % 100 !== 0 ? " " + numeroATexto(num % 100) : "");
  }

  if (num < 1000000) {
    const miles = Math.floor(num / 1000);
    const resto = num % 1000;
    return (miles === 1 ? "Mil" : numeroATexto(miles) + " Mil") + (resto !== 0 ? " " + numeroATexto(resto) : "");
  }

  return "Número demasiado grande";
}

