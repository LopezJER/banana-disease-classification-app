CREATE TABLE banana_image (
    filename TEXT NOT NULL,
    diagnosis TEXT NOT NULL, 
    treeID TEXT NOT NULL, 
    author TEXT NOT NULL, 
    part TEXT NOT NULL, 
    status TEXT NOT NULL, 
    location TEXT NOT NULL, 
    date_captured DATETIME DEFAULT CURRENT_TIMESTAMP, 
    date_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (filename)
);