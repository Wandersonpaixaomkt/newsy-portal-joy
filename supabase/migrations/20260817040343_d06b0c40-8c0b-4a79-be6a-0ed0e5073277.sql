CREATE POLICY "Allow authenticated users to read and write pautas_central"
ON public.pautas_central
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read and write competitor_alerts"
ON public.competitor_alerts
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);