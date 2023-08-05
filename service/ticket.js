const formatTicket = (TicketResponse) => ({
  id: TicketResponse._id,
  current: TicketResponse.current,
})

module.exports = {
  getCurrent: async (axios) => {
    const response = await axios.$get('/ticket/')
    return response.data.map(formatTicket)
  },
}
