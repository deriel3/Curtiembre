const express=require('express');
const sql = require('../db/connection.js');
const resize = require('../resize/resize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config=require('../config/config');
const jwtmid = require('express-jwt');
const router=express.Router();
router.get('/imagen/', async (req,res) => {
    if(req.query.imagen !== '')
    {
        const base = './src/assets/imagenes/'
        let url = base+req.query.imagen
        const widthString = req.query.width
        const heightString = req.query.height
        let width, height
        if (widthString) {
            width = parseInt(widthString)
        }
        if (heightString) {
            height = parseInt(heightString)
        }
        res.type('image/png');
        resize(url, 'png', width, height).pipe(res);
    }
    else
    {
        res.json({cod:'201'})
    }
})

router.post('/inicio_sesion', async (req,res) => {
    const usuario_buscado = await sql.awaitQuery("Select codigo,usuario,password from usuario where usuario.usuario = ?", req.body.usuario)
    if(usuario_buscado.length === 0)
    {
        res.json({
            cod:"403"
        })
    }
    else
    {
       const resultado=await bcrypt.compare(req.body.contrasena, usuario_buscado[0].password);
       if(resultado)
       {
            const payload = {
                user:req.body.usuario
            };
            const token = jwt.sign(payload, config.llave);
            const query ='SELECT cod_rol from permisos where cod_usuario = ?'
            const values = [usuario_buscado[0].codigo]
            const permisos = await sql.awaitQuery(query,values);
            res.json({
                id:usuario_buscado[0].codigo,
                permisos: permisos,
                token: token,
                cod:"200"
            });
       }
       else
       {
            res.json({
                cod:"403"
            })
       }
    }
})
router.get('/obtener_materiales',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query = 'Select codigo,descripcion,estado from material';
    const resultado = await sql.awaitQuery(query);
    res.json({cod:'200', data:resultado});
})
router.post('/importar_materiales',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query = 'INSERT INTO material (codigo, descripcion) VALUES ?';
    const resultado = await sql.awaitQuery(query,[req.body.materiales])
    res.json({cod:"200"})
})
router.post('/actualizar_material',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) =>{
    const query = "Update material set descripcion = ? WHERE codigo = ?";
    const values = [req.body.descripcion, parseInt(req.body.codigo)];
    const resultado = await sql.awaitQuery(query,values);
    res.json({cod:'200'});
})
router.post('/estado_material',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) =>{
    const query = "Update material set estado = ? where codigo = ?";
    const values = [req.body.estado, parseInt(req.body.codigo)];
    const resultado = await sql.awaitQuery(query,values);
    res.json({cod:'200'});
})
module.exports=router;
