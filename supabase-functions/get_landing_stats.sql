-- Function to get public stats for the landing page
-- Returns aggregated counts for vehicles, ratings, and service breakdown
-- Uses SECURITY DEFINER to bypass RLS on the bookings table for public display

create or replace function get_landing_stats()
returns json
language plpgsql
security definer
as $$
declare
  result json;
begin
  select json_build_object(
    'vehicles', (select count(*) from bookings where status = 'completed'),
    'five_star', (select count(*) from testimonials where rating = 5 and is_public = true),
    'rating', (select coalesce(avg(rating), 5.0) from testimonials where is_public = true),
    'service_breakdown', (
      select json_object_agg(coalesce(service_id, 'unknown'), count)
      from (
        select service_id, count(*) as count
        from bookings
        where status = 'completed'
        group by service_id
      ) s
    )
  ) into result;
  
  return result;
end;
$$;
