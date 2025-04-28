CREATE DATABASE softjobs;
\c softjobs;
CREATE TABLE usuarios ( id SERIAL, email VARCHAR(50) NOT NULL, password
VARCHAR(60) NOT NULL, rol VARCHAR(25), lenguage VARCHAR(20) );
SELECT * FROM usuarios;

INSERT INTO usuarios (email, password, rol, lenguage) VALUES
('juan.perez@example.com', '$2a$10$Pdq8Gg0X6MFNRk5ATZ9UqOZlhpg9T1QsCYo2.sAq1HkFMRHvhv06m', 'admin', 'es'),
('maria.gomez@example.com', '$2a$10$L8StxaM8aQJfNdleXxj9jF0DhS9TYB9fAol60ZGjtxmA4vjN29Kji', 'user', 'en'),
('luis.sanchez@example.com', '$2a$10$D3hzf0r.LVO1ixx2HJcR16YkBZshn3ZDdyDOXauo7TpB01zzwChie', 'user', 'es'),
('ana.martinez@example.com', '$2a$10$Q7kszOh6v7sk58dLqNoDBs7RPjx2rcVqdlZo9Zw1Sc9eI8GEiMK6y', 'admin', 'en'),
('pedro.ramirez@example.com', '$2a$10$D0OWUQqkOh72d90glNEdzm0eaqVGWSm5hkm6GGFh93nlv8OIfzF7O', 'user', 'fr');
