-- Function to delete own account
-- This must be SECURITY DEFINER to access auth.users
create or replace function delete_own_account()
returns void
language plpgsql
security definer
as $$
declare
  current_uid uuid;
begin
  current_uid := auth.uid();

  -- 1. Unlink and anonymize bookings
  -- We set user_id to NULL and prefix the email with 'deleted_' + timestamp
  update bookings
  set 
    user_id = null,
    client_email = 'deleted_' || extract(epoch from now())::text || '_' || client_email
  where user_id = current_uid;

  -- 2. Delete user vehicles
  -- We remove all vehicles associated with this user
  delete from user_vehicles where user_id = current_uid;

  -- 3. Delete the user account
  delete from auth.users where id = current_uid;
end;
$$;

-- Function to suspend own account
-- Updates user metadata to include 'suspended: true'
create or replace function suspend_own_account()
returns void
language plpgsql
security definer
as $$
begin
  update auth.users
  set raw_user_meta_data = 
    coalesce(raw_user_meta_data, '{}'::jsonb) || '{"suspended": true}'::jsonb
  where id = auth.uid();
end;
$$;

-- Grant execute permissions
grant execute on function delete_own_account() to authenticated;
grant execute on function suspend_own_account() to authenticated;
