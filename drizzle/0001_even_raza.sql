CREATE TABLE `admins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(64) NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `admins_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `uids` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vendor_id` int NOT NULL,
	`account_id` varchar(64) NOT NULL,
	`duration_days` int NOT NULL,
	`registered_at` timestamp NOT NULL DEFAULT (now()),
	`expires_at` timestamp NOT NULL,
	`status` enum('ativo','expirado') NOT NULL DEFAULT 'ativo',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `uids_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vendors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(64) NOT NULL,
	`password_hash` text NOT NULL,
	`uid_limit` int NOT NULL DEFAULT 10,
	`used_uids` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendors_id` PRIMARY KEY(`id`),
	CONSTRAINT `vendors_username_unique` UNIQUE(`username`)
);
