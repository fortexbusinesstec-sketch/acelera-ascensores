-- Agrega referencia opcional de cotización de origen en la orden de trabajo
ALTER TABLE work_orders ADD COLUMN quotation_id TEXT REFERENCES quotations(id) ON DELETE SET NULL;

