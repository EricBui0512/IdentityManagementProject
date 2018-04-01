# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.21)
# Database: next_id
# Generation Time: 2018-03-31 10:36:02 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table account
# ------------------------------------------------------------

CREATE TABLE `account` (
  `owner` varchar(42) NOT NULL DEFAULT '',
  `email` varchar(255) DEFAULT NULL,
  `userName` varchar(255) DEFAULT NULL,
  `deviceToken` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`owner`),
  KEY `fk_account_keys_registry_idx` (`email`),
  CONSTRAINT `fk_account_keys_registry` FOREIGN KEY (`email`) REFERENCES `keys_registry` (`email`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table contact
# ------------------------------------------------------------

CREATE TABLE `contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner` varchar(42) NOT NULL DEFAULT '',
  `account` varchar(42) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_contact_account_idx` (`owner`),
  CONSTRAINT `fk_contact_account` FOREIGN KEY (`owner`) REFERENCES `account` (`owner`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table facet
# ------------------------------------------------------------

CREATE TABLE `facet` (
  `facetAddress` varchar(42) NOT NULL DEFAULT '',
  `title` varchar(200) NOT NULL DEFAULT '',
  `owner` varchar(42) NOT NULL DEFAULT '',
  `facetKey` varchar(64) NOT NULL DEFAULT '',
  PRIMARY KEY (`facetAddress`),
  KEY `fk_facet_account_idx` (`owner`),
  CONSTRAINT `fk_facet_account` FOREIGN KEY (`owner`) REFERENCES `account` (`owner`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table facet_activity
# ------------------------------------------------------------

CREATE TABLE `facet_activity` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `facetAddress` varchar(42) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `account` varchar(42) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `dateTime` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `shareKey` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_facet_activity_facet_idx` (`facetAddress`),
  CONSTRAINT `fk_facet_activity_facet` FOREIGN KEY (`facetAddress`) REFERENCES `facet` (`facetAddress`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table facet_field
# ------------------------------------------------------------

CREATE TABLE `facet_field` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `facetAddress` varchar(42) NOT NULL DEFAULT '',
  `fieldName` varchar(255) NOT NULL DEFAULT '',
  `fieldValueHash` varchar(66) NOT NULL DEFAULT '',
  `fieldValue` varchar(2000) NOT NULL DEFAULT '',
  `status` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_facet_field_facet_idx` (`facetAddress`),
  CONSTRAINT `fk_facet_field_facet` FOREIGN KEY (`facetAddress`) REFERENCES `facet` (`facetAddress`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table keys_registry
# ------------------------------------------------------------

CREATE TABLE `keys_registry` (
  `email` varchar(255) NOT NULL,
  `publicKey` varchar(458) NOT NULL DEFAULT '',
  `privateKey` varchar(1700) NOT NULL DEFAULT '',
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
