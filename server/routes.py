from flask import Blueprint, jsonify, send_file, make_response, request, render_template
import random
import requests

routes_blueprint = Blueprint("routes", __name__)

authenticated = []

def shamir_secret_share(address):

    #replace address with what you get from the user
    # address = "0x545238BA21F36B095468132B6854CaAf8b5367B3"
    address = address[2:]
    if (len(address) != 40):
        print("oh no bad address")

    int_add = int(address, 16)
    random.seed(524)
    rand = random.randint(0, pow(2,64))

    shardA = int_add + rand #evaluate polynomial at x = 1
    shardB = int_add + 2*rand #evaluate polynomial at x = 2
    shardC = int_add + 3*rand #evaluate polynomial at x = 3
    return shardA, shardB, shardC

def identity_auth_1(shard):
    pass

def identity_auth_2(shard):
    pass

def identity_auth_3(shard):
    pass

@routes_blueprint.route("/")
def home():
    return "ok"

@routes_blueprint.route("/api/v1/auth/authenticate/", methods=["GET", "POST"])
def authenticate():
    data = request.get_json(force=True)
    name = data['name']
    wallet = data['wallet']
    SSN = data['SSN']

    if SSN in authenticated:
        response = jsonify({"success": False})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    authenticated.append(SSN)

    shardA, shardB, shardC = shamir_secret_share(wallet)

    identity_auth_1(shardA)
    identity_auth_2(shardB)
    identity_auth_3(shardC)

    print(name + " with wallet address " + wallet + " authenticated!")
    response = jsonify({"success": True})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@routes_blueprint.route("/api/v1/database/upload/", methods=["GET", "POST"])
def upload():
    data = request.get_json(force=True)
    # token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEY5Q0NGQjAzZTcwMGNjNDI5OTY3MjY5NTcxQ0JhQ0M2QUE1NmRmYWIiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDUzMTExNTQzODUsIm5hbWUiOiJOb3RlYm9vayJ9.N2axGWFvDekcS7UToV4h1QFVxFaDqi-JaruviRPbtyk"
    # file_path = "routes.py"
    token = data['token']
    file_path = data['file_path']
    with open(file_path) as f:
        x = requests.post(url="https://api.web3.storage/upload", data=f.read(), headers={"Authorization": "Bearer " + token})
        cid = x.json()['cid']
        response = jsonify({"success": True, "cid": cid})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    response = jsonify({"success": True, "cid": None})
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
    
    # return render_template('entry_upload.html', token=token, file_paths=file_paths)
