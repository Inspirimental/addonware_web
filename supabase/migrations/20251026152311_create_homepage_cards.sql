/*
  # Create homepage_cards table

  1. New Tables
    - `homepage_cards`
      - `id` (uuid, primary key)
      - `title` (text) - Card title
      - `subtitle` (text) - Card subtitle
      - `teaser` (text) - Card description/teaser text
      - `category` (text) - Card category (Focus Work, Case Study, etc.)
      - `icon` (text) - Icon name from lucide-react
      - `background_image` (text) - URL or path to background image
      - `link_type` (text) - Type of link: 'service', 'case-study', 'external', 'internal'
      - `link_value` (text) - The actual link value (slug, ID, or URL)
      - `order_index` (integer) - Display order
      - `is_active` (boolean) - Whether card is visible
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `homepage_cards` table
    - Add policy for public read access (active cards only)
    - Add policy for authenticated admin users to manage cards
*/

CREATE TABLE IF NOT EXISTS homepage_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL,
  teaser text NOT NULL,
  category text NOT NULL,
  icon text NOT NULL DEFAULT 'FileText',
  background_image text NOT NULL,
  link_type text NOT NULL CHECK (link_type IN ('service', 'case-study', 'external', 'internal')),
  link_value text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE homepage_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active homepage cards"
  ON homepage_cards
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all homepage cards"
  ON homepage_cards
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert homepage cards"
  ON homepage_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update homepage cards"
  ON homepage_cards
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete homepage cards"
  ON homepage_cards
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_homepage_cards_order ON homepage_cards(order_index);
CREATE INDEX IF NOT EXISTS idx_homepage_cards_active ON homepage_cards(is_active);