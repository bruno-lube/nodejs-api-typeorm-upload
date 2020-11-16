import { EntityRepository, Repository } from 'typeorm';
import Category from '../models/Category';

@EntityRepository(Category)
class TransactionCategoriesRepository extends Repository<Category> { }

export default TransactionCategoriesRepository;
