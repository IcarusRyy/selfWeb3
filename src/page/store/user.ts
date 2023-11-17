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
  changeSelfAddres(selfAddress: string) {
    this.selfAddress = selfAddress
  }
}

const userInfo = new UserInfoStore()

export default userInfo
