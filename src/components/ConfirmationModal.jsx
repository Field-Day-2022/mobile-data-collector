import { motion } from 'framer-motion';

export default function ConfirmationModal({
    data,
    completeCapture,
    setConfirmationModalIsOpen,
    modalType,
    resetFields,
}) {
    const displayData = () => {
        let outputArray = [];

        if (modalType === 'lizard') {
            for (const dataPoint in data) {
                if (data[dataPoint] !== undefined) {
                    let displayText = dataPoint;

                    if (dataPoint === 'speciesCode') displayText = 'Species Code';
                    if (dataPoint === 'trap') displayText = 'Trap';
                    if (dataPoint === 'toeCode') displayText = 'Toe Clip Code';
                    if (dataPoint === 'svl') displayText = 'SVL (mm)';
                    if (dataPoint === 'vtl') displayText = 'VTL (mm)';
                    if (dataPoint === 'otl') displayText = 'OTL (mm)';
                    if (dataPoint === 'massGrams') displayText = 'Mass (g)';
                    if (dataPoint === 'sex') displayText = 'Sex';
                    if (dataPoint === 'comments') displayText = 'Comments';

                    outputArray.push(<p key={dataPoint}>{`${displayText}: ${data[dataPoint]}`}</p>);
                }
            }
        }

        if (modalType === 'amphibian') {
            for (const dataPoint in data) {
                if (data[dataPoint] !== undefined) {
                    let displayText = dataPoint;
                    if (dataPoint === 'speciesCode') displayText = 'Species Code';
                    if (dataPoint === 'trap') displayText = 'Trap';
                    if (dataPoint === 'hdBody') displayText = 'Hd Body';
                    if (dataPoint === 'mass') displayText = 'Mass (g)';
                    if (dataPoint === 'sex') displayText = 'Sex';
                    if (dataPoint === 'isDead') displayText = 'Is it dead?';
                    if (dataPoint === 'comments') displayText = 'Comments';
                    outputArray.push(<p key={dataPoint}>{`${displayText}: ${data[dataPoint]}`}</p>);
                }
            }
        }

        if (modalType === 'arthropod') {
            for (const dataPoint in data) {
                if (data[dataPoint] !== undefined) {
                    let displayText = dataPoint;
                    if (dataPoint === 'speciesCode') displayText = 'Species Code';
                    if (dataPoint === 'trap') displayText = 'Trap';
                    if (dataPoint === 'comments') displayText = 'Comments';
                    if (dataPoint === 'predator') displayText = 'Predator?';
                    if (dataPoint !== 'arthropodData') {
                        outputArray.push(
                            <p key={dataPoint}>{`${displayText}: ${data[dataPoint]}`}</p>,
                        );
                    } else if (dataPoint === 'arthropodData') {
                        for (const arthropodEntry in data.arthropodData) {
                            if (Number(data.arthropodData[arthropodEntry]) > 0) {
                                outputArray.push(
                                    <p key={arthropodEntry}>
                                        {`${arthropodEntry.toUpperCase()}: ${data.arthropodData[arthropodEntry]}`}
                                    </p>,
                                );
                            }
                        }
                    }
                }
            }
        }

        if (modalType === 'mammal') {
            for (const dataPoint in data) {
                if (data[dataPoint] !== undefined) {
                    let displayText = dataPoint;
                    if (dataPoint === 'speciesCode') displayText = 'Species Code';
                    if (dataPoint === 'trap') displayText = 'Trap';
                    if (dataPoint === 'mass') displayText = 'Mass (g)';
                    if (dataPoint === 'sex') displayText = 'Sex';
                    if (dataPoint === 'isDead') displayText = 'Is it dead?';
                    if (dataPoint === 'comments') displayText = 'Comments';
                    outputArray.push(<p key={dataPoint}>{`${displayText}: ${data[dataPoint]}`}</p>);
                }
            }
        }

        if (modalType === 'snake') {
            for (const dataPoint in data) {
                if (data[dataPoint] !== undefined) {
                    let displayText = dataPoint;
                    if (dataPoint === 'speciesCode') displayText = 'Species Code';
                    if (dataPoint === 'trap') displayText = 'Trap';
                    if (dataPoint === 'svl') displayText = 'SVL (mm)';
                    if (dataPoint === 'vtl') displayText = 'VTL (mm)';
                    if (dataPoint === 'mass') displayText = 'Mass (g)';
                    if (dataPoint === 'sex') displayText = 'Sex';
                    if (dataPoint === 'isDead') displayText = 'Is it dead?';
                    if (dataPoint === 'comments') displayText = 'Comments';
                    outputArray.push(<p key={dataPoint}>{`${displayText}: ${data[dataPoint]}`}</p>);
                }
            }
        }

        return outputArray;
    };

    return (
        <motion.div
            className="absolute h-full w-full flex justify-center bg-black/90 z-50 top-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="relative flex flex-col justify-between bg-white h-5/6 w-full border-2 border-asu-maroon overflow-y-auto"
                initial={{ y: '100%', scale: 0 }}
                animate={{ y: 0, scale: 1, transition: { duration: 0.25 } }}
            >
                <div className="overflow-y-auto text-2xl">
                    <p className="text-4xl mt-2 mb-2">Verify</p>
                    {displayData()}
                </div>
                <div className="w-full flex justify-between">
                    <button
                        className="active:scale-90 transition bg-asu-maroon text-asu-gold p-3 rounded-xl m-2 w-1/2 font-bold text-xl"
                        onClick={() => {
                            resetFields();
                            setConfirmationModalIsOpen(false);
                        }}
                    >
                        Go Back
                    </button>
                    <button
                        className="active:scale-90 transition bg-asu-maroon text-asu-gold p-3 rounded-xl m-2 w-1/2 font-bold text-xl"
                        onClick={() => {
                            completeCapture();
                        }}
                    >
                        Confirm
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
