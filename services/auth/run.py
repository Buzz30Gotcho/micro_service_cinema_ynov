from generate_key import ensure_env_and_keys

# Ensure .env and keys exist before verifying/loading config
ensure_env_and_keys()

import subprocess
import sys

# Try to create admin user
try:
    print("Checking/Creating admin user...")
    subprocess.run([sys.executable, "create_admin.py"], check=False)
except Exception as e:
    print(f"Admin creation helper error: {e}")

from src import create_app

app = create_app()

if __name__ == "__main__":
    # Debug=True permet le rechargement auto quand on modifie le code
    app.run(host="0.0.0.0", port=4002, debug=True)
