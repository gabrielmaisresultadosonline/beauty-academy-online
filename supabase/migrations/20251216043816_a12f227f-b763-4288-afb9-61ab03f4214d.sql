-- Allow logged-in users to update their own enrollment (needed for certificate photo updates and premium activation)
CREATE POLICY "Users can update own enrollment"
ON public.course_enrollments
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
