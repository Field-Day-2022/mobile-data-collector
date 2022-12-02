import { motion } from "framer-motion"

export default function ConfirmationModal({
  data,
  completeCapture,
  setConfirmationModalIsOpen,
  modalType
}) {

  const displayData = () => {
    let outputArray = []

    if (modalType === 'lizard') {
      for (const dataPoint in data) {
        if (data[dataPoint]) {
          let displayText = dataPoint;

          if (dataPoint === 'speciesCode') displayText = 'Species Code'
          if (dataPoint === 'trap') displayText = 'Trap'
          if (dataPoint === 'toeCode') displayText = 'Toe Clip Code'
          if (dataPoint === 'svl') displayText = 'SVL (mm)'
          if (dataPoint === 'vtl') displayText = 'VTL (mm)'
          if (dataPoint === 'otl') displayText = 'OTL (mm)'
          if (dataPoint === 'massGrams') displayText = 'Mass (g)'
          if (dataPoint === 'sex') displayText = 'Sex'
          if (dataPoint === 'comments') displayText = 'Comments'

          outputArray.push(
            <p key={dataPoint}>{`${displayText}: ${data[dataPoint]}`}</p>
          )
        }
      }
    }

    if (modalType === 'amphibian') {
      for (const dataPoint in data) {
        if (data[dataPoint]) {
          let displayText = dataPoint;
          if (dataPoint === 'speciesCode') displayText = 'Species Code'
          if (dataPoint === 'trap') displayText = 'Trap'
          if (dataPoint === 'hdBody') displayText = 'Hd Body'
          if (dataPoint === 'mass') displayText  = "Mass (g)"
          if (dataPoint === 'sex') displayText = 'Sex'
          if (dataPoint === 'isDead') displayText = 'Is it dead?'
          if (dataPoint === 'comments') displayText = 'Comments'
          outputArray.push(
            <p key={dataPoint}>{`${displayText}: ${data[dataPoint]}`}</p>
          )
        }
      }
    }

    if (modalType === 'arthropod') {
      console.log(data)
      for (const dataPoint in data) {
        if (data[dataPoint]) {
          let displayText = dataPoint;
          if (dataPoint === 'speciesCode') displayText = 'Species Code'
          if (dataPoint === 'trap') displayText = 'Trap'
          if (dataPoint === 'comments') displayText = 'Comments'
          if (dataPoint === 'predator') displayText = 'Predator?'
          if (dataPoint !== 'arthropodData') {
            outputArray.push(
              <p key={dataPoint}>{`${displayText}: ${data[dataPoint]}`}</p>
            )
          } else if (dataPoint === 'arthropodData') {
            for (const arthropodEntry in data.arthropodData) {
              outputArray.push(
                <p key={arthropodEntry}>
                  {`${arthropodEntry}: ${data.arthropodData[arthropodEntry]}`}
                </p>
              )
            }
          }
        }
      }
    }

    if (modalType === 'mammal') {
      for (const dataPoint in data) {
        if (data[dataPoint]) {
          let displayText = dataPoint;
          if (dataPoint === 'speciesCode') displayText = 'Species Code'
          if (dataPoint === 'trap') displayText = 'Trap'
          if (dataPoint === 'mass') displayText  = "Mass (g)"
          if (dataPoint === 'sex') displayText = 'Sex'
          if (dataPoint === 'isDead') displayText = 'Is it dead?'
          if (dataPoint === 'comments') displayText = 'Comments'
          outputArray.push(
            <p key={dataPoint}>{`${displayText}: ${data[dataPoint]}`}</p>
          )
        }
      }
    }


    return outputArray;
  }

  return (
    <motion.div className="absolute h-full w-full flex justify-center"
      initial={{opacity: 0}}
      animate={{opacity: 1}}
    >
      <div className="relative bg-white/95 h-5/6 w-3/4">
        <p className="text-2xl mt-2 mb-2">Verify</p>
        {displayData()}
        <div className="absolute bottom-0 w-full flex justify-between">
          <button className="active:scale-90 transition bg-asu-maroon text-asu-gold p-3 rounded-xl m-2 w-1/2 font-bold text-xl"
            onClick={() => {
              setConfirmationModalIsOpen(false)
            }}
          >Go Back</button>
          <button className="active:scale-90 transition bg-asu-maroon text-asu-gold p-3 rounded-xl m-2 w-1/2 font-bold text-xl"
            onClick={() => {
              completeCapture()
            }}
          >Confirm</button>
        </div>
      </div>
    </motion.div>
  )
}