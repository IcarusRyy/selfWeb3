import { makeAutoObservable } from 'mobx'

class UserInfoStore {
  isLoggedIn: boolean = false
  selfAddress: string = ''
  web2Address: string = ''
  constructor() {
    makeAutoObservable(this)
  }
  changeLoginStatus(status: boolean) {
    this.isLoggedIn = status
  }
}

const userInfo = new UserInfoStore()

export default userInfo
