import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Button, Form, FormLabel, Image} from "react-bootstrap";
import toeClipIcon from "../../img/toe-clip-btn-img.png";
import generateIcon from "../../img/sync data.png";
import historyIcon from "../../img/unsync-history.png";
import ToeClipModal from "../toe-clip-example-modal/toe-clip-modal";
import ToeClipExampleImage from "../../img/toe-clip-example-img.png";
import CaptureHistory from "../capture-history-modal/capture-history-modal";
import {getAnswerSetByName} from "../../indexeddb/DbAnswerSetHandler";
import {UPDATE_CURRENT_FORM} from "../../redux/actions/session-actions";
import {showErrorMessage, disableComponent} from "../../utils/utils";
import * as CONSTANTS from '../../constants';
import {getDataEntry} from "../../indexeddb/DbDataEntryHandler";
import {
    ADD_USED_CODE,
    REMOVE_USED_CODE,
} from "../../redux/actions/toe-clip-code-actions";
import ToeErrorMessage from "../error-message/toe-clip-error-message";
import {getSession} from "../../indexeddb/DbSessionHandler";

const ToeClipCodeWrapper = ({field}) => {
    const dispatch = useDispatch();

    // Redux Store
    const current_slice = useSelector(state => state.Session_Info.currentSession);
    const current_error_state = useSelector(state => state.Session_Info.currentErrorState);
    const redux_field = useSelector(state => state.Session_Info.currentSession.data);
    const currentSite = useSelector(state => state.Location_Info.site);
    const currentToeClipCodes = useSelector(state => state.Toe_Clip_Code[currentSite]);

    const [modalShowing, updateModalShowing] = useState(false);
    const [showCaptureHistory, setShowCaptureHistory] = useState(false);
    const [captureHistoryList, setCaptureHistoryList] = useState([])
    const [showCodeInUse, setShowCodeInUse] = useState(false);


    // Local State
    const [relies_on, setReliesOn] = useState([]);

    useEffect(() => {
        setReliesOn(current_slice.reliesOn);
    }, [current_slice.reliesOn]);

    const recaptureLookUp = async () => {
        if (!(redux_field[CONSTANTS.SPECIES_CODE] && redux_field[CONSTANTS.TOE_CLIP_CODE] && currentSite)) {
            return
        }
        let captureHistoryEntryID = currentToeClipCodes[redux_field[CONSTANTS.SPECIES_CODE]]
            .filter(o => o.toeClipCode === redux_field[CONSTANTS.TOE_CLIP_CODE]);

        const captureHistoryIDs = captureHistoryEntryID.map((entry) => entry.entry_id);
        let captureHistoryInfoList = []
        for (const entry_id of captureHistoryIDs) {
            const captureHistoryData = await getDataEntry(entry_id);
            let sessionInfo = await getSession(captureHistoryData.session_id)
            let listDataWithoutDate = captureHistoryData.entry_json;
            listDataWithoutDate.Array = sessionInfo.session_json.Array
            listDataWithoutDate.DateUnmodified = new Date(sessionInfo.date_created * 1000);
            listDataWithoutDate.Date = (new Date(sessionInfo.date_created * 1000)).toLocaleDateString("en-US");
            captureHistoryInfoList.push(captureHistoryData.entry_json)
        }

        const arraySorted = (array) => {
            //sort list by date
            for (let i = 0; i < array.length - 1; i++) {
                let dateOne = array[i].DateUnmodified;
                let dateTwo = array[i + 1].DateUnmodified;
                if (dateOne > dateTwo) {
                    return false;
                }
            }
            return true;
        }

        const sortArrayByDates = (array) => {
            //sort list by date
            for (let i = 0; i < array.length - 1; i++) {
                let dateOne = array[i].DateUnmodified;
                let dateTwo = array[i + 1].DateUnmodified;
                if (dateOne > dateTwo) {
                    let temp = array[i]
                    array[i] = array[i + 1];
                    array[i + 1] = temp;
                }
            }
        }
        let sortedFlag = false;
        while(!sortedFlag) {
            sortArrayByDates(captureHistoryInfoList);
            if (arraySorted(captureHistoryInfoList)) {
                sortedFlag = true;
            }
        }


        setCaptureHistoryList(captureHistoryInfoList)




        captureHistoryEntryID = captureHistoryEntryID[0].entry_id
        const captureHistoryInfo = await getDataEntry(captureHistoryEntryID);
        return !!captureHistoryInfo;
    };

    const handleShowCaptureHistory = () => {
        const success = () => {
            setShowCaptureHistory(true);
        };
        const failure = (err) => console.log('Failure getting History: ', err);

        recaptureLookUp().then(success, failure);
    };

    const validateToeClipCode = (code) => {
        // const regex = RegExp('^([A-D])([1-5])[A-D][1-5]([A-D])([1-5])[A-D][1-5]$');
        const regex = RegExp("^(A[1-5]){0,5}(B[1-5]){0,5}(C[1-5]){0,5}(D[1-5]){0,5}$");
        return regex.test(code);
    };

    const codeNotUsed = (code) => {
        let returnBoolean = true;
        if (currentToeClipCodes[redux_field[CONSTANTS.SPECIES_CODE]]) {
            currentToeClipCodes[redux_field[CONSTANTS.SPECIES_CODE]].forEach((toeClipCodeObject) => {
                if (toeClipCodeObject.toeClipCode === code) {
                    returnBoolean = false;
                }
            })
        }
        return returnBoolean;
    }

    const handleToeClipValidation = (e) => {
        if (
            e.target.value.toString().length % 2 === 0
            && validateToeClipCode(e.target.value)
            && codeNotUsed(e.target.value)
        ) {
            // removeFromErrors('toeClipCode');
            dispatch({
                type: REMOVE_USED_CODE,
            })
            setShowCodeInUse(false)
        } else {
            dispatch({
                type: ADD_USED_CODE,
            })
            setShowCodeInUse(true)
            // addError('toeClipCode', 'Does not match the pattern');
        }
    };

    const handleToeClipCodeOnChange = (e) => {
        // setToeClipCode(e.target.value);
        handleToeClipValidation(e);
        dispatch({
            type: UPDATE_CURRENT_FORM,
            payload: {[field.prompt]: e.target.value}
        })
    }

    const generateToeClipCode = async () => {
        if (!(redux_field[CONSTANTS.SPECIES_CODE] && currentSite)) {
            return
        }
        let generatedCode = '';
        let toeClipCodesStrings = []
        for (const toeClipObj of currentToeClipCodes[redux_field[CONSTANTS.SPECIES_CODE]]) {
            toeClipCodesStrings.push(toeClipObj["toeClipCode"])
        }
        await getAnswerSetByName('toe clip codes').then((value => {
                    for (let currentCode of value.answers) {
                        let toeClipCode = currentCode.primary
                        if (!toeClipCodesStrings.includes(toeClipCode) && !toeClipCode.includes('C4') && !toeClipCode.includes('D4')) {
                            generatedCode = toeClipCode;
                            dispatch({
                                type: UPDATE_CURRENT_FORM,
                                payload: {[field.prompt]: generatedCode}
                            })
                            dispatch({
                                type: REMOVE_USED_CODE,
                            })
                            break;
                        }
                    }
                }
            )
        )
    }

    return (
        <ToeErrorMessage
            key={`Recapture-error-message`}
            hasErrors={showErrorMessage("toeClipCode", {...current_error_state})}
        >
            <Form.Group
                controlId={field.prompt}
                key={field.prompt}
            >
                <div className={redux_field[CONSTANTS.RECAPTURE] ? 'toe-clip-question-column' : 'toe-clip-question-row'}>
                    <div className='toe-clip-question-row'>
                        <FormLabel>{field.prompt}</FormLabel>
                        <Button
                            variant='success'
                            aria-label='Open Toe Clip Example.'
                            // className='green-rounded-rect'
                            onClick={() => updateModalShowing(true)}
                            style={{backgroundColor: "#1d8d69", borderRadius: 10}}
                        >
                            <Image
                                // className='lizard-icon'
                                src={toeClipIcon}
                                alt=''
                                style={{maxHeight: 40, minHeight: 40}}
                            />
                        </Button>
                        {redux_field[CONSTANTS.RECAPTURE] ?
                            <Button
                                variant='success'
                                aria-label='Generator Toe Clip Code.'
                                // className='grey-rounded-rect'
                                onClick={handleShowCaptureHistory}
                                style={{backgroundColor: "#690014", borderRadius: 10}}
                            >
                                <Image
                                    // className='lizard-icon'
                                    src={historyIcon}
                                    alt={''}
                                    style={{maxHeight: 40, minHeight: 40}}
                                />
                            </Button>
                            : <Button
                                variant='success'
                                aria-label='Generator Toe Clip Code.'
                                // className='grey-rounded-rect'
                                onClick={generateToeClipCode}
                                style={{backgroundColor: "#1b1e21", borderRadius: 10}}
                            >
                                <Image
                                    // className='lizard-icon'
                                    src={generateIcon}
                                    alt={''}
                                    style={{maxHeight: 40, minHeight: 40}}
                                />
                            </Button>
                        }
                        <Form.Control
                            name={field.prompt}
                            type='text'
                            component='input'
                            label={field.prompt}
                            placeholder="Toe Clip Code"
                            maxLength={10}
                            className='rounded-input-fields'
                            value={redux_field[CONSTANTS.TOE_CLIP_CODE]}
                            onChange={(e) => handleToeClipCodeOnChange(e)}
                            disabled={disableComponent(current_slice, field, relies_on)}

                        />
                    </div>
                </div>

                <ToeClipModal
                    show={modalShowing}
                    onHide={() => updateModalShowing(false)}
                    ToeClipExampleImage={ToeClipExampleImage}
                    toeClipCode={redux_field["Toe-clip Code"]}
                    updateToeClipCode={(e) => dispatch({
                        type: UPDATE_CURRENT_FORM,
                        payload: {[field.prompt]: e}
                    })}
                />
                <CaptureHistory
                    show={showCaptureHistory}
                    onHide={() => setShowCaptureHistory(false)}
                    captureHistory={captureHistoryList}
                    currentSite={currentSite}
                    currentSpecies={redux_field[CONSTANTS.SPECIES_CODE]}
                    currentToeClipCode={redux_field[CONSTANTS.TOE_CLIP_CODE]}
                />
            </Form.Group>
        </ToeErrorMessage>
    );
};

export default ToeClipCodeWrapper;
