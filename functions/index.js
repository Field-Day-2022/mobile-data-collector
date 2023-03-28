/* eslint-disable no-undef */
const firestore = require('firebase-admin');
const functions = require('firebase-functions');
const cors = require('cors')({
    origin: true,
});

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.createBundle = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () => {
        try {
            //   const gatewayLizardData = await db.
            //   .collection('GatewayData')
            //   .where('taxa', '==', 'Lizard')
            //   .get();
            //   const sanPedroLizardData = await firestore
            //       .collection('SanPedroData')
            //       .where('taxa', '==', 'Lizard')
            //       .get();
            //   const virginRiverLizardData = await firestore
            //       .collection('VirginRiverData')
            //       .where('taxa', '==', 'Lizard')
            //       .get();
            //   const answerSetData = await db.collection('AnswerSet').get();

            //   const bundleBuffer = firestore
            //       .bundle('initial-dataset')
            //       .add('gateway-lizard-data-query', gatewayLizardData)
            //   //   .add('sanPedro-lizard-data-query', sanPedroLizardData)
            //   //   .add('virginRiver-lizard-data-query', virginRiverLizardData)
            //   //   .add('answerSet-query', answerSetData)
            //       .build();

            const bundle = db.bundle('initial-dataset');

            const bundleBuffer = bundle.add(gatewayLizardData).build();

            response.set('Cache-Control', 'public: max-age=7776000, s-maxage=15552000');

            response.set('Access-Control-Allow-Origin', '*');

            response.end(bundleBuffer);

            response.status(200).send();
        } catch (e) {
            console.error(e);
        }
    });
});
