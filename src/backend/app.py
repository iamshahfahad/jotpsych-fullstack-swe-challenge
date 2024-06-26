from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from cryptography.fernet import Fernet
from flask_migrate import Migrate
import os

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()
key = Fernet.generate_key()
cipher_suite = Fernet(key)



UPLOAD_FOLDER = 'uploads'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_PATH = os.path.join(BASE_DIR, UPLOAD_FOLDER)

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
    app.config['SECRET_KEY'] = 'secret123'
    app.config['JWT_SECRET_KEY'] = 'secret1234'
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    CORS(
        app,
        resources={r"/*": {"origins": ["*"]}},
        allow_headers=["Authorization", "Content-Type"],
        methods=["GET", "POST", "OPTIONS"],
        max_age=86400
    )

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    migrate = Migrate(app, db)

    with app.app_context():
        db.create_all()

    @app.route('/')
    def index():
        return jsonify({'status': 200})

    @app.route('/register', methods=['POST'])
    def register():
        data = request.form  # Use request.form to get form data including files
        username = data.get('username')
        password = data.get('password')
        motto = data.get('motto')
        avatar = request.files.get('avatar')  # Get the uploaded avatar file

        # Check if username or password is missing
        if not username or not password:
            return jsonify({'message': 'Username and password are required'}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')


        if motto:
            motto_encrypted = motto
        else:
            motto_encrypted = None

        # Example: Handle avatar file upload
        avatar_filename = None
        avatar_filename = f"{username}_avatar.png"
        avatar_path = os.path.join(app.config['UPLOAD_FOLDER'], avatar_filename)
        avatar.save(os.path.join(BASE_DIR, avatar_path))

        # Create a new user object
        new_user = User(username=username, password=hashed_password, motto_encrypted=motto, avatar_url=avatar_filename)

        # Add the user to the database
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully'}), 201

    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user and bcrypt.check_password_hash(user.password, data['password']):
            access_token = create_access_token(
                identity={'username': user.username})
            return jsonify({'token': access_token}), 200
        return jsonify({'message': 'Invalid credentials'}), 401

    @app.route('/user', methods=['GET'])
    @jwt_required()
    def user():
        current_user = get_jwt_identity()

        if current_user:
            return jsonify(current_user), 200

        return jsonify({'message': 'User not found'}), 404

    @app.route('/profile', methods=['GET'])
    @jwt_required()
    def profile():
        current_user_username = get_jwt_identity()

        if current_user_username:
            user = User.query.filter_by(username=current_user_username['username']).first()

            avatar_url = None
            if user.avatar_url:
                avatar_url = f"http://localhost:3002/uploads/{user.avatar_url}"


            if user:
                return jsonify({
                    'id': user.id,
                    'username': user.username,
                    'motto': user.motto_encrypted,
                    'avatar_url': avatar_url,

                }), 200

        return jsonify({'message': 'User not found'}), 200

    @app.route('/upload', methods=['POST'])
    def upload_file():
        if 'audio' not in request.files:
            return jsonify({'message': 'No file part'}), 400
        file = request.files['audio']
        if file.filename == '':
            return jsonify({'message': 'No selected file'}), 400
        if file:
            filename = os.path.join(app.config['UPLOAD_FOLDER'], 'recording.webm')
            file.save(filename)
            return jsonify({'message': 'File uploaded successfully', 'filename': filename}), 200


    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        return send_from_directory(UPLOAD_PATH, filename)

    return app


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    motto_encrypted = db.Column(db.String(256))
    avatar_url = db.Column(db.String(150))


if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app = create_app()
    app.run(port=3002, debug=True)
