-- Create storage bucket for music files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('music-files', 'music-files', true, 52428800, ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/m4a', 'audio/aac']);

-- Create storage bucket for album covers
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('album-covers', 'album-covers', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- RLS policies for music-files bucket
CREATE POLICY "Anyone can view music files"
ON storage.objects FOR SELECT
USING (bucket_id = 'music-files');

CREATE POLICY "Admins can upload music files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'music-files' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update music files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'music-files' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete music files"
ON storage.objects FOR DELETE
USING (bucket_id = 'music-files' AND has_role(auth.uid(), 'admin'));

-- RLS policies for album-covers bucket
CREATE POLICY "Anyone can view album covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'album-covers');

CREATE POLICY "Admins can upload album covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'album-covers' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update album covers"
ON storage.objects FOR UPDATE
USING (bucket_id = 'album-covers' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete album covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'album-covers' AND has_role(auth.uid(), 'admin'));