import { UserState } from 'redux/types/user.types'

const defaultState: UserState = {
  firstName: '',
  lastName: '',
  email: '',
  institution: {
    id: '',
    name: '',
    profileImage: '',
    colors: [],
    lastUpdated: '',
  },
  meta: {
    dateCreated: '',
  },
  role: '',
  systemUser: false,
  features: [],
  accountId: '',
  externalId: '',
}

export default defaultState
