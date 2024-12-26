import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models.user import User, Role, Department

app = create_app()

with app.app_context():
    # Create initial role
    admin_role = Role(name='admin', description='Administrator')
    admin_role.save()

    # Create initial department
    it_dept = Department(name='IT', description='Information Technology')
    it_dept.save()

    # Create admin user
    admin = User(
        username='admin',
        email='admin@ricemills.com',
        first_name='Admin',
        last_name='User',
        role_id=admin_role.id,
        department_id=it_dept.id
    )
    admin.password = 'admin123'  # This will be hashed automatically
    admin.save()