CREATE DATABASE IF NOT EXISTS graphql;
SET NAMES "UTF8";
USE graphql;

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL DEFAULT '',
  `age` int(10) NOT NULL DEFAULT '0',
  `company` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `companies`;
CREATE TABLE IF NOT EXISTS `companies` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

INSERT INTO `users` (`email`, `age`, `company`) VALUES('user1@graphql.com', 28, 1);
INSERT INTO `users` (`email`, `age`, `company`) VALUES('user2@graphql.com', 34, 1);
INSERT INTO `users` (`email`, `age`, `company`) VALUES('user3@graphql.com', 42, 1);
INSERT INTO `users` (`email`, `age`, `company`) VALUES('user4@graphql.com', 22, 2);
INSERT INTO `users` (`email`, `age`, `company`) VALUES('user5@graphql.com', 26, 2);

INSERT INTO `companies` (`name`) VALUES('Company A');
INSERT INTO `companies` (`name`) VALUES('Company B');