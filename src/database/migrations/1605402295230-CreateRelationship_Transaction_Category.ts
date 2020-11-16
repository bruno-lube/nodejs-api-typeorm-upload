/* eslint-disable import/prefer-default-export */
import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class CreateRelationshipTransactionCategory1605402295230
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        name: 'fk_transaction_categories_id',
        columnNames: ['category_id'],
        referencedTableName: 'categories',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'transactions',
      'fk_transaction_categories_id',
    );
  }
}
