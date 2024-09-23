import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createConnection({
  // host: 'db',
  host: "127.0.0.1",
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "connectnet",
});

db.connect((err) => {
  if (err) throw err;
  db.query("CREATE DATABASE IF NOT EXISTS connectnet", (err, result) => {
    if (err) throw err;
    db.query("USE connectnet", (err, result) => {
      if (err) throw err;
    });
  });
});

const query1 =
  "CREATE TABLE IF NOT EXISTS `connectnet`.`users` (`id` INT NOT NULL AUTO_INCREMENT," +
  " `username` VARCHAR(100) NOT NULL,`email` VARCHAR(100) NOT NULL," +
  " `password` VARCHAR(200) NOT NULL,`name` VARCHAR(100) NOT NULL," +
  " `DOB` DATE NULL,`coverpic` VARCHAR(500) NULL,`profilepic` VARCHAR(500) NULL," +
  " `city` VARCHAR(50) NULL,`website` VARCHAR(200) NULL,`phoneno` VARCHAR(50) NULL," +
  " PRIMARY KEY (`id`),UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);";

const query2 =
  "CREATE TABLE IF NOT EXISTS `connectnet`.`relations` (" +
  " `id` INT NOT NULL AUTO_INCREMENT," +
  " `userid` INT NOT NULL," +
  " `friendid` INT NOT NULL," +
  " PRIMARY KEY (`id`)," +
  " UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE," +
  " INDEX `relations_userid_idx` (`userid` ASC) VISIBLE," +
  " INDEX `relations_friendid_idx` (`friendid` ASC) VISIBLE," +
  " CONSTRAINT `relations_userid`" +
  " FOREIGN KEY (`userid`)" +
  " REFERENCES `connectnet`.`users` (`id`)" +
  " ON DELETE CASCADE" +
  " ON UPDATE CASCADE," +
  " CONSTRAINT `relations_friendid`" +
  " FOREIGN KEY (`friendid`)" +
  " REFERENCES `connectnet`.`users` (`id`)" +
  " ON DELETE CASCADE" +
  " ON UPDATE CASCADE);";

const query3 =
  "CREATE TABLE IF NOT EXISTS `connectnet`.`posts` (" +
  " `id` INT NOT NULL AUTO_INCREMENT," +
  " `desc` VARCHAR(300) NOT NULL," +
  " `content` VARCHAR(300) NULL," +
  " `userid` INT NOT NULL," +
  " `createdAt` DATETIME NOT NULL," +
  " PRIMARY KEY (`id`)," +
  " UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE," +
  " INDEX `posts_userid_idx` (`userid` ASC) VISIBLE," +
  " CONSTRAINT `posts_userid`" +
  " FOREIGN KEY (`userid`)" +
  " REFERENCES `connectnet`.`users` (`id`)" +
  " ON DELETE CASCADE" +
  " ON UPDATE CASCADE);";

const query4 =
  "CREATE TABLE IF NOT EXISTS `connectnet`.`messages` (" +
  " `id` INT NOT NULL AUTO_INCREMENT," +
  " `senderid` INT NOT NULL," +
  " `receiverid` INT NOT NULL," +
  " `message` VARCHAR(300) NOT NULL," +
  " `createdAt` DATETIME NOT NULL," +
  " PRIMARY KEY (`id`)," +
  " UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE," +
  " INDEX `mess_senderid_idx` (`senderid` ASC) VISIBLE," +
  " INDEX `mess_receiverid_idx` (`receiverid` ASC) VISIBLE," +
  " CONSTRAINT `mess_senderid`" +
  " FOREIGN KEY (`senderid`)" +
  " REFERENCES `connectnet`.`users` (`id`)" +
  " ON DELETE CASCADE" +
  " ON UPDATE CASCADE," +
  " CONSTRAINT `mess_receiverid`" +
  " FOREIGN KEY (`receiverid`)" +
  " REFERENCES `connectnet`.`users` (`id`)" +
  " ON DELETE CASCADE" +
  " ON UPDATE CASCADE);";

const query5 =
  "CREATE TABLE IF NOT EXISTS `connectnet`.`likes` (" +
  " `id` INT NOT NULL AUTO_INCREMENT," +
  " `userid` INT NOT NULL," +
  " `postid` INT NOT NULL," +
  " PRIMARY KEY (`id`)," +
  " UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE," +
  " INDEX `like_userid_idx` (`userid` ASC) VISIBLE," +
  " INDEX `like_postid_idx` (`postid` ASC) VISIBLE," +
  " CONSTRAINT `like_userid`" +
  " FOREIGN KEY (`userid`)" +
  " REFERENCES `connectnet`.`users` (`id`)" +
  " ON DELETE CASCADE" +
  " ON UPDATE CASCADE," +
  " CONSTRAINT `like_postid`" +
  " FOREIGN KEY (`postid`)" +
  " REFERENCES `connectnet`.`posts` (`id`)" +
  " ON DELETE CASCADE" +
  " ON UPDATE CASCADE);";

const query6 =
  "CREATE TABLE IF NOT EXISTS `connectnet`.`comments` (" +
  " `id` INT NOT NULL AUTO_INCREMENT," +
  " `desc` VARCHAR(300) NOT NULL," +
  " `time` DATETIME NOT NULL," +
  " `userid` INT NOT NULL," +
  " `postid` INT NOT NULL," +
  " PRIMARY KEY (`id`)," +
  " UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE," +
  " INDEX `comment_userid_idx` (`userid` ASC) VISIBLE," +
  " INDEX `comment_postid_idx` (`postid` ASC) VISIBLE," +
  " CONSTRAINT `comment_userid`" +
  " FOREIGN KEY (`userid`)" +
  " REFERENCES `connectnet`.`users` (`id`)" +
  " ON DELETE CASCADE" +
  " ON UPDATE CASCADE," +
  " CONSTRAINT `comment_postid`" +
  " FOREIGN KEY (`postid`)" +
  " REFERENCES `connectnet`.`posts` (`id`)" +
  " ON DELETE CASCADE" +
  " ON UPDATE CASCADE);";

  // activities table
const query7 =
  "CREATE TABLE IF NOT EXISTS `connectnet`.`activities` (" +
  " `id` INT NOT NULL AUTO_INCREMENT," +
  " `userid` INT NOT NULL," +
  " `activity` JSON NOT NULL," +
  " `time` DATETIME NOT NULL," +
  " PRIMARY KEY (`id`)," +
  " UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE," +
  " INDEX `activity_user_idx` (`userid` ASC) VISIBLE," +
  " CONSTRAINT `activity_user`" +
  " FOREIGN KEY (`userid`)" +
  " REFERENCES `connectnet`.`users` (`id`)" +
  " ON DELETE CASCADE" +
  " ON UPDATE CASCADE);";

db.query(query1, (err, result) => {
  if (err) console.log(err);
});

db.query(query2, (err, result) => {
  if (err) console.log(err);
});

db.query(query3, (err, result) => {
  if (err) console.log(err);
});

db.query(query4, (err, result) => {
  if (err) console.log(err);
});

db.query(query5, (err, result) => {
  if (err) console.log(err);
});

db.query(query6, (err, result) => {
  if (err) console.log(err);
});

db.query(query7, (err, result) => {
  if (err) console.log(err);
});

console.log("Connected to the database");
