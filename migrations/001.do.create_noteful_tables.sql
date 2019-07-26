CREATE TABLE folders (
    id VARCHAR(36) UNIQUE,
    folder_name TEXT NOT NULL
);

CREATE TABLE notes (
    id VARCHAR(36) UNIQUE,
    note_name text NOT NULL,
    date_modified TIMESTAMP DEFAULT now() NOT NULL,
    content text,
    folders_id VARCHAR(36)
        REFERENCES folders(id) ON DELETE CASCADE NOT NULL
);