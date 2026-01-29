-- Connected Task Marketplace Database Schema (MySQL)

CREATE DATABASE IF NOT EXISTS connected_db;
USE connected_db;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('client', 'tasker', 'admin') NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS Tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    date_time DATETIME NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    status ENUM('open', 'assigned', 'completed', 'cancelled') DEFAULT 'open',
    tasker_id INT, -- Added to track assigned tasker
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (tasker_id) REFERENCES Users(id) ON DELETE SET NULL
);

-- Offers Table
CREATE TABLE IF NOT EXISTS Offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    tasker_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    message TEXT,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (tasker_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Chats Table (Encrypted)
CREATE TABLE IF NOT EXISTS Chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL, -- Encrypted with AES-256
    file_url VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Payments Table (Escrow)
CREATE TABLE IF NOT EXISTS Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    client_id INT NOT NULL,
    tasker_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    commission DECIMAL(10, 2) NOT NULL,
    escrow_status ENUM('pending', 'held', 'released', 'refunded') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (tasker_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS Reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    reviewee_id INT NOT NULL,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES Tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- AdminActions Table
CREATE TABLE IF NOT EXISTS AdminActions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES Users(id) ON DELETE CASCADE
);
