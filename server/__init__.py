from flask import Flask
from flask import jsonify
from flask import request

app = Flask(__name__)


@app.route("/get-accounts", methods=['GET'])
def get_accounts():
    return jsonify({"accounts":[{"account-id":"nonce:42069000-96459775","legacy-institution-id":42069000,"institution-name":"NYBE (Not Your Bank Either)","active":True,"account-name":"Really Swell Checking","balance":100000000,"account-type":"asset","last-digits":"9645"}],"error":"no-error"})

@app.route("/get-transactions", methods=['GET'])
def get_transactions():
    request_args = request.args
    user = request_args.get('user')
    import pdb; pdb.set_trace()
    if user is 'poor':
        return jsonify()
    elif user is 'rich':
        return jsonify()
    else:
        from user_normal import user_normal
        return jsonify(user_normal)

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run()