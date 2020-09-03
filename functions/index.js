const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');


// iniciar el servidor
const app = express();



//configurar firebase

var serviceAccount = require('./credenciales.json');

admin.initializeApp({
    credential: admin.credential.cert('./credenciales.json'),
    databaseURL: 'https://rest-api-firebase1.firebaseio.com'
});

//conectarse a firebase
const db = admin.firestore();

app.get('/holaMundo', (req, res) => {
    //console.log(admin);
    return res.status(200).json({
            massage: 'Hello-Worldd'
    })
});



//------------API------------------//

app.post('/api/productos', async (req, res) => {

    try {
        await db.collection('productos').doc('/' + req.body.id + '/').create({
            name: req.body.name
        })
        return res.status(204).json();
    } catch (error) {
        return res.status(500).send(error);
    }
});


app.get('/api/productos/:id', async (req, res) => {
    try {
        const doc = db.collection('productos').doc(req.params.id);
        const item = await doc.get();
        const datos = item.data();
        console.log(item.data());
        return res.json(item.data());
    } catch (error) {
        res.status(500).send(error);
    }
});


app.get('/api/productos', async (req,res) => {
    const query = db.collection('productos');
    const querySnapshot = await query.get();
    const producto = querySnapshot.docs;

    const response = producto.map(pro =>
        ({
            id:pro.id,
            name:pro.data().name
        }))

        return res.status(200).json(response);
});


app.delete('/api/productos/:id' ,  async (req,res) => {
    const query = db.collection('productos').doc(req.params.id);
    await query.delete();
    res.status(200).send('Producto Eliminado Correctamente');
});

app.put('/api/productos/:id', async (req,res)=>{
    const documento = db.collection('productos').doc(req.params.id);
    await documento.update({
        name:req.body.name
    });
    res.status(200).send("Registro Actualizado Correctamente");
})




exports.app = functions.https.onRequest(app);