-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2023-03-28 09:27:27
-- 伺服器版本： 10.4.27-MariaDB
-- PHP 版本： 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `vue_test`
--

-- --------------------------------------------------------

--
-- 資料表結構 `cus_label`
--

CREATE TABLE `cus_label` (
  `id` int(100) NOT NULL,
  `label_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `cus_label`
--

INSERT INTO `cus_label` (`id`, `label_name`) VALUES
(1, '帥哥'),
(2, '調皮'),
(3, '無聊');

-- --------------------------------------------------------

--
-- 資料表結構 `cus_profile`
--

CREATE TABLE `cus_profile` (
  `id` int(100) NOT NULL,
  `create_user_id` int(100) NOT NULL,
  `cus_name` varchar(100) NOT NULL,
  `cus_number` varchar(100) NOT NULL,
  `cus_email` varchar(100) NOT NULL,
  `cus_idnumber` varchar(100) NOT NULL,
  `cus_remark` varchar(100) NOT NULL,
  `cus_status` varchar(100) NOT NULL,
  `cus_level` varchar(100) NOT NULL,
  `edit_user_id` int(100) NOT NULL,
  `update_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `cus_profile`
--

INSERT INTO `cus_profile` (`id`, `create_user_id`, `cus_name`, `cus_number`, `cus_email`, `cus_idnumber`, `cus_remark`, `cus_status`, `cus_level`, `edit_user_id`, `update_time`) VALUES
(3, 1, '客戶一號', '0900000000', 'a00000@test.com.tw', 'H123456789', '備註', '潛在客戶', '銅', 1, '2023-03-28 15:19:52'),
(5, 1, '客戶二號', '0923494594', 'test@test.com', 'H224332344', '測試備註', '舊客戶', '銀', 1, '2023-03-28 15:22:13');

-- --------------------------------------------------------

--
-- 資料表結構 `cus_profile_label`
--

CREATE TABLE `cus_profile_label` (
  `id` int(100) NOT NULL,
  `cus_id` int(100) NOT NULL,
  `label_id` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `cus_profile_label`
--

INSERT INTO `cus_profile_label` (`id`, `cus_id`, `label_id`) VALUES
(1, 1, 0),
(2, 2, 0),
(3, 3, 1),
(4, 5, 2),
(5, 5, 1),
(6, 5, 3);

-- --------------------------------------------------------

--
-- 資料表結構 `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_password` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_avatar` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `users`
--

INSERT INTO `users` (`id`, `user_name`, `user_password`, `user_email`, `user_avatar`) VALUES
(1, 'Carl', '$2b$10$nXJBxDUoy/J63yi1zocfx.VgiS5bJ4IxHRfH0LffEFBxfEqXS8laK', 'carl@verygood.com.tw', 'https://images.pexels.com/photos/7036557/pexels-photo-7036557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
(3, 'CheCheHuang', '', '', 'https://profile.line-scdn.net/0h6czKOykHaUxHMn4VaFkWG3t3ZyEwHG8EP10jLWszZHg_UilKfAEgKGtlMC5uVidIe1cgfjI6MXRr');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `cus_label`
--
ALTER TABLE `cus_label`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `cus_profile`
--
ALTER TABLE `cus_profile`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `cus_profile_label`
--
ALTER TABLE `cus_profile_label`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `cus_label`
--
ALTER TABLE `cus_label`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `cus_profile`
--
ALTER TABLE `cus_profile`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `cus_profile_label`
--
ALTER TABLE `cus_profile_label`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
