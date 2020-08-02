import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const add = personObject => {
    const request = axios.post(baseUrl, personObject)
    return request.then(response => response.data)
}

const update = (id, personObject) => {
  const request = axios.put(`${baseUrl}/${id}`, personObject)
  return request.then(response => response.data)
}

const deleteEntry = id => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, add, update, deleteEntry }
