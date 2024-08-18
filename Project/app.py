
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta
import logging
from bson.objectid import ObjectId
from pymongo.errors import PyMongoError

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017/queue_management'

mongo = PyMongo(app)

# CORS setup
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

logging.basicConfig(level=logging.DEBUG)

def token_required(f):
    def token_required_decorator(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            logging.debug('Token is missing!')
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            token = token.replace('Bearer ', '')
            logging.debug(f'Decoding token: {token}')
            decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            logging.debug(f'Decoded token: {decoded_token}')
        except jwt.ExpiredSignatureError:
            logging.debug('Token has expired!')
            return jsonify({'message': 'Token has expired!'}), 403
        except jwt.InvalidTokenError:
            logging.debug('Token is invalid!')
            return jsonify({'message': 'Token is invalid!'}), 403
        return f(*args, **kwargs)
    return token_required_decorator

@app.route('/api/queues', methods=['POST'])
@token_required
def create_queue():
    data = request.json
    result = mongo.db.queues.insert_one({'name': data['name']})
    return jsonify({'id': str(result.inserted_id)})

@app.route('/api/queues', methods=['GET'])
def get_queues():
    queues = mongo.db.queues.find({}, {'_id': 1, 'name': 1, 'users': 1})
    result = []
    for queue in queues:
        queue['_id'] = str(queue['_id'])  # Convert ObjectId to string
        if 'users' in queue:
            queue['users'] = [str(user_id) for user_id in queue['users']]  # Convert each user ID to string
        result.append(queue)
    return jsonify(result)

@app.route('/api/queues/user/<username>', methods=['GET'])
def get_queues_by_user(username):
    try:
        user = mongo.db.users.find_one({"username": username})
        if not user:
            return jsonify({'error': 'User not found'}), 404

        user_id = user['_id']
        # Assuming you want to find queues the user is part of
        queues = mongo.db.queues.find({"users": user_id})
        
        # Prepare the response
        result = [{'id': str(queue['_id']), 'name': queue['name']} for queue in queues]
        
        return jsonify(result)

    except pymongo.errors.PyMongoError as e:
        app.logger.error(f"Database error: {e}")
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        app.logger.error(f"Error fetching queues: {e}")
        return jsonify({'error': 'Error fetching queues'}), 500

@app.route('/api/queues/position/<user_id>', methods=['GET'])
def get_queue_position(user_id):
    try:
        # Retrieve the user from the database
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Ensure `calculate_user_position` function is defined
        position = calculate_user_position(user_id)

        return jsonify({'position': position})

    except pymongo.errors.PyMongoError as e:
        app.logger.error(f"Database error: {e}")
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        app.logger.error(f"Error retrieving user position: {e}")
        return jsonify({'error': 'Error retrieving user position'}), 500

@app.route('/api/queues/<queue_id>/join', methods=['POST'])
def join_queue(queue_id):
    user_name = request.json.get('user_name')
    if not user_name:
        return jsonify({'error': 'User name is required'}), 400

    try:
        queue_id = ObjectId(queue_id)
        
        user = mongo.db.users.find_one({"username": user_name})  # Ensure field names are consistent
        if not user:
            app.logger.error(f"User not found with name: {user_name}")
            return jsonify({'error': 'User not found'}), 404
        
        user_id = user['_id']
        app.logger.debug(f"User found with ID: {user_id}")

        queue = mongo.db.queues.find_one({"_id": queue_id})
        if not queue:
            app.logger.error(f"Queue not found with ID: {queue_id}")
            return jsonify({'error': 'Queue not found'}), 404

        result = mongo.db.queues.update_one(
            {"_id": queue_id},
            {"$addToSet": {"users": user_id}}
        )
        
        if result.modified_count > 0:
            app.logger.debug(f"User added to queue successfully: Queue ID: {queue_id}, User ID: {user_id}")
        else:
            app.logger.debug(f"No modification occurred. Result: {result.raw_result}")
            app.logger.error(f"Failed to add user to queue: {queue_id}")


    except PyMongoError as e:
        app.logger.error(f"Database error: {e}")
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        app.logger.error(f"Error joining queue: {e}")
        return jsonify({'error': 'Error joining queue'}), 500

@app.route('/api/business-signup', methods=['POST'])
def business_signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    existing_business = mongo.db.businesses.find_one({'email': email})
    if existing_business:
        return jsonify({'message': 'Business already exists'}), 400

    mongo.db.businesses.insert_one({
        'email': email,
        'password': generate_password_hash(password)
    })
    return jsonify({'message': 'Business registered successfully'}), 201

@app.route('/api/business-login', methods=['POST'])
def business_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = mongo.db.businesses.find_one({'email': email})
    if user and check_password_hash(user['password'], password):
        token = jwt.encode({
            'email': email,
            'exp': datetime.utcnow() + timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({'message': 'Login successful', 'token': token}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/user-signup', methods=['POST'])
def user_signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    existing_user = mongo.db.users.find_one({'username': username})
    if existing_user:
        return jsonify({'message': 'Username already exists'}), 400

    hashed_password = generate_password_hash(password)

    mongo.db.users.insert_one({
        'username': username,
        'password': hashed_password
    })

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/user-login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = mongo.db.users.find_one({'username': username})
    if user and check_password_hash(user['password'], password):
        token = jwt.encode({
            'username': username,
            'exp': datetime.utcnow() + timedelta(hours=1)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'username': username
        }), 200
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/leave', methods=['POST'])
def leave_queue():
    try:
        user_name = request.json.get('username')
        if not user_name:
            return jsonify({'error': 'Username is required'}), 400

        user = mongo.db.users.find_one({"username": user_name})  # Ensure field names are consistent
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        queue_id = user.get('queue_id')
        if queue_id:
            result = mongo.db.queues.update_one(
                {"_id": ObjectId(queue_id)},
                {"$pull": {"users": user['_id']}}
            )
            if result.modified_count > 0:
                return jsonify({'message': 'Left queue successfully!'}), 200
            else:
                return jsonify({'error': 'Failed to leave the queue'}), 500
        else:
            return jsonify({'error': 'Queue ID not found for user'}), 404
    except Exception as e:
        app.logger.error(f"Error leaving queue: {e}")
        return jsonify({'error': 'Error leaving queue'}), 500

@app.route('/api/queues/<queue_id>/process', methods=['POST'])
# @token_required
def process_queue(username):
    try:
        # Validate and convert queue_id
        username = ObjectId(username)
        
        # Find the queue to be processed
        queue = mongo.db.queues.find_one({"_id": username})
        if not queue:
            return jsonify({'error': 'Queue not found'}), 404

        # Implement processing logic here
        # Example: Clear all users from the queue
        mongo.db.queues.update_one(
            {"_id": username},
            {"$set": {"users": []}}  # Clear all users from the queue
        )

        app.logger.info(f"Queue processed successfully: Queue ID: {username}")
        return jsonify({'message': 'Queue processed successfully'}), 200

    except PyMongoError as e:
        app.logger.error(f"Database error: {e}")
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        app.logger.error(f"Error processing queue: {e}")
        return jsonify({'error': 'Error processing queue'}), 500



@app.route('/api/queues/stats', methods=['GET'])
def get_queue_stats():
    # Example stats: total number of queues, total number of users in each queue
    stats = {}
    total_queues = mongo.db.queues.count_documents({})
    total_users = mongo.db.users.count_documents({})
    queues_with_users = mongo.db.queues.aggregate([
        {'$match': {'users': {'$exists': True, '$ne': []}}},
        {'$count': 'queues_with_users'}
    ])
    
    stats['total_queues'] = total_queues
    stats['total_users'] = total_users
    stats['queues_with_users'] = next(queues_with_users, {}).get('queues_with_users', 0)

    return jsonify(stats)

if __name__ == '__main__':
    app.config['SECRET_KEY'] = 'your_secret_key'
    app.run(debug=True)
