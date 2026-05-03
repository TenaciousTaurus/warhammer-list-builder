-- W2-9: Tournament List Submission + TO Admin

ALTER TABLE public.tournament_participants
  ADD COLUMN IF NOT EXISTS list_submission_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS submitted_list_id        UUID REFERENCES public.army_lists(id) ON DELETE SET NULL;

-- RPC: submit a list for a tournament (validates before accepting)
CREATE OR REPLACE FUNCTION public.submit_tournament_list(
  p_participant_id UUID,
  p_list_id        UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_participant tournament_participants%ROWTYPE;
  v_validation  RECORD;
  v_result      JSONB;
BEGIN
  -- Fetch participant, verify caller owns it
  SELECT * INTO v_participant
    FROM tournament_participants
    WHERE id = p_participant_id AND user_id = auth.uid();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Participant not found or not yours');
  END IF;

  -- Check deadline
  IF v_participant.list_submission_deadline IS NOT NULL
     AND NOW() > v_participant.list_submission_deadline THEN
    RETURN jsonb_build_object('success', false, 'error', 'Submission deadline has passed');
  END IF;

  -- Validate the list
  SELECT * INTO v_validation FROM validate_army_list(p_list_id);

  IF NOT v_validation.is_valid THEN
    RETURN jsonb_build_object(
      'success', false,
      'error',  'List is invalid',
      'details', jsonb_build_object(
        'total_points',            v_validation.total_points,
        'points_limit',            v_validation.points_limit,
        'has_unit_violations',     v_validation.has_unit_limit_violations,
        'has_enhancement_violations', v_validation.has_enhancement_violations
      )
    );
  END IF;

  -- Persist the submission
  UPDATE tournament_participants
    SET submitted_list_id = p_list_id
    WHERE id = p_participant_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL   ON FUNCTION public.submit_tournament_list(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_tournament_list(UUID, UUID) TO authenticated;
