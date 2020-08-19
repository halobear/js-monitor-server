/*
 Navicat Premium Data Transfer

 Source Server         : local_dev
 Source Server Type    : MySQL
 Source Server Version : 50731
 Source Host           : localhost
 Source Database       : halo_monitor

 Target Server Type    : MySQL
 Target Server Version : 50731
 File Encoding         : utf-8

 Date: 08/19/2020 12:29:04 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `halo_errors`
-- ----------------------------
DROP TABLE IF EXISTS `halo_errors`;
CREATE TABLE `halo_errors` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `pid` varchar(20) NOT NULL,
  `uid` varchar(20) NOT NULL,
  `type` varchar(2) NOT NULL,
  `desc` varchar(255) NOT NULL,
  `stack` varchar(255) NOT NULL,
  `from` varchar(255) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
