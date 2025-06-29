-- CS2BETA Database Schema
-- Initial migration with all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar TEXT,
    bio TEXT,
    country VARCHAR(2) DEFAULT 'pt',
    role VARCHAR(20) DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    tag VARCHAR(10) NOT NULL UNIQUE,
    logo TEXT,
    banner TEXT,
    description TEXT,
    country VARCHAR(2) NOT NULL,
    city VARCHAR(100),
    founded INTEGER,
    website TEXT,
    socials JSONB,
    achievements JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    nickname VARCHAR(50) NOT NULL,
    real_name VARCHAR(100),
    avatar TEXT,
    banner TEXT,
    country VARCHAR(2) NOT NULL,
    city VARCHAR(100),
    age INTEGER,
    role VARCHAR(20) DEFAULT 'player',
    position VARCHAR(20),
    bio TEXT,
    achievements JSONB,
    stats JSONB,
    socials JSONB,
    faceit_nickname VARCHAR(50),
    faceit_id VARCHAR(100),
    faceit_elo INTEGER,
    faceit_level INTEGER,
    steam_id VARCHAR(50),
    faceit_url TEXT,
    faceit_stats_updated_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tournaments table
CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    logo TEXT,
    banner TEXT,
    organizer VARCHAR(100) NOT NULL,
    prize_pool DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'EUR',
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    registration_deadline TIMESTAMP,
    max_teams INTEGER,
    current_teams INTEGER DEFAULT 0,
    format VARCHAR(50),
    maps JSONB,
    rules TEXT,
    status VARCHAR(20) DEFAULT 'upcoming',
    country VARCHAR(2),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- News table
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    image TEXT,
    category VARCHAR(20) NOT NULL,
    tags JSONB,
    views INTEGER DEFAULT 0,
    read_time INTEGER,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Casters table
CREATE TABLE casters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    specialty VARCHAR(100),
    avatar TEXT,
    banner TEXT,
    bio TEXT,
    country VARCHAR(2) NOT NULL,
    languages JSONB,
    followers INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    experience VARCHAR(50),
    socials JSONB,
    is_live BOOLEAN DEFAULT FALSE,
    current_game TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Drafts table
CREATE TABLE drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    max_teams INTEGER NOT NULL,
    current_teams INTEGER DEFAULT 0,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    requirements JSONB,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Draft Applications table
CREATE TABLE draft_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draft_id UUID REFERENCES drafts(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Team Members table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'player',
    joined_at TIMESTAMP DEFAULT NOW(),
    left_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tournament Participants table
CREATE TABLE tournament_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'registered',
    seed INTEGER,
    final_position INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Caster Applications table
CREATE TABLE caster_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    country VARCHAR(2) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    bio TEXT,
    demo_url TEXT,
    socials JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_players_nickname ON players(nickname);
CREATE INDEX idx_players_faceit_id ON players(faceit_id);
CREATE INDEX idx_teams_tag ON teams(tag);
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_published ON news(is_published);
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_start_date ON tournaments(start_date);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_casters_updated_at BEFORE UPDATE ON casters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_drafts_updated_at BEFORE UPDATE ON drafts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_draft_applications_updated_at BEFORE UPDATE ON draft_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_caster_applications_updated_at BEFORE UPDATE ON caster_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 