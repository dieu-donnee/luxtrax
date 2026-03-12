-- ==========================================================
-- LUXTRAX STARTUP MARKETPLACE - MIGRATION SQL
-- ==========================================================
-- Ce script prépare votre base de données Supabase pour les 
-- nouvelles fonctionnalités : Paiements, Wiki Prestataires, 
-- Avis clients et Validation des documents.
--
-- INSTRUCTIONS : Copiez et collez ce script dans l'éditeur SQL 
-- de votre tableau de bord Supabase (SQL Editor).
-- ==========================================================

-- 1. Enums (Types personnalisés)
DO $$ BEGIN
    CREATE TYPE review_status AS ENUM ('pending', 'published', 'hidden');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('momo_mtn', 'momo_moov', 'cash', 'card');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'captured', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE provider_doc_status AS ENUM ('pending', 'awaiting_correction', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Mise à jour de la table PROFILES
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS balance NUMERIC(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5, 2) DEFAULT 20.00,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

-- 3. Création de la table PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status payment_status DEFAULT 'pending',
    method payment_method NOT NULL,
    transaction_reference TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Création de la table REVIEWS (Avis)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    status review_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Création de la table PROVIDER_DOCS (Documents prestataires)
CREATE TABLE IF NOT EXISTS provider_docs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL, 
    doc_url TEXT NOT NULL,
    status provider_doc_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Sécurité RLS et Politiques
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_docs ENABLE ROW LEVEL SECURITY;

-- Politiques de Paiement
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = payments.booking_id 
            AND (bookings.user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
            ))
        )
    );

-- Politiques de Reviews
DROP POLICY IF EXISTS "Anyone can view published reviews" ON reviews;
CREATE POLICY "Anyone can view published reviews" ON reviews
    FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Clients can create reviews for their bookings" ON reviews;
CREATE POLICY "Clients can create reviews for their bookings" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Politiques Documents
DROP POLICY IF EXISTS "Providers can manage their own docs" ON provider_docs;
CREATE POLICY "Providers can manage their own docs" ON provider_docs
    FOR ALL USING (auth.uid() = provider_id);

-- Politiques Admin (Accès total sur les nouvelles tables)
DROP POLICY IF EXISTS "Admins have full access on all new tables" ON payments;
CREATE POLICY "Admins have full access on all new tables" ON payments FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins have full access on reviews" ON reviews;
CREATE POLICY "Admins have full access on reviews" ON reviews FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Admins have full access on provider_docs" ON provider_docs;
CREATE POLICY "Admins have full access on provider_docs" ON provider_docs FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
