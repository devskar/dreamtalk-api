import { Dreamer } from './../entity/Dreamer';
import { Dream } from './../entity/Dream';
import express from 'express';
import { JoinColumn } from 'typeorm';

const router = express.Router();

router.get('/', (req, res, next) => {
  Dream.find().then((dreams) => {
    res.status(200).json(dreams);
  });
});

router.post('/', (req, res, next) => {
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
});

export default router;
