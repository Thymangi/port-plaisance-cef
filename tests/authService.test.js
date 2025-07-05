// tests/authService.test.mjs
const mongoose = require('mongoose');
const { expect } = require('chai');
const authService = require('../services/authService');
const User = require('../models/User');

describe('authService.register()', function () {
  this.timeout(10000); //  Timeout général pour toute la suite

  before(async () => {
    try {
      console.log(' Connexion à MongoDB...');
      await mongoose.connect('mongodb://127.0.0.1:27017/test_port_plaisance', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(' Connecté à MongoDB');
    } catch (err) {
      console.error(' Erreur connexion MongoDB :', err);
      throw err;
    }
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    try {
      console.log(' Déconnexion de MongoDB...');
      await mongoose.disconnect();
      console.log(' Déconnecté');
    } catch (err) {
      console.error(' Erreur déconnexion MongoDB :', err);
      throw err;
    }
  });

  it('devrait créer un nouvel utilisateur', async () => {
    const userData = {
      name: 'testuser',
      email: 'test@example.com',
      password: 'motdepasse123'
    };

    const user = await authService.register(userData);
    expect(user).to.have.property('_id');
    expect(user.name).to.equal('testuser');
    expect(user.password).to.not.equal('motdepasse123');
  });

  it('devrait échouer si le nom est déjà utilisé', async () => {
    await authService.register({ name: 'test', email: '', password: '123456' });

    try {
      await authService.register({ name: 'test', email: '', password: '123456' });
      throw new Error('Test échoué : une erreur aurait dû être levée');
    } catch (err) {
      expect(err.message).to.equal('Nom déjà utilisé');
    }
  });
});