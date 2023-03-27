/* eslint-disable no-undef */
const functions = require('firebase-functions');

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.createBundle = functions.https.onRequest(async (request, response) => {
  const gatewayLizardData = await db.collection('GatewayData')
      .where('taxa', '==', 'Lizard')
      .get();
  const sanPedroLizardData = await db.collection('SanPedroData')
      .where('taxa', '==', 'Lizard')
      .get();
  const virginRiverLizardData = await db
      .collection('VirginRiverData')
      .where('taxa', '==', 'Lizard')
      .get();
  const answerSetData = await db.collection('AnswerSet').get();

  const bundleBuffer = db
      .bundle('initial-dataset')
      .add('gateway-lizard-data-query', gatewayLizardData)
      .add('sanPedro-lizard-data-query', sanPedroLizardData)
      .add('virginRiver-lizard-data-query', virginRiverLizardData)
      .add('answerSet-query', answerSetData)
      .build();

  response.set('Cache-Control', 'public: max-age=7776000, s-maxage=15552000');

  response.end(bundleBuffer);
});
