CREATE DATABASE tile_gallery_db;

USE tile_gallery_db;

CREATE TABLE category_master (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    block VARCHAR(50)
);

CREATE TABLE application_master (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    block VARCHAR(50)
);

CREATE TABLE products (
    prod_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    application_id INT,
    prod_name VARCHAR(100) NOT NULL,
    sqcode VARCHAR(50) UNIQUE NOT NULL,
    block VARCHAR(50),
    FOREIGN KEY (category_id) REFERENCES category_master(category_id),
    FOREIGN KEY (application_id) REFERENCES application_master(application_id)
);

ALTER TABLE products
MODIFY category_id INT NOT NULL,
MODIFY application_id INT NOT NULL;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'viewer') NOT NULL
);

INSERT INTO category_master (name, block) VALUES
('Ceramic', 'A'),
('Porcelain', 'B'),
('Marble', 'A');

INSERT INTO application_master (name, block) VALUES
('Flooring', 'A'),
('Wall', 'B'),
('Outdoor', 'A');

INSERT INTO users (username, password, role) VALUES
('admin', '<your hashed password>', 'admin'),
('viewer', '<your hashed password>', 'viewer');

SHOW TABLES;

ALTER TABLE products
ADD COLUMN imageUrl VARCHAR(255) DEFAULT NULL;

SELECT * FROM category_master;
SELECT * FROM application_master;
DROP TABLE users;
DROP DATABASE tile_gallery_db;
-- Insert test data

INSERT INTO categories (name, block) VALUES
    ('Ceramic', 'A'),
    ('Porcelain', 'B');

INSERT INTO applications (name, block) VALUES
    ('Floor', 'A'),
    ('Wall', 'B');
DESCRIBE products
