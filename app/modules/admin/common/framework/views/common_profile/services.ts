import axios from 'axios'

export default {
  retrieveActivities: async (userId: string) => {
    return axios.get(`/api/account/${userId}/activities`)
  },
}
