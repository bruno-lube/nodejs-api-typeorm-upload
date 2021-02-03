# nodejs-api-typeorm-upload
Example API using typeorm for database persistence and multer for file uploading

In this repository, I implemented typeorm to persist financial transactions and transaction categories, creating a many-to-one relationship.

And I used Multer injected in a post route to save a file to the filesystem, and the file was read by a service that extracted data from the .csv file, and saved to the database.

To evaluate the API:
* Clone the repository
* Run yarn
* Run yarn dev:server

Api Endpoints:

Post Transaction: POST http://host:3333/transactions
Body:
{
    "title": "First deposit",
    "value": "1000",
    "type": "tecome",
    "category": "initial"
}

Get Transactions: GET http://host:3333/transactions

Delete Transaction: DELETE http://localhost:3333/transactions/{ID}

Import Transactions: POST http://localhost:3333/transactions/import
Body:
BodyType: FormData
BodyData: Key: file
BodyValue: Value: The .csv file itself
