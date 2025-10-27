-- AgroConnect Database Schema
-- SQLite Database for MVP

-- Users table - UC-01: Đăng ký tài khoản
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role TEXT CHECK(role IN ('farmer', 'business', 'consumer', 'esg_expert')) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT 1,
    is_verified BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User profiles table - UC-02: Hồ sơ người dùng
CREATE TABLE IF NOT EXISTS user_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    bio TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    address TEXT,
    certifications TEXT, -- JSON string of certifications
    activity_history TEXT, -- JSON string of activities
    social_links TEXT, -- JSON string of social media links
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ESG verification table - UC-03: Xác thực ESG ID
CREATE TABLE IF NOT EXISTS esg_verifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    esg_id VARCHAR(50) UNIQUE,
    verification_status TEXT CHECK(verification_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    verified_by INTEGER, -- ESG expert who verified
    verification_date DATETIME,
    verification_notes TEXT,
    esg_score INTEGER, -- 0-100
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- ESG score details table
CREATE TABLE IF NOT EXISTS esg_score_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    esg_verification_id INTEGER NOT NULL,
    environment_score INTEGER DEFAULT 0, -- E score
    social_score INTEGER DEFAULT 0, -- S score
    governance_score INTEGER DEFAULT 0, -- G score
    co2_emissions DECIMAL(10, 2),
    water_usage DECIMAL(10, 2),
    waste_management_score INTEGER,
    gender_equality_score INTEGER,
    safety_score INTEGER,
    community_participation_score INTEGER,
    data_transparency_score INTEGER,
    legal_compliance_score INTEGER,
    traceability_score INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (esg_verification_id) REFERENCES esg_verifications(id) ON DELETE CASCADE
);

-- User sessions table for authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_esg_verifications_user_id ON esg_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_esg_verifications_esg_id ON esg_verifications(esg_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
