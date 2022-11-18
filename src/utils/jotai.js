import { 
  atomWithStorage
} from 'jotai/utils'

export const currentSessionData = atomWithStorage(
  'currentSessionData',
  {
    captureStatus: '',
    array: '',
    project: '',
    site: '',
    handler: '',
    recorder: '',
    arthropod: [],
    amphibian: [],
    lizard: [],
    mammal: [],
    snake: [],
  }
)

export const currentFormName = atomWithStorage('currentFormName', 'New Data')