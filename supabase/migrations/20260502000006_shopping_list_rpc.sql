-- W2-3: Shopping List for Army
-- RPC returns units in the list that the user doesn't own enough of,
-- along with estimated cost from their wishlist if available.

CREATE OR REPLACE FUNCTION public.shopping_list_for_army(
  p_list_id UUID,
  p_user_id UUID
)
RETURNS TABLE (
  unit_id   UUID,
  unit_name TEXT,
  count_needed INT,
  count_owned  INT,
  est_cost_usd NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.id                                  AS unit_id,
    u.name                                AS unit_name,
    SUM(alu.model_count)::INT             AS count_needed,
    COALESCE(ce_agg.total_owned, 0)::INT  AS count_owned,
    wi.estimated_price                    AS est_cost_usd
  FROM army_list_units alu
  JOIN army_lists al ON al.id = alu.army_list_id
  JOIN units u       ON u.id = alu.unit_id
  LEFT JOIN (
    SELECT unit_id, SUM(quantity)::INT AS total_owned
    FROM collection_entries
    WHERE user_id = p_user_id
      AND unit_id IS NOT NULL
    GROUP BY unit_id
  ) ce_agg ON ce_agg.unit_id = u.id
  LEFT JOIN LATERAL (
    SELECT estimated_price
    FROM wishlist_items
    WHERE user_id   = p_user_id
      AND unit_id   = u.id
      AND estimated_price IS NOT NULL
    ORDER BY priority ASC
    LIMIT 1
  ) wi ON TRUE
  WHERE alu.army_list_id = p_list_id
    AND al.user_id       = p_user_id   -- caller must own the list
  GROUP BY u.id, u.name, ce_agg.total_owned, wi.estimated_price
  HAVING SUM(alu.model_count) > COALESCE(ce_agg.total_owned, 0)
  ORDER BY u.name;
$$;

REVOKE ALL   ON FUNCTION public.shopping_list_for_army(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.shopping_list_for_army(UUID, UUID) TO authenticated;
