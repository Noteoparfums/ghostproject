ALTER TABLE credit_ledger
  ADD COLUMN IF NOT EXISTS balance_after NUMERIC(10,2);

UPDATE credit_ledger ledger
SET balance_after = balances.balance_after
FROM (
  SELECT
    id,
    SUM(delta) OVER (
      PARTITION BY user_id
      ORDER BY created_at, id
      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS balance_after
  FROM credit_ledger
) balances
WHERE ledger.id = balances.id
  AND ledger.balance_after IS NULL;

ALTER TABLE credit_ledger
  ALTER COLUMN balance_after SET NOT NULL;

ALTER TABLE job_runs
  ADD COLUMN IF NOT EXISTS error_message TEXT;