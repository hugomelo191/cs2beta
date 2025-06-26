-- Add Faceit integration fields to players table
-- Migration: 0002_add_faceit_fields.sql
-- Created: 2025-01-08

ALTER TABLE players 
ADD COLUMN faceit_nickname VARCHAR(50),
ADD COLUMN faceit_id VARCHAR(100),
ADD COLUMN faceit_elo INTEGER,
ADD COLUMN faceit_level INTEGER,
ADD COLUMN steam_id VARCHAR(50),
ADD COLUMN faceit_url TEXT,
ADD COLUMN faceit_stats_updated_at TIMESTAMP;

-- Add indexes for better performance
CREATE INDEX idx_players_faceit_nickname ON players(faceit_nickname);
CREATE INDEX idx_players_faceit_id ON players(faceit_id);
CREATE INDEX idx_players_steam_id ON players(steam_id);

-- Add comment
COMMENT ON COLUMN players.faceit_nickname IS 'Player nickname on Faceit platform';
COMMENT ON COLUMN players.faceit_id IS 'Unique Faceit player ID';
COMMENT ON COLUMN players.faceit_elo IS 'Current Faceit ELO rating';
COMMENT ON COLUMN players.faceit_level IS 'Current Faceit level (1-10)';
COMMENT ON COLUMN players.steam_id IS 'Steam 64-bit ID';
COMMENT ON COLUMN players.faceit_url IS 'Full URL to Faceit profile';
COMMENT ON COLUMN players.faceit_stats_updated_at IS 'Timestamp of last Faceit stats update'; 