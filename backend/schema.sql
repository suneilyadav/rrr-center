CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,

  item_name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  quantity INTEGER DEFAULT 1,

  condition VARCHAR(100),
  status VARCHAR(20) DEFAULT 'AVAILABLE',

  posted_by_email VARCHAR(200) NOT NULL,

  claimed_by_email VARCHAR(200),
  claimed_at TIMESTAMP,

  collected BOOLEAN DEFAULT FALSE,
  collected_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

