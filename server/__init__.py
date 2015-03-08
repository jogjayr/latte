from flask import Flask
from flask import jsonify
from flask import request
# from flask_cors import CORSimport datetime
import re

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

    if user == 'poor':
        from user_poor import transactions
    elif user == 'rich':
        from user_rich import transactions
    else:
        from user_normal import transactions
    
    return jsonify(transactions)

@app.route("/can-afford", methods=['GET'])
def can_afford():
  user = request.args.get('user')
  amount = request.args.get('amount')
  
  print "user: %s wants to know if they can spend $%s" % (user, amount)
  
  if amount is None:
    amount = 5
  else:
    amount = float(amount)
    
  if user == 'poor':
    from user_poor import accounts
  elif user == 'rich':
    from user_rich import accounts
  else:
    from user_normal import accounts
  
  checkingBalance = 0;
  
  for account in accounts["accounts"]:
    account_name = account["account-name"]
    account_balance = float(account["balance"]) / 10000
    
    checkingMatch = re.match('.*checking.*', account_name, re.I)
    if checkingMatch:
      print account_name + ":" + str(account_balance);
      checkingBalance = account_balance
  
  if checkingBalance <= amount:
    print "They can not afford it"
    return "false"
  else:
    print "They can afford it"
    return "true"
  
  return "False"

@app.route("/save-latte", methods=['GET'])
def save_latte():
  user = request.args.get('user')
  amount = request.args.get('amount')
  
  print "user: %s wants to save $%s" % (user, amount)
  
  if amount is None:
    amount = 5
  else:
    amount = float(amount)

  if user is None: user = "normal"
    
  print "user: %s wants to save $%s" % (user, amount)
  
  i = datetime.datetime.now()
  #print ("Current date & time = %s" % i)
  
  savedItem = {'datetime': i, 'amount': amount}
   
  print savedItem
  
  saveFile = user + "_saved"
  
  with open(saveFile, "a") as myfile:
    myfile.write(str(savedItem) + "\n")
    
  savedSoFar = 0;

  with open(saveFile, "r") as myfile:
    for line in myfile:
      saveItem = eval(line)
      #print "%f" % saveItem["amount"]
      savedSoFar += saveItem["amount"]
  

  return "Saved $%f" % savedSoFar


@app.route("/")
def hello():
    return "Hello World!"


if __name__ == "__main__":
    #app.run()    app.run(debug=True)