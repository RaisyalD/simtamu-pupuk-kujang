-- Query to check the definition of the visits_status_check constraint
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'visits_status_check';

-- If status column uses enum type, replace 'status_enum_type' with actual enum type name
-- Query to list all allowed enum values
SELECT unnest(enum_range(NULL::status_enum_type));
