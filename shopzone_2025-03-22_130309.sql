-- MySQL dump 10.13  Distrib 8.4.4, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: shopzone
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ordenes`
--

DROP TABLE IF EXISTS `ordenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordenes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `producto_id` int DEFAULT NULL,
  `cantidad` int NOT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `ordenes_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenes`
--

/*!40000 ALTER TABLE `ordenes` DISABLE KEYS */;
/*!40000 ALTER TABLE `ordenes` ENABLE KEYS */;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `precio` decimal(10,2) NOT NULL,
  `unidades` int NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `tienda_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tienda` (`tienda_id`),
  CONSTRAINT `fk_tienda` FOREIGN KEY (`tienda_id`) REFERENCES `tiendas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='added table';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Hamburguesa','de res y queso',200.00,10,'https://t4.ftcdn.net/jpg/05/85/29/13/360_F_585291348_nfsxpgUHUkphTWtkruvHW7lGvF6IdSvM.jpg',2),(2,'Laptop Generica','Laptop portatil',20000.00,20,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJA028v5OnWXbM3fNHjCaxiYVbGE90tN_rWw&s',2),(3,'Asus Rog Strix G16','Gaming Laptop',25000.00,3,'https://dlcdnwebimgs.asus.com/gain/CFE9CB59-216D-4AC9-AEAE-10054506055C/w1000/h732',2),(4,'producto X','X',10.00,1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLahGlY0AYlPmdF8x3QfPBhOdHQVZaMhseFg&s',2),(5,'Pizza','Pizza peperoni',100.00,1,'https://atsloanestable.com/wp-content/uploads/2023/06/new-york-style-pizza2.jpg',1),(6,'Pizza Jamon','test',200.00,22,'https://valentispizza.net/wp-content/uploads/2017/04/jamon-salami-copy-1.webp',6),(7,'Pizza Suprema','Pizza Suprema',400.00,22,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjWplXw3fVs3v40y1CPVm2ktZcAoNGLQky4g&s',6);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;

--
-- Table structure for table `tiendas`
--

DROP TABLE IF EXISTS `tiendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiendas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `direccion` text NOT NULL,
  `descripcion` text,
  `admin_id` int DEFAULT '1',
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_admin` (`admin_id`),
  CONSTRAINT `fk_admin` FOREIGN KEY (`admin_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tiendas`
--

/*!40000 ALTER TABLE `tiendas` DISABLE KEYS */;
INSERT INTO `tiendas` VALUES (1,'Tienda de Ejemplo','Calle Ficticia 123','Una tienda de ejemplo',2,'https://burgerkinghonduras.hn/assets/images/logo-lc.png'),(2,'Tienda Ceutec3','Galerías del Valle, Bulevar UNAH-VS, San Pedro Sula, Cortés, 20102, Honduras','test3',2,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl7fpXMUU9ryJIKsFmRwu-_Bwq0xdpmUshsw&s'),(3,'Tienda Ceutec5','Galerías del Valle, Bulevar UNAH-VS, San Pedro Sula, Cortés, 20102, Honduras','test5',1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl7fpXMUU9ryJIKsFmRwu-_Bwq0xdpmUshsw&s'),(4,'Tienda Ceutec6','Galerías del Valle, Bulevar UNAH-VS, San Pedro Sula, Cortés, 20102, Honduras','test6',1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl7fpXMUU9ryJIKsFmRwu-_Bwq0xdpmUshsw&s'),(5,'Tienda Ceutec7','Multiplaza Mall San Pedro Sula, Avenida Juan Pablo II, San Pedro Sula, Cortés, 21104, Honduras','test 7',1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl7fpXMUU9ryJIKsFmRwu-_Bwq0xdpmUshsw&s'),(6,'Pizza Hut','Pizza Hut, Bulevar del Norte, colonia Santa Ana, San Pedro Sula, Cortés, 21102, Honduras','Pizza Hut Blvd Norte 105 Brigada',1,'https://1000logos.net/wp-content/uploads/2017/05/Pizza-Hut-Logo.jpg');
/*!40000 ALTER TABLE `tiendas` ENABLE KEYS */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `tipo` enum('admin','cliente') NOT NULL DEFAULT 'cliente',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'andres','andres@email.com','$2b$10$jDyICXxWCHppYOoOjIBqiO0pRmeqv0f55C1yg.x0fPdxuQG8Pswn2','admin'),(2,'Eduardo','eduardo@email.com','$2b$10$Nm2V7l2gy9Z53ZIGEEdc1ukAJ916x7Zj5u2OQoH/JY72x2BEGKory','admin'),(3,'Andres2','andres2@email.com','$2b$10$bP88yeyS/Eh/OoECjGL.w.qdP.P26mN2zyoVhDakHwpnJ18tKUF16','admin'),(4,'Andres Test','andres3@email.com','$2b$10$ojBYFZSzkqWshrq9BYqqUu7Faq5U1xZW/XqZpbWdIbZg3YRgRhvuG','admin'),(5,'Andres Cliente','andres4@email.com','$2b$10$dqx4EzBhBOE5/68SKHk51ecZa1HBd9XS66LcuY8.KoTtsYKOoYrUG','cliente'),(6,'Andres admin','andres5@email.com','$2b$10$UJwBm0nfTE1Fbzf3jQSwd.yIr7jtVLsJ65XoalqEWeX2kU01J9SHG','admin'),(7,'Andres cliente','andres7@email.com','$2b$10$vbv5Pq7miqx7MsCOyVKzxOB/qtTL1qGhwDfceloBRcgoKfPvr2N1e','cliente'),(8,'Andres cliente','andres8@email.com','$2b$10$yiSOa4uy/5H1P05UTaQyGeoQOBSOFqVVBv94/McfVOvX74MhA/OHS','cliente');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;

--
-- Dumping routines for database 'shopzone'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-22 13:03:30
