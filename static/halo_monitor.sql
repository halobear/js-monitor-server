/*
 Navicat MySQL Data Transfer

 Source Server         : 121.36.255.88
 Source Server Type    : MySQL
 Source Server Version : 50644
 Source Host           : 121.36.255.88:3306
 Source Schema         : halo_monitor

 Target Server Type    : MySQL
 Target Server Version : 50644
 File Encoding         : 65001

 Date: 23/08/2020 14:31:23
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for halo_errors
-- ----------------------------
DROP TABLE IF EXISTS `halo_errors`;
CREATE TABLE `halo_errors` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `pid` varchar(20) NOT NULL,
  `uid` varchar(20) NOT NULL,
  `type` varchar(2) NOT NULL,
  `brief` varchar(255) NOT NULL,
  `stack` varchar(255) NOT NULL,
  `from` varchar(255) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=319 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for halo_manage
-- ----------------------------
DROP TABLE IF EXISTS `halo_manage`;
CREATE TABLE `halo_manage` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `password` varchar(20) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Table structure for halo_performance
-- ----------------------------
DROP TABLE IF EXISTS `halo_performance`;
CREATE TABLE `halo_performance` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `pid` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
  `uid` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
  `white_time` int(15) NOT NULL,
  `load_time` int(15) NOT NULL,
  `dom_use_time` int(15) NOT NULL,
  `redirect_time` int(15) NOT NULL,
  `response_time` int(15) NOT NULL,
  `dns_query_time` int(15) NOT NULL,
  `dns_cache_time` int(15) NOT NULL,
  `tcp_time` int(15) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;

SET FOREIGN_KEY_CHECKS = 1;
