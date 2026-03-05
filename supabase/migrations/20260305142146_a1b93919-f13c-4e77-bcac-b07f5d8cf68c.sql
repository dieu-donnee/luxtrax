
-- 1. Create a trigger function to prevent non-admin users from changing the role column
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If role is being changed
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Check if the current user is an admin
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      -- Non-admin: silently revert the role change
      NEW.role := OLD.role;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- 2. Attach the trigger to the profiles table (runs BEFORE UPDATE)
DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();

-- 3. Harden handle_new_user to reject admin role from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_role text;
BEGIN
  requested_role := NEW.raw_user_meta_data->>'role';
  
  -- Only allow 'client' or 'provider' from signup; default to 'client'
  IF requested_role NOT IN ('client', 'provider') THEN
    requested_role := 'client';
  END IF;

  INSERT INTO public.profiles (id, full_name, address, role, vehicle_type, experience_level, terms_accepted)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    requested_role::public.user_role,
    CASE WHEN NEW.raw_user_meta_data->>'vehicle_type' IS NOT NULL THEN (NEW.raw_user_meta_data->>'vehicle_type')::public.vehicle_type ELSE NULL END,
    CASE WHEN NEW.raw_user_meta_data->>'experience_level' IS NOT NULL THEN (NEW.raw_user_meta_data->>'experience_level')::public.experience_level ELSE NULL END,
    COALESCE((NEW.raw_user_meta_data->>'terms_accepted')::boolean, false)
  );
  RETURN NEW;
END;
$$;
