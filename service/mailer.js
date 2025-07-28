export default {
  async enviarCorreo(axios, { destinatario, asunto, mensaje }) {
    const mensajeConFooter = mensaje + this.getFooter();
    return await axios.$post('/api/mailer', {
      destinatario,
      asunto,
      mensaje: mensajeConFooter
    });
  },

  // Footer común para todos los correos
  getFooter() {
    return `

Saludos cordiales,
Municipalidad de Villa Gesell

---
Este es un correo automático, por favor no responda a esta dirección.
Para consultas, comuníquese con el área correspondiente.`;
  }
}
