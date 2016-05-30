-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 30, 2016 at 12:51 PM
-- Server version: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `sparta`
--

-- --------------------------------------------------------

--
-- Table structure for table `day`
--

CREATE TABLE IF NOT EXISTS `day` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `day`
--

INSERT INTO `day` (`id`, `name`, `date`) VALUES
(1, 'Day Zero', '2016-05-31'),
(2, 'Day One', '2016-05-31');

-- --------------------------------------------------------

--
-- Table structure for table `kehadiran`
--

CREATE TABLE IF NOT EXISTS `kehadiran` (
  `day_id` int(11) NOT NULL,
  `NIM` char(8) NOT NULL,
  PRIMARY KEY (`day_id`,`NIM`),
  KEY `NIM` (`NIM`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `kehadiran`
--

INSERT INTO `kehadiran` (`day_id`, `NIM`) VALUES
(1, '13514090'),
(2, '13514090');

-- --------------------------------------------------------

--
-- Table structure for table `penilaian`
--

CREATE TABLE IF NOT EXISTS `penilaian` (
  `id` int(10) NOT NULL,
  `NIM` char(8) NOT NULL,
  PRIMARY KEY (`id`,`NIM`),
  KEY `NIM` (`NIM`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `penilaian`
--

INSERT INTO `penilaian` (`id`, `NIM`) VALUES
(1, '13514090'),
(1, '13514999');

-- --------------------------------------------------------

--
-- Table structure for table `peserta`
--

CREATE TABLE IF NOT EXISTS `peserta` (
  `NIM` char(8) NOT NULL DEFAULT '',
  `password` varchar(100) NOT NULL,
  `fullname` varchar(200) DEFAULT NULL,
  `shortname` varchar(20) NOT NULL,
  `department` enum('if','sti') NOT NULL,
  `placeborn` varchar(100) NOT NULL,
  `dateborn` date NOT NULL,
  `LINEID` varchar(50) NOT NULL,
  `origin` varchar(50) NOT NULL,
  `originaddress` varchar(200) NOT NULL,
  `bandungaddress` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  `handphone1` bigint(20) NOT NULL,
  `handphone2` bigint(20) DEFAULT NULL,
  `guardianname` varchar(20) NOT NULL,
  `guardianphone` bigint(20) NOT NULL,
  `religion` enum('buddha','kristen','katolik','islam','hindu','others') NOT NULL,
  `illness` varchar(200) NOT NULL DEFAULT '-',
  `bloodtype` enum('A','B','0','AB') NOT NULL,
  `mbti` char(5) NOT NULL,
  `outsideactivity` varchar(500) NOT NULL DEFAULT '-',
  PRIMARY KEY (`NIM`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `peserta`
--

INSERT INTO `peserta` (`NIM`, `password`, `fullname`, `shortname`, `department`, `placeborn`, `dateborn`, `LINEID`, `origin`, `originaddress`, `bandungaddress`, `email`, `handphone1`, `handphone2`, `guardianname`, `guardianphone`, `religion`, `illness`, `bloodtype`, `mbti`, `outsideactivity`) VALUES
('13514090', 'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b', 'Candra Ramsi', 'Candra', 'if', 'Jakarta', '1996-06-26', 'rmxhaha', 'Jakarta', 'Jl. Janur Asri 4 QK 9 no 8', 'Jl. ciumbeleuit no 83', 'candra_ramsi@arc.itb.ac.id', 87880987539, NULL, 'Hery Gunawan', 818959388, 'buddha', '-', 'A', 'ENJF', 'Internship'),
('13514999', 'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b', 'Anonymous', 'Anonymous', 'if', 'Jakarta', '0000-00-00', 'anony', 'ano', 'an', 'anony', 'an@an.c', 888888888888888, 0, 'Anonyy', 888888888888888, 'kristen', '-', '0', 'ENFJ', 'asdf');

-- --------------------------------------------------------

--
-- Table structure for table `tugas`
--

CREATE TABLE IF NOT EXISTS `tugas` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `nama_tugas` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `tugas`
--

INSERT INTO `tugas` (`id`, `nama_tugas`) VALUES
(1, 'Tugas #1'),
(2, 'tugas 3');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kehadiran`
--
ALTER TABLE `kehadiran`
  ADD CONSTRAINT `kehadiran_ibfk_2` FOREIGN KEY (`NIM`) REFERENCES `peserta` (`NIM`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `kehadiran_ibfk_1` FOREIGN KEY (`day_id`) REFERENCES `day` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `penilaian`
--
ALTER TABLE `penilaian`
  ADD CONSTRAINT `penilaian_ibfk_1` FOREIGN KEY (`id`) REFERENCES `tugas` (`id`),
  ADD CONSTRAINT `penilaian_ibfk_2` FOREIGN KEY (`NIM`) REFERENCES `peserta` (`NIM`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
