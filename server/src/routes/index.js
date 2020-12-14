const express=require('express');
const sql = require('../db/connection.js');
const resize = require('../resize/resize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config=require('../config/config');
const jwtmid = require('express-jwt');
const { query } = require('../db/connection.js');
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
router.post('/verificar_codigo' ,jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query_usuario = "SELECT codigo FROM usuario WHERE codigo = ?";
    const values = [req.body.codigo];
    const resultado = await sql.awaitQuery(query_usuario,values);
    if (resultado.length === 0) {
        res.json({cod: '200'})
    } else {
        res.json({cod: '201'})
    }
    
})
router.post('/inicio_sesion', async (req,res) => {
    const usuario_buscado = await sql.awaitQuery("Select codigo,usuario,password from usuario where usuario.usuario = ? and estado = 'Activo'", req.body.usuario)
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
router.post('/obtener_usuarios',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query_usuarios = "SELECT usuario.codigo,usuario.nombre,usuario.estado FROM `usuario` WHERE usuario.codigo != 0 and usuario.codigo != ?"
    const values = [parseInt(req.body.codigo)]
    const query_permisos = "SELECT permisos.cod_rol,permisos.cod_usuario,roles.rol From permisos"+
    " INNER JOIN roles on permisos.cod_rol = roles.codigo";
    const query_roles = "SELECT roles.codigo,roles.rol FROM roles";
    const resultado_usuarios = await sql.awaitQuery(query_usuarios, values);
    const resultado_permisos = await sql.awaitQuery(query_permisos);
    const resultado_roles = await sql.awaitQuery(query_roles);
    res.json({cod:'200' , data:{usuarios: resultado_usuarios, permisos: resultado_permisos, roles: resultado_roles}});
})
router.get('/obtener_roles',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query_roles = "SELECT roles.codigo,roles.rol FROM roles"; 
    const resultado_roles = await sql.awaitQuery(query_roles);
    res.json({cod:'200', data:{roles: resultado_roles}});
})
router.post('/nuevo_usuario',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const contraseña = await bcrypt.hash(req.body.usuario[3],10)
    console.log(contraseña)
    const query_usuario = "Insert into usuario (codigo, nombre, usuario, password) values ('"+req.body.usuario[0]+"','"+req.body.usuario[1]+"','"+req.body.usuario[2]+"','"+contraseña+"')"
    const resultado = await sql.awaitQuery(query_usuario);
    if (resultado) {
        const query_permisos = "INSERT INTO permisos (cod_rol, cod_usuario) values ?";
        const resultado_permisos = await sql.awaitQuery(query_permisos,[req.body.permisos])
        res.json({cod:'200'})
    } else {
        res.json({cod:'201'})
    } 
})
router.post('/actualizar_usuario',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query_usuario = "Update usuario set nombre = ? where codigo = ?";
    const values_usuario = [req.body.nombre, req.body.codigo];
    const resultado = await sql.awaitQuery(query_usuario,values_usuario);
    const query_permisos = "Delete from permisos where cod_usuario = ?";
    const values_permisos = [req.body.codigo];
    const resultado_permisos = await sql.awaitQuery(query_permisos,values_permisos);
    const query_nuevos_permisos = "Insert into permisos (cod_rol, cod_usuario) values ?"
    const resultado_nuevos_permisos = await sql.awaitQuery(query_nuevos_permisos,[req.body.permisos]);
    res.json({cod:'200'})
})
router.post('/estado_usuario',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query = "Update usuario set estado = ? where codigo = ?";
    const values = [req.body.estado, req.body.codigo];
    const resultado = await sql.awaitQuery(query,values);
    res.json({cod:'200'});
})
router.post('/nuevo_articulo',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query = "INSERT INTO articulo (codigo,base) values ('"+req.body.producto[0]+"','"+
    req.body.producto[1]+"')";
    const resultado = await sql.awaitQuery(query);
    if (resultado) {
        if (req.body.articulo) {

        } else {
            res.json({cod: '200'});
        }
    }   else {
        res.json({cod: '201'});
    }
    
})
router.post('/verificar_codigo_articulo',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query_usuario = "SELECT codigo FROM articulo WHERE codigo = ?";
    const values = [req.body.codigo];
    const resultado = await sql.awaitQuery(query_usuario,values);
    if (resultado.length === 0) {
        res.json({cod: '200'})
    } else {
        res.json({cod: '201'})
    }
})
router.get('/obtener_articulos',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query_roles = "SELECT articulo.codigo,articulo.base,articulo.estado,ultm_actualizacion FROM articulo"; 
    const resultado_articulo = await sql.awaitQuery(query_roles);
    res.json({cod:'200', data:{articulo: resultado_articulo}});
})
router.post('/actualizar_articulo',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query_actualizar = "Update articulo set base = ? where codigo = ?"
    const values = [req.body.base, req.body.codigo];
    const resultado_articulo = await sql.awaitQuery(query_actualizar,values)
    res.json({cod:'200'});
})
router.post('/estado_articulo',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query = "Update articulo set estado = ? where codigo = ?";
    const values = [req.body.estado, req.body.codigo];
    const resultado = await sql.awaitQuery(query,values);
    res.json({cod:'200'});
})
router.get('/obtener_proceso',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query = "SELECT codigo, proceso from proceso where estado = 'Activo'";
    const query_mats = "SELECT descripcion, concat(codigo,'-',descripcion) AS codigo from material where estado = 'Activo' order by descripcion ASC";
    const resultado = await sql.awaitQuery(query);
    const resultado_mats = await sql.awaitQuery(query_mats)
    res.json({cod:'200', data: resultado, material: resultado_mats})
})
router.post('/validar_codigo_formula',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query = "SELECT codigo from cabecera_Formula where codigo = ?";
    const values = [req.body.codigo];
    const resultado = await sql.awaitQuery(query,values);
    if (resultado.length === 0) {
        res.json({cod: '200'})
    } else {
        res.json({cod: '201'})
    }
})
module.exports=router;
