from flask import Flask
from flask import jsonify
from flask import request
# from flask_cors import CORS
import datetime
import re
import requests
from utils import jsonp
import plotly.plotly as plotly
from plotly.graph_objs import *
#from datetime import datetime
import datetime



app = Flask(__name__)
app.config.from_pyfile("config.ini")


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

@app.route("/call-user", methods=['GET'])
def call_user():
  api_key = app.config['NEXMO_API_KEY']
  api_secret = app.config['NEXMO_API_SECRET']
  num_to_call = app.config['TEST_PHONE_NUM']
  num_times_repeat = app.config['NUM_REPEAT_CALLS']
  PHONE_MESSAGE = ("<break time=\"0.5s\"/> Hello, we don't want to disturb you too much,<break time=\"0.5s\"/> " 
                 "but you asked us to help you save.<break time=\"1s\"/> "
                 "Are you sure you want that coffee?<break time=\"1s\"/> "
                 "Perhaps you could pick one at your office instead <break time=\"0.5s\"/> "
                 "and take a nice walk in the park <break time=\"1s\"/>")
  
  url = 'https://api.nexmo.com/tts/json'
  payload = {
              'api_key'   : api_key ,
              'api_secret': api_secret , 
              'to'        : num_to_call ,
              'repeat'    : num_times_repeat ,
              'text'      : PHONE_MESSAGE
              }
  
  r = requests.get(url, params=payload)
  print r.json()
  
  return "We may have called the user by this point";


#If save_latte isn't called at least once for the user first, this might crash
@app.route("/get-savings-graph", methods=['GET'])
def get_savings_graph():
  user = request.args.get('user')
  print "Generating graph for user: %s" % (user)
  
  if user is None: user = "normal"
  print "Generating graph for user: %s" % (user)
  
  saveFile = user + "_saved"
  
  x = [];
  y = [];
  cumulative = 0;
  with open(saveFile, "r") as myfile:
    for line in myfile:
      saveItem = eval(line)
      cumulative += saveItem["amount"];
      x.append(saveItem["datetime"])
      y.append(cumulative)
      #print line
      #print "%f" % saveItem["amount"]
      #savedSoFar += saveItem["amount"]
  
  
  #x = [datetime(year=2013, month=10, day=04),
  #    datetime(year=2013, month=11, day=05),
  #    datetime(year=2013, month=12, day=06)]
  
  #data = Data([Scatter(x=x,y=[1, 3, 6])])
  data = Data( [ Scatter(x=x,y=y) ] )
  plot_url = plotly.plot(data, filename='python-datetime', auto_open=False)
  return plot_url 
  
  


@app.route("/")
def hello():
    return "Hello World!"


if __name__ == "__main__":
    app.run(host='0.0.0.0')

