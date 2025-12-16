-- Create course_modules table for hair course
CREATE TABLE public.course_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course_lessons table for videos/lessons
CREATE TABLE public.course_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  video_file_url TEXT,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course_enrollments table for premium access
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  premium_activated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create course_payments table
CREATE TABLE public.course_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_provider TEXT DEFAULT 'infinitepay',
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_payments ENABLE ROW LEVEL SECURITY;

-- RLS for course_modules (admins manage, premium users view)
CREATE POLICY "Admins can manage course_modules" ON public.course_modules
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Premium users can view course_modules" ON public.course_modules
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.course_enrollments WHERE user_id = auth.uid() AND is_premium = true)
    OR has_role(auth.uid(), 'admin')
  );

-- RLS for course_lessons (admins manage, premium users view)
CREATE POLICY "Admins can manage course_lessons" ON public.course_lessons
  FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Premium users can view course_lessons" ON public.course_lessons
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.course_enrollments WHERE user_id = auth.uid() AND is_premium = true)
    OR has_role(auth.uid(), 'admin')
  );

-- RLS for course_enrollments
CREATE POLICY "Users can view own enrollment" ON public.course_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollment" ON public.course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage enrollments" ON public.course_enrollments
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS for course_payments
CREATE POLICY "Users can view own course_payments" ON public.course_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own course_payments" ON public.course_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all course_payments" ON public.course_payments
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Create storage bucket for course videos
INSERT INTO storage.buckets (id, name, public) VALUES ('course-videos', 'course-videos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('course-covers', 'course-covers', true);

-- Storage policies
CREATE POLICY "Anyone can view course covers" ON storage.objects
  FOR SELECT USING (bucket_id = 'course-covers');

CREATE POLICY "Admins can upload course covers" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'course-covers' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course covers" ON storage.objects
  FOR UPDATE USING (bucket_id = 'course-covers' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course covers" ON storage.objects
  FOR DELETE USING (bucket_id = 'course-covers' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Premium users can view course videos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'course-videos' AND (
      EXISTS (SELECT 1 FROM public.course_enrollments WHERE user_id = auth.uid() AND is_premium = true)
      OR has_role(auth.uid(), 'admin')
    )
  );

CREATE POLICY "Admins can upload course videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'course-videos' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course videos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'course-videos' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course videos" ON storage.objects
  FOR DELETE USING (bucket_id = 'course-videos' AND has_role(auth.uid(), 'admin'));