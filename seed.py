#!/user/bin/env python3

from app import create_app, db
from app.models.user import Department, Role

app = create_app()

with app.app_context():
    # Drop all existing data and recreate tables
    db.drop_all()
    db.create_all()

    # Seed departments
    departments = [
        Department(name='IT', description='Information Technology'),
        Department(name='HR', description='Human Resources'),
        Department(name='Finance', description='Finance Department'),
        Department(name='Marketing', description='Marketing and Communications'),
    ]
    db.session.add_all(departments)

    # Seed roles
    roles = [
        Role(name='Admin', description='Administrator role with full access'),
        Role(name='Manager', description='Manager role with limited administrative access'),
        Role(name='Employee', description='Regular employee role'),
    ]
    db.session.add_all(roles)

    # Commit the changes
    db.session.commit()

    print('Database seeded successfully!')