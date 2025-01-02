from flask_mail import Message
from app import mail

def send_email(subject, recipients, body):
    try:
        msg = Message(subject, recipients=recipients)
        msg.body = body
        mail.send(msg)
    except Exception as e:
        print(f"Failed to send email: {e}")