# Traffic Branch Management System API

This is the API documentation for the Traffic Branch Management System. It provides endpoints to interact with various functionalities of the system.

## Installation

1. Clone the repository:

   git clone https://github.com/MahamdSirafi/-traffic.git

## Server-side Instructions

1. Install the required dependencies:

   npm install

2. Start the server:

   npm start

3. The server will run on `http://localhost:8000`.

## API Endpoints

### Car Endpoints

- `GET /car`: Get a list of all cars.
- `GET /car/:id`: Get details of a specific car identified by `id`.
- `POST /car`: Create a new car.
- `PATCH /car/:id`: Update details of a specific car identified by `id`.
- `DELETE /car/:id`: Delete a specific car identified by `id`.

### License Endpoints

- `GET /api/license`: Get a list of all licenses.
- `GET /api/license/:id`: Get details of a specific license by ID.
- `POST /api/license`: Create a new license.
- `PATCH /api/license/updateDate/:id`: Update date of a specific license by ID.
- `PATCH /api/license/updateClass/:id`: Update class of a specific license by ID.
- `DELETE /api/license/:id`: Delete a specific license by ID.

### service Endpoints

- `GET /api/service`: Get a list of all service.
- `GET /api/service/:id`: Get details of a specific service by ID.
- `POST /api/service`: Create a new service.
- `PATCH /api/service/:id`: Update details of a specific service by ID.
- `DELETE /api/service/:id`: Delete a specific service by ID.

### message Endpoints

- `GET /api/messag`: Get a list of all message.
- `GET /api/messag/:id`: Get details of a specific message by ID.
- `POST /api/messag`: Create a new message.
- `PATCH /api/sermessagvice/:id`: Update details of a specific message by ID.
- `DELETE /api/messag/:id`: Delete a specific message by ID.

### review Endpoints

- `GET /api/review`: Get a list of all review.
- `GET /api/review/:id`: Get details of a specific review by ID.
- `POST /api/review`: Create a new review.
- `PATCH /api/review/:id`: Update details of a specific review by ID.
- `DELETE /api/review/:id`: Delete a specific review by ID.

### date Endpoints

- `GET /api/date`: Get a list of all date.
- `GET /api/date/:id`: Get details of a specific date by ID.
- `POST /api/data/services/"id`: Create a new date by ID services.
- `PATCH /api/review/:id`: Update details of a specific date by ID.
- `DELETE /api/date/:id`: Delete a specific date by ID.

### Violation Endpoints

- `GET /api/violation`: Get a list of all violations.
- `GET /api/violation/:id`: Get details of a specific violation by ID.
- `POST /api/violation`: Create a new violation.
- `PATCH /api/violation/:id`: Update details of a specific violation by ID.
- `DELETE /api/violation/:id`: Delete a specific violation by ID.

Please refer to the API documentation for more details on request and response formats.

## Setting Up .env File

This guide explains how to set up an `.env` file to configure environment variables.

### Steps

1. Create a new file and name it `.env` in your project directory.

2. Open the `.env` file using any text editor.

3. Add the environment variables and their values to the file. Write each variable on a separate line in the following format:

Here are some examples:

NODE_ENV=development

PORT=8000

DATABASE=mongodb+srv://testName:<PASSWORD>@cluster0.name.mongodb.net/new?retryWrites=true&w=majority

DATABASE_LOCAL=mongodb://localhost:27017/Traffic

DATABASE_PASSWORD=dfadfadfdfsdf

JWT_SECRET=mas/12321/id?=adfsdfdfdfadsfsdfdfdsfdsd

JWT_EXPIRES_IN=90d

JWT_COOKIE_EXPIRES_IN=90

EMAIL_HOST=sandbox.smtp.mailtrap.io

EMAIL_PORT=222

EMAIL_USERNAME=dfadfadfadfdfa

EMAIL_PASSWORD=xcXcxcXcXcXccc

GMAIL_USERNAME=

GMAIL_PASSWORD=

## Technologies Used

- Express.js: Fast, unopinionated, minimalist web framework for Node.js
- Node.js: JavaScript runtime environment
- MongoDB: NoSQL document database

## License

This project is licensed under the [MIT License](LICENSE).

Feel free to modify the code according to your specific project requirements.
