import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import TransactionCategoriesRepository from '../repositories/TransactionCategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);
const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({ relations: ['category'] });
  transactions.forEach(trans => { delete trans.category_id; });

  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {

  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService(getCustomRepository(TransactionsRepository), getCustomRepository(TransactionCategoriesRepository));

  const transaction = await createTransactionService.execute({ title, value: parseInt(value, 10), type, category });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactionCategoriesRepository = getCustomRepository(TransactionCategoriesRepository);

  const deleteTransactionService = new DeleteTransactionService(transactionsRepository, transactionCategoriesRepository);

  await deleteTransactionService.execute(id);

  return response.status(204).json();
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const importTransactionsService = new ImportTransactionsService();

  const transactions = await importTransactionsService.execute(request.file.filename);

  return response.json(transactions);
});

export default transactionsRouter;
