CREATE POLICY "Authors update/delete based on role" ON public.authors
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Tags update/delete based on role" ON public.tags
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "Post tags update/delete based on role" ON public.post_tags
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'editor')
    )
  );
