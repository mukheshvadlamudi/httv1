import urllib.request
import urllib.error

def debug_response():
    urls = [
        "https://howtotech-api.onrender.com/health",
        "https://howtotech-api.onrender.com/guides",
        "https://howtotech-api.onrender.com/auth/login"
    ]
    
    for url in urls:
        print(f"\n--- Fetching {url} ---")
        try:
            req = urllib.request.Request(url)
            # Add dummy POST payload for login
            if "login" in url:
                req.method = "POST"
                req.data = b'{"email":"test@example.com","password":"password"}'
                req.add_header("Content-Type", "application/json")
                
            with urllib.request.urlopen(req, timeout=10) as response:
                print(f"Status: {response.getcode()}")
                print(f"Headers: {response.info()}")
                print(f"Body: {response.read().decode('utf-8')}")
        except urllib.error.HTTPError as e:
            print(f"HTTPError Status: {e.code}")
            print(f"HTTPError Headers: {e.headers}")
            try:
                print(f"HTTPError Body: {e.read().decode('utf-8')}")
            except Exception as read_err:
                print(f"Could not read body: {read_err}")
        except Exception as e:
            print(f"General Error: {e}")

if __name__ == "__main__":
    debug_response()
