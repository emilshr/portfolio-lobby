CREATE TABLE
    IF NOT EXISTS user (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        hashed_password VARCHAR(255) NOT NULL,
        confirmation_token VARCHAR(255) NULL,
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