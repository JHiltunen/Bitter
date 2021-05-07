CREATE DATABASE IF NOT EXISTS bitter;

CREATE TABLE IF NOT EXISTS users (
    userId INT NOT NULL AUTO_INCREMENT,
    firstname VARCHAR(20) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(70) NOT NULL UNIQUE,
    dateOfBirth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    password TEXT NOT NULL, 
    vst DATE NOT NULL,
    vet DATE,
	PRIMARY KEY (userId, vst)
);

CREATE TABLE IF NOT EXISTS roles (
    roleId INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
	PRIMARY KEY (roleId)
);

CREATE TABLE IF NOT EXISTS user_roles (
    userRoleId INT NOT NULL AUTO_INCREMENT,
    roleId INT NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (roleId) REFERENCES roles(roleId),
    FOREIGN KEY (userId) REFERENCES users(userId),
	PRIMARY KEY (userRoleId)
);

CREATE TABLE IF NOT EXISTS posts (
    postId INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    image TEXT NOT NULL,
    likes INT NOT NULL,
    dislikes INT NOT NULL,
    userId INT NOT NULL,
    vst DATETIME NOT NULL,
    vet DATETIME,
	FOREIGN KEY (userId) REFERENCES users(userId),
	PRIMARY KEY (postId, vst)
);

CREATE TABLE IF NOT EXISTS comments (
    commentId INT NOT NULL AUTO_INCREMENT,
    comment TEXT NOT NULL,
    postId INT NOT NULL,
    userId INT NOT NULL,
    vst DATETIME NOT NULL,
    vet DATETIME,
	FOREIGN KEY (userId) REFERENCES users(userId),
	PRIMARY KEY (commentId, vst)
);

CREATE TABLE IF NOT EXISTS contacts (
    contactId INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(70) NOT NULL,
    email VARCHAR(70) NOT NULL,
    message TEXT NOT NULL,
	hasBeenRead BOOLEAN NOT NULL,
    vst DATETIME NOT NULL,
    vet DATETIME,
	PRIMARY KEY (contactId, vst)
);

INSERT INTO roles (name) VALUES ('Admin'), ('User');