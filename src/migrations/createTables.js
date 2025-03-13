
import { sequelize } from "../models/associations.js";

try {    
    await sequelize.drop();    
    await sequelize.sync();    
    process.exit(0);
} catch (error) {
    console.error(error);
    // Le chiffre 1 est utilisé pour dire "erreur"
    process.exit(1);
}