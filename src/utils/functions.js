export const updateData = (
  species, 
  incomingData,
  setCurrentData,
  currentData,
  setCurrentForm
) => {
  setCurrentData({
    ...currentData,
    [species]: [
      ...currentData[species],
      incomingData
    ]
  })
  setCurrentForm("New Data Entry")
}