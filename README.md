## Rice Mills Oprations Management System (R-MOMS)

# Project Overview
R-MOMS is a comprehensive software solution designed to manage
the internal operations of rice mills. The system tracks the flow
of paddy from delivery and quality control to payment processing
and inventory management. R-MOMS simplifies the complex workflows
in rice mills, ensuring efficiency, traceability, and accountability.

## Features
1. Paddy Delivery Tracking
--Monitors paddy delivery from weighment to payment processing.

2. Quality Control Management
--Conducts quality checks to ensure the standard of paddy delivered.

3. Finance Management
--Handles payment processing for paddy deliveries.

4. Warehouse Management
--Manages paddy inventory efficiently.

5. Supplier Management
--Tracks supplier details and procurement processes.

## Technologies Used
** Backend
- Python (Flask Framework)
Handles server-side logic, APIs, and database integration.
- SQLAlchemy
Database ORM for managing relational databases.

** Frontend
- React.js
Provides an interactive user interface for various operations.
- TailwindCSS
Simplifies UI styling.

** Database
- PostgreSQL
Relational database for storing and managing data.

** Tools & Services
- Version Control: GitHub for code collaboration and tracking
changes.

## Directory Structure
** Backend
- app/
Contains the main application modules, including models,
routes, schema, and services.

- app/models/
Defines database models (e.g., user.py, supplier.py, delivery.py).

- app/routes/
Handles API endpoints for various modules (e.g., auth.py,
quality_route.py).

- app/utils/
Includes utility functions for logging, error handling, and security.

** Frontend
- src/
Houses the React.js components and application logic.

- src/components/
Contains modular React components like Auth, Finance, and Warehouse.

- src/api/
Manages API calls for seamless backend integration.


## How to Run the Project
** Backend Setup
1. Clone the repository:
git clone https://github.com/Abdul1091/R-MOMS.git

2. Navigate to the backend folder:
cd R-MOMS/

3. Install dependencies:
pip install -r requirements.txt

4. Set up environment variables and initialize the database.

5. Run the backend server:
python run.py

** Frontend Setup
1. Navigate to the frontend folder:
cd react_frontend/frontend/

2. Install dependencies:
npm install

3. Start the development server:
npm run dev

## Contributions
** Team Member: Abdullahi Tukur
** For contributions, fork the repository and submit pull requests.

## Demo Links
Video Demo: 
Presentation Slides: 

## Lessons Learned
1. Enhanced skills in full-stack development using Flask and React.js.
2. Improved team collaboration and version control using GitHub.
3. Gained deeper understanding of database management and API integration.

## Next Steps
- Add support for analytics and reporting.
- Integrate advanced authentication mechanisms.
- Optimize performance for large-scale operations.

## License
This project is licensed under the MIT License - see the LICENSE file for details.