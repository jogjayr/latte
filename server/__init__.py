from flask import Flask
from flask import jsonify
from flask import request
# from flask_cors import CORS
import datetime
import re
import requests
from utils import jsonp
import plotly.plotly as plotly
from plotly.graph_objs import Data, Scatter
#from datetime import datetime
import datetime
import os.path


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
                 "Perhaps you could get one at your office instead <break time=\"0.5s\"/> "
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


#@app.route("/get-savings-graph", methods=['GET'])
def get_savings_graph():
  user = request.args.get('user')
  print "Generating graph for user: %s" % (user)
  
  if user is None: user = "normal"
  print "Generating graph for user: %s" % (user)
  
  saveFile = user + "_saved"
  
  x = [];
  y = [];
  cumulative = 0;
  
  if os.path.exists(saveFile):
    with open(saveFile, "r") as myfile:
      for line in myfile:
        saveItem = eval(line)
        cumulative += saveItem["amount"];
        x.append(saveItem["datetime"])
        y.append(cumulative)
  
  data = Data( [ Scatter(x=x,y=y) ] )
  plot_url = plotly.plot(data, filename='python-datetime', auto_open=False)
  return plot_url 
  
  
@app.route("/get-savings-graph", methods=['GET'])
@app.route("/get-investment-graph", methods=['GET'])
def get_investment_graph():
  user = request.args.get('user')
  if user is None: user = "poor"
  print "Generating graph for user: %s" % (user)
  
  url = "http://navs.xignite.com/v2/xNAVs.json/GetHistoricalNAVs"
  BOND_SYMBOL = "VBTLX"
  api_token = app.config['XIGNITE_TOKEN']
  payload = {
              '_Token'          : api_token,
              'IdentifierType'  : "Symbol" , 
              'Identifier'      : BOND_SYMBOL ,
              'StartDate'       : "1/1/2014" ,
              'EndDate'         : "3/6/2015" ,
              'AdjustmentMethod': "None"
              }
  
  r = requests.get(url, params=payload)
  #print r.text
  #print r.json()
  bond_data = r.json();

  
  STOCK_SYMBOL = "VTSAX"
  payload = {
              '_Token'          : api_token,
              'IdentifierType'  : "Symbol" , 
              'Identifier'      : STOCK_SYMBOL ,
              'StartDate'       : "1/1/2014" ,
              'EndDate'         : "3/6/2015" ,
              'AdjustmentMethod': "None"
              }
  
  r = requests.get(url, params=payload)  
  stock_data = r.json();
  
  #user = "normal"
  saveFile = user + "_saved"
  
  earliestDate = datetime.datetime.now()
  
  savings = [];
  
  if os.path.exists(saveFile):
    with open(saveFile, "r") as myfile:
      for line in myfile:
        saveItem = eval(line)
        thisDate = saveItem["datetime"]
        thisSavings = saveItem["amount"];
        if(thisDate < earliestDate):
          earliestDate = thisDate
        thisTuple = (thisDate, thisSavings);
        savings.append(thisTuple);
        
  print "Earliest date : " + str(earliestDate);
  
  our_bond_prices = [];
  our_stock_prices = [];
  
  prices_bonds  = bond_data["NAVs"]
  prices_stocks = stock_data["NAVs"]
  for bond_price in prices_bonds:
    stock_price = prices_stocks.pop(0);
    thisDate  = datetime.datetime.strptime( bond_price["Date"] , "%m/%d/%Y" );
    thisBondPrice  = float(bond_price["NAV"])
    thisStockPrice = float(stock_price["NAV"])
    thisBondTuple  = (thisDate, thisBondPrice)
    thisStockTuple = (thisDate, thisStockPrice)
    
    if(thisDate >= earliestDate):  
      our_bond_prices.insert(0, thisBondTuple) #reverse order by always putting at begging of list
      our_stock_prices.insert(0, thisStockTuple);
      #print thisTuple
    #print "%s : %f " % (datetime.datetime.strptime( price["Date"] , "%m/%d/%Y"), price["NAV"])
  
  #print bond_prices;
  
  x_savings = [];
  x_bonds = [];
  x_stocks = [];
  y_savings = [];
  y_bonds = [];
  y_stocks = [];
  cumulative_savings = 0;
  surplus_savings = 0;
  num_bonds = 0;
  num_stocks = 0;

  for price_data in savings:
    print price_data
    
    x_savings.append(price_data[0]) #date
    surplus_savings += price_data[1]
    cumulative_savings += price_data[1] #amount saved
    y_savings.append(cumulative_savings);
    print cumulative_savings
    
    print "Savings: %s , %f " % (str(price_data[0]) , cumulative_savings)
    
    while our_bond_prices:
      this_bond_data = our_bond_prices.pop(0)
      this_stock_data = our_stock_prices.pop(0);
      if (price_data[0] >= this_bond_data[0]): #compare dates, ignore weekendds etc where no market data
        continue
      
      if(surplus_savings > 0):
        num_bonds  += surplus_savings / this_bond_data[1];
        num_stocks += surplus_savings / this_stock_data[1];
        surplus_savings = 0;
        
      if(num_bonds > 0):
        bonds_value  = num_bonds * this_bond_data[1]
        stocks_value = num_stocks * this_stock_data[1]
        
        x_bonds.append(this_bond_data[0])
        y_bonds.append(bonds_value)
        
        x_stocks.append(this_stock_data[0])
        y_stocks.append(stocks_value);
        
        print "Bonds: %s , %f " % (str(this_bond_data[0]) , bonds_value)  
        print "Stocks: %s , %f " % (str(this_stock_data[0]) , stocks_value)  
      
      
      break; #break bond prices loop
        
  trace_savings   = Scatter(x=x_savings, y=y_savings, name='Savings Account')
  trace_bonds     = Scatter(x=x_bonds, y=y_bonds, name='Bond Fund')
  trace_stocks   = Scatter(x=x_stocks, y=y_stocks, name='Stock Fund')
  
  data_all = Data( [trace_savings, trace_bonds, trace_stocks] );

  plot_filename = user + "investment_plot"
  
  plot_url = plotly.plot(data_all, filename=plot_filename, auto_open=False);
  
  
  return plot_url;
      
  return r.text            
  return "Getting graph from: " + url + "for " + BOND_SYMBOL + " using " + api_token;


@app.route("/")
def hello():
    return "Hello World!"


if __name__ == "__main__":
    app.run(host='0.0.0.0')
    #app.run(debug=True)

