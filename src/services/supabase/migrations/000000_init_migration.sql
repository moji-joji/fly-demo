-- Enable the UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for Plan Type
CREATE TYPE "public"."Plan Type" AS ENUM ('Pro', 'Free');

-- Create tables

-- Users table (referenced by foreign keys but not explicitly defined in your types)
-- Standard auth.users table that Supabase automatically creates
-- This is required for the foreign key relationships
-- You might not need to create this manually if using Supabase Auth

-- Credits table
CREATE TABLE "public"."credits" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "credits" INTEGER NOT NULL DEFAULT 0,
    "planType" "public"."Plan Type" NOT NULL DEFAULT 'Free',
    "proPlanExpirationDate" TIMESTAMP WITH TIME ZONE,
    "userId" UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Feedback table
CREATE TABLE "public"."feedback" (
    "id" SERIAL PRIMARY KEY,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "rating" INTEGER,
    "text" TEXT,
    "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Inspirations table
CREATE TABLE "public"."inspirations" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "category" TEXT NOT NULL,
    "isSaved" BOOLEAN NOT NULL DEFAULT FALSE,
    "text" TEXT NOT NULL,
    "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Posts table
CREATE TABLE "public"."posts" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "feedback" TEXT,
    "feedbackSubmitted" BOOLEAN NOT NULL DEFAULT FALSE,
    "isPosted" BOOLEAN NOT NULL DEFAULT FALSE,
    "isSaved" BOOLEAN NOT NULL DEFAULT FALSE,
    "rating" INTEGER,
    "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE "public"."messages" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "content" TEXT NOT NULL,
    "edited" BOOLEAN NOT NULL DEFAULT FALSE,
    "postId" UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    "role" TEXT NOT NULL,
    "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Post Iterations table
CREATE TABLE "public"."postIterations" (
    "id" SERIAL PRIMARY KEY,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "isManuallyEdited" BOOLEAN NOT NULL DEFAULT FALSE,
    "postId" UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    "text" TEXT NOT NULL,
    "userId" UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    "userMessage" TEXT
);

-- Profiles table
CREATE TABLE "public"."profiles" (
    "id" UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    "avatar" TEXT,
    "buyerPersona" TEXT,
    "companyData" TEXT,
    "companyName" TEXT,
    "companyUrl" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "email" TEXT NOT NULL,
    "feedbackGiven" BOOLEAN NOT NULL DEFAULT FALSE,
    "hasOnboarded" BOOLEAN,
    "linkedinGoals" TEXT[],
    "linkedinTopics" TEXT[],
    "name" TEXT,
    "postTone" TEXT,
    "productInfo" TEXT,
    "profession" TEXT,
    "role" TEXT,
    "stripeCustomerId" TEXT,
    "subscriptionId" TEXT,
    "targetAudience" TEXT[]
);

-- Create functions
CREATE OR REPLACE FUNCTION "public"."check_credit"()
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    user_id UUID;
    credit_count INTEGER;
BEGIN
    -- Get the current user ID
    user_id := auth.uid();
    
    -- Check if user has credits
    SELECT credits INTO credit_count FROM public.credits WHERE credits.userId = user_id;
    
    -- Return true if credits > 0
    RETURN COALESCE(credit_count, 0) > 0;
END;
$$;

CREATE OR REPLACE FUNCTION "public"."get_posts_with_latest_content"()
RETURNS TABLE(
    id UUID,
    isPosted BOOLEAN,
    isSaved BOOLEAN,
    text TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.isPosted,
        p.isSaved,
        (SELECT pi.text FROM public."postIterations" pi WHERE pi.postId = p.id ORDER BY pi."createdAt" DESC LIMIT 1) as text
    FROM 
        public.posts p
    WHERE 
        p.userId = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION "public"."subtract_credit"(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Subtract one credit from the user
    UPDATE public.credits
    SET credits = credits - 1
    WHERE credits.userId = user_id AND credits > 0;
END;
$$;

-- Add indexes for performance
CREATE INDEX idx_credits_userId ON public.credits(userId);
CREATE INDEX idx_feedback_userId ON public.feedback(userId);
CREATE INDEX idx_inspirations_userId ON public.inspirations(userId);
CREATE INDEX idx_posts_userId ON public.posts(userId);
CREATE INDEX idx_messages_postId ON public.messages(postId);
CREATE INDEX idx_messages_userId ON public.messages(userId);
CREATE INDEX idx_postIterations_postId ON public.postIterations(postId);
CREATE INDEX idx_postIterations_userId ON public.postIterations(userId);

-- Set up RLS (Row Level Security) policies if needed
-- Example for posts table:
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own posts"
    ON public.posts
    FOR SELECT
    USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own posts"
    ON public.posts
    FOR INSERT
    WITH CHECK (auth.uid() = userId);

CREATE POLICY "Users can update their own posts"
    ON public.posts
    FOR UPDATE
    USING (auth.uid() = userId);

CREATE POLICY "Users can delete their own posts"
    ON public.posts
    FOR DELETE
    USING (auth.uid() = userId);

-- Similar policies would be needed for other tables