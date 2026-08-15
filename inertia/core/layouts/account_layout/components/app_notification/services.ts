import axios from 'axios'

export default {
  notifications() {
    return axios.get('/api/account/me/notifications')
  },
}
