CREATE TABLE `messages_temp` (
    `id` INTEGER PRIMARY KEY NOT NULL,
    `text` TEXT
);

INSERT INTO `messages_temp` (`id`, `text`)
SELECT CAST(`id` AS INTEGER), `text`
FROM `messages`;

DROP TABLE `messages`;

ALTER TABLE `messages_temp` RENAME TO `messages`;
