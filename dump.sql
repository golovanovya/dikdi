DROP DATABASE IF EXISTS `motor_base`;
CREATE DATABASE `motor_base`;
USE `motor_base`;
drop table if exists `motorcycle_types`;
CREATE TABLE `motorcycles_types`(
	`id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`name` VARCHAR(50)
);
DROP TABLE IF EXISTS `motorcycles`;
CREATE TABLE `motorcycles`(
	`id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`name` VARCHAR(50),
	`discontinued` DATE DEFAULT NULL,
	`type_id` INT NOT NULL references `motorcycle_types`(`id`)
);
INSERT INTO `motorcycles_types` (`name`)
VALUES ('Классика'),
	('Спортивные'),
	('Супербайк'),
	('Дрэгстер'),
	('Мотард'),
	('Минибайк'),
	('Тяжёлые мотоциклы');
INSERT INTO `motorcycles` (`name`, `discontinued`, `type_id`)
VALUES ('Yamaha V-Max', NULL, 4),
	('Kawasaki Eliminator', NULL, 4),
	('G650 Xmoto', '2009-01-01', 5),
	('Honda Z50R', '1999-01-01', 6),
	('Урал Т', NULL, 7);
SELECT `b`.`name` AS 'type',
	COUNT(`a`.`id`) AS 'count'
FROM `motorcycles_types` AS b
	LEFT JOIN `motorcycles` AS a ON `a`.`type_id` = `b`.`id`
	AND `a`.`discontinued` IS NULL
GROUP BY `b`.`id`;