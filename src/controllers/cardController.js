import { Card, List } from "../models/associations.js";
import Joi from 'joi';

const cardController = {
    async index(req, res) {
        res.status(200).json(await Card.findAll({
            include: ["list", "tags"],
            order: [
                ["position", "ASC"],
                ["created_at", "DESC"],
            ],
        }));
    },

    async show(req, res, next) {
        const result = await Card.findByPk(req.params.id, { include: ["list", "tags"] });

        if (!result) {
            return next();
        }

        res.status(200).json(result);
    },

    async create(req, res, next) {
        const error = cardController.validate(req);
        if (error) {
            return next(error);
        }

        const result = await Card.create(req.body);

        res.status(201).json(result);
    },

    async update(req, res, next) {
        const error = cardController.validate(req);
        if (error) {
            return next(error);
        }

        const card = await Card.findByPk(req.params.id, { include: ["list", "tags"] });
        if (!card) {
            return next();
        }

        // Au lieu de faire un if pour chaque paramètre (ce qui peu faire pas mal de lignes), on peut faire une boucle
        // pour mettre à jour les valeurs qui existent dans req.body.
        for (const key in req.body) {
            // On vérifie que la clé existe avant de mettre à jour => permet de ne pas utilser d'éventuelles
            // clés inconnues dans le Model
            if (card[key] !== undefined) {
                card[key] = req.body[key];
            }
        }

        await card.save();

        res.status(200).json(card);
    },

    async delete(req, res, next) {
        const card = await Card.findByPk(req.params.id);
        if (!card) {
            return next();
        }

        await card.destroy();

        res.sendStatus(204);
    },

    async cardsByList(req, res, next) {
        // On recherche la liste correspondant à la D avec toutes ses cartes, ses tags et,
        // à l'intérieur des cartes, les informations de la liste elle-même
        const list = await List.findByPk(req.params.id, {
            include: { association: "cards", include: ["list", "tags"] },
        });

        if (!list) {
            return next();
        }

        // On ne retourne que les cartes puisqu'on est sur une route censée retourner des cartes d'une liste
        res.status(200).json(list.cards);
    },

    validate(req, method) {
        let schema = Joi.object({
            content: Joi.string().min(3).messages({
                "string.base": "Le contenu doit être une chaîne de caractères",
                "string.min": "Le contenu doit contenir au moins {#limit} caractères",
            }),
            position: Joi.number().integer().greater(0).messages({
                "number.base": "La position doit être un nombre",
                "number.integer": "La position doit être un nombre entier",
                "number.greater": "La position doit être supérieure à {#limit}",
            }),
            color: Joi.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/).messages({
                "string.pattern.base": "La couleur doit être un code hexadécimal valide",
            }),
            list_id: Joi.number().integer().greater(0).messages({
                "number.base": "L'identifiant de la liste doit être un nombre",
                "number.integer": "L'identifiant de la liste doit être un nombre entier",
                "number.greater": "L'identifiant de la liste doit être supérieur à {#limit}",
            }),
        });

        if (req.method === "POST") {
            schema = schema.fork(["content", "list_id"], field => field.required().messages({
                "any.required": "Le champ {#label} est requis",
            }));
        }

        const error = schema.validate(req.body, { abortEarly: false }).error;

        return error
            ? { statusCode: 400, message: error.details.map(detail => detail.message) }
            : null;
    },
};

export { cardController };