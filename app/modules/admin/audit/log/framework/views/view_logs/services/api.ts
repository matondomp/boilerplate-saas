import axios from 'axios'
import { LogsWithPaginationProps } from '../types.js'

export default {
  getLogs: async (queryString: string): Promise<{ data: LogsWithPaginationProps }> => {
    return axios.get(`/api/account/admin/audit/logs?${queryString}`)
  },
  extractLogs: async (format: string, queryString: string): Promise<any> => {
    return axios.get(`/api/account/admin/audit/logs/extract?fileFormat=${format}&${queryString}`, {
      responseType: 'arraybuffer',
    })
  },
}
