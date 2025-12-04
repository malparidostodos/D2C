-- 1. Create a public table to store aggregated stats
create table if not exists landing_stats (
  id int primary key default 1,
  vehicles int default 0,
  hours int default 0,
  five_star int default 0,
  rating numeric(3,1) default 5.0,
  constraint single_row check (id = 1)
);

-- Enable RLS and allow public read access
alter table landing_stats enable row level security;
drop policy if exists "Public read access" on landing_stats;
create policy "Public read access" on landing_stats for select using (true);

-- Insert initial row if not exists
insert into landing_stats (id, vehicles, hours, five_star, rating)
values (1, 0, 0, 0, 5.0)
on conflict (id) do nothing;

-- 2. Function to recalculate stats automatically
create or replace function update_landing_stats()
returns trigger
language plpgsql
security definer
as $$
declare
  v_count int;
  v_hours int;
  v_five_star int;
  v_rating numeric(3,1);
begin
  -- Calculate Vehicles (Completed bookings)
  select count(*) into v_count from bookings where status = 'completed';
  
  -- Calculate Hours (Estimated based on service type)
  select coalesce(sum(
    case 
      when service_id = 'basic' then 3
      when service_id = 'premium' then 6
      when service_id = 'ceramic' then 12
      when service_id = 'interior' then 4
      else 3
    end
  ), 0) into v_hours
  from bookings where status = 'completed';

  -- Calculate Reviews (5 Stars) - Maybe keep this public only? Or all? User asked for avg to be all.
  -- Let's keep 5-star count as ALL 5-star reviews to show total experience.
  select count(*) into v_five_star from testimonials where rating = 5; 
  
  -- Calculate Average Rating - INCLUDE ALL REVIEWS (Hidden & Public)
  select coalesce(avg(rating), 5.0) into v_rating from testimonials;

  -- Update the stats table
  update landing_stats
  set 
    vehicles = v_count,
    hours = v_hours,
    five_star = v_five_star,
    rating = v_rating
  where id = 1;

  return null;
end;
$$;

-- 3. Triggers to fire the update on changes
drop trigger if exists on_booking_change_stats on bookings;
create trigger on_booking_change_stats
after insert or update or delete on bookings
for each row execute function update_landing_stats();

drop trigger if exists on_testimonial_change_stats on testimonials;
create trigger on_testimonial_change_stats
after insert or update or delete on testimonials
for each row execute function update_landing_stats();

-- 4. Enable Realtime
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'landing_stats') then
    alter publication supabase_realtime add table landing_stats;
  end if;
end $$;

-- 5. INITIAL CALCULATION
with stats_calc as (
  select 
    (select count(*) from bookings where status = 'completed') as v_count,
    (select coalesce(sum(
      case 
        when service_id = 'basic' then 3
        when service_id = 'premium' then 6
        when service_id = 'ceramic' then 12
        when service_id = 'interior' then 4
        else 3
      end
    ), 0) from bookings where status = 'completed') as v_hours,
    (select count(*) from testimonials where rating = 5) as v_five_star,
    (select coalesce(avg(rating), 5.0) from testimonials) as v_rating
)
update landing_stats
set 
  vehicles = s.v_count,
  hours = s.v_hours,
  five_star = s.v_five_star,
  rating = s.v_rating
from stats_calc s
where id = 1;
