-- ============================================================
-- PRACHAR PHASE 2 — Prachar1 Database Inspection Script
-- Run this MANUALLY with:
--   & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d Prachar1 -f inspect_prachar1.sql
-- This script is READ-ONLY. It performs NO modifications.
-- ============================================================

\echo '======================================================'
\echo 'SECTION 1: PostgreSQL Version'
\echo '======================================================'
SELECT version();

\echo '======================================================'
\echo 'SECTION 2: Database Exists + Current DB'
\echo '======================================================'
SELECT current_database(), current_user, pg_postmaster_start_time();

\echo '======================================================'
\echo 'SECTION 3: All Schemas'
\echo '======================================================'
SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;

\echo '======================================================'
\echo 'SECTION 4: All Tables in public schema'
\echo '======================================================'
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

\echo '======================================================'
\echo 'SECTION 5: Row Counts per Table'
\echo '======================================================'
SELECT
    schemaname,
    relname AS table_name,
    n_live_tup AS row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY relname;

\echo '======================================================'
\echo 'SECTION 6: Column Details — users'
\echo '======================================================'
SELECT
    column_name, data_type, character_maximum_length,
    is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

\echo '======================================================'
\echo 'SECTION 7: Column Details — profiles'
\echo '======================================================'
SELECT
    column_name, data_type, character_maximum_length,
    is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

\echo '======================================================'
\echo 'SECTION 8: Column Details — digital_cards'
\echo '======================================================'
SELECT
    column_name, data_type, character_maximum_length,
    is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'digital_cards'
ORDER BY ordinal_position;

\echo '======================================================'
\echo 'SECTION 9: Column Details — qr_codes'
\echo '======================================================'
SELECT
    column_name, data_type, character_maximum_length,
    is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'qr_codes'
ORDER BY ordinal_position;

\echo '======================================================'
\echo 'SECTION 10: Column Details — otps'
\echo '======================================================'
SELECT
    column_name, data_type, character_maximum_length,
    is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'otps'
ORDER BY ordinal_position;

\echo '======================================================'
\echo 'SECTION 11: Column Details — refresh_tokens'
\echo '======================================================'
SELECT
    column_name, data_type, character_maximum_length,
    is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'refresh_tokens'
ORDER BY ordinal_position;

\echo '======================================================'
\echo 'SECTION 12: Column Details — qr_scan_events'
\echo '======================================================'
SELECT
    column_name, data_type, character_maximum_length,
    is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'qr_scan_events'
ORDER BY ordinal_position;

\echo '======================================================'
\echo 'SECTION 13: All Primary Keys'
\echo '======================================================'
SELECT
    tc.table_name,
    kcu.column_name,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'PRIMARY KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

\echo '======================================================'
\echo 'SECTION 14: All Foreign Keys'
\echo '======================================================'
SELECT
    tc.table_name AS child_table,
    kcu.column_name AS child_column,
    ccu.table_name AS parent_table,
    ccu.column_name AS parent_column,
    tc.constraint_name,
    rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.referential_constraints rc
    ON tc.constraint_name = rc.constraint_name
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = rc.unique_constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

\echo '======================================================'
\echo 'SECTION 15: All Unique Constraints'
\echo '======================================================'
SELECT
    tc.table_name,
    kcu.column_name,
    tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

\echo '======================================================'
\echo 'SECTION 16: All Indexes'
\echo '======================================================'
SELECT
    t.relname AS table_name,
    i.relname AS index_name,
    ix.indisunique AS is_unique,
    ix.indisprimary AS is_primary,
    array_agg(a.attname ORDER BY a.attnum) AS columns
FROM pg_class t
JOIN pg_index ix ON t.oid = ix.indrelid
JOIN pg_class i ON i.oid = ix.indexrelid
JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(ix.indkey)
JOIN pg_namespace n ON n.oid = t.relnamespace
WHERE n.nspname = 'public'
GROUP BY t.relname, i.relname, ix.indisunique, ix.indisprimary
ORDER BY t.relname, i.relname;

\echo '======================================================'
\echo 'SECTION 17: Flyway Schema History'
\echo '======================================================'
SELECT
    installed_rank,
    version,
    description,
    type,
    script,
    success,
    installed_on,
    execution_time
FROM flyway_schema_history
ORDER BY installed_rank;

\echo '======================================================'
\echo 'SECTION 18: Views (if any)'
\echo '======================================================'
SELECT table_name AS view_name, view_definition
FROM information_schema.views
WHERE table_schema = 'public';

\echo '======================================================'
\echo 'SECTION 19: Sequences (if any)'
\echo '======================================================'
SELECT sequence_name, data_type, start_value, minimum_value, maximum_value, increment
FROM information_schema.sequences
WHERE sequence_schema = 'public';

\echo '======================================================'
\echo 'SECTION 20: Extensions Installed'
\echo '======================================================'
SELECT extname, extversion FROM pg_extension ORDER BY extname;

\echo '======================================================'
\echo 'INSPECTION COMPLETE — NO DATA WAS MODIFIED'
\echo '======================================================'
