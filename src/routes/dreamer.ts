import { Dreamer } from './../entity/Dreamer';
import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/', (req, res, next) => {
  const { username, password, email } = req.body;

  console.log(username, password, email);

  if (password) {
    bcrypt.hash(password, 15).then((hashedPassword) => {
      const temp = Dreamer.create({
        email,
        username,
        password: hashedPassword,
      });

      temp.save().then(() => {
        res.status(200).json({
          message: 'Successfully created user!',
          id: temp.id,
        });
      });
    });
  }
});

// get all dreamer
router.get('/', (req, res, next) => {
  Dreamer.find().then((dreamer) => {
    res.json(dreamer);
  });
});

// get a dreamer by id
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  console.log(id);

  Dreamer.findOne(id).then((dream) => {
    console.log(dream);
  });
});

router.put('/:id', (req, res, next) => {});

router.delete('/:id', (req, res, next) => {});

export default router;
