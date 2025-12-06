-- Add new fields to invoices table
-- Run this in Supabase SQL Editor to add reference number and shipping charges

-- Add reference_number column
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS reference_number TEXT;

-- Add shipping_charges column
ALTER TABLE public.invoices 
ADD COLUMN IF NOT EXISTS shipping_charges NUMERIC(12, 2) DEFAULT 0;

-- Create index for reference_number for faster searches
CREATE INDEX IF NOT EXISTS idx_invoices_reference_number 
ON public.invoices(reference_number);

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'invoices' 
AND column_name IN ('reference_number', 'shipping_charges');

-- Success! New fields added to invoices table


