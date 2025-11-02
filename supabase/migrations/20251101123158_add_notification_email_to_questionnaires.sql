/*
  # Add notification email field to questionnaires

  1. Changes
    - Add `notification_email` field to questionnaires table
    - This field stores the email address where questionnaire responses should be sent
*/

-- Add notification_email column
ALTER TABLE questionnaires 
ADD COLUMN IF NOT EXISTS notification_email text DEFAULT '';

-- Add index for notification email lookups
CREATE INDEX IF NOT EXISTS idx_questionnaires_notification_email 
ON questionnaires(notification_email) 
WHERE notification_email != '';
