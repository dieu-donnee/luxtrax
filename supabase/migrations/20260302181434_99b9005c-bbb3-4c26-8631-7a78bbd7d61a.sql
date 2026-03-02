
CREATE TYPE public.user_role AS ENUM ('client', 'provider', 'admin');
CREATE TYPE public.service_type AS ENUM ('carwash', 'laundry');
CREATE TYPE public.booking_status AS ENUM ('pending', 'ongoing', 'completed', 'cancelled');
CREATE TYPE public.vehicle_type AS ENUM ('sedan', 'suv', 'truck', 'van', 'compact', 'coupe', 'convertible', 'wagon', 'hatchback', 'minivan', 'other');
CREATE TYPE public.experience_level AS ENUM ('beginner', 'intermediate', 'expert');
