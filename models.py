from datetime import datetime
from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(64), nullable=True)
    last_name = db.Column(db.String(64), nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Farming bot related fields
    bot_accounts = db.relationship('BotAccount', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def is_admin(self):
        return self.role == 'admin'
    
    @property
    def full_name(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
    
    def __repr__(self):
        return f'<User {self.username}>'


class BotAccount(db.Model):
    __tablename__ = 'bot_accounts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    account_name = db.Column(db.String(100), nullable=False)
    network = db.Column(db.String(50), nullable=False)  # NodePay, Gradient, etc.
    status = db.Column(db.String(20), default='inactive')  # active, inactive, error
    total_earned = db.Column(db.Float, default=0.0)
    last_activity = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Account credentials (encrypted in real implementation)
    account_email = db.Column(db.String(120))
    account_token = db.Column(db.Text)  # Store encrypted tokens
    
    def __repr__(self):
        return f'<BotAccount {self.account_name} - {self.network}>'


class FarmingSession(db.Model):
    __tablename__ = 'farming_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    bot_account_id = db.Column(db.Integer, db.ForeignKey('bot_accounts.id'), nullable=False)
    session_start = db.Column(db.DateTime, default=datetime.utcnow)
    session_end = db.Column(db.DateTime)
    earnings = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default='running')  # running, completed, error
    error_message = db.Column(db.Text)
    
    bot_account = db.relationship('BotAccount', backref='sessions')
    
    def __repr__(self):
        return f'<FarmingSession {self.id} - {self.status}>'