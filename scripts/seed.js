const mongoose = require('mongoose');
const fs = require('fs');
const Chapter = require('../models/chapters');
const User = require('../models/users');
const Meditation = require('../models/meditations');
require('dotenv').config();

// Lire le fichier JSON
const chapterData = JSON.parse(fs.readFileSync('data/chapters.json', 'utf-8'));
// Lire le fichier json + extraire L'OID en String et convertir la date en Objet Date (En utilisant l'Optional Chaining)
const userData = JSON.parse(fs.readFileSync('data/users.json', 'utf-8')).map((user) => ({
  ...user,
  _id: user._id?.$oid || undefined,
  creationDate: user.creationDate?.$date ? new Date(user.creationDate.$date) : undefined,
}));

const importData = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING_MONGODB);
    console.log('✅ Connecté à MongoDB');

    // Optionnel : Vider la collection avant
    await Chapter.deleteMany();
    await User.deleteMany();
    console.log('🗑️ Données précédentes effacées');

    // Créer les données (Mongoose validera chaque entrée ici)
    await Chapter.create(chapterData);
    console.log('🌱 Données importées avec succès !');

    await User.create(userData);
    console.log('🌱 Données importées avec succès !');

    // Vider avant:
    await Meditation.deleteMany();
      console.log('Données méditations précédentes effacées');

    // Importer
    await Meditation.create(meditationData);
    console.log('Données méditation importées avec succès !');

    process.exit();
  } catch (error) {
    console.error("❌ Erreur lors de l'import :", error.message);
    process.exit(1);
  }
};

importData();
