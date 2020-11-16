import AppError from '../errors/AppError';
import TransactionCategoriesRepository from '../repositories/TransactionCategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  transactionsRepository: TransactionsRepository;

  transactionCategoriesRepository: TransactionCategoriesRepository;

  constructor(transactionsRepository: TransactionsRepository, transactionCategoriesRepository: TransactionCategoriesRepository) {
    this.transactionsRepository = transactionsRepository;
    this.transactionCategoriesRepository = transactionCategoriesRepository;
  }

  public async execute(transactionId: string): Promise<void> {
    const transaction = await this.transactionsRepository.findOne({ where: { id: transactionId } });

    if (!transaction) {
      throw new AppError("Transaction not found", 400);
    }

    const removedTransaction = await this.transactionsRepository.remove(transaction);

    const [, transactionsUsingCategory] = await this.transactionsRepository.findAndCount({ where: { category_id: removedTransaction.category_id } });

    if (transactionsUsingCategory === 0) {
      const unusedCategory = await this.transactionCategoriesRepository.findOne({ where: { id: removedTransaction.category_id } });

      if (unusedCategory) {
        await this.transactionCategoriesRepository.remove(unusedCategory);
      }
    }
  }
}

export default DeleteTransactionService;
