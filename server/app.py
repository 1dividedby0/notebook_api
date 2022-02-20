from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)

    with app.app_context():

        from .routes import routes_blueprint

        app.register_blueprint(routes_blueprint)
        return app


if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', port=5000)
