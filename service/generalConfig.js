module.exports = {
  getGeneralConfig: async (axios) => {
    return await axios.$get('/config/general')
  },
  updateGeneralConfig: async (axios, payload) => {
    const response = await axios.$put('/config/general', payload)
    return response.data || response
  },
  getEmailTemplates: async (axios) => {
    return await axios.$get('/api/mailer/templates')
  },
  updateEmailTemplate: async (axios, key, payload) => {
    const response = await axios.$put(`/api/mailer/templates/${key}`, payload)
    return response.data || response
  },
  previewEmailTemplate: async (axios, key, context) => {
    return await axios.$post(`/api/mailer/templates/${key}/preview`, context)
  },
}
