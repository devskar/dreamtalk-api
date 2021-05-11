import { setJWTHeader, resetJWTHeader } from './../utils/utils';
import bcrypt from 'bcryptjs';
import {
  DREAMER_SIGNUP_SCHEMA,
  DREAMER_LOGIN_SCHEMA,
} from './../static/schemas';
import { createJWT, ErrorWithStatus } from '../utils/utils';
import Dreamer from '../entity/Dreamer';
import express from 'express';
import {
  sendJoiErrorResponse,
  sendWrongCredentialsErrorResponse,
} from '../static/responses';
import Dream from '../entity/Dream';

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
  if (error) return sendJoiErrorResponse(error, next);

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

      setJWTHeader(res, token);

      return res.status(200).json({
        message: 'A new dreamer has been created.',
        id: savedDreamer.id,
      });
    })
    .catch((err) => {
      res.status(400).json({ message: 'Something went wrong.' });
    });
};

export const login = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const { error, value } = DREAMER_LOGIN_SCHEMA.validate(req.body, {
    abortEarly: false,
  });

  if (error) return sendJoiErrorResponse(error, next);

  const { password, username, email } = value;

  let dreamer = null;

  // LOGIN WITH USERNAME
  if (username) {
    dreamer = await Dreamer.createQueryBuilder('dreamer')
      .where({ username: username })
      .addSelect('dreamer.password')
      .getOne();
  } else if (email) {
    dreamer = await Dreamer.createQueryBuilder('dreamer')
      .where({ email: email })
      .addSelect('dreamer.password')
      .getOne();
  }

  if (!dreamer) return sendWrongCredentialsErrorResponse(next);

  const pwResult = await bcrypt.compare(password, dreamer.password);

  if (!pwResult) return sendWrongCredentialsErrorResponse(next);

  const token = createJWT(dreamer.id, dreamer.permissionLevel);

  setJWTHeader(res, token);

  res
    .status(200)
    .json({ message: `You are now logged in as: ${dreamer.username}` });
};

export const logout = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  resetJWTHeader(res);
  res.status(200).json({ message: 'You are now logged out.' });
};

export const edit = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {};

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
  const dreamer = await Dreamer.createQueryBuilder('dreamer')
    .where({ username: req.params.username })
    // .leftJoinAndSelect('dreamer.dreams', 'dreams') CANT USE THIS BECAUSE NO GOOD SOLUTION TO LIMIT THE AMOUNT OF DREAMS
    .getOne();

  if (dreamer) {
    return res.status(202).json(dreamer);
  } else {
    res.status(404).json({ message: 'No user found.' });
  }
};

export const getDreamsByUsername = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const dreams = await Dream.createQueryBuilder('dream')
    .leftJoinAndSelect('dream.author', 'author')
    .where('author.username = :username', {
      username: req.params.username,
    })
    .getMany();

  if (dreams) {
    return res.status(202).json(dreams);
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
