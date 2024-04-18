const formatDocs = (FileResponse) => {
    const formattedDocs = {};
    for (const key in FileResponse) {
      if (FileResponse.hasOwnProperty(key)) {
        formattedDocs[key] = FileResponse[key];
      }
    }
    return formattedDocs;
  };

export async function getById(axios, { id }) {
  const fileResponse = await axios.$get(`/abiertoAnual/facturas/${id}`);
  return formatDocs(fileResponse.data);
}
  