import { List } from "../models/associations.js";
import Joi from "joi";

const listController = {
    async index(req, res) {
        // Récupérer toutes les listes de la DB
        const lists = await List.findAll({
            include: {
                association: "cards",
                include: "tags",
                separate: true,
                order: [["position", "ASC"]],
            },
            order: [["position", "ASC"]],
        });

        // Retourner le résultat en JSON au client
        res.status(200).json(lists);
    },

    async show(req, res, next) {
        const id = req.params.id;

        // On fait la requete en DB avec le model
        const result = await List.findByPk(id, {
            include: { association: "cards", include: "tags" },
        });

        if (!result) {
            return next();
        }

        // On retourne le résultat
        res.status(200).json(result);
    },

    async create(req, res, next) {
        const error = listController.validate(req);

        if (error) {
            return next(error);
        }

        try {
            // Enregistrer la nouvelle liste en DB
            const result = await List.create(req.body);

            // Retourner en JSON la nouvelle liste créée, avec toutes ses valeurs (id, title, position, etc.)
            res.status(201).json(result);
        } catch (error) {
            return next({
                statusCode: 400,
                message: "Erreur lors de l'enregistrement en BDD !!!",
            });
        }
    },

    async update(req, res, next) {
        const error = listController.validate(req);

        if (error) {
            return next(error);
        }

        const list = await List.findByPk(req.params.id, {
            include: { association: "cards", include: "tags" },
        });

        if (!list) {
            return next();
        }

        const { title, position } = req.body;

        if (title) {
            list.title = title;
        }

        if (position) {
            list.position = position;
        }

        await list.save();

        // On retourne la liste à jour
        res.status(200).json(list);
    },

    async delete(req, res, next) {
        const list = await List.findByPk(req.params.id);

        if (!list) {
            return next();
        }

        await list.destroy();

        res.sendStatus(204);
    },

    /**
     * Valider les données pour les enregistrements de ressources List
     */
    validate(req) {
        // On commence par lister toutes les règles de validation qui sont communes au POST et au PATCH.
        let schema = Joi.object({
            title: Joi.string().min(3).max(100).messages({
                "string.base": "Le titre doit être une chaîne de caractères",
                "string.min": "Le titre doit contenir au moins 3 caractères",
                "string.max": "Le titre doit contenir au plus 100 caractères",
            }),
            position: Joi.number().integer().greater(0).messages({
                "number.base": "La position doit être un nombre",
                "number.integer": "La position doit être un nombre entier",
                "number.greater": "La position doit être supérieure à 0",
            }),
        });

        // Puis on ajoutera juste les règles propres à l'un ou l'autre, selon la method de la requête HTTP
        if (req.method === "POST") {
            
            schema = schema.fork(["title"], field =>
                field.required().messages({
                    "any.required": "Le titre est requis",
                })
            );
        }

       
        const error = schema.validate(req.body, { abortEarly: false }).error;

        return error
            ? {
                  statusCode: 400,
                  message: error.details.map(detail => detail.message),
              }
            : null;
    },
};

export { listController };
