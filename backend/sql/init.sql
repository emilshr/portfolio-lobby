CREATE TABLE
    IF NOT EXISTS user (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        hashed_password VARCHAR(255) NOT NULL,
        is_verified BOOLEAN DEFAULT false,
        created_at DATETIME NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS password_reset (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL,
        FOREIGN KEY (`user_id`) REFERENCES user (`id`)
    );

CREATE TABLE
    IF NOT EXISTS token (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(255) NOT NULL,
        expiry DATETIME NOT NULL
    );

CREATE TABLE
    IF NOT EXISTS confirmation_token (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(255) NOT NULL
    );