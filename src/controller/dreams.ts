import Dreamer from './../entity/Dreamer';
import { ErrorWithStatus } from './../utils/utils';
import express from 'express';
import Dream from '../entity/Dream';

export const create = (
  req: express.Request,
  res: express.Response,
  next: (err?: ErrorWithStatus | Error) => void
) => {
  const { author_id, title, content } = req.body;

  console.log(author_id, title, content);

  Dreamer.findOne({ where: { id: author_id } }).then((author) => {
    if (author) {
      console.log(author);

      const dream = Dream.create({
        author: author,
        title: title,
        content: content,
      });

      dream.save().then((savedDream) => {
        res.status(200).json(savedDream);
      });
    }
  });
};
