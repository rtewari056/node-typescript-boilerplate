CREATE DATABASE IF NOT EXISTS node_typescript; -- Create a database named node_typescript

USE node_typescript; -- Use the database to make changes to it

-- Drop tables if already exists
DROP TABLE IF EXISTS user;

CREATE TABLE user (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  email VARCHAR(45) NOT NULL UNIQUE,
  salt VARCHAR(255) NOT NULL,
  password VARCHAR(100) NOT NULL,
  session_token VARCHAR(100) NULL,
  image varchar(500) NULL,
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);