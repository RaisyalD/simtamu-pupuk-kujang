-- Enable Row Level Security on guests and visits tables
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to select, insert, update, delete on guests
CREATE POLICY "Allow authenticated read/write on guests" ON guests
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy to allow authenticated users to select, insert, update, delete on visits
CREATE POLICY "Allow authenticated read/write on visits" ON visits
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- If you have an otp_verification table, enable RLS and create similar policies
-- ALTER TABLE otp_verification ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow authenticated read/write on otp_verification" ON otp_verification
-- FOR ALL
-- TO authenticated
-- USING (true)
-- WITH CHECK (true);
