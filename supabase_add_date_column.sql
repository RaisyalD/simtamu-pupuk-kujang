-- Tambahkan kolom check_in_time dan department ke tabel visits
ALTER TABLE visits ADD COLUMN IF NOT EXISTS check_in_time TIMESTAMP WITH TIME ZONE;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS person_to_visit TEXT;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS visit_purpose TEXT;

-- Nonaktifkan RLS sementara pada tabel visits untuk pengujian
ALTER TABLE visits DISABLE ROW LEVEL SECURITY;

-- Hapus policy jika sudah ada
DROP POLICY IF EXISTS "Allow all inserts and selects" ON visits;

-- Buat policy yang mengizinkan semua operasi INSERT dan SELECT tanpa filter pada tabel visits
CREATE POLICY "Allow all inserts and selects" ON visits
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Catatan: Setelah pengujian selesai, aktifkan kembali RLS dan sesuaikan kebijakan dengan kebutuhan keamanan
-- ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
-- DROP POLICY "Allow all inserts and selects" ON visits;
