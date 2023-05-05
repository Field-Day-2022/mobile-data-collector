import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';

export const currentSessionData = atomWithStorage('currentSessionData', {
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
});

export const sessionObject = atomWithStorage('sessionObject', {});

export const currentFormName = atomWithStorage('currentFormName', 'New Data');

export const pastSessionData = atomWithStorage('pastSessionData', []);

export const currentPageName = atomWithStorage('currentPageName', 'Collect Data');

export const editingPrevious = atomWithStorage('editingPrevious', false);

export const pastEntryIndex = atomWithStorage('pastEntryIndex', -1);

export const notificationText = atomWithStorage('notificationText', '');

export const appMode = atomWithStorage('appMode', 'live');

export const toeCodeLoadedAtom = atom(false);

export const lizardDataLoadedAtom = atom(false);

export const lizardLastEditTime = atomWithStorage('lizardLastEditTime', 0);

export const triggerUpdateOnLastEditTime = atom(false);
