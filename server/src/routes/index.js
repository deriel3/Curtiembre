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
    let ejemplo = await bcrypt.hash('123123123',10)
    console.log(ejemplo)
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
router.post('/guardar_formula',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query_cabecera = "INSERT INTO cabecera_formula (codigo, usuario_creador, proceso) values ('"+req.body.codigo+"','"+req.body.usuario_creado+"','"+req.body.proceso+"')"
    const resultado = await sql.awaitQuery(query_cabecera)
    console.log(resultado.length === 0);
    if (resultado.length !== 0) {
        const query_detalle = "INSERT INTO detalle_formula (orden, codigo, cabecera, material, porcentaje, cantidad, tiempo, observacion) values ?"
        const values = [req.body.detalle_formula];
        const resultado_detalle = await sql.awaitQuery(query_detalle,values);
        if(resultado_detalle.length !== 0) {
            res.json({cod:'200'})
        }
        else
        {
            res.json({cod:'201'})
        }
    } else {
        res.json({cod:'201'})
    }
})
router.get('/obtener_formula',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query_formulas = "SELECT cabecera_formula.codigo, cabecera_formula.peso_base, usuario.nombre as usuario_creador, cabecera_formula.version, proceso.proceso from cabecera_formula"
    +" Inner Join usuario on cabecera_formula.usuario_creador = usuario.codigo"
    +" Inner Join proceso on cabecera_formula.proceso = proceso.codigo";
    const resultado = await sql.awaitQuery(query_formulas);
    if(resultado.length !== 0) {
        res.json({cod: '200', data: resultado})
    } else {
        res.json({cod: '201'})
    }
})
router.post('/obtener_detalle',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query= "SELECT detalle_formula.orden, detalle_formula.codigo, detalle_formula.porcentaje,material.codigo as material,material.descripcion, detalle_formula.cantidad, detalle_formula.tiempo, detalle_formula.observacion from detalle_formula INNER JOIN material on detalle_formula.material = material.codigo WHERE detalle_formula.cabecera = ?"
    const r = await sql.awaitQuery(query,req.body.codigo);
    res.json({cod:'200', data: r})
})
router.post('/obtener_formula',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const material = "SELECT codigo, descripcion from material where estado = 'Activo'";
    const resultado_material = await sql.awaitQuery(material)
    const proceso = "SELECT codigo, proceso from proceso where estado = 'Activo'";
    const resultado_proceso = await sql.awaitQuery(proceso)
    const cabecera = "SELECT cabecera_formula.peso_base, usuario.nombre as usuario_creador, cabecera_formula.version, cabecera_formula.proceso FROM cabecera_formula INNER JOIN usuario on cabecera_formula.usuario_creador = usuario.codigo WHERE cabecera_formula.codigo = ?";
    const resultado = await sql.awaitQuery(cabecera,req.body.codigo)
    const query= "SELECT detalle_formula.orden,detalle_formula.codigo, detalle_formula.cabecera, detalle_formula.porcentaje,material.codigo as material,material.descripcion, detalle_formula.cantidad, detalle_formula.tiempo, detalle_formula.observacion from detalle_formula INNER JOIN material on detalle_formula.material = material.codigo WHERE detalle_formula.cabecera = ? ORDER BY orden ASC"
    const r = await sql.awaitQuery(query,req.body.codigo);
    res.json({cod:'200', data:{cabecera: resultado, detalle: r, proceso: resultado_proceso, material: resultado_material}})
})
router.post('/guardar_cambios',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const borrar_detalle = "delete from detalle_formula where cabecera = ?"
    const resultado = await sql.awaitQuery(borrar_detalle,req.body.codigo)
    const nuevo_detalle = "INSERT INTO detalle_formula (orden,codigo, cabecera, porcentaje, material , cantidad, tiempo, observacion) values ?"
    console.log(req.body.detalle)
    const values = [req.body.detalle]
    const resultado_detalle = await sql.awaitQuery(nuevo_detalle,values);
    if(resultado_detalle.length !== 0) {
        res.json({cod:'200'})
    }
    else
    {
        res.json({cod:'201'})
    }
})
router.get('/obtener_datos_op',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const codigo = "SELECT codigo from orden_p order by codigo desc LIMIT 1"
    const resultado_codigo = await sql.awaitQuery(codigo);
    const formulas_pelambre = "SELECT codigo from cabecera_formula where proceso = '01'";
    const resultado = await sql.awaitQuery(formulas_pelambre);
    const formulas_curtido = "SELECT codigo from cabecera_formula where proceso = '02'";
    const resultado_curtido = await sql.awaitQuery(formulas_curtido);
    res.json({cod:'200', data: {pelambre: resultado, curtido: resultado_curtido, codigo: resultado_codigo}});
})
router.post('/verificar_codigo_op',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const codigo = "SELECT codigo from orden_p order by codigo desc LIMIT 1"
    const resultado_codigo = await sql.awaitQuery(codigo);
    res.json({cod:'200', data: {codigo: resultado_codigo}});
})
router.post('/guardar_op',jwtmid({secret: config.llave, algorithms:['HS256']}),async (req,res) => {
    const ingresar = "INSERT INTO orden_p (codigo, kilos, pieles ,fpelambre, fcurtido, autor, ppelambre, pcurtido) values ('"+req.body.codigo.toUpperCase()+"','"+req.body.kilo+"','"+req.body.piele+"','"+req.body.fpelambre+"','"+req.body.fcurtido+"','"+req.body.autor+"','"+req.body.ppelambre.toString()+"','"+req.body.pcurtido.toString()+"')";
    const resultado = await sql.awaitQuery(ingresar);
    if(resultado) {
        const act_almacen = "UPDATE almacen set cantidad = cantidad-"+req.body.piele+" where codigo = 'MP'";
        const resultado_act_almacen = await sql.awaitQuery(act_almacen);
        const año = new Date().getFullYear();
        const ant = "SELECT codigo from historial_almacen  where cod_almacen = ? and accion = ? order by codigo DESC LIMIT 1 "
        const resultado = await sql.awaitQuery(ant,['MP','1']);
        if (resultado.length == 0)
        {
            codigo = año+'-1-1';        
        }
        else
        {
            const antcodigo = resultado[0].codigo;
            const datos = antcodigo.split('-');
            const nuevo= parseInt(datos[2])+1
            codigo = año+'-1-'+nuevo;
        }
        const nuevo = "INSERT INTO historial_almacen (codigo, accion, cod_almacen, cantidad, observacion) values ('"+codigo+"','1','MP','"+req.body.piele+"','')";
        const result = await sql.awaitQuery(nuevo);
        res.json({cod:'200'})
    }
})
router.get('/obtener_op',jwtmid({secret: config.llave, algorithms:['HS256']}),async (req,res) => {
    const lista = "SELECT codigo, kilos, pieles, fpelambre, fcurtido from orden_p";
    const resultado = await sql.awaitQuery(lista);
    res.json({cod:'200', data:resultado})
})
router.get('/obtener_data_acabado',jwtmid({secret: config.llave, algorithms:['HS256']}),async (req,res) => {
    const articulo = "SELECT codigo, base from articulo where estado = 'Activo'";
    const resultado_articulo = await sql.awaitQuery(articulo);
    const frecurtido = "SELECT codigo from cabecera_formula where proceso = '03'";
    const resultado_frecurtido = await sql.awaitQuery(frecurtido);
    const facabado = "SELECT codigo from cabecera_formula where proceso = '04'";
    const resultado_facbado = await sql.awaitQuery(facabado);
    res.json({cod:'200', data:{articulo: resultado_articulo, frecurtido: resultado_frecurtido, facabado: resultado_facbado}})
})
router.post('/verificar_codigo_acabado',jwtmid({secret: config.llave, algorithms:['HS256']}),async (req,res) => {
    const articulo = "SELECT codigo from acabado where codigo = ?";
    const value = [req.body.codigo];
    const resultado_articulo = await sql.awaitQuery(articulo,value);
    if(resultado_articulo.length === 0) {
        res.json({cod:'200'})
    } else {
        res.json({cod:'201'})
    }
})
router.post('/nuevo_acabado',jwtmid({secret: config.llave, algorithms:['HS256']}),async (req,res) => {
    const articulo = "INSERT INTO acabado (codigo_articulo, codigo, acabado, color, calibre, frecurtido, facabado) VALUES ('"+req.body.producto[0]+"','"+req.body.producto[1]+"','"+req.body.producto[2]+"','"+req.body.producto[3]+"','"+req.body.producto[4]+"','"+req.body.producto[5]+"','"+req.body.producto[6]+"')";
    const resultado_articulo = await sql.awaitQuery(articulo);
    res.json({cod:'200'})
})
router.get('/obtener_acabados',jwtmid({secret: config.llave, algorithms:['HS256']}),async (req,res) => {
    const articulo = "SELECT codigo, codigo_articulo, acabado, color, calibre, frecurtido, facabado, estado from acabado";
    const resultado_articulo = await sql.awaitQuery(articulo);
    res.json({cod:'200', data: resultado_articulo})
})
router.post('/actualizar_acabado',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query_actualizar = "Update acabado set acabado = ?, color = ?, calibre = ? where codigo = ?"
    const values = [req.body.acabado,req.body.color,req.body.calibre, req.body.codigo];
    const resultado_articulo = await sql.awaitQuery(query_actualizar,values)
    res.json({cod:'200'});
})
router.post('/estado_acabado',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const query = "Update acabado set estado = ? where codigo = ?";
    const values = [req.body.estado, req.body.codigo];
    const resultado = await sql.awaitQuery(query,values);
    res.json({cod:'200'});
})
router.get('/obtener_datos_ot',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const formulas_pelambre = "SELECT codigo from cabecera_formula where proceso = '03'";
    const resultado = await sql.awaitQuery(formulas_pelambre);
    const formulas_curtido = "SELECT codigo from cabecera_formula where proceso = '04'";
    const resultado_curtido = await sql.awaitQuery(formulas_curtido);
    res.json({cod:'200', data: {pelambre: resultado, curtido: resultado_curtido}});
})
router.post('/fin_orden',jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const formulas_pelambre = "update orden_p set fin = 1 where codigo = ?";
    const values = [req.body.codigo];
    const resultado = await sql.awaitQuery(formulas_pelambre,values);
    if(resultado) {
        res.json({cod:'200'});   
    } else {
        res.json({cod:'201'});
    }
})
router.post('/obtener_seguimiento', jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    
    const formula_proceso = "SELECT codigo,kilos, pieles, ppelambre, kilosc, pielesc, pcurtido,fin FROM orden_p where codigo = ?";
    const values_proceso = [req.body.codigo];
    const resultado_proceso = await sql.awaitQuery(formula_proceso,values_proceso);
    const formula_seguimiento = "SELECT codigo_partida, proceso_base, proceso, codigo_seguimiento, agua, grasa, recorte_piel, carnaza, observacion, fecha_creacion from seguimiento where codigo_partida = ? and proceso_base = 0 order by proceso_base ASC";
    const resulta_seguimiento = await sql.awaitQuery(formula_seguimiento,values_proceso);
    const formula_seguimiento_curtido = "SELECT codigo_partida, proceso_base, proceso, codigo_seguimiento, agua, grasa, recorte_piel, carnaza, observacion, fecha_creacion from seguimiento where codigo_partida = ? and proceso_base = 1 order by proceso_base ASC";
    const resulta_seguimiento_curtido = await sql.awaitQuery(formula_seguimiento_curtido,values_proceso)
    res.json({cod:'200', data: {proceso: resultado_proceso, seguimiento: resulta_seguimiento, curtido: resulta_seguimiento_curtido}})
})
router.post('/act_curtido', jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const formula_proceso = "UPDATE orden_p set kilosc = ?, pielesc = ? where codigo = ?";
    const values_proceso = [req.body.kilo,req.body.pieles,req.body.codigo];
    const resultado = await sql.awaitQuery(formula_proceso,values_proceso)
    res.json({cod:'200'})
})
router.post('/guardar_seguimiento', jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const codigo_seguimiento = req.body.codigo+'-'+req.body.proceso_base+'-'+req.body.proceso;
    const articulo = "INSERT INTO seguimiento (codigo_partida, proceso_base, proceso, kilos, pieles, codigo_seguimiento) VALUES ('"+req.body.codigo+"','"+req.body.proceso_base+"','"+req.body.proceso+"','"+req.body.kilo+"','"+req.body.pieles+"','"+codigo_seguimiento+"')";
    const resultado_articulo = await sql.awaitQuery(articulo);
    res.json({cod:'200'})
})
router.post('/guardar_desecho', jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const codigo_seguimiento = req.body.codigo+'-'+req.body.proceso_base+'-'+req.body.proceso;
    const articulo = "UPDATE seguimiento SET agua = ?, grasa = ?, recorte_piel = ?, carnaza = ?, observacion = ? WHERE codigo_seguimiento = ?";
    const values = [req.body.agua, req.body.grasa, req.body.recorte_piel, req.body.carnaza, req.body.observacion, codigo_seguimiento];
    const resultado_articulo = await sql.awaitQuery(articulo, values);
    res.json({cod:'200'})
})
router.post('/obt_formula_proceso', jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const cabecera = "SELECT orden_p.kilos, orden_p.pieles, cabecera_formula.codigo, cabecera_formula.usuario_creador from orden_p inner join cabecera_formula on orden_p.fpelambre = cabecera_formula.codigo where orden_p.codigo = ?";
    const values_proceso = [req.body.codigo];
    const resultado = await sql.awaitQuery(cabecera,req.body.codigo, values_proceso);
    const query= "SELECT detalle_formula.orden,detalle_formula.codigo, detalle_formula.cabecera, detalle_formula.porcentaje,material.codigo as material,material.descripcion, detalle_formula.cantidad, detalle_formula.tiempo, detalle_formula.observacion from detalle_formula INNER JOIN material on detalle_formula.material = material.codigo WHERE detalle_formula.cabecera = ? ORDER BY orden ASC"
    const r = await sql.awaitQuery(query,resultado[0].codigo);
    res.json({cod:'200', data:{cabecera: resultado, detalle: r}})
})
router.get('/obtener_almacenes', jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const cabecera = "SELECT codigo, descripcion, cantidad, fecha_actualizacion AS fecha from almacen";
    const resultado = await sql.awaitQuery(cabecera);
    res.json({cod:'200', data: {cabecera: resultado}});
})
router.post('/verificar_almacen', jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    const cabecera = "SELECT cantidad from almacen where codigo = '"+req.body.cod_almacen+"'";
    const resultado = await sql.awaitQuery(cabecera);
    res.json({cod:'200', data: {cabecera: resultado}});
})
router.post('/guardar_ingreso', jwtmid({secret: config.llave, algorithms: ['HS256']}), async (req,res) => {
    let codigo = '';
    const accion = req.body.accion;
    const cod_almacen = req.body.cod_almacen;
    const cantidad = req.body.cantidad;
    const observacion = req.body.observacion;
    const año = new Date().getFullYear();
    const ant = "SELECT codigo from historial_almacen  where cod_almacen = ? and accion = ? order by codigo DESC LIMIT 1 "
    const resultado = await sql.awaitQuery(ant,[cod_almacen,accion]);
    if (resultado.length == 0)
    {
        codigo = año+'-'+cod_almacen+'-'+accion+'-1';        
    }
    else
    {
        const antcodigo = resultado[0].codigo;
        const datos = antcodigo.split('-');
        const nuevo= parseInt(datos[3])+1
        codigo = año+'-'+cod_almacen+'-'+accion+'-'+nuevo;
    }
    const nuevo = "INSERT INTO historial_almacen (codigo, accion, cod_almacen, cantidad, observacion) values ('"+codigo+"','"+accion+"','"+cod_almacen+"','"+cantidad+"','"+observacion+"')";
    const result = await sql.awaitQuery(nuevo);
    if(result) {
        let act = '';
        if(accion == 0) {
            act = "UPDATE almacen set cantidad = cantidad + "+cantidad+" where codigo = '"+cod_almacen+"'";
        }
        else {
            act = "UPDATE almacen set cantidad = cantidad - "+cantidad+" where codigo = '"+cod_almacen+"'";
        }
        const almacen_result = await sql.awaitQuery(act);
        if(almacen_result) {
            res.json({cod:'200'});
        }
        else {
            res.json({cod:'201'});
        }
    }
    else {
        res.json({cod:'201'});
    }
})
module.exports=router;
