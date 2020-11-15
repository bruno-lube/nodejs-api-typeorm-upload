import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    let income = 0;
    let outcome = 0;

    (await this.find()).forEach(trans => {
      if (trans.type === 'income') {
        income += trans.value;
      } else {
        outcome += trans.value;
      }
    });

    return { income, outcome, total: income - outcome };
  }
}

export default TransactionsRepository;
