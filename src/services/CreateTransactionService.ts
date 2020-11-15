import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';

import Transaction from '../models/Transaction';
import TransactionCategoriesRepository from '../repositories/TransactionCategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';

enum TransactionType {
  INCOME = 'income',
  OUTCOME = 'outcome',
}

interface RequestDto {
  title: string;
  value: number;
  type: TransactionType;
  category: string;
}

class CreateTransactionService {
  categoriesRepository: TransactionCategoriesRepository;

  transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.categoriesRepository = getCustomRepository(
      TransactionCategoriesRepository,
    );
    this.transactionsRepository = transactionsRepository;
  }

  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDto): Promise<Transaction> {
    if (
      type === TransactionType.OUTCOME &&
      (await this.transactionsRepository.getBalance()).total - value < 0
    ) {
      throw new AppError('Insufficient funds available', 400);
    }

    let categoryExists:
      | Category
      | undefined
      | null = await this.categoriesRepository.findOne({
        where: { title: category },
      });

    if (!categoryExists) {
      const newCategory = this.categoriesRepository.create({
        title: category,
      });
      categoryExists = await this.categoriesRepository.save(newCategory);
    }

    const newTransaction = this.transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryExists.id,
    });

    const createdTransaction = await this.transactionsRepository.save(newTransaction);

    return createdTransaction;
  }
}

export default CreateTransactionService;
