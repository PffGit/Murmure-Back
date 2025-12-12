const mongoose = require("mongoose");
const fs = require("fs");
const Chapter = require("../models/chapters");
require("dotenv").config();

// Lire le fichier JSON
const data = JSON.parse(fs.readFileSync("data/chapters.json", "utf-8"));

const importData = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING_MONGODB);
    console.log("✅ Connecté à MongoDB");

    // Optionnel : Vider la collection avant
    await Chapter.deleteMany();
    console.log("🗑️ Données précédentes effacées");

    // Créer les données (Mongoose validera chaque entrée ici)
    await Chapter.create(data);
    console.log("🌱 Données importées avec succès !");

    process.exit();
  } catch (error) {
    console.error("❌ Erreur lors de l'import :", error.message);
    process.exit(1);
  }
};

importData();
