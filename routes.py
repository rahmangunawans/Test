from flask import render_template, request, flash, redirect, url_for, session, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from app import app, db
from models import User, BotAccount, FarmingSession
from datetime import datetime
import functools

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = request.form.get('remember', False)
        
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            login_user(user, remember=remember)
            user.last_login = datetime.utcnow()
            db.session.commit()
            
            # Redirect to dashboard after login
            next_page = request.args.get('next')
            if user.is_admin():
                return redirect(next_page or url_for('admin_dashboard'))
            else:
                return redirect(next_page or url_for('user_dashboard'))
        else:
            flash('Invalid email or password', 'error')
            return redirect(url_for('index'))
    
    return redirect(url_for('index'))

@app.route('/register', methods=['POST'])
def register():
    first_name = request.form.get('first_name')
    last_name = request.form.get('last_name')
    email = request.form.get('email')
    password = request.form.get('password')
    confirm_password = request.form.get('confirm_password')
    
    if password != confirm_password:
        flash('Passwords do not match', 'error')
        return redirect(url_for('index'))
    
    if User.query.filter_by(email=email).first():
        flash('Email already registered', 'error')
        return redirect(url_for('index'))
    
    # Create username from email
    username = email.split('@')[0]
    counter = 1
    original_username = username
    while User.query.filter_by(username=username).first():
        username = f"{original_username}{counter}"
        counter += 1
    
    user = User(
        username=username,
        email=email,
        first_name=first_name,
        last_name=last_name
    )
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    login_user(user)
    flash('Registration successful! Welcome to AutoFarmingBot', 'success')
    return redirect(url_for('user_dashboard'))

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('index'))

def admin_required(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin():
            flash('Admin access required', 'error')
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/admin/dashboard')
@login_required
@admin_required
def admin_dashboard():
    # Get statistics
    total_users = User.query.count()
    total_accounts = BotAccount.query.count()
    active_accounts = BotAccount.query.filter_by(status='active').count()
    total_earnings = db.session.query(db.func.sum(BotAccount.total_earned)).scalar() or 0
    
    # Recent users
    recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()
    
    # Recent activities
    recent_sessions = FarmingSession.query.order_by(FarmingSession.session_start.desc()).limit(10).all()
    
    return render_template('admin/dashboard.html',
                         total_users=total_users,
                         total_accounts=total_accounts,
                         active_accounts=active_accounts,
                         total_earnings=total_earnings,
                         recent_users=recent_users,
                         recent_sessions=recent_sessions)

@app.route('/admin/users')
@login_required
@admin_required
def admin_users():
    page = request.args.get('page', 1, type=int)
    users = User.query.order_by(User.created_at.desc()).paginate(
        page=page, per_page=20, error_out=False)
    return render_template('admin/users.html', users=users)

@app.route('/admin/accounts')
@login_required
@admin_required
def admin_accounts():
    page = request.args.get('page', 1, type=int)
    accounts = BotAccount.query.order_by(BotAccount.created_at.desc()).paginate(
        page=page, per_page=20, error_out=False)
    return render_template('admin/accounts.html', accounts=accounts)

@app.route('/dashboard')
@login_required
def user_dashboard():
    # Get user's bot accounts
    user_accounts = BotAccount.query.filter_by(user_id=current_user.id).all()
    
    # Calculate user statistics
    total_earned = sum(account.total_earned for account in user_accounts)
    active_count = len([acc for acc in user_accounts if acc.status == 'active'])
    
    # Recent sessions
    account_ids = [acc.id for acc in user_accounts]
    recent_sessions = FarmingSession.query.filter(
        FarmingSession.bot_account_id.in_(account_ids)
    ).order_by(FarmingSession.session_start.desc()).limit(5).all()
    
    return render_template('user/dashboard.html',
                         accounts=user_accounts,
                         total_earned=total_earned,
                         active_count=active_count,
                         recent_sessions=recent_sessions)


