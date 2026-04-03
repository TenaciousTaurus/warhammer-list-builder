-- Add game_session_events and game_session_scores to Realtime publication
-- These were missing from the original migration, preventing multi-device sync
-- for event logs and scoring updates.

ALTER PUBLICATION supabase_realtime ADD TABLE game_session_events;
ALTER PUBLICATION supabase_realtime ADD TABLE game_session_scores;
