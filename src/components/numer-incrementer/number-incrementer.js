import React, {useState, useEffect} from 'react';
import {useSelector} from "react-redux";
import {Button} from "react-bootstrap";
import './number-incrementer.css';
import '../../App.css';

const NumberIncrementer = (props) => {
    // Redux State
    const redux_field = useSelector(state => state.Session_Info.currentSession.data);

    // Local State
    const [currentNumber, setCurrentNumber] = useState(0);
    const [numberKeyPadInput, setNumberKeyPadInput] = useState(false);

    const incrementNumber = () => {
        setCurrentNumber(currentNumber + 1);
        return currentNumber + 1;
    };

    const decrementNumber = () => {
        const decremented = ((currentNumber - 1) >= 0) ? currentNumber - 1 : 0;
        setCurrentNumber(decremented);
        return decremented;
    };

    const changeNumber = (num) => {
        setCurrentNumber(num);
        return num;
    }

    const showValue = () => {
        let result = 0;
        for (const prop in redux_field) {
            if (redux_field.hasOwnProperty(prop)) {
                if (prop === props.label) {
                    result = isNaN(Number(redux_field[prop])) ? 0 : Number(redux_field[prop]);
                    setCurrentNumber(result);
                    break;
                }
            }
        }
        return result;
    };

    useEffect(() => {
        showValue();
    }, []);

    return (
        <div id='number-incrementer'>
            <Button
                className='context-btn'
                onClick={() => {
                    props.decrementCallBack(decrementNumber());
                }}
                disabled={numberKeyPadInput}
            >
                -
            </Button>
            <input
                type="number"
                className='counter-number'
                placeholder={currentNumber}
                onChange={e => {
                    const intVersion = Math.floor(Number(e.target.value));
                    const result = intVersion < 0 ? 0 : intVersion;
                    setNumberKeyPadInput(true);
                    props.incrementCallBack(changeNumber(result));
                }
                }
            />
            <Button
                className='context-btn'
                onClick={() => {
                    props.incrementCallBack(incrementNumber());
                }}
                disabled={numberKeyPadInput}
            >
                +
            </Button>
        </div>
    );
};

export default NumberIncrementer;