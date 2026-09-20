-- RedFlag Terminal Enterprise PostgreSQL Schema
-- Database tables for standalone Render or Cloud SQL backend

CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(10) UNIQUE NOT NULL,
    cik VARCHAR(12) NOT NULL,
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    industry_lens VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sec_filings_3yr (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    fiscal_year VARCHAR(10) NOT NULL,
    filing_type VARCHAR(10) NOT NULL,
    filing_date DATE NOT NULL,
    accession_number VARCHAR(30) NOT NULL,
    revenue NUMERIC(16, 2),
    cogs NUMERIC(16, 2),
    gross_profit NUMERIC(16, 2),
    operating_income NUMERIC(16, 2),
    net_income NUMERIC(16, 2),
    operating_cash_flow NUMERIC(16, 2),
    capex NUMERIC(16, 2),
    free_cash_flow NUMERIC(16, 2),
    accounts_receivable NUMERIC(16, 2),
    inventory NUMERIC(16, 2),
    total_assets NUMERIC(16, 2),
    total_liabilities NUMERIC(16, 2),
    dso NUMERIC(8, 2),
    dio NUMERIC(8, 2),
    accrual_ratio NUMERIC(8, 4),
    raw_xbrl_facts JSONB,
    UNIQUE(company_id, fiscal_year, filing_type)
);

CREATE TABLE IF NOT EXISTS flag_evaluations_210 (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    flag_code VARCHAR(20) NOT NULL,
    lens VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    signal_status VARCHAR(30) NOT NULL, -- 'Critical Anomaly', 'Warning', 'Healthy'
    current_value VARCHAR(100),
    data_source_priority VARCHAR(50) NOT NULL,
    score_deduction INTEGER DEFAULT 0,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS yahoo_market_cache (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    market_cap_billions NUMERIC(14, 2),
    stock_price NUMERIC(10, 2),
    beta NUMERIC(6, 3),
    ttm_adjustments JSONB,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kaggle_benchmarks (
    id SERIAL PRIMARY KEY,
    industry_lens VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    p25 NUMERIC(12, 4),
    p50 NUMERIC(12, 4),
    p75 NUMERIC(12, 4),
    p90 NUMERIC(12, 4),
    dataset_source VARCHAR(255) DEFAULT 'kaggle/financial-fraud-detection-benchmark'
);
