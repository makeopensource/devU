import { UserState } from 'redux/types/user.types'

const defaultState: UserState = {
  id: undefined,
  accessToken: '',
  externalId: '',
  email: '',
  createdAt: '',
  updatedAt: '',
  preferredName: '',
}

export default defaultState
