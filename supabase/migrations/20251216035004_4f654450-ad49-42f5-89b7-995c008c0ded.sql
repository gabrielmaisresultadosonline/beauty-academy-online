-- Add certificate fields to course_enrollments
ALTER TABLE public.course_enrollments
ADD COLUMN certificate_photo_url text DEFAULT NULL,
ADD COLUMN certificate_issued_at timestamp with time zone DEFAULT NULL,
ADD COLUMN certificate_url text DEFAULT NULL;

-- Create storage bucket for certificate photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate-photos', 'certificate-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own certificate photos
CREATE POLICY "Users can upload own certificate photo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificate-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read access to certificate photos
CREATE POLICY "Certificate photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificate-photos');

-- Allow users to update their own certificate photos
CREATE POLICY "Users can update own certificate photo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'certificate-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own certificate photos
CREATE POLICY "Users can delete own certificate photo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'certificate-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);