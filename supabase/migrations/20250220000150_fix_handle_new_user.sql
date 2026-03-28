-- ============================================================
-- Fix handle_new_user trigger to never block auth signup
-- ============================================================
-- The original trigger in migration 120 had no exception handler.
-- If the user_profiles INSERT fails for any reason (constraint,
-- permissions, etc.), it would silently roll back the entire
-- auth.users INSERT, preventing account creation.
-- This migration replaces it with a fault-tolerant version.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block auth signup if profile creation fails
  RETURN NEW;
END;
$$;
