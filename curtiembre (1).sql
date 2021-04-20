-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-04-2021 a las 03:11:28
-- Versión del servidor: 10.4.6-MariaDB
-- Versión de PHP: 7.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `curtiembre`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acabado`
--

CREATE TABLE `acabado` (
  `codigo` varchar(50) NOT NULL,
  `codigo_articulo` varchar(50) NOT NULL,
  `acabado` varchar(250) NOT NULL,
  `color` varchar(150) NOT NULL,
  `calibre` char(5) NOT NULL,
  `frecurtido` varchar(50) NOT NULL,
  `facabado` varchar(50) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` char(10) NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `almacen`
--

CREATE TABLE `almacen` (
  `codigo` varchar(20) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `cantidad` int(6) NOT NULL,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `almacen`
--

INSERT INTO `almacen` (`codigo`, `descripcion`, `cantidad`, `fecha_actualizacion`) VALUES
('AC', 'Acabados - Cuero Terminado', 0, '2021-04-20 01:03:41'),
('MP', 'Materia Prima - Piel Cruda', 0, '2021-04-20 01:03:45'),
('ST', 'Semiterminado - Cuero Teñido', 0, '2021-04-20 01:03:49'),
('WB', 'Wet Blue - Cuero Cormado', 0, '2021-04-20 01:03:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `articulo`
--

CREATE TABLE `articulo` (
  `codigo` varchar(50) NOT NULL,
  `base` varchar(200) NOT NULL,
  `estado` char(10) NOT NULL DEFAULT 'Activo',
  `ultm_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cabecera_formula`
--

CREATE TABLE `cabecera_formula` (
  `codigo` varchar(50) NOT NULL,
  `peso_base` decimal(3,2) NOT NULL DEFAULT 1.00,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `ultm_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `usuario_creador` char(8) NOT NULL,
  `version` int(11) NOT NULL DEFAULT 1,
  `proceso` char(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_formula`
--

CREATE TABLE `detalle_formula` (
  `codigo` varchar(50) NOT NULL,
  `cabecera` varchar(50) NOT NULL,
  `material` varchar(15) NOT NULL,
  `porcentaje` float NOT NULL,
  `cantidad` double(4,4) NOT NULL,
  `tiempo` double(3,3) DEFAULT NULL,
  `observacion` varchar(500) DEFAULT NULL,
  `orden` int(11) NOT NULL DEFAULT -1
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_almacen`
--

CREATE TABLE `historial_almacen` (
  `codigo` varchar(50) NOT NULL,
  `accion` int(1) NOT NULL,
  `cod_almacen` varchar(20) NOT NULL,
  `cantidad` int(6) NOT NULL,
  `observacion` varchar(500) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `material`
--

CREATE TABLE `material` (
  `codigo` varchar(15) NOT NULL,
  `descripcion` varchar(500) NOT NULL,
  `estado` char(10) NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden_p`
--

CREATE TABLE `orden_p` (
  `codigo` varchar(50) NOT NULL,
  `kilos` double(6,2) NOT NULL,
  `pieles` int(4) NOT NULL,
  `fpelambre` varchar(50) NOT NULL,
  `kilosc` double(6,2) NOT NULL DEFAULT 0.00,
  `pielesc` int(4) NOT NULL DEFAULT 0,
  `fcurtido` varchar(50) NOT NULL,
  `autor` char(8) NOT NULL,
  `ppelambre` varchar(200) NOT NULL,
  `pcurtido` varchar(200) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` char(10) NOT NULL DEFAULT 'Activo',
  `fin` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden_t`
--

CREATE TABLE `orden_t` (
  `codigo` varchar(50) NOT NULL,
  `kilos` double(6,2) NOT NULL,
  `pieles` int(4) NOT NULL,
  `formula` varchar(50) NOT NULL,
  `autor` char(8) NOT NULL,
  `proceso_base` char(2) NOT NULL,
  `proceso` varchar(200) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` char(10) NOT NULL DEFAULT 'Activo',
  `finalizado` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `cod_rol` int(3) NOT NULL,
  `cod_usuario` char(8) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`cod_rol`, `cod_usuario`, `fecha_creacion`) VALUES
(5, '0', '2020-12-03 17:48:24'),
(3, '0', '2020-12-03 17:48:24'),
(4, '0', '2020-12-03 17:48:24'),
(6, '0', '2020-12-03 17:48:24'),
(7, '0', '2020-12-03 17:48:24'),
(8, '0', '2020-12-03 17:48:24'),
(0, '0', '2020-12-03 17:50:02'),
(1, '0', '2020-12-04 18:52:06'),
(2, '0', '2020-12-04 18:52:06'),
(10, '0', '2020-12-15 15:24:02'),
(9, '0', '2021-03-02 13:39:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proceso`
--

CREATE TABLE `proceso` (
  `codigo` char(10) NOT NULL,
  `proceso` varchar(250) NOT NULL,
  `estado` char(10) NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `proceso`
--

INSERT INTO `proceso` (`codigo`, `proceso`, `estado`) VALUES
('01', 'Pelambre y Remojo', 'Activo'),
('02', 'Curtido', 'Activo'),
('03', 'Recurtido', 'Activo'),
('04', 'Acabado', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `codigo` int(3) NOT NULL,
  `rol` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`codigo`, `rol`) VALUES
(0, 'Creacion de usuarios'),
(1, 'Material'),
(2, 'Formula Remojo y Pelambre'),
(3, 'Formula Curtido'),
(4, 'Formula Recurtido'),
(5, 'Formula Acabado'),
(6, 'Produccion OP'),
(7, 'Produccion OT'),
(8, 'Reportes'),
(9, 'Desarrollo de producto'),
(10, 'Edicion de formulas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimiento`
--

CREATE TABLE `seguimiento` (
  `codigo_partida` varchar(50) NOT NULL,
  `proceso_base` char(1) NOT NULL,
  `proceso` char(1) NOT NULL,
  `kilos` double(6,2) NOT NULL,
  `pieles` int(3) NOT NULL,
  `agua` double(6,2) NOT NULL DEFAULT 0.00,
  `grasa` double(6,2) NOT NULL DEFAULT 0.00,
  `recorte_piel` double(6,2) NOT NULL DEFAULT 0.00,
  `carnaza` double(6,2) NOT NULL DEFAULT 0.00,
  `observacion` varchar(500) NOT NULL,
  `codigo_seguimiento` varchar(200) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimiento_ot`
--

CREATE TABLE `seguimiento_ot` (
  `codigo_partida` varchar(50) NOT NULL,
  `proceso_base` char(1) NOT NULL,
  `proceso` char(1) NOT NULL,
  `kilos` double(6,2) NOT NULL,
  `pieles` int(3) NOT NULL,
  `agua` double(6,2) NOT NULL,
  `grasa` double(6,2) NOT NULL,
  `recorte_piel` double(6,2) NOT NULL,
  `carnaza` double(6,2) NOT NULL,
  `observacion` varchar(500) NOT NULL,
  `codigo_seguimiento` varchar(200) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `codigo` char(8) NOT NULL,
  `nombre` varchar(500) NOT NULL,
  `usuario` char(16) NOT NULL,
  `password` char(60) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` char(10) NOT NULL DEFAULT 'Activo'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`codigo`, `nombre`, `usuario`, `password`, `fecha_creacion`, `estado`) VALUES
('0', 'ADMINISTRADOR', 'admin', '$2b$10$LXZ1/QpIXW9hX7Z5Mu8YueKBrojBTlaPSoWnWux7/RgM6xBkjvu1W', '2020-12-01 19:02:08', 'Activo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `acabado`
--
ALTER TABLE `acabado`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `articulo` (`codigo_articulo`),
  ADD KEY `frecurtido` (`frecurtido`),
  ADD KEY `facabado` (`facabado`);

--
-- Indices de la tabla `almacen`
--
ALTER TABLE `almacen`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `articulo`
--
ALTER TABLE `articulo`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `cabecera_formula`
--
ALTER TABLE `cabecera_formula`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `proceso` (`proceso`);

--
-- Indices de la tabla `detalle_formula`
--
ALTER TABLE `detalle_formula`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `cabecera` (`cabecera`),
  ADD KEY `material` (`material`);

--
-- Indices de la tabla `historial_almacen`
--
ALTER TABLE `historial_almacen`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `almacen` (`cod_almacen`);

--
-- Indices de la tabla `material`
--
ALTER TABLE `material`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `orden_p`
--
ALTER TABLE `orden_p`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `fpelambre` (`fpelambre`),
  ADD KEY `fcurtido` (`fcurtido`);

--
-- Indices de la tabla `orden_t`
--
ALTER TABLE `orden_t`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `formula` (`formula`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD KEY `rol` (`cod_rol`),
  ADD KEY `usuario` (`cod_usuario`);

--
-- Indices de la tabla `proceso`
--
ALTER TABLE `proceso`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `seguimiento`
--
ALTER TABLE `seguimiento`
  ADD PRIMARY KEY (`codigo_seguimiento`),
  ADD KEY `cod_partida` (`codigo_partida`);

--
-- Indices de la tabla `seguimiento_ot`
--
ALTER TABLE `seguimiento_ot`
  ADD PRIMARY KEY (`codigo_seguimiento`),
  ADD KEY `codigo` (`codigo_partida`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`codigo`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `acabado`
--
ALTER TABLE `acabado`
  ADD CONSTRAINT `articulo` FOREIGN KEY (`codigo_articulo`) REFERENCES `articulo` (`codigo`),
  ADD CONSTRAINT `facabado` FOREIGN KEY (`facabado`) REFERENCES `cabecera_formula` (`codigo`),
  ADD CONSTRAINT `frecurtido` FOREIGN KEY (`frecurtido`) REFERENCES `cabecera_formula` (`codigo`);

--
-- Filtros para la tabla `cabecera_formula`
--
ALTER TABLE `cabecera_formula`
  ADD CONSTRAINT `proceso` FOREIGN KEY (`proceso`) REFERENCES `proceso` (`codigo`);

--
-- Filtros para la tabla `detalle_formula`
--
ALTER TABLE `detalle_formula`
  ADD CONSTRAINT `cabecera` FOREIGN KEY (`cabecera`) REFERENCES `cabecera_formula` (`codigo`),
  ADD CONSTRAINT `material` FOREIGN KEY (`material`) REFERENCES `material` (`codigo`);

--
-- Filtros para la tabla `historial_almacen`
--
ALTER TABLE `historial_almacen`
  ADD CONSTRAINT `almacen` FOREIGN KEY (`cod_almacen`) REFERENCES `almacen` (`codigo`);

--
-- Filtros para la tabla `orden_p`
--
ALTER TABLE `orden_p`
  ADD CONSTRAINT `fcurtido` FOREIGN KEY (`fcurtido`) REFERENCES `cabecera_formula` (`codigo`),
  ADD CONSTRAINT `fpelambre` FOREIGN KEY (`fpelambre`) REFERENCES `cabecera_formula` (`codigo`);

--
-- Filtros para la tabla `orden_t`
--
ALTER TABLE `orden_t`
  ADD CONSTRAINT `formula` FOREIGN KEY (`formula`) REFERENCES `cabecera_formula` (`codigo`);

--
-- Filtros para la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD CONSTRAINT `rol` FOREIGN KEY (`cod_rol`) REFERENCES `roles` (`codigo`),
  ADD CONSTRAINT `usuario` FOREIGN KEY (`cod_usuario`) REFERENCES `usuario` (`codigo`);

--
-- Filtros para la tabla `seguimiento`
--
ALTER TABLE `seguimiento`
  ADD CONSTRAINT `cod_partida` FOREIGN KEY (`codigo_partida`) REFERENCES `orden_p` (`codigo`);

--
-- Filtros para la tabla `seguimiento_ot`
--
ALTER TABLE `seguimiento_ot`
  ADD CONSTRAINT `codigo` FOREIGN KEY (`codigo_partida`) REFERENCES `orden_t` (`codigo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
