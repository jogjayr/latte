from flask import Flask
from flask import jsonify
from flask import request
# from flask_cors import CORS
from utils import jsonp

app = Flask(__name__)

# cors = CORS(app)


@app.route("/get-accounts", methods=['GET'])
@jsonp
def get_accounts():
    user = request.args.get('user')
    if user == 'poor':
        from user_poor import accounts
    elif user == 'rich':
        from user_rich import accounts
    else:
        from user_normal import accounts

    return jsonify(accounts)

@app.route("/get-transactions", methods=['GET'])
@jsonp
def get_transactions():
    user = request.args.get('user')
    if user is 'poor':
        from user_poor import transactions
    elif user is 'rich':
        from user_rich import transactions
    else:
        from user_normal import transactions
    
    return jsonify(transactions)

@app.route("/")
def hello():
    return "Hello World!"


if __name__ == "__main__":
    app.run()