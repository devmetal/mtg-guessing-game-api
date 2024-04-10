CREATE TABLE `games` (
	`id` integer PRIMARY KEY NOT NULL,
	`started` integer,
	`user_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `puzzles` (
	`id` integer PRIMARY KEY NOT NULL,
	`cid` text NOT NULL,
	`score` real,
	`cmc_guessed` integer,
	`cmc_actual` integer,
	`colors_guessed` text,
	`colors_actual` text,
	`game_id` integer,
	FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON UPDATE no action ON DELETE no action
);
