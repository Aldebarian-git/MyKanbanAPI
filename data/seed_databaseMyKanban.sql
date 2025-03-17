-- Création de données de test pour notre BDD

BEGIN;

-- Insertion des listes
INSERT INTO "list"
  ("id", "title", "position")
VALUES
  (1, 'Mes objectifs', 1),
  (2, 'Mes compétences', 2),
  (3, 'Mes qualités', 3)
;

-- Insertion des cartes dans les listes avec des emojis
INSERT INTO "card"
  (id, position, content, color, list_id)
VALUES
  (1, 1, 'Apprendre Python 🐍', NULL, 1),
  (2, 2, 'Apprendre PHP 💻', NULL, 1),
  (3, 3, 'Apprendre GO 🚀', NULL, 1),
  (4, 4, 'Rejoindre une chouette entreprise 🏢', NULL, 1),
  (5, 5, 'Profiter de moment en famille 👨‍👩‍👧‍👦', NULL, 1),

  (6, 1, 'HTML/CSS 🌐', NULL, 2),
  (7, 2, 'JavaScript/React ⚛️', NULL, 2),
  (8, 3, 'Node.js 🟩', NULL, 2),
  (9, 4, 'Express 🚂', NULL, 2),
  (10, 5, 'PostgreSQL/Sequelize 🗃️', NULL, 2),

  (11, 1, 'Bienveillant 💖', NULL, 3),
  (12, 2, 'Esprit d\'équipe 🤝', NULL, 3),
  (13, 3, 'Jovialité 😄', NULL, 3),
  (14, 4, 'Sérieux 💼', NULL, 3),
  (15, 5, 'Rigoureux 🧐', NULL, 3)
;

-- On va ré-initialiser les séquences d'ID
-- (puisqu'ici on insère les ID manuellement alors qu'on ne devrait pas, et on devrait laisser la BDD choisir pour nous)

SELECT setval('list_id_seq', (SELECT MAX(id) from "list"));
SELECT setval('card_id_seq', (SELECT MAX(id) from "card"));

COMMIT;