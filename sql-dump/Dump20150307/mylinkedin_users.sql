CREATE DATABASE  IF NOT EXISTS `mylinkedin` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `mylinkedin`;
-- MySQL dump 10.13  Distrib 5.6.17, for Win32 (x86)
--
-- Host: localhost    Database: mylinkedin
-- ------------------------------------------------------
-- Server version	5.1.30-community

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `email` varchar(50) NOT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `password` mediumtext,
  `salt` mediumtext,
  `lastLogin` varchar(50) DEFAULT NULL,
  `gender` varchar(10) DEFAULT '--',
  `dob` varchar(50) DEFAULT '--',
  `summary` varchar(250) DEFAULT '--',
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('aakash@bb.com','Aakash222','Mangal222','Xx63rYKPOOQznraX7Nqd9f/Na1MataNQsB/IB5iQmZd8FJlgb4xhwQxjfVeV69JmBntP2ygTG+mOKQFjYCIBfYcAubVxT4BpW2NC+XxvGKsI1UvnjahHpW8hhygtIBHh0fO9Otost0YsonSkxhCSMo+S7mMFtoMQJyMgN7Vxp9o=','lhfhYp/CAGEHcISY4wgiLXiZPa/8S//tp5+LNWS+ro45bsrxBBOrZhhho4+qf3C+Bayo2wbNrSJ1snGnozEFzzD2c+GudOYuUq2MKNUlhYkZ2nXTFnQTj9X0/Y0qjuowTH5nfo1wpwZHC906jHfgDYzBIJreXgaDv83jihmM2yc=','Sat Mar 07 2015 1:45:00 AM','Female','08-June-2000','--'),('aakash@cc.com','Aakash111','Mangal111','Py5WW4ANXHprfdS4iQFEpKYaowEzsg5nLf1ohEwzIhpVeoyQ9hjsOytujjrFHtq200D8k3JIeZlv4M4pR/KKa8+FXN2vIzZvO424MMHE3oK6L8Ip2kFn0y+/PAFtWfQpfwgnLbcd2MG2qB2Jzs+huobejkbaGPkA+zhPVfOeIz0=','4muieFcTY37Um3dXfU1Tjvtz6NGe7IrDrRRLD280cGIgdA98WkLZVEmL9S+ewP9DuyUXrE36lww1BJhXM+Jt2lAQlXAE104hL0ior1LeFP/d2s5+Wh1zsQNYeo1mGWTTe3DOzPevkmjO+z9k8MIcPnNt9idys0pg4TzwJ5EsM2M=','Sat Mar 07 2015 2:51:18 PM','Male','26-November-1991','I like programming.\nMy favorite subject is 273');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-03-07 14:53:58
