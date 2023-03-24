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

export const currentFormName = atomWithStorage('currentFormName', 'New Data');

export const pastSessionData = atomWithStorage('pastSessionData', []);

export const currentPageName = atomWithStorage('currentPageName', 'Home');

export const editingPrevious = atomWithStorage('editingPrevious', false);

export const pastEntryIndex = atomWithStorage('pastEntryIndex', -1);

export const notificationText = atomWithStorage('notificationText', '');

export const appMode = atomWithStorage('appMode', 'test');

export const toeCodeLoadedAtom = atom(false);

export const lizardDataLoadedAtom = atom(false);

export const lizardLastEditTime = atomWithStorage('lizardLastEditTime', 0);
