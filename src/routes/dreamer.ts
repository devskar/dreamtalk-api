import { Dreamer } from './../entity/Dreamer';
import { ErrorWithStatus } from './../utils';
import { DREAMER_SIGNUP_SCHEMA } from './../static/schemas';
import express, { response } from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

// USER SIGNUP
router.post('/signup', async (req, res, next) => {
  // VALIDATING THE INCOMING REQUEST
  const { error, value } = DREAMER_SIGNUP_SCHEMA.validate(req.body, {
    abortEarly: false,
  });

  // IF ANYTHING IS INVALID
  if (error) {
    const messages = error.details.map((x) => x.message);

    const err = new Error() as ErrorWithStatus;
    err.status = 400;
    err.messages = messages;

    return next(err);
  }

  // GETTING THE VALID DATA
  const { username, email, password } = value;

  // CHECK IF USERNAME OR EMAIL IS ALREADY USED

  const used = [];

  if (await Dreamer.findOne({ username: username })) {
    used.push('This username is already in use.');
  }

  if (await Dreamer.findOne({ email: email })) {
    used.push('This email is already in use.');
  }

  if (used.length > 0) {
    const err = new Error() as ErrorWithStatus;
    err.status = 422;
    err.messages = used;

    return next(err);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newDreamer = Dreamer.create({
    username,
    email,
    password: hashedPassword,
  });

  newDreamer
    .save()
    .then((savedDreamer) => {
      res.status(200).json({
        message: 'A new dreamer has been created.',
        id: savedDreamer.id,
      });
    })
    .catch((err) => {
      console.log(err);

      res.status(400).json({ message: 'Something went wrong.' });
    });
});

router.get('/', (req, res, next) => {
  Dreamer.find().then((dreamer) => {
    res.json(dreamer);
  });
});

router.get('/:username', (req, res, next) => {
  Dreamer.findOne({ username: req.params.username })
    .then((dreamer) => {
      return res.json(dreamer);
    })
    .catch((err) => {
      console.log(err);
    });

  res.json({ message: 'No user found.' });
});

router.put('/:id', (req, res, next) => {});

router.delete('/:username', (req, res, next) => {
  Dreamer.delete({ username: req.params.username })
    .then((result) => {
      res.json({ message: 'User successfully deleted.' });
    })
    .catch((err) => {
      console.log(err);
    });
});

export default router;
