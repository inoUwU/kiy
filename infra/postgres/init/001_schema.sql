CREATE TABLE IF NOT EXISTS conversations (
  id varchar PRIMARY KEY,
  title varchar,
  created_at timestamp,
  updated_at timestamp
);

CREATE TABLE IF NOT EXISTS nodes (
  id varchar PRIMARY KEY,
  conversation_id varchar NOT NULL,
  role varchar,
  content text,
  metadata jsonb,
  created_at timestamp,
  CONSTRAINT fk_nodes_conversation
    FOREIGN KEY (conversation_id)
    REFERENCES conversations (id)
);

CREATE TABLE IF NOT EXISTS edges (
  id varchar PRIMARY KEY,
  conversation_id varchar,
  source_id varchar,
  target_id varchar,
  CONSTRAINT fk_edges_conversation
    FOREIGN KEY (conversation_id)
    REFERENCES conversations (id),
  CONSTRAINT fk_edges_source
    FOREIGN KEY (source_id)
    REFERENCES nodes (id),
  CONSTRAINT fk_edges_target
    FOREIGN KEY (target_id)
    REFERENCES nodes (id)
);

CREATE INDEX IF NOT EXISTS idx_edges_source_id ON edges (source_id);
CREATE INDEX IF NOT EXISTS idx_edges_target_id ON edges (target_id);

CREATE TABLE IF NOT EXISTS active_paths (
  conversation_id varchar,
  node_id varchar,
  order_index int,
  CONSTRAINT fk_active_paths_conversation
    FOREIGN KEY (conversation_id)
    REFERENCES conversations (id),
  CONSTRAINT fk_active_paths_node
    FOREIGN KEY (node_id)
    REFERENCES nodes (id)
);
