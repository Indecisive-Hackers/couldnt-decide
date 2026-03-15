import flask
from flask_cors import CORS
from src.entities import user, entity
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
import datetime
from src.llmApiCall import prompt
from flask_socketio import SocketIO

app = flask.Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app, supports_credentials=True, origins=['http://localhost:4200'])
app.config['SECRET_KEY'] = 'aSecretKey'
interface = JWTManager(app)

entity.Base.metadata.create_all(entity.engine)

users = {}
revoked_tokens = []


@interface.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload['jti']
    return jti in revoked_tokens

# Websockets

@socketio.on('sign_in')
def user_sign_in(username):
    users[flask.request.sid] = username['name']
    socketio.emit('current_users', users)
    print(f"New user: {username}\nThe users are: {users}")

@socketio.on('disconnect')
def on_disconnect():
    users.pop(flask.request.sid,'No user found')
    socketio.emit('current_users', users)
    print(f"User disconnected.\nThe users are: {users}")

@socketio.on('message')
def messaging(message):
    print(f'Message: {str(message)}, Sender: {flask.request.sid}, Recipient: {message["to"]}')
    message['from'] = flask.request.sid
    # socketio.emit('message', message, room=flask.request.sid)
    socketio.emit('message', message, room=message['to'])

# Rest APIs

@app.route("/api/login", methods=['POST'])
def login():
    expiration = datetime.datetime.now() + datetime.timedelta(days = 30)
    session = entity.Session()
    json = flask.request.get_json()
    if 'id' in json:
        json['id'] = 0
    posted_user = user.UserSchema().load(json)
    if posted_user['username'] is None or posted_user['password'] is None:
        session.close()
        return flask.abort(400, description="Password or Username is incorrect")
    the_user = session.query(user.User).filter_by(username=posted_user['username']).first()
    if the_user is not None:
        if the_user is None or not the_user.check_password(posted_user['password']):
            session.close()
            return flask.abort(400, description="Password or Username is incorrect")
        token = create_access_token(identity=the_user.id)
        send_the_user = user.UserSchema().dump(user.SecureUser(the_user))
        response = {'message': 'Login successful', 'user_id': the_user.id, 'status': 200, 'token': token, 'user': send_the_user}
        session.close()
        return flask.jsonify(response)
    session.close()
    return flask.abort(400, description="Password or Username is incorrect")


@app.route('/api/logout', methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    revoked_tokens.append(jti)
    return flask.jsonify(msg="Token revoked")


@app.route('/api/register-user', methods=['POST'])
def register_user():
    session = entity.Session()
    json = flask.request.get_json()
    if json['id'] == None:
        json['id'] = 0
    else:
        flask.abort(400, description="ID shouldn't be provided")
    posted_user = user.UserSchema().load(json)
    if posted_user['username'] is None or posted_user['password'] is None:
        flask.abort(400, description="Username or Password is missing.")
    if session.query(user.User).filter_by(username=posted_user['username']).first() is not None:
        flask.abort(400, description="Username is taken.")
    new_user = user.User()
    new_user.username = posted_user['username']
    new_user.set_password(posted_user['password'])
    new_user.email_address = posted_user['email_address']
    session.add(new_user)
    session.commit()
    send_new_user = user.UserSchema().dump(user.SecureUser(new_user))
    session.close()
    return (flask.jsonify(send_new_user), 201)

@app.route('/api/check-facts', methods=['POST'])
def check_facts():
    json_o = flask.request.get_json()
    if json_o['text'] == "" or json_o['speaker'] == "":
        flask.abort(400, description="Speaker or/and text is missing.")
    facts = prompt(f"Please only give exactly \"true\" or \"false\". Is this statement the truth?: \"{json_o['text']}\"")
    info = prompt(f"Briefly explain why this statement is or isn't true: \"{json_o['text']}\"")
    return flask.jsonify({"facts": facts, "info": info, "speaker": json_o['speaker']}), 200