import fs from 'fs';
import path from 'path';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload'
import CreateTransactionService from "./CreateTransactionService";
import TransactionCategoriesRepository from '../repositories/TransactionCategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

function trimText(text: string): string {
  if (!text) {
    return '';
  }
  return text.trimLeft().trimRight();
}

class ImportTransactionsService {
  async execute(fileName: string): Promise<Transaction[]> {
    const filePath = path.resolve(uploadConfig.directory, fileName);

    const file = await fs.promises.readFile(filePath, { encoding: 'utf-8' });

    const lines = file.split('\r\n');

    const registers = [];

    for (let index = 1; index < lines.length; index++) {
      const [title, type, value, category] = lines[index].split(',');
      if (!title || !type || !value || !category) { continue; };
      const register = {
        title: trimText(title),
        type: trimText(type),
        value: parseInt(value, 10),
        category: trimText(category),
      };
      registers.push(register);
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactionCategoriesRepository = getCustomRepository(TransactionCategoriesRepository);

    const createTransactionService = new CreateTransactionService(transactionsRepository, transactionCategoriesRepository);

    const transactions: Transaction[] = [];

    for (let index = 0; index < registers.length; index++) {
      const { title, type, value, category } = registers[index];
      // eslint-disable-next-line no-await-in-loop
      transactions.push(await createTransactionService.execute({ title, value, type, category }));
    }

    return transactions;
  }
}

export default ImportTransactionsService;
