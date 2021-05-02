import bcrypt from 'bcryptjs';
import { DREAMER_SIGNUP_SCHEMA } from './../static/schemas';
import { createJWT, ErrorWithStatus } from '../utils/utils';
import { Dreamer } from '../entity/Dreamer';
import express from 'express';

export const signup = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
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
      const token = createJWT(savedDreamer.id, savedDreamer.permissionLevel);

      res.setHeader('Set-Cookie', `sessiontoken=${token}; HttpOnly`);

      return res.status(200).json({
        message: 'A new dreamer has been created.',
        id: savedDreamer.id,
      });
    })
    .catch((err) => {
      res.status(400).json({ message: 'Something went wrong.' });
    });
};

export const getAll = (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  Dreamer.find().then((dreamer) => {
    return res.json(dreamer);
  });
};

export const getByUsername = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const dreamer = await Dreamer.findOne({ username: req.params.username });

  if (dreamer) {
    return res.status(202).json(dreamer);
  } else {
    res.status(404).json({ message: 'No user found.' });
  }
};

export const deleteByUsername = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const result = await Dreamer.delete({ username: req.params.username });

  if (result.affected) {
    return res.status(202).json({ message: 'User has been deleted.' });
  } else {
    return res.status(404).json({ message: 'No user found.' });
  }
};
