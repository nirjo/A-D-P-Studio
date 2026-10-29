-- ==============================================================================
-- MIGRATION 001: Add order_email_notifications table & atomic claim function
-- Aiel Design & Printing Studio
-- ==============================================================================

-- 1. EMAIL NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.order_email_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL DEFAULT 'order_confirmation',
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'sending', 'sent', 'failed')),
    attempt_count INTEGER NOT NULL DEFAULT 0,
    resend_email_id TEXT,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    sent_at TIMESTAMPTZ,

    -- Prevent duplicate notifications per order + type
    CONSTRAINT uq_order_notification UNIQUE (order_id, notification_type)
);

-- 2. INDEXES
CREATE INDEX IF NOT EXISTS idx_email_notifications_order_id
    ON public.order_email_notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status
    ON public.order_email_notifications(status);

-- 3. UPDATED_AT TRIGGER (reuses existing function)
DROP TRIGGER IF EXISTS trigger_email_notifications_updated_at ON public.order_email_notifications;
CREATE TRIGGER trigger_email_notifications_updated_at
    BEFORE UPDATE ON public.order_email_notifications
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. ROW-LEVEL SECURITY
ALTER TABLE public.order_email_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages email notifications" ON public.order_email_notifications;
CREATE POLICY "Service role manages email notifications"
    ON public.order_email_notifications FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. PERMISSIONS
GRANT ALL ON TABLE public.order_email_notifications TO postgres, service_role;

-- 6. ATOMIC CLAIM FUNCTION
-- Inserts a new row if none exists, or claims a pending/failed row for retry.
-- Returns the claimed row so the caller knows whether to proceed.
-- If the row is already 'sending' or 'sent', returns nothing (prevents duplicates).
CREATE OR REPLACE FUNCTION public.claim_email_notification(
    p_order_id UUID,
    p_notification_type TEXT DEFAULT 'order_confirmation'
)
RETURNS TABLE (
    id UUID,
    status TEXT,
    attempt_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO public.order_email_notifications (order_id, notification_type, status, attempt_count)
    VALUES (p_order_id, p_notification_type, 'sending', 1)
    ON CONFLICT (order_id, notification_type) DO UPDATE
        SET status = 'sending',
            attempt_count = public.order_email_notifications.attempt_count + 1,
            updated_at = timezone('utc'::text, now())
        WHERE public.order_email_notifications.status IN ('pending', 'failed')
    RETURNING
        public.order_email_notifications.id,
        public.order_email_notifications.status,
        public.order_email_notifications.attempt_count;
END;
$$ LANGUAGE plpgsql;

-- Grant execute on the claim function to service_role
GRANT EXECUTE ON FUNCTION public.claim_email_notification(UUID, TEXT) TO service_role;

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
