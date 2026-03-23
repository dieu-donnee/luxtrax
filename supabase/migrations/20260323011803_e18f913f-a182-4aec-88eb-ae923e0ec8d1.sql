
DROP POLICY "Users can update own bookings" ON public.bookings;

CREATE POLICY "Users can update own bookings"
  ON public.bookings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND status = (SELECT b.status FROM public.bookings b WHERE b.id = bookings.id)
    AND service_id = (SELECT b.service_id FROM public.bookings b WHERE b.id = bookings.id)
    AND user_id = (SELECT b.user_id FROM public.bookings b WHERE b.id = bookings.id)
  );
