import { DreamerPermissionLevel } from './../entity/Dreamer';
import {
  sendNotSignedInErrorResponse,
  sendDreamerNotFoundErrorResponse,
  sendInsufficientPermissionErrorResponse,
  sendSomethingWentWrongErrorResponse,
} from './../static/responses';
import {
  setJWTHeader,
  resetJWTHeader,
  getDreamerIdFromJWT,
  getJWTToken,
} from './../utils/utils';
import bcrypt from 'bcryptjs';
import {
  DREAMER_SIGNUP_SCHEMA,
  DREAMER_LOGIN_SCHEMA,
  DREAMER_UPDATE_SCHEMA,
} from './../static/schemas';
import {
  createJWT,
  ErrorWithStatus,
  isDreamerOrHasPermission,
} from '../utils/utils';
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
      console.log(err);
      return sendSomethingWentWrongErrorResponse(next);
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

export const update = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const toBeEditedDreamer = await Dreamer.createQueryBuilder()
    .where({ username: req.params.username })
    .getOne();

  // CHECK IF THE USER THAT SHOULD BE EDITED EXISTS
  if (!toBeEditedDreamer) return sendDreamerNotFoundErrorResponse(next);

  if (
    !isDreamerOrHasPermission(
      DreamerPermissionLevel.Staff,
      getDreamerIdFromJWT(getJWTToken(req)),
      toBeEditedDreamer.id
    )
  )
    return sendInsufficientPermissionErrorResponse(next);

  // VALIDATE THE INPUT
  const { error, value } = DREAMER_UPDATE_SCHEMA.validate(req.body, {
    abortEarly: false,
  });

  if (error) return sendJoiErrorResponse(error, next);

  // CHECK IF USERNAME OR EMAIL IS ALREADY USED
  const used = [];

  if ('username' in value) {
    if (await Dreamer.findOne({ username: value['username'] })) {
      used.push('This username is already in use.');
    }
  }
  if ('email' in value) {
    if (await Dreamer.findOne({ email: value['email'] })) {
      used.push('This email is already in use.');
    }
  }

  if (used.length > 0) {
    const err = new Error() as ErrorWithStatus;
    err.status = 422;
    err.messages = used;

    return next(err);
  }

  // UPDATING THE USER
  const result = await Dreamer.createQueryBuilder()
    .update()
    .set(value)
    .where({ id: toBeEditedDreamer.id })
    .execute();

  // IF ERROR WHILE UPDATING OCCURS
  if (!result.affected) return sendSomethingWentWrongErrorResponse(next);

  // SEND RESPONSE IF EVERYTHING WENT RIGHT
  res.status(200).json({ message: 'User successfully updated.' });
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
  const toBeDeletedDreamer = await Dreamer.createQueryBuilder()
    .where({ username: req.params.username })
    .getOne();

  // CHECK IF THE USER THAT SHOULD BE DELETED EXISTS
  if (!toBeDeletedDreamer) return sendDreamerNotFoundErrorResponse(next);

  if (
    !isDreamerOrHasPermission(
      DreamerPermissionLevel.Staff,
      getDreamerIdFromJWT(getJWTToken(req)),
      toBeDeletedDreamer.id
    )
  )
    return sendInsufficientPermissionErrorResponse(next);

  // DELETE THE USER
  toBeDeletedDreamer.remove().then((dreamer) => {
    res
      .status(200)
      .json({ message: `Successfully deleted dreamer ${dreamer.username}` });
  });
};

// FOR DEVELOPMENT
export const myself = async (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const id = getDreamerIdFromJWT(getJWTToken(req));

  const dreamer = await Dreamer.createQueryBuilder().where({ id: id }).getOne();

  if (!dreamer) return res.status(404).json({ message: 'Not logged in' });

  res.status(200).json(dreamer);
};
