import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { currentFormName, currentSessionData } from '../utils/jotai';

import { useCollectionData } from 'react-firebase-hooks/firestore'
import { db } from '../index';

import {
  collection,
  setDoc,
  query,
  where,
  doc,
  getDocs,
  addDoc,
} from 'firebase/firestore';

import FormWrapper from '../components/FormWrapper';
import Dropdown from '../components/Dropdown';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

export const FinishSessionForm = () => {
  const [currentData, setCurrentData] = useAtom(currentSessionData);
  const [currentForm, setCurrentForm] = useAtom(currentFormName);

  const [trapStatus, setTrapStatus] = useState();
  const [comments, setComments] = useState();

  const [
    answerSet,
    answerSetLoading, 
    answerSetError, 
    answerSetSnapshot, 
  ] = useCollectionData(collection(db, 'AnswerSet'))

  const uploadSessionData = async (sessionObj) => {
    const docRef = await addDoc(
      collection(db, `Test${currentData.project}Session`),
      sessionObj
    );
    console.log(`doc written with id ${docRef.id}`);
  };

  const finishSession = () => {
    const date = new Date();
    const sessionObj = {
      array: currentData.array,
      commentsAboutTheArray: comments,
      dateTime: date.toLocaleString(),
      handler: currentData.handler,
      noCaptures: currentData.captureStatus,
      recorder: currentData.recorder,
      site: currentData.site,
      trapStatus: trapStatus,
      year: date.getFullYear(),
    };
    console.log(`Uploading to ${currentData.project}Session collection (test)`);
    console.log(sessionObj);
    const dataObjTemplate = {
      aran: 'N/A',
      array: 'N/A',
      auch: 'N/A',
      blat: 'N/A',
      cclMm: 'N/A',
      chil: 'N/A',
      cole: 'N/A',
      comments: 'N/A',
      crus: 'N/A',
      dateTime: 'N/A',
      dead: 'N/A',
      derm: 'N/A',
      diel: 'N/A',
      dipt: 'N/A',
      fenceTrap: 'N/A',
      genus: 'N/A',
      hatchling: 'N/A',
      hdBody: 'N/A',
      hete: 'N/A',
      hyma: 'N/A',
      lepi: 'N/A',
      mant: 'N/A',
      massG: 'N/A',
      micro: 'N/A',
      orth: 'N/A',
      otlMm: 'N/A',
      plMm: 'N/A',
      predator: 'N/A',
      pseu: 'N/A',
      recapture: 'N/A',
      regenTail: 'N/A',
      scor: 'N/A',
      sessionDateTime: 'N/A',
      sex: 'N/A',
      site: 'N/A',
      soli: 'N/A',
      species: 'N/A',
      speciesCode: 'N/A',
      svlMm: 'N/A',
      taxa: 'N/A',
      thys: 'N/A',
      toeClipCode: 'N/A',
      unki: 'N/A',
      vtlMm: 'N/A',
      year: 'N/A',
    }
    let dataArray = [];
    if (currentData.amphibian) {
      for (const dataEntry of currentData.amphibian) {
        const [genus, species] = getGenusSpecies(currentData.project, "Amphibian", dataEntry.speciesCode)
        const obj = structuredClone(dataObjTemplate)
        obj.array = currentData.array
        obj.dateTime = date.toLocaleString()
        obj.dead = dataEntry.isDead
        obj.fenceTrap = dataEntry.trap
        obj.genus = genus
        obj.hdBody = dataEntry.hdBody
        obj.massG = dataEntry.massG 
        obj.sessionDateTime = date.toLocaleString()
        obj.sex = dataEntry.sex
        obj.site = currentData.site
        obj.species = species
        obj.speciesCode = dataEntry.speciesCode
        obj.taxa = "Amphibian"
        obj.year = date.getFullYear()
        dataArray.push(obj)
      }
    }
    console.log(dataArray);
  };

  const getGenusSpecies = (project, taxa, speciesCode) => {
    for (const set of answerSet) {
      if (set.set_name === `${project}${taxa}Species`) {
        // console.log(set)
        for (const answer of set.answers) {
          if (answer.primary === speciesCode) {
            // console.log(answer.secondary.Genus)
            return [answer.secondary.Genus, answer.secondary.Species]
          }
        }
      }
    }
  }


  return (
    <FormWrapper>
      <Dropdown
        value={trapStatus}
        setValue={setTrapStatus}
        placeholder='Trap Status'
        options={['OPEN', 'CHECKED', 'CHECKED & CLOSED']}
      />
      {trapStatus && (
        <TextInput
          prompt='Comments'
          placeholder='any thoughts about this array?'
          value={comments}
          setValue={setComments}
        />
      )}
      {trapStatus && <Button prompt='Done' clickHandler={finishSession} />}
    </FormWrapper>
  );
};
