import Cookies from 'js-cookie'
import { getRole } from 'src/redux/api/api'

const setCookies = () => {
  const getrole = async () => {
    try {
      const role = await getRole()
      const data = role.data.info
      const cookie = JSON.stringify(data)
      Cookies.set('role', cookie)
    } catch (error) {
      console.log(error)
    }
  }
  getrole()
}

export default setCookies
