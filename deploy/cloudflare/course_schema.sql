CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semester_source TEXT NOT NULL,
  serial TEXT,
  code TEXT,
  name TEXT NOT NULL,
  credits NUMERIC,
  category TEXT,
  teacher TEXT,
  classroom TEXT,
  capacity TEXT,
  time_data JSONB,
  time_info TEXT,
  department TEXT,
  grade TEXT,
  major TEXT,
  sem_seq TEXT,
  class_name TEXT,
  group_type TEXT,
  notes TEXT,
  raw_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (semester_source, serial, code, class_name, name)
);

CREATE INDEX IF NOT EXISTS idx_courses_semester_source ON courses (semester_source);
CREATE INDEX IF NOT EXISTS idx_courses_department ON courses (department);
CREATE INDEX IF NOT EXISTS idx_courses_grade ON courses (grade);
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses (code);
CREATE INDEX IF NOT EXISTS idx_courses_serial ON courses (serial);
CREATE INDEX IF NOT EXISTS idx_courses_name ON courses (name);
